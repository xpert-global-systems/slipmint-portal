// components/onboarding/InvestmentStep.js
// Step 3: User adds their first investment

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function InvestmentStep({ user, onComplete }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInvest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const investAmount = parseFloat(amount);

    if (isNaN(investAmount) || investAmount < 100) {
      setError('Minimum investment is $100');
      setLoading(false);
      return;
    }

    try {
      // Save investment to Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        balance: investAmount,
        totalInvested: investAmount,
        investmentDate: new Date().toISOString(),
        profileComplete: true, // Mark onboarding as complete
      });

      onComplete();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const presetAmounts = [500, 1000, 5000, 10000];

  return (
    <div style={styles.stepContainer}>
      <div style={styles.card}>
        <h1 style={styles.title}>Make Your First Investment</h1>
        <p style={styles.subtitle}>
          Minimum $100. This becomes your trading capital.
        </p>

        <form onSubmit={handleInvest} style={styles.form}>
          <label style={styles.label}>Investment Amount</label>
          <div style={styles.inputGroup}>
            <span style={styles.currencySymbol}>$</span>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="100"
              step="100"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.presetButtons}>
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setAmount(preset.toString())}
                style={{
                  ...styles.presetButton,
                  background: amount === preset.toString() ? '#22c55e' : 'rgba(255,255,255,0.08)',
                  color: amount === preset.toString() ? '#081120' : '#fff',
                }}
              >
                ${preset.toLocaleString()}
              </button>
            ))}
          </div>

          <div style={styles.infoBox}>
            <p style={styles.infoLabel}>This investment will:</p>
            <ul style={styles.infoList}>
              <li>✓ Become your trading capital</li>
              <li>✓ Generate weekly profit reports</li>
              <li>✓ Be fully tracked on your dashboard</li>
            </ul>
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Processing...' : 'Complete Investment'}
          </button>
        </form>
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
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  label: {
    fontSize: '14px',
    color: '#dce7f3',
    fontWeight: 600,
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  currencySymbol: {
    position: 'absolute',
    left: '16px',
    color: '#b8c7d9',
    fontSize: '18px',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '14px 14px 14px 36px',
    background: '#081120',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '10px',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box',
  },
  presetButtons: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '10px',
  },
  presetButton: {
    padding: '10px',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '8px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  infoBox: {
    background: 'rgba(34, 197, 94, 0.1)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '10px',
    padding: '16px',
  },
  infoLabel: {
    fontSize: '13px',
    fontWeight: 600,
    margin: '0 0 8px',
  },
  infoList: {
    margin: 0,
    paddingLeft: '16px',
    fontSize: '13px',
    color: '#b8c7d9',
  },
  button: {
    padding: '14px 20px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    color: '#ef4444',
    fontSize: '14px',
  },
};
