import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

const CONTENT_FILE = path.join(process.cwd(), "backend", "portfolio_content.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "ZEUS999+";

export async function GET() {
  try {
    const content = await readFile(CONTENT_FILE, "utf8");
    return NextResponse.json(JSON.parse(content));
  } catch (error) {
    console.error("Content read failed:", error);
    return NextResponse.json({ error: "Content is unavailable." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const password = request.headers.get("X-Admin-Password");

  if (password !== ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);

  if (!body) {
    return NextResponse.json({ error: "No data provided" }, { status: 400 });
  }

  try {
    await writeFile(CONTENT_FILE, JSON.stringify(body, null, 2), "utf8");
    return NextResponse.json({ message: "Content updated successfully", content: body });
  } catch (error) {
    console.error("Content save failed:", error);
    return NextResponse.json({ error: "Content could not be saved." }, { status: 500 });
  }
}
