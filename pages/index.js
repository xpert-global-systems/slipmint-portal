"use client";

import Layout from '../components/Layout'
import Hero from '../components/Hero'
import NewsletterForm from '../components/NewsletterForm'
import Link from 'next/link'
import styles from './index.module.css'
import { useEffect, useState } from 'react'

export default function Home() {

  const [news, setNews] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch('/api/news');
        const data = await res.json();
        setNews(data.news?.data || []);
      } catch (err) {
        console.error("Failed to load news", err);
      }
    }
    loadNews();
  }, []);

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

      {/* TESTIMONIALS */}
      <section className={`${styles.testimonials} ${styles.fadeIn}`}>
        <h2>What Traders Say</h2>

        <div className={styles.testimonialGrid}>
          <div className={styles.testimonialCard}>
            <p>"SlipMint changed how I analyze the market."</p>
            <span>- Daniel O.</span>
          </div>

          <div className={styles.testimonialCard}>
            <p>"The Founder Vault is worth every second."</p>
            <span>- Chioma A.</span>
          </div>

          <div className={styles.testimonialCard}>
            <p>"The research is clean, structured, and actionable."</p>
            <span>- Kelvin M.</span>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* PRICING */}
      <section className={`${styles.pricingSection} ${styles.fadeIn}`}>
        <h2>Membership Levels</h2>

        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <h3>Free</h3>
            <p>Basic research + weekly insights</p>
          </div>

          <div className={styles.pricingCard}>
            <h3>Founder Vault</h3>
            <p>Premium notes, private research, and strategy</p>
          </div>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* LATEST CRYPTO NEWS */}
      <section className={styles.newsSection}>
        <h2 className={styles.newsTitle}>Latest Crypto News</h2>

        <div className={styles.newsGrid}>
          {news.slice(0, 6).map((item, i) => (
            <a 
              key={i} 
              href={item.news_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className={styles.newsCard}
            >
              <h3>{item.title}</h3>
              <p>{item.source_name}</p>
              <span>{new Date(item.date).toLocaleString()}</span>
            </a>
          ))}
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* TRADING PARTNERS & RESOURCES */}
      <section className={`${styles.partnersSection} ${styles.fadeIn}`}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionTag}>Ecosystem</span>
          <h2>Recommended Trading Platforms</h2>
          <p>Verified partners we use and recommend for execution</p>
        </div>

        <div className={styles.partnerGrid}>
          <a 
            href="https://www.gate.io/share/VQQRBWXZBW" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.partnerCard}
          >
            <h3>Gate.io</h3>
            <p>Spot & futures trading with deep liquidity</p>
            <span className={styles.partnerCTA}>Open Account →</span>
          </a>

          <a 
            href="https://one.exnessonelink.com/a/c_5ufq543auz?platform=mobile" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.partnerCard}
          >
            <h3>Exness (Mobile)</h3>
            <p>Forex & crypto on-the-go trading</p>
            <span className={styles.partnerCTA}>Download App →</span>
          </a>

          <a 
            href="https://one.exnessonelink.com/boarding/sign-up/a/c_5ufq543auz" 
            target="_blank" 
            rel="noopener noreferrer" 
            className={styles.partnerCard}
          >
            <h3>Exness (Web)</h3>
            <p>Desktop platform for advanced traders</p>
            <span className={styles.partnerCTA}>Trade on Web →</span>
          </a>
        </div>
      </section>

      <div className={styles.sectionDivider}></div>

      {/* NEWSLETTER */}
      <NewsletterForm />

      {/* FLOATING CTA */}
      <a href="/vault" className={styles.floatingCTA}>
        Access Founder Vault
      </a>

    </Layout>
  )
}
