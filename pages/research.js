import Layout from '../components/Layout'

const posts = [
  {
    title: 'Weekly Market Brief',
    summary: 'A structured overview of major crypto market movement and sentiment.',
  },
  {
    title: 'Bitcoin Trend Watch',
    summary: 'Key support, resistance, and momentum zones to watch this week.',
  },
  {
    title: 'Risk and Structure',
    summary: 'Why disciplined positioning matters more than hype in volatile markets.',
  },
]

export default function Research() {
  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.container}>
          <span style={styles.tag}>Research</span>
          <h1 style={styles.title}>Structured crypto research and insights</h1>
          <p style={styles.subtitle}>
            Read market commentary, research notes, and weekly updates from SlipMint.
          </p>

          <div style={styles.grid}>
            {posts.map((post, index) => (
              <article key={index} style={styles.card}>
                <h2 style={styles.cardTitle}>{post.title}</h2>
                <p style={styles.cardText}>{post.summary}</p>
                <button style={styles.button}>Read More</button>
              </article>
            ))}
          </div>
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
    margin: '0 0 18px',
    color: '#b8c7d9',
    lineHeight: 1.6,
  },
  button: {
    border: 'none',
    background: '#22c55e',
    color: '#081120',
    padding: '12px 18px',
    borderRadius: '10px',
    fontWeight: 700,
    cursor: 'pointer',
  },
}
