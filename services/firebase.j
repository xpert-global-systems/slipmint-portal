// services/firebase.js

const admin = require("firebase-admin");

let serviceAccount = {
projectId: process.env.FIREBASE_PROJECT_ID,
clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, "\n"),
};

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