# Bondfire Production De-Hardcoding: Free Cloud APIs & Manual Setup Guide

This comprehensive guide details every mocked or simulated feature in Bondfire, the exact **100% Free Production APIs** that replace them, and the step-by-step manual actions you need to perform to go live.

---

## Summary of Hardcoded Elements vs. 100% Free APIs

| Feature Area | Current State (Local/Mock) | Free Production Replacement | Free Tier Allowance | Credit Card Needed? |
| :--- | :--- | :--- | :--- | :--- |
| **Authentication** | Simulated `currentUser` & GSI JWT Decoder | **Google Identity Services (OAuth 2.0)** | Unlimited Free Forever | ❌ **No** |
| **Media & Photos** | Unsplash static URLs in Vault & Book | **Cloudflare R2 Object Storage** | 10 GB Free Storage + 0 Egress Bandwidth Fees | ❌ **No** |
| **AI Roast & Trivia** | Hardcoded question array in `gameScreen.js` | **Google Gemini 1.5 Flash API** | 15 RPM, 1,500 Requests/Day Free via AI Studio | ❌ **No** |
| **Database & Sync** | Browser `localStorage` + Memory Store | **Supabase Cloud PostgreSQL** | 500 MB DB, 50,000 Monthly Active Users | ❌ **No** |
| **Payments & Pro** | Simulated Stripe Cyber Checkout Modal | **Stripe Developer Test Mode** | Unlimited Sandbox Charges & Real Webhooks | ❌ **No** |
| **Live WebSockets** | Localhost ws port 4000 or broadcast | **PartyKit / Cloudflare Workers** | 100k daily requests Free | ❌ **No** |

---

## 1. Google OAuth 2.0 (Real Google 1-Tap & Sign-In)

### What it Replaces
Replaces the simulated user object with real verified user names, emails, and profile pictures from Google.

### Step-by-Step Manual Setup (5 Minutes)
1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Click **Create Project** ➔ Name it `Bondfire-App`.
3. In the left navigation, open **APIs & Services** ➔ **OAuth consent screen**:
   - User Type: Select **External** and click **Create**.
   - App Information: Set App Name to `Bondfire`, User support email to your personal email.
   - Developer contact email: Enter your email.
   - Click **Save and Continue** through the Scopes step (default `email`, `profile`, `openid` are automatically selected).
   - Test Users: Add your personal Gmail address to test sign-ins.
4. Go to **APIs & Services** ➔ **Credentials**:
   - Click **+ CREATE CREDENTIALS** ➔ Select **OAuth client ID**.
   - Application type: Select **Web application**.
   - Name: `Bondfire Web Client`.
   - **Authorized JavaScript origins**:
     - `http://localhost:5173`
     - `http://localhost:3000`
     - `https://your-domain.vercel.app` (when deployed)
   - Click **Create**.
5. Copy the generated **Client ID** (looks like `XXXXXXXXX-XXXXX.apps.googleusercontent.com`).
6. Open `js/config.js` in your project and update:
   ```javascript
   GOOGLE_CLIENT_ID: 'YOUR_COPIED_CLIENT_ID.apps.googleusercontent.com'
   ```

---

## 2. Cloudflare R2 (Real Group Photo & Voice Note Storage)

### What it Replaces
Replaces static Unsplash placeholder photos with real group photos, screenshots, and audio recordings uploaded by squad members.

