// pages/api/paystack-webhook.js
// Receives events from Paystack for ALL payment flows (website checkout AND
// the standalone Payment Page link shared on Telegram).
//
// On a successful charge:
//   1. If metadata.uid is present (website flow), unlock that account directly.
//   2. Otherwise (Payment Page / Telegram flow), look up the user by email.
//      - If found, unlock their account.
//      - If not found, log it to "unmatchedPayments" so it can be reviewed
//        and manually linked instead of silently losing the payment.
//
// IMPORTANT: configure this URL in Paystack Dashboard -> Settings -> API Keys & Webhooks
//   https://luckmanworld.icu/api/paystack-webhook

import crypto from "crypto";
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// Next.js needs the raw body to verify Paystack's signature correctly.
export const config = {
  api: {
    bodyParser: false,
  },
};

function getRawBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (chunk) => (data += chunk));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Webhook error: PAYSTACK_SECRET_KEY not configured");
    return res.status(500).send("Server misconfigured");
  }

  const rawBody = await getRawBody(req);

  // Verify the request genuinely came from Paystack, not a forged request.
  const signature = req.headers["x-paystack-signature"];
  const expectedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  if (signature !== expectedSignature) {
    console.error("Webhook error: invalid signature");
    return res.status(401).send("Invalid signature");
  }

  let event;
  try {
    event = JSON.parse(rawBody);
  } catch (err) {
    return res.status(400).send("Invalid payload");
  }

  // Always respond 200 quickly once verified — Paystack retries on non-2xx.
  // We process the event after acknowledging receipt isn't required here
  // since our work is fast, but we still ack first to be safe.
  res.status(200).send("Received");

  try {
    if (event.event !== "charge.success") {
      // Other events (subscription.create, invoice.update, etc.) — nothing to do yet.
      return;
    }

    const data = event.data;
    const email = data?.customer?.email;
    const uid = data?.metadata?.uid; // present only for website-initiated checkouts
    const reference = data?.reference;

    const db = admin.firestore();

    const subscriptionPayload = {
      tier: "founder",
      subscriptionCode: data?.plan_object?.plan_code || data?.plan || null,
      customerCode: data?.customer?.customer_code || null,
      lastPaymentReference: reference,
      source: uid ? "website" : "payment_page",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (uid) {
      // Website flow — we already know exactly which account this is.
      await db.collection("users").doc(uid).set(
        { subscription: subscriptionPayload },
        { merge: true }
      );
      console.log(`Webhook: unlocked Founder Vault for uid ${uid}`);
      return;
    }

    if (!email) {
      console.error("Webhook: charge.success with no uid and no email — cannot match");
      return;
    }

    // Telegram / Payment Page flow — match by email.
    const matches = await db
      .collection("users")
      .where("email", "==", email)
      .limit(1)
      .get();

    if (matches.empty) {
      // No website account with this email yet — log it instead of losing the payment.
      await db.collection("unmatchedPayments").add({
        email,
        reference,
        amount: data?.amount,
        currency: data?.currency,
        receivedAt: admin.firestore.FieldValue.serverTimestamp(),
        raw: {
          customerCode: data?.customer?.customer_code || null,
          planCode: data?.plan_object?.plan_code || data?.plan || null,
        },
      });
      console.log(`Webhook: no website account for ${email}, logged to unmatchedPayments`);
      return;
    }

    const matchedDoc = matches.docs[0];
    await matchedDoc.ref.set({ subscription: subscriptionPayload }, { merge: true });
    console.log(`Webhook: unlocked Founder Vault for ${email} via email match`);
  } catch (error) {
    console.error("Webhook processing error:", error);
  }
}
