"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { getUser } from '../services/auth';
import styles from './checkout.module.css';

export default function Checkout() {
  const router = useRouter();
  const { tier } = router.query;

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const plans = {
    free: { name: 'Free Tier', price: 0, description: 'Basic research + weekly insights' },
    founder: { name: 'Founder Vault', price: 6800, description: 'Premium notes, private research, and strategy', currency: 'NGN' },
  };

  const selectedPlan = plans[tier] || plans.free;

  useEffect(() => {
    async function loadUser() {
      const result = await getUser();
      if (result.success) {
        setUser(result.user);
      } else {
        router.push('/login');
      }
    }
    loadUser();
  }, [router]);

  const handleCheckout = async () => {
    if (!user) return;
    if (selectedPlan.price === 0) {
      router.push('/vault');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/paystack/initialize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          amount: selectedPlan.price,
          userId: user.uid,
          tier: tier,
        }),
      });

      const data = await response.json();

      if (data.success) {
        window.location.href = data.authorization_url;
      } else {
        setError(data.error || 'Payment initialization failed');
      }
    } catch (err) {
      setError('Checkout failed. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className={styles.loading}>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.checkoutContainer}>
        <div className={styles.checkoutCard}>
          <h1>Complete Your Order</h1>

          <div className={styles.summaryBox}>
            <div className={styles.summaryItem}>
              <span>Plan:</span>
              <strong>{selectedPlan.name}</strong>
            </div>
            <div className={styles.summaryItem}>
              <span>Email:</span>
              <strong>{user.email}</strong>
            </div>
            <div className={styles.divider}></div>
            <div className={styles.summaryItem}>
              <span>Amount:</span>
              <strong className={styles.price}>{selectedPlan.currency ? '₦' : '$'}{selectedPlan.price}/{selectedPlan.currency ? 'month' : 'month'}</strong>
            </div>
          </div>

          <div className={styles.description}>
            <h3>{selectedPlan.name}</h3>
            <p>{selectedPlan.description}</p>
          </div>

          {error && <div className={styles.errorBox}>{error}</div>}

          <button
            className={styles.checkoutButton}
            onClick={handleCheckout}
            disabled={loading}
          >
            {loading ? 'Processing...' : selectedPlan.price === 0 ? 'Activate Free Tier' : 'Proceed to Payment'}
          </button>

          <p className={styles.disclaimer}>
            By proceeding, you agree to our terms of service and privacy policy.
          </p>
        </div>
      </div>
    </Layout>
  );
}