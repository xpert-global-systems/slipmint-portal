// pages/api/admin/unmatched-payments.js
// Lists Paystack payments that couldn't be auto-matched to a website account
// (usually because someone paid via the Telegram Payment Page using a
// different email than their site login). Protected by ADMIN_API_KEY.
//
// Usage: GET /api/admin/unmatched-payments?key=YOUR_ADMIN_API_KEY

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
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const providedKey = req.query.key;
  if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const db = admin.firestore();
    const snapshot = await db
      .collection("unmatchedPayments")
      .orderBy("receivedAt", "desc")
      .limit(50)
      .get();

    const payments = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return res.status(200).json({ count: payments.length, payments });
  } catch (error) {
    console.error("Unmatched payments lookup error:", error);
    return res.status(500).json({ error: error.message });
  }
}
