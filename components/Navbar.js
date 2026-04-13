import Link from 'next/link'
import { siteConfig } from '../lib/siteConfig'

export default function Navbar() {
  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link href="/" style={styles.brandWrap}>
          <div style={styles.logo}>S</div>
          <div>
            <div style={styles.brand}>{siteConfig.name}</div>
            <div style={styles.tag}>Crypto Infrastructure Platform</div>
          </div>
        </Link>

        <nav style={styles.nav}>
          <Link href="/" style={styles.navLink}>Home</Link>
          <Link href="/research" style={styles.navLink}>Research</Link>
          <Link href="/performance" style={styles.navLink}>Performance</Link>
          <Link href="/vault" style={styles.navLink}>Founder Vault</Link>
          <Link href="/faq" style={styles.navLink}>FAQ</Link>
        </nav>
      </div>
    </header>
  )
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(8, 17, 32, 0.92)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  container: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    flexWrap: 'wrap',
  },
  brandWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    textDecoration: 'none',
  },
  logo: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #22c55e 0%, #0f766e 100%)',
    color: '#081120',
    fontWeight: 800,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    flexShrink: 0,
  },
  brand: {
    fontSize: '18px',
    fontWeight: 800,
    color: '#ffffff',
    lineHeight: 1.1,
  },
  tag: {
    fontSize: '12px',
    color: '#a9b8c9',
    marginTop: '2px',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  navLink: {
    color: '#dce7f3',
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: 600,
  },
}
