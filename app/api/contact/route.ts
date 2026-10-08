import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactRequest = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
};

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function sanitize(value: string) {
  return value.replace(/[<>]/g, "").trim();
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactRequest | null;

  if (!body) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // Honeypot check for bots
  if (body.company) {
    return NextResponse.json({ ok: true });
  }

  const name = sanitize(body.name || "");
  const senderEmail = sanitize(body.email || "");
  const message = sanitize(body.message || "");

  if (!name || !senderEmail || !message) {
    return NextResponse.json({ error: "Please fill every field." }, { status: 400 });
  }

  if (!isValidEmail(senderEmail)) {
    return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
  }

  const resendApiKey = process.env.RESEND_API_KEY?.trim();
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "").replace(/^["']|["']$/g, "");
  const to = process.env.CONTACT_TO_EMAIL?.trim() || "ashwathramj.devops@gmail.com";
  const from = process.env.CONTACT_FROM_EMAIL?.trim() || "Portfolio Contact <onboarding@resend.dev>";

  // 1. If RESEND_API_KEY is provided, use Resend API
  if (resendApiKey && !resendApiKey.includes("your_resend_api_key")) {
    try {
      const resendResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from,
          to: [to],
          reply_to: senderEmail,
          subject: `Portfolio intro from ${name}`,
          text: [
            `Name: ${name}`,
            `Email: ${senderEmail}`,
            "",
            "Why they are visiting:",
            message,
          ].join("\n"),
        }),
      });

      if (resendResponse.ok) {
        return NextResponse.json({ ok: true });
      }

      const errorText = await resendResponse.text();
      console.error("Resend API error:", errorText);
    } catch (error) {
      console.error("Resend error:", error);
    }
  }

  // 2. If GMAIL_USER & GMAIL_APP_PASSWORD are provided, use Gmail Nodemailer (Matches your screenshot!)
  if (gmailUser && gmailAppPassword && !gmailAppPassword.includes("your-16-char")) {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: gmailUser,
          pass: gmailAppPassword,
        },
      });

      await transporter.sendMail({
        from: gmailUser,
        to,
        replyTo: senderEmail,
        subject: `Portfolio intro from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${senderEmail}`,
          "",
          "Why they are visiting:",
          message,
        ].join("\n"),
      });

      return NextResponse.json({ ok: true });
    } catch (error) {
      console.error("Gmail contact email failed:", error);
      return NextResponse.json(
        { error: "Gmail authentication failed (Error 535). Please check GMAIL_APP_PASSWORD." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json(
    { error: "Email service is not configured yet. Please set RESEND_API_KEY or GMAIL_APP_PASSWORD in .env." },
    { status: 500 }
  );
}
