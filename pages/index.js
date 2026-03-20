import Layout from '../components/Layout'
import Hero from '../components/Hero'
import NewsletterForm from '../components/NewsletterForm'
import Link from 'next/link'
import styles from './index.module.css'

export default function Home() {
  return (
    <Layout>
      <Hero />

      {/* Core Actions */}
      <div className={styles.coreActions}>
        <Link href="/demo">
          <button style={{ marginRight: '10px' }}>View Demo</button>
        </Link>

        <Link href="/signup">
          <a>Create Account</a>
        </Link>
      </div>

      {/* Optional */}
      <NewsletterForm />
    </Layout>
  )
}
