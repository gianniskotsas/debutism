import Newsletter from "@/emails/Newsletter";
import { Newsletter as NewsletterType } from "@/types";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendNewsletter(newsletter: NewsletterType) {
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { day: '2-digit' });
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  const year = today.toLocaleDateString('en-US', { year: 'numeric' });

  const subject = `Daily product launch digest`;

  try {
    // Create the broadcast

    const from = process.env.NEWSLETTER_FROM;
    const sender = `debutism <${from}>`;
    if (!from) {
      throw new Error("From email not found");
    }

    const broadcast = await resend.broadcasts.create({
      audienceId: process.env.RESEND_AUDIENCE_ID!,
      from: sender,
      replyTo: from,
      subject: subject,
      react: Newsletter(newsletter),
    });

    console.log('Broadcast created:', broadcast);

    // Send the broadcast immediately
    // Note: broadcast.data.id is the correct path for the ID
    if (broadcast.data?.id) {
      await resend.broadcasts.send(broadcast.data.id);
      console.log('Broadcast sent successfully');
    } else {
      throw new Error('Broadcast creation failed - no ID returned');
    }
  } catch (error) {
    console.error('Error creating or sending broadcast:', error);
    throw error;
  }
}
