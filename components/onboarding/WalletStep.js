// components/onboarding/WalletStep.js
// Step 2: Connect MetaMask wallet

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function WalletStep({ user, onComplete }) {
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [connected, setConnected] = useState(false);

  const connectWallet = async () => {
    setLoading(true);
    setError('');

    try {
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error('MetaMask not installed. Please install it first.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });

      const address = accounts[0];
      setWalletAddress(address);
      setConnected(true);

      // Save wallet address to Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        walletAddress: address,
        walletConnected: true,
      });
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleSkip = async () => {
    // User can skip wallet connection for now
    await updateDoc(doc(db, 'users', user.uid), {
      walletConnected: true,
    });
    onComplete();
  };

  const handleContinue = () => {
    if (walletAddress) {
      onComplete();
    } else {
      setError('Please connect a wallet first');
    }
  };

  return (
    <div style={styles.stepContainer}>
      <div style={styles.card}>
        <h1 style={styles.title}>Connect Your Wallet</h1>
        <p style={styles.subtitle}>
          Link your MetaMask wallet to receive profits
        </p>

        {connected ? (
          <div style={styles.successBox}>
            <p style={styles.successIcon}>✓</p>
            <p style={styles.successText}>Wallet Connected</p>
            <p style={styles.walletAddress}>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
          </div>
        ) : (
          <div style={styles.walletInfo}>
            <p style={styles.infoText}>
              MetaMask is a crypto wallet. Profits will be sent directly here.
            </p>

            <button
              onClick={connectWallet}
              disabled={loading}
              style={{
                ...styles.connectButton,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Connecting...' : '🦊 Connect MetaMask'}
            </button>

            {error && <p style={styles.error}>{error}</p>}

            <button
              onClick={handleSkip}
              style={styles.skipButton}
            >
              Skip for now
            </button>
          </div>
        )}

        {connected && (
          <button
            onClick={handleContinue}
            style={styles.button}
          >
            Continue
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  stepContainer: {
    maxWidth: '500px',
    margin: '0 auto',
  },
  card: {
    background: '#0f1b2d',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '40px 30px',
  },
  title: {
    fontSize: '28px',
    margin: '0 0 8px',
  },
  subtitle: {
    color: '#b8c7d9',
    marginBottom: '30px',
  },
  walletInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  infoText: {
    color: '#b8c7d9',
    fontSize: '14px',
    lineHeight: 1.6,
  },
  connectButton: {
    padding: '14px 20px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  skipButton: {
    padding: '12px 20px',
    background: 'transparent',
    color: '#b8c7d9',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '10px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  button: {
    padding: '14px 20px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 600,
    marginTop: '20px',
    cursor: 'pointer',
  },
  successBox: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.3)',
    borderRadius: '12px',
    padding: '24px',
    textAlign: 'center',
    marginBottom: '20px',
  },
  successIcon: {
    fontSize: '40px',
    margin: '0 0 12px',
  },
  successText: {
    fontSize: '18px',
    fontWeight: 600,
    margin: '0 0 8px',
  },
  walletAddress: {
    color: '#b8c7d9',
    fontSize: '14px',
    margin: 0,
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
  },
};
