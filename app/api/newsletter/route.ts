import { fetchPosts } from "@/app/lib/fetchPosts";
import { sendNewsletter } from "@/app/lib/sendEmail";
import { NextRequest } from "next/server";
import { Newsletter } from "@/types"; // Assuming you export Post/Newsletter types here

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

  const { after: yesterdayAfter, before: yesterdayBefore } =
    getYesterdayRange();
  const { after: lastWeekAfter, before: lastWeekBefore } = getLastWeekRange();

  const [productsOfTheDay, productsOfTheWeek] = await Promise.all([
    fetchPosts(yesterdayAfter, yesterdayBefore),
    fetchPosts(lastWeekAfter, lastWeekBefore),
  ]);

  // Convert the newsletter object to an array of posts for the sendNewsletter function
  const newsletterProps: Newsletter = {
    productsOfTheDay,
    productsOfTheWeek,
  };

  await sendNewsletter(newsletterProps);

  return new Response(JSON.stringify({ status: "sent" }), { status: 200 });
}
