"use client";

import Layout from '../components/Layout'
import Hero from '../components/Hero'
import NewsletterForm from '../components/NewsletterForm'
import Link from 'next/link'
import styles from './index.module.css'

export default function Home() {

  return (
    <Layout>

      {/* HERO */}
      <div className={styles.heroWrapper}>
        <div className={styles.heroGlow}></div>
        <Hero />
      </div>

      {/* ACTION BUTTONS */}
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

      <div className={styles.sectionDivider}></div>

      {/* STATS */}
      <section className={`${styles.statsSection} ${styles.fadeIn}`}>
        <div className={styles.statsGrid}>
          <div className={styles.statBox}>
            <h3>12,400+</h3>
            <p>Weekly Readers</p>
          </div>

          <div className={styles.statBox}>
            <h3>3+ Years</h3>
            <p>Market Research</p>
          </div>

          <div className={styles.statBox}>
            <h3>98%</h3>
            <p>User Satisfaction</p>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* FEATURES */}
      <section className={`${styles.featuresSection} ${styles.fadeIn}`}>
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
            <p>Structured crypto insights, market commentary, and weekly analysis.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>02</div>
            <h3>Founder Vault</h3>
            <p>Premium content, private notes, and deeper strategic ideas.</p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>03</div>
            <h3>Transparency</h3>
            <p>A cleaner and more trustworthy digital experience.</p>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* TESTIMONIALS — RESEARCH STYLE */}
      <section className={`${styles.researchBlock} ${styles.fadeIn}`}>
        <div className={styles.blockHeader}>
          <span className={styles.blockTag}>Community Insight</span>
          <h2 className={styles.blockTitle}>What Traders Say</h2>
        </div>

        <div className={styles.horizontalCards}>
          <div className={styles.horizontalCard}>
            <p className={styles.cardQuote}>
              “SlipMint changed how I analyze the market.”
            </p>
            <span className={styles.cardAuthor}>Daniel O.</span>
          </div>

          <div className={styles.horizontalCard}>
            <p className={styles.cardQuote}>
              “The Founder Vault is worth every second.”
            </p>
            <span className={styles.cardAuthor}>Chioma A.</span>
          </div>

          <div className={styles.horizontalCard}>
            <p className={styles.cardQuote}>
              “The research is clean, structured, and actionable.”
            </p>
            <span className={styles.cardAuthor}>Kelvin M.</span>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* MEMBERSHIP — STRUCTURED MATRIX */}
      <section className={`${styles.researchBlock} ${styles.fadeIn}`}>
        <div className={styles.blockHeader}>
          <span className={styles.blockTag}>Membership</span>
          <h2 className={styles.blockTitle}>Choose Your Access Level</h2>
        </div>

        <div className={styles.membershipMatrix}>
          <div className={styles.matrixCard}>
            <h3 className={styles.matrixTitle}>Free</h3>
            <p className={styles.matrixDesc}>Basic research + weekly insights</p>
          </div>

          <div className={styles.matrixCard}>
            <h3 className={styles.matrixTitle}>Founder Vault</h3>
            <p className={styles.matrixDesc}>
              Premium notes, private research, and strategy
            </p>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* AFFILIATES */}
      <section className={`${styles.affiliatesSection} ${styles.fadeIn}`}>
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

      {/* NEWSLETTER */}
      <NewsletterForm />

      {/* FLOATING CTA */}
      <a href="/vault" className={styles.floatingCTA}>
        Access Founder Vault
      </a>

    </Layout>
  )
}
