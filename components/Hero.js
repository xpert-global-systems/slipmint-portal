import Link from 'next/link'

export default function Hero() {
  return (
    <section style={styles.hero}>
      <div style={styles.container}>
        <div style={styles.badge}>Crypto Infrastructure Platform</div>

        <h1 style={styles.title}>
          Crypto Infrastructure Built on <span style={styles.highlight}>Discipline</span>
        </h1>

        <p style={styles.subtitle}>
          Transparency. Structure. Compounding Trust.
        </p>

        <div style={styles.actions}>
          <Link href="/vault" style={styles.primaryButton}>
            Explore Founder Vault
          </Link>

          <Link href="/research" style={styles.secondaryButton}>
            Read Research
          </Link>
        </div>
      </div>
    </section>
  )
}

const styles = {
  hero: {
    background:
      'radial-gradient(circle at top right, rgba(34,197,94,0.18), transparent 25%), linear-gradient(180deg, #081120 0%, #0d1726 100%)',
    color: '#ffffff',
    padding: '80px 20px 60px',
  },
  container: {
    maxWidth: '860px',
    margin: '0 auto',
    textAlign: 'center',
  },
  badge: {
    display: 'inline-block',
    padding: '10px 16px',
    border: '1px solid rgba(255,255,255,0.14)',
    background: 'rgba(255,255,255,0.06)',
    color: '#d8e3f0',
    borderRadius: '999px',
    fontSize: '13px',
    fontWeight: 700,
    letterSpacing: '0.4px',
    marginBottom: '22px',
  },
  title: {
    fontSize: '48px',
    lineHeight: 1.1,
    fontWeight: 800,
    margin: '0 0 18px',
  },
  highlight: {
    color: '#22c55e',
  },
  subtitle: {
    color: '#b8c7d9',
    fontSize: '18px',
    lineHeight: 1.7,
    maxWidth: '720px',
    margin: '0 auto',
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '14px',
    flexWrap: 'wrap',
    marginTop: '30px',
  },
  primaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    padding: '14px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    background: '#22c55e',
    color: '#081120',
    boxShadow: '0 10px 30px rgba(34, 197, 94, 0.24)',
  },
  secondaryButton: {
    display: 'inline-block',
    textDecoration: 'none',
    padding: '14px 24px',
    borderRadius: '12px',
    fontWeight: 700,
    border: '1px solid rgba(255,255,255,0.16)',
    color: '#ffffff',
    background: 'rgba(255,255,255,0.05)',
  },
}
