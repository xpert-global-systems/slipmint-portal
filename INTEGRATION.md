# SlipMint — Subscribe Form Integration

Wires the homepage email form to Brevo or Mailchimp.
All code is drop-in — no third-party npm packages needed.

---

## Files included

```
pages/api/subscribe/brevo.js        ← Brevo API route
pages/api/subscribe/mailchimp.js    ← Mailchimp API route
components/SubscribeForm.js         ← React form component
styles/SubscribeForm.module.css     ← Matching styles
.env.local.example                  ← All required env vars
```

---

## Step 1 — Copy files into your repo

Drop each file into the matching path in your slipmint-portal project.

---

## Step 2 — Set up environment variables

Copy `.env.local.example` → `.env.local` and fill in your real keys.

**Using Brevo:**
1. Go to https://app.brevo.com → Settings → API Keys → Create key
2. Go to Contacts → Lists → create a "SlipMint Subscribers" list, note its ID
3. Set `BREVO_API_KEY` and `BREVO_LIST_ID` in `.env.local`
4. Set `NEXT_PUBLIC_EMAIL_PROVIDER=brevo`

**Using Mailchimp:**
1. Go to mailchimp.com → Account → Extras → API Keys → Create key
2. Note the server prefix (last part of your API key, e.g. `-us21`)
3. Find your Audience ID: Audience → Manage Audience → Settings
4. Set all three `MAILCHIMP_*` vars in `.env.local`
5. Set `NEXT_PUBLIC_EMAIL_PROVIDER=mailchimp`

---

## Step 3 — Replace the subscribe section in pages/index.js

Find your existing subscribe section and replace it:

```jsx
// At the top of pages/index.js — add this import
import SubscribeForm from '../components/SubscribeForm'

// Then find your existing subscribe HTML section, e.g.:
// <section>
//   <h2>Get market insights...</h2>
//   <p>Join our mailing list...</p>
//   <button>Subscribe</button>
// </section>

// Replace it entirely with:
<SubscribeForm />
```

---

## Step 4 — Vercel environment variables (production)

In your Vercel dashboard:
1. Go to your slipmint-portal project → Settings → Environment Variables
2. Add each variable from your `.env.local` (except NEXT_PUBLIC ones which auto-deploy)
3. Redeploy

**Variables to add in Vercel:**

| Variable | Value |
|---|---|
| `NEXT_PUBLIC_EMAIL_PROVIDER` | `brevo` or `mailchimp` |
| `BREVO_API_KEY` | your Brevo key |
| `BREVO_LIST_ID` | your list number |
| `MAILCHIMP_API_KEY` | (if using Mailchimp) |
| `MAILCHIMP_SERVER_PREFIX` | (if using Mailchimp) |
| `MAILCHIMP_AUDIENCE_ID` | (if using Mailchimp) |

---

## How it works

```
User types email → clicks Subscribe
        ↓
SubscribeForm.js → POST /api/subscribe/brevo (or /mailchimp)
        ↓
API route validates email → calls Brevo/Mailchimp API server-side
        ↓
Success → shows "You're on the list!" ✓
Error   → shows friendly error message
```

The API key never touches the browser — it's server-side only.

---

## Testing locally

```bash
npm run dev
# Visit http://localhost:3000
# Enter any email and click Subscribe
# Check your Brevo/Mailchimp contacts list
```

---

## Double opt-in (recommended for GDPR)

**Brevo:** In your Brevo dashboard → Settings → Senders & IP → Double opt-in
Set it on the list you're using. No code change needed.

**Mailchimp:** In `pages/api/subscribe/mailchimp.js`, change:
```js
status_if_new: 'subscribed'
// to:
status_if_new: 'pending'
```
Mailchimp will send a confirmation email automatically.
