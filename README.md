# FacePay MVP

Face recognition payment platform. Customers register their face on the web; merchants scan faces at point of sale; Tembo USSD push completes the payment.

## Architecture

- **Web** (Next.js): Customer registration, dashboards, merchant auth
- **API** (FastAPI): Face matching (DeepFace), payment initiation, Tembo webhook
- **Mobile** (Expo): Merchant face scanner and payment flow
- **Supabase**: Users, merchants, transactions, face images storage
- **Tembo**: MOMO collection (Airtel, Tigo, HaloPesa)

## Quick Start

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run SQL from `supabase/migrations/` in the SQL Editor
3. Create Storage bucket `face-images` (public) — see `supabase/README.md`

### 2. API

```bash
cd api
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
cp .env.example .env    # Fill in Supabase + Tembo keys
uvicorn main:app --reload
```

For local webhook testing, expose the API with ngrok and set `API_BASE_URL` in `.env`.

### 3. Web

```bash
cd web
npm install
cp .env.example .env.local   # Fill in Supabase URL, anon key, API URL
npm run dev
```

### 4. Mobile

```bash
cd mobile
npm install
cp .env.example .env        # Fill in API URL, Supabase URL, anon key
npx expo start
```

Add `assets/icon.png` and `assets/splash.png` for production builds (Expo will warn if missing).

## Environment Variables

| App   | Key                         | Description                    |
|-------|-----------------------------|--------------------------------|
| Web   | NEXT_PUBLIC_SUPABASE_URL     | Supabase project URL           |
| Web   | NEXT_PUBLIC_SUPABASE_ANON_KEY| Supabase anon key             |
| Web   | NEXT_PUBLIC_API_URL         | FastAPI URL (e.g. localhost:8000) |
| API   | SUPABASE_URL                 | Supabase project URL           |
| API   | SUPABASE_SERVICE_KEY         | Supabase service role key      |
| API   | TEMBO_BASE_URL               | https://sandbox.temboplus.com  |
| API   | TEMBO_ACCOUNT_ID             | Tembo account ID               |
| API   | TEMBO_SECRET_KEY             | Tembo secret key               |
| API   | API_BASE_URL                 | Public API URL for webhook     |
| Mobile| EXPO_PUBLIC_API_URL          | FastAPI URL                    |
| Mobile| EXPO_PUBLIC_SUPABASE_*       | Same as web                    |

## Deployment

**Vercel**: Set **Root Directory** to `web` in project settings. See [DEPLOYMENT.md](DEPLOYMENT.md).

## E2E Flow

1. **Register**: Go to `/register` on web, enter name/phone/network, capture face
2. **Merchant**: Create merchant account at `/merchant/register`
3. **Scan**: Log in on mobile app, scan customer face
4. **Pay**: Enter amount, tap Charge — customer gets USSD push
5. **Confirm**: Customer enters PIN on phone; status updates on app

## License

MIT
