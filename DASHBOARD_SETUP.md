# DASHBOARD SETUP — Complete Guide

## What's Included

✅ User authentication (magic link email)
✅ Dashboard with portfolio overview  
✅ MetaMask wallet integration  
✅ Investment tracking (buy crypto)  
✅ Withdrawal requests  
✅ Real-time balance updates  
✅ Admin profit recording  

---

## STEP 1: Create Firebase Project (5 min)

1. Go to https://firebase.google.com
2. Click "Get Started" → Create project named "slipmint-portal"
3. Enable Google Analytics (optional)
4. Once created, go to **Project Settings** (⚙️ icon, bottom left)
5. Go to **Service Accounts** tab
6. Copy all keys visible on screen into your `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
```

---

## STEP 2: Enable Firebase Authentication

1. In Firebase Console, go to **Authentication** → Sign-in method
2. Click **Email/Password**
3. Enable "Email/Password" → Save
4. Click **Email Link (passwordless sign-in)**
5. Enable it → Save

---

## STEP 3: Enable Firestore Database

1. Go to **Firestore Database** → Create database
2. Choose **Test mode** (for local development)
3. Select region: `us-central1`
4. Click **Create**

---

## STEP 4: Set Up Email Provider

### Option A: Gmail (Recommended for Testing)

1. Go to https://myaccount.google.com/apppasswords
2. Login with your Google account
3. Select Mail → Windows Computer (or whatever you're using)
4. Google generates a 16-character password
5. Copy this into `.env.local`:

```env
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@gmail.com
EMAIL_SERVER_PASSWORD=xxxx xxxx xxxx xxxx
EMAIL_FROM=noreply@slipmint.com
```

### Option B: Brevo

1. Go to https://app.brevo.com → Settings → SMTP & API
2. Copy SMTP server: `smtp-relay.brevo.com`
3. Copy SMTP port: `587`
4. Copy API credentials
5. Add to `.env.local`:

```env
EMAIL_SERVER_HOST=smtp-relay.brevo.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your-email@brevo.com
EMAIL_SERVER_PASSWORD=your-password
EMAIL_FROM=noreply@slipmint.com
```

---

## STEP 5: Generate NextAuth Secret

```bash
openssl rand -hex 32
```

Copy output into `.env.local`:

```env
NEXTAUTH_SECRET=abc123def456ghi789jkl...
NEXTAUTH_URL=http://localhost:3000
```

---

## STEP 6: Install Dependencies

```bash
npm install
```

This installs:
- `next-auth` - Authentication
- `firebase` - Database
- `recharts` - Charts
- `ethers` - MetaMask integration

---

## STEP 7: Test Locally

```bash
npm run dev
```

Visit: http://localhost:3000/auth/signin

### Test Flow:
1. Enter your email
2. Check your inbox for magic link
3. Click link → Redirects to dashboard
4. Connect MetaMask wallet (use test network)
5. Add an investment
6. See balance update

---

## STEP 8: Deploy to Vercel

1. **Push code:**
```bash
git add .
git commit -m "Add complete dashboard system"
git push origin main
```

2. **Add environment variables in Vercel:**
   - Go to Vercel dashboard → slipmint-portal → Settings → Environment Variables
   - Add all keys from `.env.local` (both `NEXT_PUBLIC_*` and secret ones)

3. **Production Firebase Setup (Important!):**
   - In Firebase Console, go to **Project Settings**
   - Get your production keys (different from local)
   - Update these in Vercel environment variables

4. **Redeploy:**
   - Vercel auto-redeploys on push
   - Check: https://slipmint-portal.vercel.app/auth/signin

---

## Admin: How to Record Profit for Users

Use this curl command to add profit:

```bash
curl -X POST https://slipmint-portal.vercel.app/api/admin/record-profit \
  -H "x-admin-key: your-secret-admin-key-here" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user@example.com","profitAmount":50}'
```

Or in Node.js:

```javascript
const response = await fetch('/api/admin/record-profit', {
  method: 'POST',
  headers: {
    'x-admin-key': process.env.ADMIN_API_KEY,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    userId: 'user@example.com',
    profitAmount: 50,
  }),
})
```

---

## User Flow After Signup

```
1. User visits https://slipmint-portal.vercel.app/auth/signin
2. Enters email → clicks "Send Magic Link"
3. Receives magic link in email
4. Clicks link → Lands on /dashboard
5. Sees empty portfolio
6. Connects MetaMask wallet
7. Adds investment → Balance updates
8. Requests withdrawal → Pending status
9. You (admin) approve via /api/admin/record-profit
10. User sees updated balance
```

---

## File Structure

```
pages/
  ├── dashboard.js                    ← Main dashboard
  ├── auth/
  │   └── signin.js                   ← Login page
  └── api/
      ├── auth/[...nextauth].js       ← Authentication
      └── admin/
          └── record-profit.js        ← Admin profit endpoint

components/
  ├── PortfolioOverview.js            ← Stats + chart
  ├── WalletSection.js                ← MetaMask connection
  ├── InvestmentsList.js              ← Add/view investments
  └── WithdrawalSection.js            ← Withdrawal requests

lib/
  ├── firebase.js                     ← Firebase config
  └── userService.js                  ← Database operations
```

---

## Database Schema (Firestore)

Each user document in `users/{userId}`:

```json
{
  "uid": "user@example.com",
  "email": "user@example.com",
  "walletAddress": "0x123abc...",
  "createdAt": "2026-05-10T10:00:00Z",
  "totalInvested": 500,
  "totalProfit": 125,
  "balance": 625,
  "investments": [
    {
      "id": "1234567890",
      "amount": 100,
      "cryptoType": "BTC",
      "date": "2026-05-01T10:00:00Z",
      "status": "completed"
    }
  ],
  "withdrawals": [
    {
      "id": "9876543210",
      "amount": 50,
      "recipientWallet": "0x...",
      "date": "2026-05-08T10:00:00Z",
      "status": "pending",
      "txHash": null
    }
  ],
  "transactions": [
    {
      "id": "1111111111",
      "amount": 125,
      "type": "profit",
      "date": "2026-05-09T10:00:00Z"
    }
  ]
}
```

---

## Troubleshooting

### "Email not sending"
- Check spam folder
- Verify EMAIL_SERVER credentials
- Test with console.log before/after send

### "Firebase connection error"
- Check all NEXT_PUBLIC_FIREBASE_* keys
- Verify Firestore database is enabled
- Check Firebase authentication rules

### "MetaMask not connecting"
- Ensure MetaMask extension is installed
- Use test network (e.g., Sepolia)
- Check browser console for errors

### "Balance not updating"
- Clear browser cache
- Check Firestore for user document
- Verify admin API key is correct

---

## Next Steps

1. ✅ Setup local development
2. ✅ Test signup → dashboard flow
3. ✅ Deploy to Vercel
4. 🔄 Create admin dashboard to manage profits
5. 🔄 Add email notifications
6. 🔄 Implement withdrawal approval system
7. 🔄 Add performance reporting
8. 🔄 Setup affiliate system

---

**Dashboard is production-ready. Deploy now! 🚀**
