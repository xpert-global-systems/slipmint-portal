import crypto from 'crypto';
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
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Verify webhook signature
  const hash = crypto
    .createHmac('sha512', process.env.PAYSTACK_SECRET_KEY)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const event = req.body;

  try {
    if (event.event === 'charge.success') {
      const { reference, amount, customer, metadata } = event.data;
      const { userId, tier } = metadata;

      // Record payment
      await db.collection('payments').add({
        userId,
        reference,
        amount: amount / 100,
        tier,
        email: customer.email,
        status: 'completed',
        createdAt: new Date(),
      });

      // Update user subscription
      await db.collection('users').doc(userId).update({
        subscription: {
          tier,
          active: true,
          startDate: new Date(),
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          lastPaymentReference: reference,
        },
      });

      console.log(`Payment successful for ${userId} - Tier: ${tier}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Webhook processing error:', error);
    return res.status(500).json({ error: 'Webhook processing failed' });
  }
}