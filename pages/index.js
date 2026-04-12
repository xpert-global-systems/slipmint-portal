import Layout from '../components/Layout'
import Link from 'next/link'
import styles from './index.module.css'

export default function Home() {
  return (
    <Layout>
      <main className={styles.page}>
        <section className={styles.hero}>
          <div className={styles.badge}>Professional Forex Trading Platform</div>

          <h1 className={styles.title}>
            Trade smarter with
            <span className={styles.highlight}> Xpert Forex Trade</span>
          </h1>

          <p className={styles.subtitle}>
            Market insights, trading tools, and risk-aware strategies designed
            for modern traders who value clarity, speed, and discipline.
          </p>

          <div className={styles.actions}>
            <Link href="/signup" className={styles.primaryButton}>
              Create Account
            </Link>

            <Link href="/demo" className={styles.secondaryButton}>
              View Demo
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statCard}>
              <h3>Real-Time Insights</h3>
              <p>Stay informed with timely market analysis and trade signals.</p>
            </div>

            <div className={styles.statCard}>
              <h3>Risk Management</h3>
              <p>Trade with structure using disciplined planning and control.</p>
            </div>

            <div className={styles.statCard}>
              <h3>Trader Focused</h3>
              <p>Built for both beginners and experienced forex traders.</p>
            </div>
          </div>
        </section>

        <section className={styles.featuresSection}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTag}>Why Choose Us</span>
            <h2>Professional tools with a clean trading experience</h2>
            <p>
              Xpert Forex Trade combines financial professionalism with a simple,
              modern interface that helps users focus on what matters most.
            </p>
          </div>

          <div className={styles.featureGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>01</div>
              <h3>Market Analysis</h3>
              <p>
                Understand price movement, trends, and opportunities with
                clearer analysis.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>02</div>
              <h3>Fast Access</h3>
              <p>
                Navigate your dashboard quickly with a layout built for
                confidence and speed.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>03</div>
              <h3>Modern Design</h3>
              <p>
                A polished interface that gives your brand a stronger and more
                trustworthy presence.
              </p>
            </div>
          </div>
        </section>

        <section className={styles.ctaSection}>
          <div className={styles.ctaBox}>
            <h2>Start your journey with confidence</h2>
            <p>
              Join Xpert Forex Trade and explore a cleaner, more professional
              way to engage with forex markets.
            </p>
            <Link href="/signup" className={styles.primaryButton}>
              Get Started
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  )
}
