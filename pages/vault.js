import Layout from '../components/Layout'
import Link from 'next/link'

const vaultItems = [
  {
    title: 'Founder Notes',
    summary: 'Private thinking, strategy notes, and structured crypto observations.',
  },
  {
    title: 'Premium Research',
    summary: 'Deeper market breakdowns and higher-conviction research pieces.',
  },
  {
    title: 'Strategic Watchlist',
    summary: 'A curated view of themes, narratives, and assets worth monitoring.',
  },
]

export default function Vault() {
  const hasAccess = false

  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.container}>
          <span style={styles.tag}>Founder Vault</span>
          <h1 style={styles.title}>Private research and strategic access</h1>
          <p style={styles.subtitle}>
            The Founder Vault gives members access to premium SlipMint content,
            deeper research, and curated strategic insights.
          </p>

          {!hasAccess ? (
            <div style={styles.lockedCard}>
              <h2 style={styles.lockedTitle}>Members only</h2>
              <p style={styles.lockedText}>
                This section is currently locked. Sign in to access premium
                research and private founder content.
              </p>

              <div style={styles.actions}>
                <Link href="/login" style={styles.primaryButton}>
                  Login
                </Link>
                <Link href="/research" style={styles.secondaryButton}>
                  View Free Research
                </Link>
              </div>
            </div>
          ) : (
            <div style={styles.grid}>
              {vaultItems.map((item, index) => (
                <article key={index} style={styles.card}>
                  <h2 style={styles.cardTitle}>{item.title}</h2>
                  <p style={styles.cardText}>{item.summary}</p>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#081120',
    color: '#fff',
    padding: '40px 20px 60px',
  },
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
  },
  tag: {
    display: 'inline-block',
    color: '#22c55e',
    fontWeight: 700,
    marginBottom: '12px',
  },
  title: {
    fontSize: '40px',
    margin: '0 0 14px',
  },
  subtitle: {
    color: '#b8c7d9',
    fontSize: '18px',
    lineHeight: 1.7,
    maxWidth: '760px',
    marginBottom: '30px',
  },
  lockedCard: {
    background: '#0f1b2d',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '28px',
  },
  lockedTitle: {
    margin: '0 0 12px',
    fontSize: '28px',
  },
  lockedText: {
    margin: '0 0 22px',
    color: '#b8c7d9',
    lineHeight: 1.7,
    maxWidth: '720px',
  },
  actions: {
    display: 'flex',
    gap: '14px',
    flexWrap: 'wrap',
  },
  primaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    padding: '14px 22px',
    borderRadius: '12px',
    fontWeight: 700,
    background: '#22c55e',
    color: '#081120',
  },
  secondaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    padding: '14px 22px',
    borderRadius: '12px',
    fontWeight: 700,
    border: '1px solid rgba(255,255,255,0.16)',
    color: '#ffffff',
    background: 'rgba(255,255,255,0.05)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  card: {
    background: '#0f1b2d',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '18px',
    padding: '22px',
  },
  cardTitle: {
    margin: '0 0 10px',
    fontSize: '22px',
  },
  cardText: {
    margin: 0,
    color: '#b8c7d9',
    lineHeight: 1.6,
  },
}
