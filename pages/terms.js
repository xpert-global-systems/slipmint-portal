import Head from 'next/head'
import Layout from '../components/Layout'
import { siteConfig } from '../lib/siteConfig'

export default function Terms() {
  return (
    <Layout>
      <Head>
        <title>{`Terms of Service | ${siteConfig.website}`}</title>
        <meta name="description" content={`Terms of Service and legal agreements for ${siteConfig.legalName}.`} />
      </Head>

      <div className="relative min-h-screen py-16 px-4 sm:px-6 lg:px-8">
        {/* Subtle Background Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />

        <main className="relative max-w-4xl mx-auto">
          {/* Main Document Card */}
          <article className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-2xl p-8 sm:p-12 shadow-2xl">
            
            {/* Header */}
            <header className="border-b border-gray-800 pb-8 mb-10">
              <span className="inline-flex items-center gap-2 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
                Legal & Terms
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
                Terms of Service
              </h1>
              <p className="text-sm text-gray-400">
                Last updated: <time dateTime="2026-06">June 2026</time>
              </p>
            </header>

            {/* Content Body */}
            <div className="prose prose-invert prose-emerald max-w-none text-gray-300 leading-relaxed space-y-8">
              
              <p className="text-lg text-gray-200">
                These Terms of Service govern your use of <strong>SlipMint</strong> (<a href={`https://${siteConfig.website}`} className="text-emerald-400 underline hover:text-emerald-300">{siteConfig.website}</a>),
                operated by <strong className="text-white">{siteConfig.legalName}</strong>. By accessing or using this site, our Telegram channel, or Founder Vault membership, you agree to be bound by these terms.
              </p>

              {/* High-Risk Warning Card */}
              <section className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/20 not-prose">
                <h3 className="text-amber-400 font-semibold text-sm uppercase tracking-wider mb-1">
                  Important Financial Notice
                </h3>
                <p className="text-amber-200/80 text-sm leading-relaxed">
                  SlipMint is an educational and commentary platform. We do not offer personalized financial advice or manage assets. Trading involves high risk—please review sections 1 and 2 carefully.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">1. Not Financial Advice</h2>
                <p>
                  SlipMint provides market commentary, trading signals, and educational content for informational purposes only. Nothing on this site, in our Telegram channel, or within Founder Vault constitutes financial, investment, legal, or tax advice. We are not a registered investment advisor or broker-dealer. You are solely responsible for your own trading and investment decisions.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">2. Risk Disclosure</h2>
                <p>
                  Trading forex, cryptocurrency, and other financial instruments carries significant risk, including the potential for total loss of capital. Past performance of any signal or strategy is not indicative of future results. You should only trade with risk capital you can afford to lose.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">3. Founder Vault Membership</h2>
                <p>
                  Founder Vault is a paid monthly membership ($39/month) granting access to proprietary signals, market research, and community features. Subscriptions automatically renew each billing cycle until canceled. You may cancel at any time via your account settings; we do not issue refunds for partial billing periods.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">4. Affiliate Relationships</h2>
                <p>
                  SlipMint participates in affiliate programs with <strong>Exness</strong> and <strong>Gate.io</strong> and may earn commission when you register or trade through our referral links, at no extra cost to you. This relationship does not influence the objectivity or independence of our market research.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">5. Acceptable Use & Intellectual Property</h2>
                <p>
                  You agree not to redistribute, re-broadcast, resell, or republish SlipMint's proprietary signals, research, or content without explicit written consent. You also agree not to utilize the platform for any unlawful or unauthorized activity.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">6. Limitation of Liability</h2>
                <p>
                  To the maximum extent permitted by law, SlipMint and <strong className="text-white">{siteConfig.legalName}</strong> shall not be liable for any trading losses, lost profits, damages, or claims arising directly or indirectly from your reliance on the site, signals, or related materials.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">7. Changes to These Terms</h2>
                <p>
                  We reserve the right to amend these terms at any time. Continued usage of the platform following any modifications constitutes your formal acceptance of the updated terms.
                </p>
              </section>

              {/* Contact Callout Card */}
              <section className="mt-12 p-6 rounded-xl bg-gray-800/50 border border-gray-700/60 not-prose">
                <h3 className="text-lg font-semibold text-white mb-2">Questions regarding our terms?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  For inquiries or legal notices, feel free to reach out to our legal support team directly.
                </p>
                <a 
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-colors"
                >
                  Contact Legal Support ({siteConfig.supportEmail})
                </a>
              </section>

            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}
