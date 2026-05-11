## Goal
Send you an instant WhatsApp message whenever a new row is added to `enrollments` or `gift_claims`.

## Heads-up about WhatsApp
WhatsApp Business messaging requires Twilio + a WhatsApp sender. There are two paths:

- **Twilio WhatsApp Sandbox** (free, instant) — you join a sandbox by texting a code to Twilio's shared number from your phone. Perfect for personal admin alerts. ✅ Recommended for now.
- **Approved WhatsApp Business sender** (paid, takes days, requires Meta business verification). Skip unless you want messages to clients.

If WhatsApp setup feels heavy later, **Telegram Bot is a 2-minute free alternative** with the exact same alert UX — happy to switch.

---

## What you'll need to do (one-time, ~5 min)
1. Create a free Twilio account → grab Account SID + Auth Token.
2. Open Twilio Console → Messaging → Try WhatsApp → text the join code (e.g. `join <two-words>`) from your WhatsApp to **+1 415 523 8886**.
3. Connect Twilio in Lovable when I prompt you.
4. Tell me your WhatsApp number (with country code).

---

## Implementation

### 1. Connect Twilio
Use the Twilio connector so credentials are managed securely (no manual API keys). Adds `TWILIO_API_KEY` env var.

### 2. Store admin recipient
Add a small `notification_settings` table (or a single env secret `ADMIN_WHATSAPP_NUMBER`) so the number isn't hardcoded.

### 3. Public webhook endpoint
Create `src/routes/api/public/notify-new-record.ts` (TanStack server route). It:
- Verifies a shared `WEBHOOK_SECRET` header (so only Supabase can call it).
- Accepts `{ table, record }` payload.
- Formats a message like:
  ```
  🆕 New Enrollment
  Name: Rahim
  Mobile: 017xxxxxxxx
  Course: Online Pro
  Time: 11 May 2026, 22:45
  ```
- Sends via Twilio WhatsApp gateway to `whatsapp:+88017...`.

### 4. Database triggers (real-time, no polling)
Add a Postgres function + triggers on `enrollments` (AFTER INSERT) and `gift_claims` (AFTER INSERT) that use `pg_net` to POST the new row to the webhook with the secret header. This means alerts fire **the instant a row is inserted**, even if the dashboard is closed.

### 5. Admin dashboard toggle (optional small UI)
Add a "Notifications" card on `/admin-binary` showing:
- Connection status (✅ Twilio linked / ❌ Not configured)
- Test button → sends "🔔 Test alert from Binary Admin" to your WhatsApp
- Toggle on/off per table (stored in `notification_settings`)

---

## Technical details
- **Stack:** Twilio connector via Lovable connector gateway (no SDK needed, OAuth/token refresh handled automatically).
- **Secrets:** `TWILIO_API_KEY` (auto from connector), `WEBHOOK_SECRET` (random, generated), `ADMIN_WHATSAPP_NUMBER` (your number).
- **Trigger SQL:**
  ```
  CREATE TRIGGER enrollments_notify
    AFTER INSERT ON enrollments
    FOR EACH ROW EXECUTE FUNCTION notify_admin();
  ```
- **Endpoint URL** for triggers: `https://binaryacademy.lovable.app/api/public/notify-new-record`
- Sandbox limitation: Twilio Sandbox can only message numbers that have joined the sandbox (i.e. your own admin number). That's exactly the use case here.

---

## Order of operations after you approve
1. I'll prompt you to connect Twilio.
2. Ask for your WhatsApp number + that you've joined the sandbox.
3. Run the migration (triggers + settings table).
4. Build the webhook + dashboard card.
5. Hit the Test button together to confirm a real WhatsApp message arrives.