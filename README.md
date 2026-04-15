# Lumino Expense — Demo Backend

A Next.js 14 (App Router) backend for the Lumino Expense demo bot. Exposes 4 API endpoints for AI-driven CSV import from Google Sheets into Supabase.

## Deploy

1. Push this repo to GitHub
2. Go to https://vercel.com/new and import the repo
3. Add environment variables (see below)
4. Click Deploy

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_PUBLISHABLE_KEY` | Supabase publishable (anon) key — safe for reads |
| `SUPABASE_SECRET_KEY` | Supabase service role key — used for writes (keep secret) |
| `GEMINI_API_KEY` | Google Gemini API key |

Copy `.env.local.example` to `.env.local` and fill in the blanks for local dev.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check — returns `{status:"ok", timestamp}` |
| POST | `/api/import/analyze` | Fetch a Google Sheet, infer schema via Gemini, create import session |
| GET | `/api/import/[id]` | Fetch an import session by ID |
| PATCH | `/api/import/[id]/mapping` | Update column mapping overrides on a session |
| POST | `/api/import/[id]/execute` | Execute the import — bulk insert rows into Supabase |

## Local dev

```bash
npm install
cp .env.local.example .env.local
# fill in .env.local
npm run dev
# Test: curl http://localhost:3000/api/health
```
