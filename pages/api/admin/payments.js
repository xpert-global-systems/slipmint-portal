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
    // Get all payments from Firestore
    const paymentsSnapshot = await db.collection('payments').get();
    const payments = [];

    paymentsSnapshot.forEach((doc) => {
      payments.push({
        reference: doc.data().reference,
        userId: doc.data().userId,
        amount: doc.data().amount,
        tier: doc.data().tier,
        email: doc.data().email,
        status: doc.data().status || 'completed',
        createdAt: doc.data().createdAt || new Date(),
      });
    });

    return res.status(200).json({
      success: true,
      payments: payments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    });
  } catch (error) {
    console.error('Fetch payments error:', error);
    return res.status(500).json({
      error: 'Failed to fetch payments',
      details: error.message,
    });
  }
}
