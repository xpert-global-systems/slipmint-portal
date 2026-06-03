// services/firebase.js
const admin = require("firebase-admin");
const fs = require("fs");

// Load service account from environment variable
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!fs.existsSync(serviceAccountPath)) {
  throw new Error(`Firebase service account file not found at ${serviceAccountPath}`);
}

const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
  });
}

const db = admin.firestore(); // Or admin.database() if using RTDB
module.exports = { admin, db };
