import Layout from '../components/Layout'
import { siteConfig } from '../lib/siteConfig'

export default function About() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">About SlipMint</h1>

        <p className="mb-4">
          SlipMint is a market intelligence platform built around one idea: trading
          is not about predicting market outcomes, but about meticulous preparation.
          We provide crypto and forex trading signals, research, and educational
          content for traders who want structure over noise.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">What We Do</h2>
        <p className="mb-4">
          Our core methodology centers on momentum-based setups using 4H bias with
          1H entries, primarily on XAUUSD and EURUSD during the London-New York
          session overlap. We publish 2-3 signals per day with a minimum 1:2
          risk-to-reward ratio, alongside market research and a paid membership
          community, Founder Vault.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Who's Behind It</h2>
        <p className="mb-4">
          SlipMint is operated by {siteConfig.legalName}, based in {siteConfig.address}.
          SlipMint is an independent platform and is not affiliated with or endorsed
          by any exchange, broker, or financial institution beyond our disclosed
          affiliate partnerships.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Important Disclosure</h2>
        <p className="mb-4">
          Content published by SlipMint is for informational and educational
          purposes only and does not constitute financial advice. Trading involves
          risk, including the risk of loss. SlipMint has affiliate partnerships
          with Exness and Gate.io and may earn a commission from referrals, at no
          extra cost to you.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Get In Touch</h2>
        <p>
          Email: {siteConfig.supportEmail}
          <br />
          Telegram: {siteConfig.telegram.replace('https://', '')}
        </p>
      </div>
    </Layout>
  )
}
