import admin from “firebase-admin”;

if (!admin.apps.length) {
admin.initializeApp({
credential: admin.credential.cert({
projectId: process.env.FIREBASE_PROJECT_ID,
clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, “\n”),
}),
});
}

export default async function handler(req, res) {
try {
const token = req.headers.authorization?.split(“Bearer “)[1];

if (!token) {
  return res.status(401).json({
    error: "No token",
  });
}
const decoded = await admin.auth().verifyIdToken(token);
return res.status(200).json({
  success: true,
  user: decoded,
});

} catch (err) {
console.error(err);

return res.status(401).json({
  error: "Invalid token",
});

}
}