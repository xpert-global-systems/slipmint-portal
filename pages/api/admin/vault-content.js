 // pages/api/admin/vault-content.js
// Manage Founder Vault content (Founder Notes, Premium Research, Strategic Watchlist).
// Protected by ADMIN_API_KEY.

import admin from "firebase-admin";

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

const VALID_CATEGORIES = ["founder_notes", "premium_research", "watchlist"];

// Basic sanitization helper to escape HTML tags
const sanitizeInput = (str) => {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

export default async function handler(req, res) {
  const providedKey = req.query.key;
  if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const db = admin.firestore();

  if (req.method === "GET") {
    try {
      let query = db.collection("vaultContent").orderBy("createdAt", "desc");
      if (req.query.category) {
        if (!VALID_CATEGORIES.includes(req.query.category)) {
          return res.status(400).json({ error: "Invalid category parameter" });
        }
        query = db
          .collection("vaultContent")
          .where("category", "==", req.query.category)
          .orderBy("createdAt", "desc");
      }
      
      const snapshot = await query.limit(100).get();
      const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return res.status(200).json({ count: items.length, items });
    } catch (error) {
      console.error("vault-content GET error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "POST") {
    try {
      const { category, title, body } = req.body || {};

      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({
          error: `category must be one of: ${VALID_CATEGORIES.join(", ")}`,
        });
      }
      if (!title?.trim() || !body?.trim()) {
        return res.status(400).json({ error: "title and body are required" });
      }

      // Prevent XSS
      const sanitizedTitle = sanitizeInput(title.trim());
      const sanitizedBody = sanitizeInput(body.trim());

      const docRef = await db.collection("vaultContent").add({
        category,
        title: sanitizedTitle,
        body: sanitizedBody,
        published: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ success: true, id: docRef.id });
    } catch (error) {
      console.error("vault-content POST error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Valid id is required" });
      }
      
      await db.collection("vaultContent").doc(id).delete();
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("vault-content DELETE error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
