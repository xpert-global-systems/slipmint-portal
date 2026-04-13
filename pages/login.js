import { useState } from 'react'
import Layout from '../components/Layout'
import Link from 'next/link'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await res.json()

    if (data.token) {
      window.location.href = '/dashboard'
    } else {
      alert('Login failed')
    }
  }

  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.card}>
          <span style={styles.tag}>Member Access</span>
          <h1 style={styles.title}>Login to SlipMint</h1>
          <p style={styles.subtitle}>
            Access the Founder Vault, premium research, and member-only updates.
          </p>

          <form onSubmit={handleLogin} style={styles.form}>
            <label htmlFor="email" style={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />

            <label htmlFor="password" style={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input}
            />

            <button type="submit" style={styles.button}>
              Login
            </button>
          </form>

          <p style={styles.footerText}>
            Do not have an account?{' '}
            <Link href="/signup" style={styles.link}>
              Create one
            </Link>
          </p>
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
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '100%',
    maxWidth: '480px',
    background: '#0f1b2d',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '20px',
    padding: '32px 24px',
    boxSizing: 'border-box',
  },
  tag: {
    display: 'inline-block',
    color: '#22c55e',
    fontWeight: 700,
    marginBottom: '12px',
  },
  title: {
    fontSize: '34px',
    margin: '0 0 12px',
  },
  subtitle: {
    color: '#b8c7d9',
    lineHeight: 1.7,
    marginBottom: '24px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  label: {
    fontSize: '14px',
    color: '#dce7f3',
    fontWeight: 600,
  },
  input: {
    width: '100%',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
    boxSizing: 'border-box',
  },
  button: {
    border: 'none',
    background: '#22c55e',
    color: '#081120',
    padding: '14px 18px',
    borderRadius: '12px',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  footerText: {
    marginTop: '18px',
    color: '#b8c7d9',
    fontSize: '14px',
  },
  link: {
    color: '#22c55e',
    textDecoration: 'none',
    fontWeight: 700,
  },
}
