import admin from "firebase-admin";

// -----------------------------
// SINGLETON INSTANCE
// -----------------------------
let app = null;

/**
 * Initialize Firebase Admin safely (Vercel + Next.js compatible)
 */
export function getFirebaseApp() {
  // Return cached instance
  if (app) return app;

  // Prevent duplicate initialization
  if (admin.apps.length > 0) {
    app = admin.app();
    return app;
  }

  // Validate env
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT env variable");
  }

  try {
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT
    );

    // Fix private key formatting
    if (serviceAccount.private_key) {
      serviceAccount.private_key =
        serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    // Initialize Firebase Admin
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    return app;
  } catch (error) {
    console.error("Firebase Admin initialization failed:", error);
    throw error;
  }
}

// -----------------------------
// SERVICES (SAFE EXPORTS)
// -----------------------------
export function getAuth() {
  return getFirebaseApp().auth();
}

export function getDb() {
  return getFirebaseApp().firestore();
}

// -----------------------------
// OPTIONAL DEFAULT EXPORT (IMPORTANT)
// -----------------------------
export default getFirebaseApp;