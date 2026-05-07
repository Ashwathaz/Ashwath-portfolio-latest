# Ashwath Ram Portfolio

Personal portfolio for Ashwath Ram, focused on cloud engineering, DevOps, AWS infrastructure, Docker, CI/CD, Terraform, Linux, Prometheus, and Grafana.

## Local Development

Install frontend dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example`, then set the contact form values:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
RESEND_API_KEY=re_your_key_here
CONTACT_TO_EMAIL=your-inbox@example.com
CONTACT_FROM_EMAIL="Portfolio <hello@yourdomain.com>"
```

Create `backend/.env` from `backend/.env.example`, then set the Groq values:

```env
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
FRONTEND_URL=http://localhost:3000
FLASK_ENV=development
```

Run the Next.js frontend:

```bash
npm run dev
```

Run the Flask backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Open [http://localhost:3000](http://localhost:3000).

## Docker Compose

Run the full app:

```bash
docker compose up --build
```

Services:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend: [http://localhost:5000](http://localhost:5000)

## Why This Portfolio Needs a Backend

A plain portfolio page does not need a backend. This one does because it has private, server-side actions:

- The recruiter tab sends pasted job descriptions to Groq and compares them with Ashwath's profile/resume content.
- The Groq API key must never be exposed in browser JavaScript.
- The contact form sends email through Resend, and the Resend API key must also stay server-side.
- The backend owns portfolio content updates, uploads, and the AI prompt context.

The browser is public. The backend is where private keys, prompt logic, email sending, and admin-protected actions belong.

## AI Provider

The only AI provider used by this project is Groq. No other AI SDK is required in the frontend or backend.
