import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

// Simple validation helper
const validateInput = (data) => {
  const errors = [];
  const { fullName, phone, dob, ssn } = data;
  
  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }
  if (phone && !/^[\d\s\-\+\(\)]{10,20}$/.test(phone)) {
    errors.push("Invalid phone number format");
  }
  if (dob && !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
    errors.push("DOB must be YYYY-MM-DD format");
  }
  if (ssn && !/^\d{3}-\d{2}-\d{4}$|^\d{9}$/.test(ssn)) {
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
    const token = req.headers.authorization?.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = await admin.auth().verifyIdToken(token);
    
    // Validate inputs
    const validationErrors = validateInput(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationErrors,
      });
    }

    const {
      fullName,
      phone,
      occupation,
      dob,
      ssn, // ⚠️ See security note below
      referral,
    } = req.body;

    // Sanitize inputs
    const sanitizedData = {
      uid: decoded.uid,
      email: decoded.email,
      fullName: fullName.trim(),
      phone: phone?.trim() || null,
      occupation: occupation?.trim() || null,
      dob: dob || null,
      // ⚠️ SECURITY: Consider encrypting SSN or storing in a separate secure collection
      ssn: ssn ? ssn.replace(/\D/g, "") : null, // Store digits only
      referral: referral?.trim() || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    // Use createdAt only on first write (merge preserves existing)
    const docRef = admin.firestore().collection("users").doc(decoded.uid);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      sanitizedData.createdAt = admin.firestore.FieldValue.serverTimestamp();
    }

    await docRef.set(sanitizedData, { merge: true });

    return res.status(200).json({
      success: true,
      message: "Profile saved successfully",
      data: { uid: decoded.uid },
    });

  } catch (error) {
    console.error("Profile error:", error);
    
    // Don't leak internal error details to client
    const isAuthError = error.code?.startsWith("auth/");
    const statusCode = isAuthError ? 401 : 500;
    const message = isAuthError 
      ? "Invalid or expired token" 
      : "Internal server error";

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
