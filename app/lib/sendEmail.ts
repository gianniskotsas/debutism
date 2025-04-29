import Newsletter from "@/emails/Newsletter";
import { Post, Newsletter as NewsletterType } from "@/types";
import { render } from "@react-email/render";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendNewsletter(newsletter: NewsletterType) {
  // await resend.broadcasts.create({
  //   audienceId: process.env.RESEND_AUDIENCE_ID!,
  //   from: "giannis@veevo.app",
  //   subject: "hello world",
  //   react: Newsletter({ posts }),
  // });

  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('en-US', { day: '2-digit' });
  const month = today.toLocaleDateString('en-US', { month: 'long' });
  const year = today.toLocaleDateString('en-US', { year: 'numeric' });

  const subject = `debutism | ${dayOfWeek} ${month} ${year}`

  await resend.emails.send({
    from: "debutism@veevo.app",
    to: ["giannis@kotsas.com", "kkrachtop@gmail.com"],
    subject: subject,
    react: Newsletter(newsletter),
  });
}
