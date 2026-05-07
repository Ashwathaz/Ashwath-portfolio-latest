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

  const gmailUser = process.env.GMAIL_USER;
  const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;
  const to = process.env.CONTACT_TO_EMAIL;

  if (!gmailUser || !gmailAppPassword || !to) {
    return NextResponse.json(
      { error: "Contact mail is not configured yet. Please email me directly." },
      { status: 500 }
    );
  }

  // Create transporter
  const transporter = nodemailer.createTransporter({
    service: "gmail",
    auth: {
      user: gmailUser,
      pass: gmailAppPassword,
    },
  });

  const mailOptions = {
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
  };

  try {
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Gmail contact email failed:", error);
    return NextResponse.json(
      { error: "Failed to send email. Please try again later." },
      { status: 500 }
    );
  }
}
      "I could not send that message right now. Please email me directly.";
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
