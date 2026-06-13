import admin from "firebase-admin";

let app = null;

export function getFirebaseApp() {
  if (app) return app;

  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return app;
}

// Export services safely (lazy initialized)
export const auth = () => getFirebaseApp().auth();
export const db = () => getFirebaseApp().firestore();
