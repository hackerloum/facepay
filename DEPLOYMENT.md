# FacePay Deployment Guide

## Vercel (Web Frontend)

The **web** app (Next.js) deploys to Vercel. The **API** (FastAPI + DeepFace) is too large for Vercel Lambda (2.3GB deps vs 500MB limit) and must be deployed separately.

### Vercel Setup

1. Import the repo in Vercel: https://vercel.com/new
2. **Critical**: Set **Root Directory** to `web`
   - Project Settings → General → Root Directory → `web`
   - This ensures only the Next.js app is built; the API is ignored.
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_API_URL` (your deployed API URL, e.g. `https://facepay-api.railway.app`)

### Why Root Directory = web?

The repo contains:
- `web/` — Next.js (deploy to Vercel)
- `api/` — FastAPI + DeepFace (deploy to Railway, Render, Fly.io, etc.)
- `mobile/` — Expo (build separately)

Without setting Root Directory to `web`, Vercel detects `api/requirements.txt` and tries to bundle the Python API, which exceeds the 500MB Lambda limit.

---

## API (FastAPI) Deployment

Deploy the API to a platform that supports larger runtimes:

- **Railway**: `railway init` in `api/`, add `Procfile` with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Render**: Add a Web Service, root directory `api`, build `pip install -r requirements.txt`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Fly.io**: Add `Dockerfile` in `api/` for Python + uvicorn

Set `API_BASE_URL` to your deployed API URL for Tembo webhooks.
