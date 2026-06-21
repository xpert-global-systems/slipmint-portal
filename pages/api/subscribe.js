// pages/api/subscribe.js
// Initializes a Paystack transaction for the Founder Vault plan.
// Requires the user to be logged in (Firebase ID token in Authorization header).

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

const FOUNDER_VAULT_PLAN_CODE = "PLN_eg5pjf5m4a1g6kp";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const authHeader = req.headers.authorization || "";
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ success: false, message: "Missing token" });
    }

    const token = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(token);

    if (!decoded.email_verified) {
      return res.status(403).json({ success: false, message: "Email not verified" });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ success: false, message: "PAYSTACK_SECRET_KEY not configured" });
    }

    // Reference encodes the uid so verify-payment can find the right user
    // even before checking Paystack's customer record.
    const reference = `vault_${decoded.uid}_${Date.now()}`;

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || `https://${req.headers.host}`;

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: decoded.email,
        plan: FOUNDER_VAULT_PLAN_CODE,
        reference,
        callback_url: `${siteUrl}/vault?ref=${reference}`,
        metadata: {
          uid: decoded.uid,
        },
      }),
    });

    const data = await paystackRes.json();

    if (!data.status) {
      return res.status(500).json({ success: false, message: data.message || "Paystack initialization failed" });
    }

    return res.status(200).json({
      success: true,
      authorization_url: data.data.authorization_url,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Subscribe error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
