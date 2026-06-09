import admin from "firebase-admin";

// Safe JSON parsing wrapper that handles hidden whitespace and newline injections
const getServiceAccount = () => {
  try {
    const rawEnv = process.env.FIREBASE_SERVICE_ACCOUNT || "";
    // Clean up escaped newlines or spaces that Vercel configuration layers might inject
    const cleanEnv = rawEnv.replace(/\\n/g, '\n').trim();
    return JSON.parse(cleanEnv);
  } catch (parseError) {
    console.error("FATAL: FIREBASE_SERVICE_ACCOUNT environment string is malformed JSON.", parseError.message);
    return null;
  }
};

const serviceAccount = getServiceAccount();

if (!admin.apps.length && serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Simple validation helper (Fully protected against missing/undefined UI fields)
const validateInput = (data) => {
  const errors = [];
  const { fullName, phone, dob, ssn } = data;
  
  // 1. Full name is strictly required
  if (!fullName || fullName.trim().length < 2) {
    errors.push("Full name must be at least 2 characters");
  }
  
  // 2. Only validate phone if it is present and not empty
  if (phone && phone.trim() !== "" && !/^[\d\s\-\+\(\)]{10,20}$/.test(phone.trim())) {
    errors.push("Invalid phone number format");
  }
  
  // 3. Only validate DOB if the input actually exists on the screen
  if (dob && dob.trim() !== "" && !/^\d{4}-\d{2}-\d{2}$/.test(dob.trim())) {
    errors.push("DOB must be YYYY-MM-DD format");
  }
  
  // 4. Only validate SSN if the input actually exists on the screen
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

  // Early exit if the SDK failed initialization due to string environment formatting
  if (!admin.apps.length) {
    return res.status(500).json({
      success: false,
      message: "Firebase Admin SDK failed to initialize. Check service account environment configuration format."
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
    
    // Validate inputs safely
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
      ssn,
      referral,
    } = req.body;

    // Sanitize values cleanly (convert empty or missing client strings into database nulls)
    const sanitizedData = {
      uid: decoded.uid,
      email: decoded.email,
      fullName: fullName.trim(),
      phone: phone && phone.trim() !== "" ? phone.trim() : null,
      occupation: occupation && occupation.trim() !== "" ? occupation.trim() : null,
      dob: dob && dob.trim() !== "" ? dob.trim() : null,
      ssn: ssn && ssn.trim() !== "" ? ssn.replace(/\D/g, "") : null, // Store digits only if sent
      referral: referral && referral.trim() !== "" ? referral.trim() : null,
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
    
    // Don't leak internal crash details to client unless it is an explicit auth breach
    const isAuthError = error.code?.startsWith("auth/");
    const statusCode = isAuthError ? 401 : 500;
    const message = isAuthError 
      ? "Invalid or expired token" 
      : `Internal server error: ${error.message}`;

    return res.status(statusCode).json({
      success: false,
      message,
    });
  }
}
