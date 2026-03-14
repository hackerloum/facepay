# FacePay E2E Test Guide

Manual end-to-end test to verify the full payment flow.

## Prerequisites

- Supabase project configured with migrations run
- API running (`uvicorn main:app --reload`)
- Web running (`npm run dev` in web/)
- Mobile app running (`npx expo start` in mobile/)
- Tembo sandbox credentials (or mock webhook for status updates)

## Test Steps

### 1. Customer Registration (Web)

1. Open http://localhost:3000/register
2. Enter: Name, Phone (e.g. 255712345678), Network (Airtel/Tigo/Halotel)
3. Allow camera access, position face in circle, click "Capture Face"
4. Click "Complete Registration"
5. Verify redirect to dashboard with profile and transaction history (empty)

### 2. Merchant Setup (Web)

1. Open http://localhost:3000/merchant/register
2. Create account: email, password, shop name, owner name, Tembo Account ID (optional)
3. Sign in at /merchant/login
4. Verify merchant dashboard loads

### 3. Face Scan (Mobile)

1. Open Expo app, sign in with merchant credentials
2. Navigate to Scan screen (auto after login)
3. Allow camera, position your face (same as registered), tap "Scan Face"
4. Verify "Matching face..." then redirect to Confirm with your name and photo

### 4. Payment Flow (Mobile)

1. On Confirm screen, enter amount (e.g. 1000)
2. Tap "Charge [Your Name]"
3. Verify redirect to Status screen with "Waiting for customer to confirm..."
4. On your phone (registered number): receive USSD push, enter PIN
5. Verify Status updates to "Payment Received" with amount (or "Payment Rejected" if declined)

### 5. Dashboard Verification (Web)

1. Customer: Open /dashboard, enter phone number, verify transaction appears
2. Merchant: Open /merchant/dashboard, verify today's transaction count and total

## Troubleshooting

- **No face detected**: Ensure good lighting, face centered, no obstructions
- **Face not recognized**: Re-register on web with clearer capture
- **API connection refused**: Ensure API is running, check NEXT_PUBLIC_API_URL / EXPO_PUBLIC_API_URL
- **Webhook not received**: Use ngrok to expose API, set API_BASE_URL in API .env
- **Tembo errors**: Verify sandbox credentials, channel matches phone network
