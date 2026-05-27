// pages/onboarding.js
// Multi-step onboarding flow after signup

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import WalletStep from '../components/onboarding/WalletStep';
import InvestmentStep from '../components/onboarding/InvestmentStep';

export default function Onboarding() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (!authUser) {
        window.location.href = '/login';
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', authUser.uid));
      const data = userDoc.data();

      // If user already completed onboarding, redirect to dashboard
      if (data?.profileComplete) {
        window.location.href = '/dashboard';
        return;
      }

      setUser(authUser);
      setUserData(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleStepComplete = () => {
    if (currentStep === 3) {
      // After investment step, redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      handleNext();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        {/* Progress Bar */}
        <div style={styles.progressContainer}>
          <div style={styles.progressLabel}>
            Step {currentStep} of 3
          </div>
          <div style={styles.progressBar}>
            <div
              style={{
                ...styles.progressFill,
                width: `${(currentStep / 3) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* Step 1: Profile Confirmation */}
        {currentStep === 1 && (
          <div style={styles.stepContent}>
            <div style={styles.card}>
              <h1 style={styles.title}>Welcome, {userData.fullName}!</h1>
              <p style={styles.subtitle}>
                Let's set up your trading account
              </p>

              <div style={styles.profileBox}>
                <div style={styles.profileField}>
                  <span style={styles.fieldLabel}>Email:</span>
                  <span style={styles.fieldValue}>{userData.email}</span>
                </div>
                <div style={styles.profileField}>
                  <span style={styles.fieldLabel}>Name:</span>
                  <span style={styles.fieldValue}>{userData.fullName}</span>
                </div>
                <div style={styles.profileField}>
                  <span style={styles.fieldLabel}>Occupation:</span>
                  <span style={styles.fieldValue}>{userData.occupation}</span>
                </div>
              </div>

              <div style={styles.infoMessage}>
                <p style={styles.infoIcon}>ℹ️</p>
                <p style={styles.infoText}>
                  Your profile looks good. Next, we'll connect your wallet and set your investment amount.
                </p>
              </div>

              <button
                onClick={handleNext}
                style={styles.button}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Wallet Connection */}
        {currentStep === 2 && (
          <div style={styles.stepContent}>
            <WalletStep
              user={user}
              onComplete={handleStepComplete}
            />
          </div>
        )}

        {/* Step 3: Investment */}
        {currentStep === 3 && (
          <div style={styles.stepContent}>
            <InvestmentStep
              user={user}
              onComplete={handleStepComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#081120',
    color: '#fff',
    padding: '40px 20px',
  },
  container: {
    maxWidth: '600px',
    margin: '0 auto',
  },
  progressContainer: {
    marginBottom: '40px',
  },
  progressLabel: {
    fontSize: '13px',
    color: '#b8c7d9',
    fontWeight: 600,
    marginBottom: '12px',
  },
  progressBar: {
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: '#22c55e',
    transition: 'width 0.3s ease',
  },
  stepContent: {
    animation: 'fadeIn 0.3s ease',
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
    color: '#b8c55e',
    marginBottom: '30px',
  },
  profileBox: {
    background: 'rgba(34, 197, 94, 0.05)',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
  },
  profileField: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  fieldLabel: {
    color: '#b8c7d9',
    fontSize: '13px',
  },
  fieldValue: {
    fontWeight: 600,
    fontSize: '14px',
  },
  infoMessage: {
    background: 'rgba(59, 130, 246, 0.1)',
    border: '1px solid rgba(59, 130, 246, 0.2)',
    borderRadius: '10px',
    padding: '16px',
    marginBottom: '24px',
    display: 'flex',
    gap: '12px',
  },
  infoIcon: {
    margin: 0,
    fontSize: '18px',
  },
  infoText: {
    margin: 0,
    color: '#b8c7d9',
    fontSize: '14px',
    lineHeight: 1.5,
  },
  button: {
    width: '100%',
    padding: '14px 20px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: 600,
    cursor: 'pointer',
  },
  loadingPage: {
    minHeight: '100vh',
    background: '#081120',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
