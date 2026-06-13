import admin from "firebase-admin";

let app = null;

function getFirebaseApp() {
  // 1. Return cached instance (serverless-safe)
  if (app) return app;

  // 2. Prevent multiple Firebase app instances (important in Vercel)
  if (admin.apps.length > 0) {
    app = admin.apps[0];
    return app;
  }

  // 3. Validate environment variable
  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is missing in environment variables"
    );
  }

  try {
    // 4. Parse service account
    const serviceAccount = JSON.parse(
      process.env.FIREBASE_SERVICE_ACCOUNT
    );

    // 5. Fix private key formatting for Firebase
    if (serviceAccount.private_key) {
      serviceAccount.private_key =
        serviceAccount.private_key.replace(/\\n/g, "\n");
    }

    // 6. Initialize Firebase Admin
    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });

    return app;
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
    throw error;
  }
}

// -----------------------------
// SAFE SERVICE EXPORTS
// -----------------------------

export const auth = () => getFirebaseApp().auth();
export const db = () => getFirebaseApp().firestore();

// Optional: direct access if needed
export default getFirebaseApp;