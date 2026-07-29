import Head from 'next/head'
import Layout from '../components/Layout'
import { siteConfig } from '../lib/siteConfig'

export default function PrivacyPolicy() {
  return (
    <Layout>
      <Head>
        <title>{`Privacy Policy | ${siteConfig.website}`}</title>
        <meta name="description" content={`Privacy Policy and data practices for ${siteConfig.legalName}.`} />
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
                Legal & Governance
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white mb-3">
                Privacy Policy
              </h1>
              <p className="text-sm text-gray-400">
                Last updated: <time dateTime="2026-06">June 2026</time>
              </p>
            </header>

            {/* Content Body */}
            <div className="prose prose-invert prose-emerald max-w-none text-gray-300 leading-relaxed space-y-8">
              
              <p className="text-lg text-gray-200">
                This Privacy Policy explains how <strong className="text-white">{siteConfig.legalName}</strong>, operating
                {' '}<strong>SlipMint</strong> (<a href={`https://${siteConfig.website}`} className="text-emerald-400 underline hover:text-emerald-300">{siteConfig.website}</a>), collects, uses, and protects
                information when you use this site, our Telegram channel, or
                Founder Vault membership.
              </p>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">1. Information We Collect</h2>
                <p>
                  We may collect account information you provide directly (such as email address and username),
                  authentication data managed via Firebase, payment and subscription status for Founder Vault,
                  and basic usage telemetry (pages visited, device type) for site analytics.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">2. How We Use Information</h2>
                <p>
                  We process collected information to provide and maintain our services, manage Founder Vault
                  subscriptions, dispatch signal alerts and opted-in newsletters, handle support requests, and improve platform reliability.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">3. Third-Party Services</h2>
                <p>
                  We rely on trusted third-party providers including <strong>Firebase</strong> (authentication and data storage), 
                  {' '}<strong>Vercel</strong> (edge infrastructure & hosting), and secure payment processors for subscriptions. 
                  These providers process data according to their respective privacy standards. 
                  <span className="block mt-2 font-medium text-emerald-400">
                    We never sell or rent your personal information to third parties.
                  </span>
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">4. Affiliate Links & Disclosures</h2>
                <p>
                  This site contains affiliate links to third-party platforms including <strong>Exness</strong> and <strong>Gate.io</strong>. 
                  If you sign up or trade through these links, the broker or exchange may share referral telemetry with us. 
                  We never receive or have access to your trading account credentials or financial funds.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">5. Data Retention & Your Rights</h2>
                <p>
                  We retain account details for as long as your account remains active or as required to deliver our services. 
                  You maintain full rights to request access to, correction of, or permanent deletion of your personal records.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">6. Cookies & Tracking</h2>
                <p>
                  We utilize cookies and session storage for persistent authentication and core site analytics. 
                  You can manage or disable cookies directly within your web browser settings.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-bold text-white mb-3">7. Policy Updates</h2>
                <p>
                  We periodically refine this policy. Material updates will be communicated by updating the 
                  &quot;Last updated&quot; date at the top of this document.
                </p>
              </section>

              {/* Contact Callout Card */}
              <section className="mt-12 p-6 rounded-xl bg-gray-800/50 border border-gray-700/60 not-prose">
                <h3 className="text-lg font-semibold text-white mb-2">Have questions or data requests?</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Our compliance team is here to assist with any privacy concerns or account rights queries.
                </p>
                <a 
                  href={`mailto:${siteConfig.supportEmail}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-semibold text-sm transition-colors"
                >
                  Contact Support ({siteConfig.supportEmail})
                </a>
              </section>

            </div>
          </article>
        </main>
      </div>
    </Layout>
  )
}
