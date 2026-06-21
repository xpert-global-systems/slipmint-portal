import { useState } from "react";
import Layout from "../components/Layout";

const faqs = [
  {
    question: "What is SlipMint?",
    answer:
      "SlipMint is a market intelligence platform providing crypto and forex trading signals, research, and educational content, with a focus on disciplined, rules-based trade setups.",
  },
  {
    question: "What is the Founder Vault?",
    answer:
      "Founder Vault is SlipMint's paid membership tier ($39/month), giving members access to live trade signals, market research, and our private community.",
  },
  {
    question: "Is this financial advice?",
    answer:
      "No. SlipMint provides market commentary, signals, and educational content for informational purposes only. Nothing on this site constitutes financial, investment, or trading advice. Trading carries risk, including the risk of loss, and you should do your own research before making any financial decisions.",
  },
  {
    question: "What markets and strategy do you focus on?",
    answer:
      "Our core methodology centers on momentum-based setups using 4H bias with 1H entries, primarily on XAUUSD and EURUSD during the London-New York session overlap. We typically publish 2-3 signals per day with a minimum 1:2 risk-to-reward ratio.",
  },
  {
    question: "Do you have affiliate relationships with brokers or exchanges?",
    answer:
      "Yes. SlipMint has affiliate partnerships with Exness and Gate.io. We may earn a commission if you sign up through our links, at no extra cost to you. This does not influence our signals or research.",
  },
  {
    question: "What is your refund policy?",
    answer:
      "Founder Vault is billed monthly and can be cancelled at any time. We do not offer refunds for partial billing periods.",
  },
  {
    question: "How do I get signals?",
    answer:
      "Free signals are posted on our Telegram channel at t.me/slipmintsignals. Founder Vault members get expanded access through our private community.",
  },
  {
    question: "How do I contact support?",
    answer:
      "Email us at info@luckmanworld.icu, or reach out via Telegram. We aim to respond within 24-48 hours.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <Layout>
      <main style={styles.page}>
        <div style={styles.container}>
          <header style={styles.header}>
            <span style={styles.badge}>Help Center</span>
            <h1 style={styles.mainTitle}>Frequently Asked Questions</h1>
            <p style={styles.subtitle}>Transparency and structure matter here.</p>
          </header>

          <div style={styles.feed}>
            {faqs.map((item, i) => {
              const isOpen = openIndex === i;
              return (
                <section key={i} style={styles.card}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    style={styles.questionButton}
                  >
                    <span style={styles.questionText}>{item.question}</span>
                    <span style={styles.chevron}>{isOpen ? "−" : "+"}</span>
                  </button>
                  {isOpen && <p style={styles.answerText}>{item.answer}</p>}
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </Layout>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#081120",
    color: "#fff",
    padding: "30px 20px 80px",
  },
  container: {
    maxWidth: "760px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "35px",
  },
  badge: {
    background: "rgba(34, 197, 94, 0.15)",
    color: "#22c55e",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  mainTitle: {
    fontSize: "32px",
    marginTop: "12px",
    marginBottom: "6px",
    fontWeight: "800",
  },
  subtitle: {
    color: "#b8c7d9",
    fontSize: "16px",
    margin: 0,
  },
  feed: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  card: {
    background: "#0f1b2d",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  questionButton: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    padding: "20px 24px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
    textAlign: "left",
  },
  questionText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
  },
  chevron: {
    flexShrink: 0,
    color: "#22c55e",
    fontSize: "20px",
    fontWeight: "900",
    width: "24px",
    textAlign: "center",
  },
  answerText: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.7",
    padding: "0 24px 20px",
    margin: 0,
  },
};
