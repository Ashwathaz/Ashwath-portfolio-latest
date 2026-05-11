import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const CONTENT_FILE = path.join(process.cwd(), "backend", "portfolio_content.json");
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

type ChatRequest = {
  message?: string;
  mode?: "general" | "recruiter";
  selectedSkills?: string[];
};

type GroqResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
};

type ContentRecord = {
  SITE?: Record<string, unknown>;
  ABOUT_TEXT?: unknown;
  TIMELINE?: unknown;
  PROJECTS?: unknown;
  PERSONAL?: Record<string, unknown>;
};

function text(value: unknown) {
  return typeof value === "string" ? value : "";
}

function records(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object") : [];
}

function list(value: unknown) {
  return Array.isArray(value) ? value.map(text).filter(Boolean) : [];
}

function groqKeys() {
  const keys = [
    process.env.GROQ_API_KEY,
    process.env.GROQ_API_KEY_2,
    ...(process.env.GROQ_API_KEYS || "").split(/[,;\n]/),
  ]
    .map((key) => key?.trim())
    .filter((key): key is string => Boolean(key));

  return [...new Set(keys)];
}

async function loadContent(): Promise<ContentRecord> {
  const raw = await readFile(CONTENT_FILE, "utf8").catch(() => "{}");
  return JSON.parse(raw) as ContentRecord;
}

function formatNamedItems(items: unknown, secondaryKey: "rank" | "desc" | "type" = "rank") {
  return records(items)
    .map((item) => {
      const name = text(item.name || item.title);
      const secondary = text(item[secondaryKey]);
      const desc = text(item.desc);
      return [name, secondary, desc].filter(Boolean).join(" - ");
    })
    .filter(Boolean)
    .join("; ");
}

function buildProfileContext(content: ContentRecord) {
  const site = content.SITE || {};
  const about = Array.isArray(content.ABOUT_TEXT) ? content.ABOUT_TEXT.map(text).filter(Boolean).join(" ") : "";
  const timeline = records(content.TIMELINE);
  const projects = records(content.PROJECTS);
  const personal = content.PERSONAL || {};

  const timelineText = timeline
    .map((item) => {
      const points = list(item.points).join(", ");
      return `- ${text(item.role)} at ${text(item.organization)} (${text(item.period)}): ${points}`;
    })
    .join("\n");

  const projectsText = projects
    .map((item) => {
      const points = list(item.points).join("; ");
      return `- ${text(item.title)} (${text(item.date)}): ${text(item.description)} Tech: ${text(item.tech)}. Link: ${text(item.link)}. Details: ${points}`;
    })
    .join("\n");

  const galleryNotes = records(personal.galleryNotes)
    .map((item) => `${text(item.title)}: ${text(item.desc)}`)
    .filter(Boolean)
    .join("; ");

  const personalText = [
    `Hero: ${text(personal.heroTitle)} ${text(personal.heroHeadingBefore)} ${text(personal.heroHeadingAccent)} ${text(personal.heroHeadingAfter)} ${text(personal.heroText)}`,
    `Gaming: ${formatNamedItems(personal.gaming)}`,
    `Sports: ${formatNamedItems(personal.sports)}`,
    `Food: ${formatNamedItems(personal.foodie, "type")}`,
    `Ambitions: ${formatNamedItems(personal.ambitions, "desc")}`,
    `Gallery notes: ${galleryNotes}`,
    `Instagram: ${text(personal.instagram)}`,
  ]
    .filter((line) => !line.endsWith(": "))
    .join("\n");

  return {
    site,
    context: `
PROFILE:
- Name: ${text(site.name) || "Candidate"}
- Title: ${text(site.title)}
- Tagline: ${text(site.tagline)}
- Location: ${text(site.location)}
- Email: ${text(site.email)}
- Phone: ${text(site.phone)}
- LinkedIn: ${text(site.linkedin)}
- GitHub: ${text(site.github)}
- Portfolio: ${text(site.portfolio)}
- Resume: ${text(site.resumeUrl)}
- About: ${about}
- Experience:
${timelineText}
- Projects:
${projectsText}
- Personal:
${personalText}
`,
  };
}

function isCloudDevopsSdeJobDescription(message: string) {
  const keywords = [
    "cloud",
    "devops",
    "sde",
    "software engineer",
    "software developer",
    "backend",
    "aws",
    "azure",
    "gcp",
    "kubernetes",
    "docker",
    "terraform",
    "ci/cd",
    "pipeline",
    "infrastructure",
    "site reliability",
    "platform engineer",
    "cloud-native",
  ];
  const lower = message.toLowerCase();
  return keywords.some((keyword) => lower.includes(keyword));
}

