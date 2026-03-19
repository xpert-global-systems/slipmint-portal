import Layout from '../components/Layout'
import Hero from '../components/Hero'
import NewsletterForm from '../components/NewsletterForm'
import Link from 'next/link'

export default function Home() {
  return (
    <Layout>
      <Hero />

      {/* Core Actions */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link href="/demo">
          <button style={{ marginRight: '10px' }}>View Demo</button>
        </Link>

        <Link href="/signup">
          <button>Create Account</button>
        </Link>
      </div>

      {/* Optional */}
      <NewsletterForm />
    </Layout>
  )
}
