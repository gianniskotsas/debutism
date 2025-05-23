import { fetchPosts } from "@/app/lib/fetchPosts";
import { sendNewsletter } from "@/app/lib/sendEmail";
import { NextRequest, NextResponse } from "next/server";
import { Newsletter } from "@/types"; // Assuming you export Post/Newsletter types here
import { Resend } from 'resend';
import { z } from 'zod';
import axios from 'axios';

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

function getYesterdayRange() {
  const today = new Date();
  const after = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 1,
      0,
      0,
      0
    )
  );
  const before = new Date(
    Date.UTC(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0)
  );
  return { after, before };
}

function getLastWeekRange() {
  const today = new Date();
  // Find the previous Monday
  const dayOfWeek = today.getUTCDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
  const daysSinceLastMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // if Sunday (0), go back 6 days
  const lastMonday = new Date(
    Date.UTC(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - daysSinceLastMonday - 7,
      0,
      0,
      0
    )
  );
  const lastSunday = new Date(
    Date.UTC(
      lastMonday.getFullYear(),
      lastMonday.getMonth(),
      lastMonday.getDate() + 6,
      23,
      59,
      59
    )
  );
  return { after: lastMonday, before: lastSunday };
}

export async function GET(req: NextRequest) {

  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.DEBUTISM_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    console.log('Starting newsletter generation...');
    
    const { after: yesterdayAfter, before: yesterdayBefore } =
      getYesterdayRange();
    const { after: lastWeekAfter, before: lastWeekBefore } = getLastWeekRange();

    console.log('Fetching posts for date ranges:', {
      yesterday: { after: yesterdayAfter.toISOString(), before: yesterdayBefore.toISOString() },
      lastWeek: { after: lastWeekAfter.toISOString(), before: lastWeekBefore.toISOString() }
    });

    const [productsOfTheDay, productsOfTheWeek] = await Promise.all([
      fetchPosts(yesterdayAfter, yesterdayBefore),
      fetchPosts(lastWeekAfter, lastWeekBefore),
    ]);

    console.log('Posts fetched successfully:', {
      productsOfTheDay: productsOfTheDay.length,
      productsOfTheWeek: productsOfTheWeek.length
    });

    // Convert the newsletter object to an array of posts for the sendNewsletter function
    const newsletterProps: Newsletter = {
      productsOfTheDay,
      productsOfTheWeek,
    };

    console.log('Sending newsletter...');
    await sendNewsletter(newsletterProps);
    console.log('Newsletter sent successfully');

    return new Response(JSON.stringify({ status: "sent" }), { status: 200 });
  } catch (error: unknown) {
    console.error('Error in newsletter generation:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('This is an Axios error (likely from Product Hunt API):');
      console.error('Status:', error.response?.status);
      console.error('Status text:', error.response?.statusText);
      console.error('Response data:', error.response?.data);
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to fetch data from external API',
          details: error.response?.data || error.message 
        }), 
        { status: 500 }
      );
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to generate newsletter',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), 
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Validate the email
    const { email } = schema.parse(body);
    
    // Add the email to Resend audience
    const audienceId = process.env.RESEND_AUDIENCE_ID;
    
    if (!audienceId) {
      return NextResponse.json(
        { error: 'RESEND_AUDIENCE_ID is not configured' },
        { status: 500 }
      );
    }

    // Add subscriber to audience
    await resend.contacts.create({
      email,
      audienceId,
    });

    return NextResponse.json(
      { success: true, message: 'Successfully subscribed to the newsletter' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to the newsletter' },
      { status: 500 }
    );
  }
}
