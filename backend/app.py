import json
import os
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from groq import Groq

load_dotenv(Path(__file__).parent / ".env")

app = Flask(__name__)

FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:3000")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "ZEUS999+")
CONTENT_FILE = Path(__file__).parent / "portfolio_content.json"
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.3-70b-versatile")

CORS(app, origins=[
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    FRONTEND_URL,
    r"https://.*\.vercel\.app",
], supports_credentials=True)

def get_groq_keys():
    keys = [
        os.environ.get("GROQ_API_KEY"),
        os.environ.get("GROQ_API_KEY_2"),
    ]
    keys.extend(os.environ.get("GROQ_API_KEYS", "").replace("\n", ",").split(","))
    cleaned = []
    for key in keys:
        if key and key.strip() and key.strip() not in cleaned:
            cleaned.append(key.strip())
    return cleaned


def create_groq_completion(**kwargs):
    last_error = None
    for key in get_groq_keys():
        try:
            client = Groq(api_key=key)
            return client.chat.completions.create(**kwargs)
        except Exception as exc:
            last_error = exc
            print(f"Groq key failed, trying fallback if available: {exc}")
    if last_error:
        raise last_error
    raise RuntimeError("GROQ_API_KEY is not configured")


def load_content():
    if CONTENT_FILE.exists():
        with open(CONTENT_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_content(content):
    with open(CONTENT_FILE, "w", encoding="utf-8") as f:
        json.dump(content, f, indent=2)


@app.route("/api/content", methods=["GET"])
def get_content():
    return jsonify(load_content())


@app.route("/api/content", methods=["POST"])
def update_content():
    password = request.headers.get("X-Admin-Password")
    if password != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401

    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400

    save_content(data)
    return jsonify({"message": "Content updated successfully", "content": data})


UPLOAD_FOLDER = Path(__file__).parent.parent / "public" / "uploads"
UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


@app.route("/api/upload", methods=["POST"])
def upload_file():
    password = request.headers.get("X-Admin-Password")
    if password != ADMIN_PASSWORD:
        return jsonify({"error": "Unauthorized"}), 401

    if "file" not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files["file"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        from werkzeug.utils import secure_filename

        filename = secure_filename(file.filename)
    except ImportError:
        filename = file.filename.replace(" ", "_").replace("/", "")

    file.save(os.path.join(app.config["UPLOAD_FOLDER"], filename))
    return jsonify({"url": f"/uploads/{filename}"})


def build_profile_context(content):
    site_info = content.get("SITE", {})
    about_text = " ".join(content.get("ABOUT_TEXT", []))
    timeline = content.get("TIMELINE", [])
    projects = content.get("PROJECTS", [])
    personal = content.get("PERSONAL", {})

    timeline_str = "\n".join([
        f"- {item.get('role', '')} at {item.get('organization', '')} ({item.get('period', '')}): {', '.join(item.get('points', []))}"
        for item in timeline
    ])

    projects_str = "\n".join([
        (
            f"- {item.get('title', '')} ({item.get('date', '')}): "
            f"{item.get('description', '')} Tech: {item.get('tech', '')}. "
            f"Details: {'; '.join(item.get('points', []))}"
        )
        for item in projects
    ])

    def named_items(items, secondary_key="rank"):
        formatted = []
        for item in items or []:
            if isinstance(item, str):
                formatted.append(item)
                continue
            if not isinstance(item, dict):
                continue
            parts = [
                item.get("name") or item.get("title") or "",
                item.get(secondary_key) or "",
                item.get("desc") or "",
            ]
            formatted.append(" - ".join([part for part in parts if part]))
        return "; ".join(formatted)

    gallery_notes = "; ".join([
        f"{item.get('title', '')}: {item.get('desc', '')}"
        for item in personal.get("galleryNotes", [])
        if isinstance(item, dict)
    ])

    return site_info, f"""
PROFILE:
- Name: {site_info.get('name', 'Candidate')}
- Title: {site_info.get('title', '')}
- Tagline: {site_info.get('tagline', '')}
- About: {about_text}
- Experience:
{timeline_str}
- Projects:
{projects_str}
- Personal:
Hero: {personal.get("heroTitle", "")} {personal.get("heroHeadingBefore", "")} {personal.get("heroHeadingAccent", "")} {personal.get("heroHeadingAfter", "")} {personal.get("heroText", "")}
Gaming: {named_items(personal.get("gaming", []))}
Sports: {named_items(personal.get("sports", []))}
Food: {named_items(personal.get("foodie", []), "type")}
Ambitions: {named_items(personal.get("ambitions", []), "desc")}
Gallery notes: {gallery_notes}
Instagram: {personal.get("instagram", "")}
"""


@app.route("/api/chat", methods=["POST"])
def chat():
    if not get_groq_keys():
        return jsonify({"error": "GROQ_API_KEY is not configured"}), 503

    data = request.get_json()
    if not data or "message" not in data:
        return jsonify({"error": "Message is required"}), 400

    message = data["message"].strip()
    mode = data.get("mode", "general")
    selected_skills = data.get("selectedSkills", [])

    if not message:
        return jsonify({"error": "Message is required"}), 400

    if mode == "recruiter" and len(message) < 80:
        return jsonify({"error": "Please paste the full job description for an accurate match."}), 400

    site_info, base_context = build_profile_context(load_content())

    if mode == "recruiter":
        system_prompt = f"""You are {site_info.get('name', 'the candidate')} speaking directly to a recruiter who pasted a job description. Analyze whether the candidate suits the role using only the profile, experience, and projects below.
{base_context}
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

RESPOND IN THIS EXACT JSON FORMAT:
{{
  "type": "job_match",
  "matchPercentage": <number>,
  "matchLevel": "<string>",
  "content": "<analysis written in first person, with **highlights**>",
  "followUps": ["<short question 1>", "<short question 2>", "<short question 3>"]
}}"""
    else:
        system_prompt = f"""You are {site_info.get('name', 'the candidate')}. Speak entirely in first person. You are professional and helpful.
{base_context}
RULES:
1. Stay substantive and conversational.
2. Keep it professional.
3. Wrap key impact statements in **double asterisks**.
4. 2-4 paragraphs max.

FORMAT YOUR RESPONSE AS JSON:
{{
  "content": "<your response text with **highlights**>",
  "followUps": ["<short question 1>", "<short question 2>", "<short question 3>"]
}}"""

    if mode == "recruiter" and selected_skills:
        system_prompt += f"\n\nThe recruiter wants to especially highlight these skills: {', '.join(selected_skills)}"

    try:
        completion = create_groq_completion(
            model=GROQ_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": message},
            ],
            temperature=0.7,
            max_tokens=1024,
            response_format={"type": "json_object"},
        )

        content_json = completion.choices[0].message.content
        parsed = json.loads(content_json)

        if mode == "recruiter":
            return jsonify(parsed)

        return jsonify({
            "type": "general",
            "content": parsed.get("content", ""),
            "followUps": parsed.get("followUps", []),
        })

    except Exception as e:
        print(f"Groq error: {e}")
        return jsonify({"error": "Groq request failed"}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=os.environ.get("FLASK_ENV") != "production")
