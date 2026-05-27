// Check if user has completed onboarding
// Returns: { isNew: boolean, step: 'profile' | 'wallet' | 'investment' | 'complete' }

import { db } from '../../lib/firebase';
import { collection, doc, getDoc } from 'firebase/firestore';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { uid } = req.query;

  if (!uid) {
    return res.status(400).json({ error: 'UID required' });
  }

  try {
    const userDoc = await getDoc(doc(db, 'users', uid));
    
    if (!userDoc.exists()) {
      // New user - start from profile
      return res.status(200).json({ isNew: true, step: 'profile' });
    }

    const userData = userDoc.data();
    
    // Check which steps are complete
    if (!userData.profileComplete) return res.status(200).json({ isNew: true, step: 'profile' });
    if (!userData.walletConnected) return res.status(200).json({ isNew: false, step: 'wallet' });
    if (userData.balance === undefined || userData.balance === 0) return res.status(200).json({ isNew: false, step: 'investment' });
    
    // All complete
    return res.status(200).json({ isNew: false, step: 'complete' });

  } catch (error) {
    console.error('Setup status error:', error);
    return res.status(500).json({ error: 'Failed to check setup status' });
  }
}
