# Free APIs, Infrastructure & Manual Setup Guide

This document outlines all free public APIs, STUN infrastructure, and manual deployment steps implemented in Bondfire.

---

## 1. Free STUN Servers for Peer-to-Peer WebRTC Multiplayer

To allow browsers and mobile phones to establish direct peer-to-peer data channels without purchasing expensive TURN servers or hosted socket servers, Bondfire connects directly to Google and Twilio's public free STUN gateways.

### Active Endpoints:
- `stun:stun.l.google.com:19302` (Google Public STUN — 100% Free, Global Anycast)
- `stun:stun1.l.google.com:19302` (Google Secondary STUN)
- `stun:global.stun.twilio.com:3478?transport=udp` (Twilio Public STUN)

### How to Get / Configure:
1. **Zero Registration**: These endpoints are open-source and free public internet infrastructure.
2. **Implementation**: Configured in [`js/services/webrtcService.js`](file:///c:/Users/Harshal/Desktop/gpt6/js/services/webrtcService.js).
3. **Behavior**: When two devices are on Wi-Fi or cellular, the STUN server discovers their public IP and NAT mapping, allowing them to exchange messages directly via `RTCPeerConnection`.

---

## 2. Real Chat Export Importers (WhatsApp & Discord)

### WhatsApp Chat Export:
1. Open any group chat on WhatsApp (iOS or Android).
2. Tap the group title > **Export Chat**.
3. Choose **Without Media** (creates a lightweight `_chat.txt`).
4. In Bondfire: Go to **Memory Vault** -> Tap **Import Chat (.txt/.json)** -> Drag & drop the `.txt` file or paste lines directly.
5. **PII Filtering**: Credit card numbers (`4111-XXXX-XXXX-XXXX`) and phone numbers are automatically redacted in-browser before cards are minted.

### Discord Chat Export:
1. Use any standard Discord channel export tool or bot (e.g. DiscordChatExporter) to download a `.json` transcript.
2. In Bondfire: Drop the `.json` file. Bondfire filters out bot commands (`!`, `/`), links, and system notifications, keeping dialogue for trivia cards.

---

## 3. Host Live TV Presentation Mode

1. From the live game screen ([`gameScreen.js`](file:///c:/Users/Harshal/Desktop/gpt6/js/components/gameScreen.js)), tap **"TV Mode"** in the top action bar.
2. Tap **"Fullscreen"** (`F11` or full screen toggle).
3. Connect your laptop or phone via AirPlay, Chromecast, or HDMI to your living room TV.
4. Players scan the corner QR code or enter the 4-letter room code on their phones to buzz in, while the TV displays high-impact questions and timer rings.

---

## 4. Print-Ready Keepsake Hardcover PDF Exporter

1. Navigate to **3D Photobook** (`/yearbook`).
2. Review your squad's auto-compiled yearbook spread.
3. Click **"Download PDF"** (`window.print`).
4. The print stylesheet automatically hides UI bars, switches to high-contrast printable white backgrounds, and formats the pages with proper landscape spreads ready to save as PDF or send to a local print shop.

---

## 5. Host Procedural Comedy Soundboard

1. In any game round or TV Mode, tap **"FX Soundboard"**.
2. Trigger:
   - **Buzzer** (Sawtooth dissonant buzz)
   - **Airhorn** (Tri-blast stadium fanfare)
   - **Rimshot** (Ba-dum-tss procedural snare and high-pass cymbal noise)
   - **Applause** (Bandpass white noise crowd cheer)
   - **Silence** (Procedural cricket chirps)
3. Synthesized completely using the browser's native **Web Audio API** (`AudioContext`) — zero MP3 downloads or copyright licensing fees.

---

## 6. How to Make Google Login Work for Multiple Real Accounts (100% Free)

If you see an error saying **"Access blocked: This app is in testing and you are not a test user"** or can only log in with one email, here is exactly why and how to unlock it freely:

### Why Google Restricts Accounts Initially:
When you create a Google Cloud Project for OAuth 2.0, Google automatically starts the project in **"Testing" Publishing Status**. In "Testing" mode, Google **blocks all Google accounts** except the exact email addresses you manually add to the "Test Users" whitelist.

### Option A: Make it Work for ANY Google Account in the World (Recommended, 100% Free)
Because Bondfire only requests basic non-sensitive scopes (`openid`, `email`, `profile`), **Google DOES NOT require an app verification audit, payment, or paperwork!**

1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your Bondfire project.
3. In the left navigation menu, go to **APIs & Services** > **OAuth consent screen**.
4. Look at **Publishing status**. It currently says **"Testing"**.
5. Click the **"PUBLISH APP"** button.
6. A confirmation modal will appear: *"Push to production? Your app will be available to any user with a Google Account."* Click **Confirm**.
7. **Done!** Now **ANY** Google account can immediately sign in.

### Option B: Keep in Testing Mode but Add Friends/Multiple Accounts
If you prefer not to publish to production yet:
1. In Google Cloud Console > **APIs & Services** > **OAuth consent screen**.
2. Scroll down to the **Test users** section.
3. Click **"+ ADD USERS"**.
4. Type in the email addresses of your friends, family, or other test accounts (up to 100 emails).
5. Click **Save**. All those accounts can now log in.

### Crucial Step: Authorized JavaScript Origins
To prevent `origin_mismatch` errors on your live site or locally:
1. Go to **APIs & Services** > **Credentials**.
2. Click your OAuth 2.0 Client ID (under Web application).
3. Under **Authorized JavaScript origins**, ensure you have added:
   - `https://bondfire-chi.vercel.app` (your Vercel production URL)
   - `http://localhost:5173` (Vite dev server)
   - `http://localhost:3000` (Local preview)
4. Under **Authorized redirect URIs**, add the same URLs if using redirect mode.
5. Click **Save**.

### Testing Multiple Accounts Locally / On 1 Device:
1. **Google Account Picker**: In Bondfire's Sign In modal, click **"Switch / Choose Another Google Account"** or use the official Google button to choose a different Google account.
2. **Incognito / Private Window**: Open an Incognito window to log in as a second player with a separate Google account without logging out of your main account.
3. **1-Click Test Accounts**: In the Bondfire Auth Modal, click any of the 4 instant test camper buttons (**Harshal [Host]**, **Liam**, **Sarah**, **Alex**) to test multiplayer flows in 1 click without needing multiple passwords.
