// components/SubscribeForm.js
// Drop-in replacement for the existing subscribe section on the SlipMint homepage.
// Supports both Brevo and Mailchimp via a NEXT_PUBLIC_EMAIL_PROVIDER env var.
// Usage: set NEXT_PUBLIC_EMAIL_PROVIDER=brevo OR mailchimp in .env.local

import { useState } from 'react'
import styles from '../styles/SubscribeForm.module.css'

// Which API route to hit — switch by setting NEXT_PUBLIC_EMAIL_PROVIDER
const PROVIDER = process.env.NEXT_PUBLIC_EMAIL_PROVIDER || 'brevo'
const API_ROUTE = `/api/subscribe/${PROVIDER}`

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    const trimmed = email.trim()
    if (!trimmed) return

    setStatus('loading')
    setMessage('')

    try {
      const res = await fetch(API_ROUTE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setStatus('success')
        setMessage(data.message || "You're on the list!")
        setEmail('')
      } else {
        setStatus('error')
        setMessage(data.error || 'Something went wrong. Please try again.')
      }
    } catch {
      setStatus('error')
      setMessage('Network error. Please check your connection and try again.')
    }
  }

  return (
    <section className={styles.section}>
      <p className={styles.eyebrow}>Stay Updated</p>
      <h2 className={styles.heading}>Get market insights and platform updates</h2>
      <p className={styles.subtext}>
        Join our mailing list to receive research updates, insights, and important
        platform news from SlipMint.
      </p>

      {status === 'success' ? (
        <div className={styles.successBox}>
          <span className={styles.successIcon}>✓</span>
          <span>{message}</span>
        </div>
      ) : (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <input
            type="email"
            className={styles.input}
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={status === 'loading'}
            required
            aria-label="Email address"
          />
          <button
            type="submit"
            className={styles.button}
            disabled={status === 'loading' || !email.trim()}
          >
            {status === 'loading' ? (
              <span className={styles.spinner} aria-label="Subscribing…" />
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      )}

      {status === 'error' && (
        <p className={styles.errorText}>{message}</p>
      )}
    </section>
  )
}
