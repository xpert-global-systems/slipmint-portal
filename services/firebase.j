// services/firebase.js

const admin = require("firebase-admin");
const fs = require("fs");

let serviceAccount;

// Option 1: JSON stored directly in environment variable
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  serviceAccount = JSON.parse(
    process.env.FIREBASE_SERVICE_ACCOUNT
  );
}

// Option 2: JSON file path
else {
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    "/content/drive/MyDrive/slipmint/firebase/credentials/serviceAccount.json";

  if (!fs.existsSync(serviceAccountPath)) {
    throw new Error(
      `Firebase credentials not found: ${serviceAccountPath}`
    );
  }

  serviceAccount = JSON.parse(
    fs.readFileSync(serviceAccountPath, "utf8")
  );
}

// Prevent duplicate initialization during hot reload
const app =
  admin.apps.length > 0
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

const db = admin.firestore();
const rtdb = admin.database();

module.exports = {
  admin,
  app,
  db,
  rtdb,
};
