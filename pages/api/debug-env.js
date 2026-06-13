export default function handler(req, res) {
res.status(200).json({
FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,

projectId: process.env.FIREBASE_PROJECT_ID || null,
clientEmailPresent: !!process.env.FIREBASE_CLIENT_EMAIL,
privateKeyPresent: !!process.env.FIREBASE_PRIVATE_KEY,
privateKeyLength:
  process.env.FIREBASE_PRIVATE_KEY?.length || 0,

});
}