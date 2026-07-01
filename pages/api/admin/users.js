import admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = admin.firestore();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify admin token
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Get all users from Firestore
    const usersSnapshot = await db.collection('users').get();
    const users = [];

    usersSnapshot.forEach((doc) => {
      users.push({
        uid: doc.id,
        email: doc.data().email,
        emailVerified: doc.data().emailVerified || false,
        subscription: doc.data().subscription,
        createdAt: doc.data().createdAt || new Date(),
      });
    });

    return res.status(200).json({
      success: true,
      users: users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (error) {
    console.error('Fetch users error:', error);
    return res.status(500).json({
      error: 'Failed to fetch users',
      details: error.message,
    });
  }
}
