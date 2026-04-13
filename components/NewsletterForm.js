export default function NewsletterForm() {
  return (
    <section style={styles.section}>
      <div style={styles.card}>
        <div style={styles.textWrap}>
          <span style={styles.tag}>Stay Updated</span>
          <h2 style={styles.title}>Get market insights and platform updates</h2>
          <p style={styles.text}>
            Join our mailing list to receive research updates, insights,
            and important platform news from SlipMint.
          </p>
        </div>

        <form style={styles.form}>
          <input
            type="email"
            placeholder="Enter your email address"
            style={styles.input}
          />
          <button type="submit" style={styles.button}>
            Subscribe
          </button>
        </form>
      </div>
    </section>
  )
}

const styles = {
  section: {
    maxWidth: '1180px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    background: 'linear-gradient(135deg, #13243a 0%, #0c1626 100%)',
    border: '1px solid rgba(34, 197, 94, 0.18)',
    borderRadius: '24px',
    padding: '32px 24px',
    color: '#ffffff',
  },
  textWrap: {
    maxWidth: '720px',
    marginBottom: '20px',
  },
  tag: {
    display: 'inline-block',
    color: '#22c55e',
    fontWeight: 700,
    fontSize: '14px',
    marginBottom: '10px',
  },
  title: {
    margin: '0 0 12px',
    fontSize: '30px',
    lineHeight: 1.2,
  },
  text: {
    margin: 0,
    color: '#b8c7d9',
    fontSize: '16px',
    lineHeight: 1.7,
  },
  form: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '18px',
  },
  input: {
    flex: '1 1 320px',
    minWidth: '240px',
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#ffffff',
    fontSize: '15px',
    outline: 'none',
  },
  button: {
    padding: '14px 22px',
    borderRadius: '12px',
    border: 'none',
    background: '#22c55e',
    color: '#081120',
    fontWeight: 700,
    fontSize: '15px',
    cursor: 'pointer',
  },
}
