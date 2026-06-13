import admin from "firebase-admin";

function getApp() {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  if (!process.env.FIREBASE_SERVICE_ACCOUNT) {
    throw new Error("Missing FIREBASE_SERVICE_ACCOUNT");
  }

  const serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );

  serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

  return admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// ❗ DO NOT initialize at module load

export function getAuth() {
  return getApp().auth();
}

export function getDb() {
  return getApp().firestore();
}

export default getApp;
