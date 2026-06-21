import Layout from '../components/Layout'
import { siteConfig } from '../lib/siteConfig'

export default function PrivacyPolicy() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-gray-400 mb-8">Last updated: June 2026</p>

        <p className="mb-4">
          This Privacy Policy explains how {siteConfig.legalName}, operating
          SlipMint ({siteConfig.website}), collects, uses, and protects
          information when you use this site, our Telegram channel, or
          Founder Vault membership.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Information We Collect</h2>
        <p className="mb-4">
          We may collect: account information you provide (email, username),
          authentication data via Firebase, payment and subscription status
          for Founder Vault, and basic usage data (pages visited, device
          type) for site analytics.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">How We Use Information</h2>
        <p className="mb-4">
          We use collected information to provide and maintain the service,
          manage Founder Vault subscriptions, send signal alerts and
          newsletters you've opted into, respond to support requests, and
          improve the platform.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Third-Party Services</h2>
        <p className="mb-4">
          We use third-party services including Firebase (authentication and
          data storage), Vercel (hosting), and payment processors for
          subscriptions. These providers may process your data under their
          own privacy policies. We do not sell your personal information to
          third parties.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Affiliate Links</h2>
        <p className="mb-4">
          This site contains affiliate links to Exness and Gate.io. If you
          sign up through these links, the broker or exchange may share
          referral information with us. We do not receive your trading
          account credentials or funds.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Data Retention & Your Rights</h2>
        <p className="mb-4">
          We retain account information for as long as your account is
          active or as needed to provide services. You may request access
          to, correction of, or deletion of your personal information by
          contacting us at {siteConfig.supportEmail}.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Cookies</h2>
        <p className="mb-4">
          We may use cookies or similar technologies for authentication
          sessions and basic analytics. You can control cookies through your
          browser settings.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Changes to This Policy</h2>
        <p className="mb-4">
          We may update this Privacy Policy from time to time. Material
          changes will be reflected by updating the "Last updated" date
          above.
        </p>

        <h2 className="text-xl font-semibold mt-8 mb-3">Contact</h2>
        <p>
          Questions about this policy can be sent to {siteConfig.supportEmail}.
        </p>
      </div>
    </Layout>
  )
}
