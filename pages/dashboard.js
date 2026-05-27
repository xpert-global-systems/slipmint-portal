// pages/dashboard.js
// Main dashboard showing user balance, performance, and account info

import { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
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

      if (!data?.profileComplete) {
        window.location.href = '/onboarding';
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

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = '/login';
  };

  // Sample performance data (in production, fetch from Firestore)
  const performanceData = [
    { week: 'Week 1', profit: 250, loss: 50 },
    { week: 'Week 2', profit: 480, loss: 120 },
    { week: 'Week 3', profit: 320, loss: 80 },
    { week: 'Week 4', profit: 650, loss: 150 },
  ];

  const balanceHistory = [
    { day: 'Mon', balance: userData.balance },
    { day: 'Tue', balance: userData.balance + 50 },
    { day: 'Wed', balance: userData.balance + 120 },
    { day: 'Thu', balance: userData.balance + 180 },
    { day: 'Fri', balance: userData.balance + 250 },
  ];

  const profitData = [
    { name: 'Profit', value: 2000 },
    { name: 'Loss', value: 400 },
  ];

  const COLORS = ['#22c55e', '#ef4444'];

  // Calculate totals
  const totalProfit = performanceData.reduce((sum, week) => sum + week.profit, 0);
  const totalLoss = performanceData.reduce((sum, week) => sum + week.loss, 0);
  const roi = ((totalProfit - totalLoss) / userData.totalInvested) * 100;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.logo}>SlipMint</h1>
          <button
            onClick={handleLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </div>

      <div style={styles.container}>
        {/* Welcome Section */}
        <div style={styles.welcomeCard}>
          <div>
            <p style={styles.welcomeLabel}>Welcome back!</p>
            <h1 style={styles.welcomeName}>{userData.fullName}</h1>
          </div>
          <div style={styles.profileIcon}>👤</div>
        </div>

        {/* Key Metrics */}
        <div style={styles.metricsGrid}>
          <div style={styles.metricCard}>
            <p style={styles.metricLabel}>Current Balance</p>
            <h2 style={styles.metricValue}>
              ${userData.balance?.toLocaleString() || 0}
            </h2>
            <p style={styles.metricDetail}>Initial: ${userData.totalInvested?.toLocaleString() || 0}</p>
          </div>

          <div style={styles.metricCard}>
            <p style={styles.metricLabel}>ROI</p>
            <h2 style={{...styles.metricValue, color: roi > 0 ? '#22c55e' : '#ef4444'}}>
              {roi.toFixed(2)}%
            </h2>
            <p style={styles.metricDetail}>Return on investment</p>
          </div>

          <div style={styles.metricCard}>
            <p style={styles.metricLabel}>Total Profit</p>
            <h2 style={styles.metricValue}>
              +${totalProfit.toLocaleString()}
            </h2>
            <p style={styles.metricDetail}>This period</p>
          </div>

          <div style={styles.metricCard}>
            <p style={styles.metricLabel}>Total Loss</p>
            <h2 style={{...styles.metricValue, color: '#ef4444'}}>
              -${totalLoss.toLocaleString()}
            </h2>
            <p style={styles.metricDetail}>This period</p>
          </div>
        </div>

        {/* Charts Section */}
        <div style={styles.chartsGrid}>
          {/* Balance History */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Balance History</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={balanceHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="day" stroke="#b8c7d9" />
                <YAxis stroke="#b8c7d9" />
                <Tooltip contentStyle={{ background: '#0f1b2d', border: 'none' }} />
                <Line type="monotone" dataKey="balance" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Profit vs Loss */}
          <div style={styles.chartCard}>
            <h3 style={styles.chartTitle}>Weekly Performance</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="week" stroke="#b8c7d9" />
                <YAxis stroke="#b8c7d9" />
                <Tooltip contentStyle={{ background: '#0f1b2d', border: 'none' }} />
                <Legend />
                <Bar dataKey="profit" fill="#22c55e" />
                <Bar dataKey="loss" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Account Info */}
        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Account Information</h3>
            <div style={styles.infoField}>
              <span style={styles.infoLabel}>Email:</span>
              <span>{userData.email}</span>
            </div>
            <div style={styles.infoField}>
              <span style={styles.infoLabel}>Occupation:</span>
              <span>{userData.occupation}</span>
            </div>
            <div style={styles.infoField}>
              <span style={styles.infoLabel}>Phone:</span>
              <span>{userData.phone}</span>
            </div>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Wallet Info</h3>
            {userData.walletAddress ? (
              <>
                <div style={styles.infoField}>
                  <span style={styles.infoLabel}>Status:</span>
                  <span style={{ color: '#22c55e' }}>✓ Connected</span>
                </div>
                <div style={styles.infoField}>
                  <span style={styles.infoLabel}>Address:</span>
                  <span style={styles.walletAddress}>
                    {userData.walletAddress.slice(0, 6)}...{userData.walletAddress.slice(-4)}
                  </span>
                </div>
              </>
            ) : (
              <div style={styles.infoField}>
                <span style={{ color: '#b8c7d9' }}>No wallet connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actionsGrid}>
          <button style={styles.actionButton}>Withdraw Profit</button>
          <button style={styles.actionButton}>View Trade History</button>
          <button style={styles.actionButton}>Download Report</button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#081120',
    color: '#fff',
    paddingBottom: '40px',
  },
  header: {
    background: '#0f1b2d',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '20px 0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  headerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 700,
    margin: 0,
  },
  logoutButton: {
    padding: '8px 16px',
    background: 'rgba(255,255,255,0.1)',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
  },
  welcomeCard: {
    background: '#0f1b2d',
    border: '1px solid rgba(34, 197, 94, 0.2)',
    borderRadius: '20px',
    padding: '30px',
    marginBottom: '30px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  welcomeLabel: {
    color: '#b8c7d9',
    margin: '0 0 8px',
    fontSize: '14px',
  },
  welcomeName: {
    fontSize: '32px',
    margin: 0,
  },
  profileIcon: {
    fontSize: '40px',
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  metricCard: {
    background: '#0f1b2d',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
  },
  metricLabel: {
    color: '#b8c7d9',
    fontSize: '13px',
    margin: '0 0 8px',
  },
  metricValue: {
    fontSize: '28px',
    margin: '0 0 8px',
    color: '#22c55e',
  },
  metricDetail: {
    color: '#818fa9',
    fontSize: '12px',
    margin: 0,
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  chartCard: {
    background: '#0f1b2d',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 20px',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px',
  },
  infoCard: {
    background: '#0f1b2d',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '20px',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: 600,
    margin: '0 0 16px',
  },
  infoField: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '10px 0',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
  },
  infoLabel: {
    color: '#b8c7d9',
    fontSize: '13px',
  },
  walletAddress: {
    fontFamily: 'monospace',
    fontSize: '12px',
  },
  actionsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
  },
  actionButton: {
    padding: '12px 20px',
    background: '#22c55e',
    color: '#081120',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
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
