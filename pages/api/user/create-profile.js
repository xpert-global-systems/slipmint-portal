import admin from "firebase-admin";

// --------------------
// SAFE INIT (ONLY ONCE)
// --------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

// --------------------
// VALIDATION
// --------------------
const validateInput = (data) => {
  const errors = [];
  const { fullName, phone, dob, ssn } = data;

  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }

  if (phone && phone.trim() && !/^[\d\s-+()]{10,20}$/.test(phone.trim())) {
    errors.push("Invalid phone number format");
  }

  if (dob && dob.trim() && !/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
    errors.push("DOB must be YYYY-MM-DD format");
  }

  if (ssn && ssn.trim() && !/^\d{3}-\d{2}-\d{4}$|^\d{9}$/.test(ssn.trim())) {
    errors.push("Invalid SSN format");
  }

  return errors;
};

// --------------------
// HANDLER
// --------------------
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const authHeader = req.headers.authorization || "";

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Missing token",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    const decoded = await admin.auth().verifyIdToken(token);

    const errors = validateInput(req.body);

    if (errors.length) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors,
      });
    }

    const { fullName, phone, occupation, dob, ssn, referral } = req.body;

    const db = admin.firestore();

    const docRef = db.collection("users").doc(decoded.uid);
    const doc = await docRef.get();

    const data = {
      uid: decoded.uid,
      email: decoded.email || null,
      fullName: fullName?.trim() || "",
      phone: phone?.trim() || null,
      occupation: occupation?.trim() || null,
      dob: dob?.trim() || null,
      ssn: ssn?.replace(/\D/g, "") || null,
      referral: referral?.trim() || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (!doc.exists) {
      data.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await docRef.set(data, { merge: true });

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      uid: decoded.uid,
    });

  } catch (error) {
    console.error("Profile error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}