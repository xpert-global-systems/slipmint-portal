import Layout from '../components/Layout'

const faqs = [
  {
    question: 'What is SlipMint?',
    answer: 'SlipMint is a market intelligence platform providing crypto and forex trading signals, research, and educational content, with a focus on disciplined, rules-based trade setups.'
  },
  {
    question: 'What is the Founder Vault?',
    answer: "Founder Vault is SlipMint's paid membership tier ($39/month), giving members access to live trade signals, market research, and our private community."
  },
  {
    question: 'Is this financial advice?',
    answer: 'No. SlipMint provides market commentary, signals, and educational content for informational purposes only. Nothing on this site constitutes financial, investment, or trading advice. Trading carries risk, including the risk of loss, and you should do your own research before making any financial decisions.'
  },
  {
    question: 'What markets and strategy do you focus on?',
    answer: 'Our core methodology centers on momentum-based setups using 4H bias with 1H entries, primarily on XAUUSD and EURUSD during the London-New York session overlap. We typically publish 2-3 signals per day with a minimum 1:2 risk-to-reward ratio.'
  },
  {
    question: 'Do you have affiliate relationships with brokers or exchanges?',
    answer: 'Yes. SlipMint has affiliate partnerships with Exness and Gate.io. We may earn a commission if you sign up through our links, at no extra cost to you. This does not influence our signals or research.'
  },
  {
    question: 'What is your refund policy?',
    answer: 'Founder Vault is billed monthly and can be cancelled at any time. We do not offer refunds for partial billing periods.'
  },
  {
    question: 'How do I get signals?',
    answer: 'Free signals are posted on our Telegram channel at t.me/slipmintsignals. Founder Vault members get expanded access through our private community.'
  },
  {
    question: 'How do I contact support?',
    answer: 'Email us at info@luckmanworld.icu, or reach out via Telegram. We aim to respond within 24-48 hours.'
  }
]

export default function FAQ() {
  return (
    <Layout>
      <div className="container">
        <h1>FAQ</h1>
        <p>Transparency and structure matter here.</p>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className="faq-item">
              <h3>{item.question}</h3>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
