import Layout from '../components/Layout'
import Hero from '../components/Hero'
import NewsletterForm from '../components/NewsletterForm'
import Link from 'next/link'
import styles from './index.module.css'

export default function Home() {
  return (
    <Layout>
      <Hero />

      <div className={styles.actions}>
        <Link href="/vault" className={styles.primaryButton}>
          Explore Founder Vault
        </Link>

        <Link href="/research" className={styles.secondaryButton}>
          Read Research
        </Link>

        <a 
          href="https://t.me/slipmintsignals" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.telegramButton}
        >
          Join Telegram
        </a>
      </div>

      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Why SlipMint</span>
          <h2>Built for structure, clarity, and trust</h2>
          <p>
            SlipMint is designed as a modern crypto infrastructure platform
            focused on research, transparency, and disciplined growth.
          </p>
        </div>

        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>01</div>
            <h3>Research</h3>
            <p>
              Read structured crypto insights, market commentary, and weekly
              analysis.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>02</div>
            <h3>Founder Vault</h3>
            <p>
              Access premium content, private notes, and deeper strategic ideas.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>03</div>
            <h3>Transparency</h3>
            <p>
              Present your platform with a cleaner and more trustworthy digital
              experience.
            </p>
          </div>
        </div>
      </section>

      <section className={styles.affiliatesSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Partners</span>
          <h2>Trusted Trading Platforms</h2>
          <p>Trade with our verified affiliate partners</p>
        </div>

        <div className={styles.affiliateLinks}>
          <a 
            href="https://www.gate.io/share/VQQRBWXZBW" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.affiliateButton}
          >
            Trade on Gate.io
          </a>
          <a 
            href="https://one.exnessonelink.com/a/c_5ufq543auz?platform=mobile" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.affiliateButton}
          >
            Trade on Exness (Mobile)
          </a>
          <a 
            href="https://one.exnessonelink.com/boarding/sign-up/a/c_5ufq543auz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.affiliateButton}
          >
            Trade on Exness (Web)
          </a>
        </div>
      </section>

      <NewsletterForm />
    </Layout>
  )
}