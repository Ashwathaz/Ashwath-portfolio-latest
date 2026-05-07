import { NextResponse } from "next/server";

type ContactRequest = {
  name?: string;
  email?: string;
  message?: string;
  company?: string;
};

const RESEND_API_URL = "https://api.resend.com/emails";

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

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";

  if (!apiKey || !to) {
    return NextResponse.json(
      { error: "Contact mail is not configured yet. Please email me directly." },
      { status: 500 }
    );
  }

  const response = await fetch(RESEND_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
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

  if (!response.ok) {
    const error = await response.json().catch(() => null);
    console.error("Resend contact email failed:", response.status, error);
    const errorMessage =
      error?.error ||
      error?.message ||
      "I could not send that message right now. Please email me directly.";
    return NextResponse.json({ error: errorMessage }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
