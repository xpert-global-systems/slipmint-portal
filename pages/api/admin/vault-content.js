import admin from "firebase-admin";

function initFirebase() {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });
  }
  return admin.firestore();
}

const VALID_CATEGORIES = ["founder_notes", "premium_research", "watchlist"];

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
  try {
    const providedKey = req.query?.key;

    if (!providedKey || providedKey !== process.env.ADMIN_API_KEY) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const db = initFirebase();

    if (req.method === "GET") {
      let query = db.collection("vaultContent");

      if (req.query?.category) {
        if (!VALID_CATEGORIES.includes(req.query.category)) {
          return res.status(400).json({ error: "Invalid category" });
        }

        query = query
          .where("category", "==", req.query.category)
          .orderBy("createdAt", "desc");
      } else {
        query = query.orderBy("createdAt", "desc");
      }

      const snapshot = await query.limit(100).get();

      const items = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return res.status(200).json({
        count: items.length,
        items,
      });
    }

    if (req.method === "POST") {
      const { category, title, body } = req.body || {};

      if (!VALID_CATEGORIES.includes(category)) {
        return res.status(400).json({ error: "Invalid category" });
      }

      if (!title?.trim() || !body?.trim()) {
        return res.status(400).json({ error: "Missing fields" });
      }

      const docRef = await db.collection("vaultContent").add({
        category,
        title: sanitizeInput(title.trim()),
        body: sanitizeInput(body.trim()),
        published: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      return res.status(200).json({ success: true, id: docRef.id });
    }

    if (req.method === "DELETE") {
      const { id } = req.query || {};

      if (!id) {
        return res.status(400).json({ error: "id required" });
      }

      await db.collection("vaultContent").doc(id).delete();

      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("VAULT ERROR:", error);

    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}
