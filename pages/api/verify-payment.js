// pages/api/verify-payment.js
// Verifies a Paystack transaction reference and, if successful, marks the
// corresponding user's Firestore subscription tier as "founder".

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

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  try {
    const { reference } = req.body;
    if (!reference) {
      return res.status(400).json({ success: false, message: "Reference is required" });
    }

    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      return res.status(500).json({ success: false, message: "PAYSTACK_SECRET_KEY not configured" });
    }

    // Server-side verification — never trust the client's claim that payment succeeded.
    const verifyRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${secretKey}` },
      }
    );
    const verifyData = await verifyRes.json();

    if (!verifyData.status || verifyData.data?.status !== "success") {
      return res.status(200).json({
        success: false,
        message: "Payment not successful",
        paystackStatus: verifyData.data?.status || "unknown",
      });
    }

    const uid = verifyData.data?.metadata?.uid;
    if (!uid) {
      return res.status(400).json({ success: false, message: "No user reference on this transaction" });
    }

    const db = admin.firestore();
    await db.collection("users").doc(uid).set(
      {
        subscription: {
          tier: "founder",
          subscriptionCode: verifyData.data?.plan_object?.plan_code || null,
          customerCode: verifyData.data?.customer?.customer_code || null,
          lastPaymentReference: reference,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      },
      { merge: true }
    );

    return res.status(200).json({ success: true, message: "Founder Vault unlocked" });
  } catch (error) {
    console.error("Verify payment error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
}
