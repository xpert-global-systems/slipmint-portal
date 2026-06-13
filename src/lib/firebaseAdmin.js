import admin from “firebase-admin”;

// —————————–
// SINGLETON INSTANCE
// —————————–
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

// Validate env vars
if (
!process.env.FIREBASE_PROJECT_ID ||
!process.env.FIREBASE_CLIENT_EMAIL ||
!process.env.FIREBASE_PRIVATE_KEY
) {
throw new Error(
“Missing one or more Firebase environment variables”
);
}

try {
const serviceAccount = {
projectId: process.env.FIREBASE_PROJECT_ID,
clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\n/g, “\n”),
};

app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
return app;

} catch (error) {
console.error(“Firebase Admin initialization failed:”, error);
throw error;
}
}

// —————————–
// SERVICES
// —————————–
export function getAuth() {
return getFirebaseApp().auth();
}

export function getDb() {
return getFirebaseApp().firestore();
}

// —————————–
// DEFAULT EXPORT
// —————————–
export default getFirebaseApp;