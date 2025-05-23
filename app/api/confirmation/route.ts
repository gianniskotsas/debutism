import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import ConfirmationEmail from "@/emails/Confirmation";
import { z } from "zod";

const resend = new Resend(process.env.RESEND_API_KEY);

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = schema.parse(body);

    const data = await resend.emails.send({
      from: "debutism@veevo.app",
      to: email,
      subject: "Welcome to debutism - The newsletter for the tech early adopters",
      react: ConfirmationEmail(),
    });

    return NextResponse.json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to send confirmation email" },
      { status: 500 }
    );
  }
}