### Step-by-Step Manual Setup (5 Minutes)
1. Sign up for a free account at [Cloudflare.com](https://dash.cloudflare.com/).
2. In the left sidebar, click **R2 Object Storage**.
3. Click **Create Bucket** ➔ Bucket Name: `bondfire-vault-prod`.
   - Location: Choose **Automatic** (closest to users).
   - Click **Create Bucket**.
4. In the bucket **Settings** tab:
   - Under **Public Access**, click **Connect Domain** (or enable the free `r2.dev` public subdomain for testing).
   - Under **CORS Policy**, click **Add CORS policy** and paste:
     ```json
     [
       {
         "AllowedOrigins": ["http://localhost:5173", "https://*.vercel.app"],
         "AllowedMethods": ["GET", "PUT", "POST"],
         "AllowedHeaders": ["*"],
         "MaxAgeSeconds": 3600
       }
     ]
     ```
5. In the top-right of the R2 page, click **Manage R2 API Tokens** ➔ **Create API Token**:
   - Permissions: Select **Object Read & Write**.
   - Click **Create API Token**.
6. Copy the:
   - **Access Key ID**
   - **Secret Access Key**
   - **Jurisdiction-Specific S3 Endpoint** (`https://<account_id>.r2.cloudflarestorage.com`)
7. Paste these credentials into `.env`:
   ```env
   R2_ACCOUNT_ID=your_account_id
   R2_ACCESS_KEY_ID=your_access_key
   R2_SECRET_ACCESS_KEY=your_secret_key
   R2_BUCKET_NAME=bondfire-vault-prod
   R2_PUBLIC_URL=https://pub-xxxxxx.r2.dev
   ```

---

## 3. Google Gemini 1.5 Flash API (Real AI Trivia & Chat OCR Roasts)

### What it Replaces
Replaces the static 5-question mock array in `gameScreen.js` with live, hilarious AI roast questions generated directly from text OCR extracted from your group chat screenshots.

### Step-by-Step Manual Setup (2 Minutes)
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Sign in with your Google account.
3. Click **Get API Key** ➔ Click **Create API key in new project**.
4. Copy the API key (starts with `AIzaSy...`).
5. In `.env`, add:
   ```env
   GEMINI_API_KEY=AIzaSy...
   ```
6. The client / backend calls Gemini Flash:
   ```javascript
   const prompt = `You are the roast master for a squad called "${podName}". 
   Here is a real quote from their chat: "${quote}". 
   Generate 4 multiple-choice options for "Who said this in 2019?", where one is correct and 3 are believable squad members. 
   Return pure JSON.`;
   ```

---

## 4. Supabase (Free Production PostgreSQL Database)

### What it Replaces
Replaces client `localStorage` with a persistent multi-user PostgreSQL database so scores, squad memberships, and unlocked memories persist across all devices.

### Step-by-Step Manual Setup (3 Minutes)
1. Go to [Supabase.com](https://supabase.com/) and click **Start your project** (free).
2. Project Name: `Bondfire-DB` ➔ Set a strong Database Password.
3. Region: Select the region closest to your users.
4. When created, go to **SQL Editor** in the Supabase sidebar.
5. Open `database/migrations/001_initial_schema.sql` from this repository, copy all contents, paste into the Supabase SQL editor, and click **RUN**.
6. Go to **Project Settings** ➔ **API**:
   - Copy **Project URL**
   - Copy **anon / public key**
7. Paste into `.env`:
   ```env
   SUPABASE_URL=https://xxxxxx.supabase.co
   SUPABASE_ANON_KEY=eyJhbGci...
   ```

---

## 5. Stripe Developer Test Mode (Real Sandbox Payments & Webhooks)

### What it Replaces
Transitions the interactive demo checkout modal into real Stripe Elements with test cards, simulated 3D Secure verification, and webhook fulfillment.

### Step-by-Step Manual Setup (3 Minutes)
1. Create a free developer account at [Stripe.com](https://stripe.com/).
2. In the top-right header, ensure **Test Mode** toggle is switched ON (Orange banner).
3. Go to **Developers** ➔ **API Keys**:
   - Copy **Publishable key** (`your_stripe_publishable_key`)
   - Copy **Secret key** (`your_stripe_secret_key`)
4. Add to `.env`:
   ```env
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   ```
5. You can test transactions immediately with the official Stripe test cards:
   - **Visa Success**: `4242 4242 4242 4242`
   - **Mastercard Success**: `5555 5555 5555 4444`
   - **Any future date** (e.g. `12/28`) and any 3-digit CVC (`123`).

---

## 6. Verification & Health Checklist

To verify your configuration at any time, run:
```bash
# Verify all enterprise scenario assertions
node tests/scenario_full_lifecycle.js

# Verify core logic & screen renderers
node tests/verify_services.js

# Check local frontend server
http://localhost:5173
```
