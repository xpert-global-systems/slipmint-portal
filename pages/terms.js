import Layout from '../components/Layout'
import { siteConfig } from '../lib/siteConfig'

export default function Terms() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <p className="mb-4">
          These Terms of Service govern your use of SlipMint ({siteConfig.website}),
          operated by {siteConfig.legalName}. By using this site, our Telegram
          channel, or Founder Vault membership, you agree to these terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">1. Not Financial Advice</h2>
        <p className="mb-4">
          SlipMint provides market commentary, trading signals, and
          educational content for informational purposes only. Nothing on
          this site, in our Telegram channel, or in Founder Vault
          constitutes financial, investment, legal, or tax advice. We are
          not a registered investment advisor or broker-dealer. You are
          solely responsible for your own trading and investment decisions.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">2. Risk Disclosure</h2>
        <p className="mb-4">
          Trading forex, crypto, and other financial instruments carries
          significant risk, including the risk of total loss of capital.
          Past performance of any signal or strategy is not indicative of
          future results. You should only trade with capital you can afford
          to lose.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">3. Founder Vault Membership</h2>
        <p className="mb-4">
          Founder Vault is a paid monthly membership ($39/month) granting
          access to signals, research, and community features. Subscriptions
          renew automatically each billing period until cancelled. You may
          cancel at any time; we do not provide refunds for partial billing
          periods.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">4. Affiliate Relationships</h2>
        <p className="mb-4">
          SlipMint participates in affiliate programs with Exness and
          Gate.io and may earn a commission when you sign up or trade
          through our links, at no additional cost to you. This does not
          affect the content or independence of our research and signals.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">5. Acceptable Use</h2>
        <p className="mb-4">
          You agree not to redistribute, resell, or republish SlipMint's
          signals, research, or content without permission, and not to use
          the platform for any unlawful purpose.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">6. Limitation of Liability</h2>
        <p className="mb-4">
          SlipMint and {siteConfig.legalName} are not liable for any trading
          losses, damages, or claims arising from your use of the site,
          signals, or related content, to the fullest extent permitted by
          law.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">7. Changes to These Terms</h2>
        <p className="mb-4">
          We may update these Terms from time to time. Continued use of the
          platform after changes constitutes acceptance of the updated
          terms.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">8. Contact</h2>
        <p>
          Questions about these terms can be sent to {siteConfig.supportEmail}.
        </p>
      </div>
    </Layout>
  )
}
