import admin from “firebase-admin”;

export default async function handler(req, res) {
try {
if (!admin.apps.length) {
admin.initializeApp({
credential: admin.credential.cert({
projectId: process.env.FIREBASE_PROJECT_ID,
clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, “\n”),
}),
});
}

res.status(200).json({
  success: true,
  projectId: process.env.FIREBASE_PROJECT_ID,
  envs: {
    FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
  },
});

} catch (error) {
res.status(500).json({
success: false,
error: error.message,
stack: error.stack,
});
}
}