import Link from 'next/link'
import { siteConfig } from '../lib/siteConfig'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.left}>
          <h3 style={styles.brand}>{siteConfig.name}</h3>
          <p style={styles.text}>{siteConfig.description}</p>
        </div>

        <div style={styles.links}>
          <Link href="/" style={styles.link}>Home</Link>
          <Link href="/research" style={styles.link}>Research</Link>
          <Link href="/vault" style={styles.link}>Founder Vault</Link>
          <Link href="/faq" style={styles.link}>FAQ</Link>
        </div>
      </div>

      <div style={styles.copy}>
        © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.08)',
    marginTop: '40px',
    background: '#07101d',
    color: '#ffffff',
  },
  container: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '32px 20px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
  },
  left: {
    maxWidth: '520px',
  },
  brand: {
    margin: 0,
    fontSize: '20px',
  },
  text: {
    color: '#a9b8c9',
    lineHeight: 1.7,
    marginTop: '10px',
    fontSize: '15px',
  },
  links: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    color: '#dce7f3',
    textDecoration: 'none',
    fontSize: '14px',
  },
  copy: {
    textAlign: 'center',
    color: '#7f93aa',
    fontSize: '13px',
    padding: '0 20px 24px',
  },
}
