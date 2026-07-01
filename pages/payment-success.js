"use client";

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link';
import styles from './payment-success.module.css';

export default function PaymentSuccess() {
  const router = useRouter();
  const { reference } = router.query;
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reference) return;

    async function verifyPayment() {
      try {
        const response = await fetch(`/api/paystack/verify?reference=${reference}`);
        const data = await response.json();

        if (data.success) {
          setVerified(true);
        } else {
          setError(data.message || 'Payment verification failed');
        }
      } catch (err) {
        setError('Error verifying payment');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    verifyPayment();
  }, [reference]);

  if (loading) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.spinner}></div>
          <p>Verifying your payment...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className={styles.container}>
          <div className={styles.errorBox}>
            <h2>Payment Verification Failed</h2>
            <p>{error}</p>
            <Link href="/vault" className={styles.button}>
              Return to Vault
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.container}>
        <div className={styles.successBox}>
          <div className={styles.successIcon}>✓</div>
          <h1>Payment Successful!</h1>
          <p>Your subscription is now active.</p>
          
          <div className={styles.nextSteps}>
            <h3>What's Next:</h3>
            <ul>
              <li>Access premium research & analysis</li>
              <li>Get exclusive trade setups</li>
              <li>Join the community channel</li>
              <li>Receive weekly market briefs</li>
            </ul>
          </div>

          <Link href="/vault" className={styles.primaryButton}>
            Access Founder Vault
          </Link>

          <Link href="/" className={styles.secondaryButton}>
            Back to Home
          </Link>
        </div>
      </div>
    </Layout>
  );
}