import axios from 'axios';
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

  const { reference } = req.query;

  if (!reference) {
    return res.status(400).json({ error: 'Missing reference' });
  }

  try {
    // Verify payment with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const data = response.data.data;

    // Check if payment was successful
    if (data.status !== 'success') {
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }

    // Extract metadata
    const { userId, tier } = data.metadata;

    // Save payment record to Firestore
    await db.collection('payments').add({
      userId,
      reference,
      amount: data.amount / 100, // Convert back from kobo
      tier,
      email: data.customer.email,
      status: 'completed',
      authorization: data.authorization,
      createdAt: new Date(),
      paymentDate: new Date(data.paid_at),
    });

    // Update user subscription in Firestore
    await db.collection('users').doc(userId).update({
      subscription: {
        tier,
        active: true,
        startDate: new Date(),
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        lastPaymentReference: reference,
      },
    });

    return res.status(200).json({
      success: true,
      message: 'Payment verified successfully',
      subscription: {
        tier,
        renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  } catch (error) {
    console.error('Paystack verification error:', error.response?.data || error.message);
    return res.status(500).json({
      error: 'Payment verification failed',
      details: error.response?.data?.message || error.message,
    });
  }
}