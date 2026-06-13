import admin from "../../../lib/firebaseAdmin";

// Simple validation helper
const validateInput = (data) => {
  const errors = [];
  const { fullName, phone, dob, ssn } = data;

  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }

  if (phone && phone.trim() !== "" && !/^[\d\s-+()]{10,20}$/.test(phone.trim())) {
    errors.push("Invalid phone number format");
  }

  if (dob && dob.trim() !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
    errors.push("DOB must be YYYY-MM-DD format");
  }

  if (ssn && ssn.trim() !== "" && !/^\d{3}-\d{2}-\d{4}$|^\d{9}$/.test(ssn.trim())) {
    errors.push("Invalid SSN format");
  }

  return errors;
};

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
        message: "Authentication required: Missing Bearer prefix",
      });
    }

    const token = authHeader.split("Bearer ")[1]?.trim();
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required: Token parameter is empty",
      });
    }

    // Verify token with Firebase Admin
    const decoded = await admin.auth().verifyIdToken(token);

    // Run input validation
    const validationErrors = validateInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const { fullName, phone, occupation, dob, ssn, referral } = req.body;

    // Sanitize input data (with safe fallback for fullName)
    const sanitizedData = {
      uid: decoded.uid,
      email: decoded.email || null,
      fullName: fullName?.trim() || "",
      phone: phone?.trim() ? phone.trim() : null,
      occupation: occupation?.trim() ? occupation.trim() : null,
      dob: dob?.trim() ? dob.trim() : null,
      ssn: ssn?.trim() ? ssn.replace(/\D/g, "") : null,
      referral: referral?.trim() ? referral.trim() : null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = admin.firestore().collection("users").doc(decoded.uid);
    const doc = await docRef.get();

    // Only set createdAt if the document doesn't exist yet
    if (!doc.exists) {
      sanitizedData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }

    // Save profile to database
    await docRef.set(sanitizedData, { merge: true });

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: {
        uid: decoded.uid,
      },
    });

  } catch (error) {
    console.error("Profile error:", error);

    const isAuthError = error.code?.startsWith("auth/");
    return res.status(isAuthError ? 401 : 500).json({
      success: false,
      message: isAuthError ? "Invalid or expired token" : error.message,
    });
  }
}