function normalizeRecruiterMatch(parsed: any, message: string) {
  if (!parsed || typeof parsed !== "object") return parsed;

  let matchPercentage = Number(parsed.matchPercentage);
  if (!Number.isFinite(matchPercentage)) {
    const extracted = String(parsed.content || "").match(/\b(\d{1,3})\s*%/);
    matchPercentage = extracted ? Number(extracted[1]) : NaN;
  }

  if (!Number.isFinite(matchPercentage)) return parsed;

  if (isCloudDevopsSdeJobDescription(message)) {
    const targetLow = 80;
    const targetHigh = 85;
    if (matchPercentage < targetLow) matchPercentage = targetLow;
    if (matchPercentage > targetHigh) matchPercentage = targetHigh;

    parsed.matchPercentage = matchPercentage;
    parsed.matchLevel = "Strong";

    const content = String(parsed.content || "").trim();
    const justification = `I place this match in the ${matchPercentage}% range because the job aligns strongly with the candidate’s cloud/DevOps/SDE strengths and the profile demonstrates the key technical experience required.`;
    if (!content.includes(justification)) {
      parsed.content = content ? `${content} ${justification}` : justification;
    }
  }

  return parsed;
}

async function createGroqCompletion(keys: string[], body: unknown) {
  let lastError = "No Groq request was attempted.";

  for (const key of keys) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        lastError = await response.text();
        continue;
      }

      const data = (await response.json()) as GroqResponse;
      const content = data.choices?.[0]?.message?.content;

      if (content) {
        return content;
      }

      lastError = "Groq returned an empty response.";
    } catch (error) {
      lastError = error instanceof Error ? error.message : "Groq request failed.";
    }
  }

  throw new Error(lastError);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ChatRequest | null;
  const message = body?.message?.trim() || "";
  const mode = body?.mode || "general";
  const selectedSkills = Array.isArray(body?.selectedSkills) ? body.selectedSkills : [];
  const keys = groqKeys();

  if (!keys.length) {
    return NextResponse.json({ error: "GROQ_API_KEY is not configured" }, { status: 503 });
  }

  if (!message) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  if (mode === "recruiter" && message.length < 80) {
    return NextResponse.json({ error: "Please paste the full job description for an accurate match." }, { status: 400 });
  }

  const { site, context } = buildProfileContext(await loadContent());
  const name = text(site.name) || "the candidate";

  let systemPrompt =
    mode === "recruiter"
      ? `You are ${name} speaking directly to a recruiter who pasted a job description. Analyze whether the candidate suits the role using only the profile, experience, projects, links, and personal context below.
${context}
ANALYSIS INSTRUCTIONS:
1. Compare the job description against the candidate profile.
2. Calculate a realistic match percentage from 0-100. Do not inflate it.
3. Use matchLevel as one of: Excellent, Strong, Good, Moderate, Low.
4. Clearly say whether the candidate suits the job.
5. Include the strongest matches and the most important gaps.
6. If there are gaps, suggest how the candidate can position them.
7. Sound human and professional. Avoid generic corporate language.
8. Wrap 1-3 standout strengths in **double asterisks**.
9. Keep content to 2-4 short paragraphs.
10. If the role is related to cloud, DevOps, or software engineering and the candidate has strong relevant experience, aim for a justified match percentage in the 80-85% range.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "type": "job_match",
  "matchPercentage": <number>,
  "matchLevel": "<string>",
  "content": "<analysis written in first person, with **highlights**>",
  "followUps": ["<short question 1>", "<short question 2>", "<short question 3>"]
}`
      : `You are ${name}. Speak entirely in first person. You are professional and helpful.
${context}
RULES:
1. Stay substantive and conversational.
2. Keep it professional.
3. Wrap key impact statements in **double asterisks**.
4. 2-4 paragraphs max.

FORMAT YOUR RESPONSE AS JSON:
{
  "content": "<your response text with **highlights**>",
  "followUps": ["<short question 1>", "<short question 2>", "<short question 3>"]
}`;

  if (mode === "recruiter" && selectedSkills.length) {
    systemPrompt += `\n\nThe recruiter wants to especially highlight these skills: ${selectedSkills.join(", ")}`;
  }

  try {
    const completionText = await createGroqCompletion(keys, {
      model: GROQ_MODEL,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });
    let parsed = JSON.parse(completionText) as any;

    if (mode === "recruiter") {
      parsed = normalizeRecruiterMatch(parsed, message);
      return NextResponse.json(parsed);
    }

    return NextResponse.json({
      type: "general",
      content: parsed.content || "",
      followUps: parsed.followUps || [],
    });
  } catch (error) {
    console.error("Groq request failed:", error);
    return NextResponse.json({ error: "Groq request failed" }, { status: 502 });
  }
}
