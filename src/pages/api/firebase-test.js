export default function handler(req, res) {
return res.status(200).json({
marker: “NEW_FIREBASE_TEST_FILE”,
timestamp: Date.now(),
FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY,
});
}