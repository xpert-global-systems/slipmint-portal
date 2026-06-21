import Link from "next/link";
import Layout from "../../components/Layout";

export default function BitcoinTrendWatch() {
  const sections = [
    {
      title: "Trend Context",
      points: [
        "Identify the higher-timeframe trend before reacting to lower-timeframe noise",
        "Bitcoin's dominant trend tends to set the tone for the broader crypto market — confirm direction here first",
        "Trend strength matters as much as trend direction when sizing a position",
      ],
    },
    {
      title: "Support & Resistance Zones",
      points: [
        "Treat round numbers and prior swing highs/lows as zones, not exact lines — price often wicks through before reacting",
        "Confluence between multiple timeframes at the same level increases its reliability",
        "A broken resistance that holds as new support strengthens the bullish case, and vice versa",
      ],
    },
    {
      title: "Momentum Signals",
      points: [
        "Slowing momentum into a key level is a warning sign, even if price hasn't reversed yet",
        "Divergence between price and momentum indicators is best used as a caution flag, not a standalone entry signal",
        "Volume should confirm the move — strong breakouts on weak volume tend to fail",
      ],
    },
    {
      title: "Risk Framing This Week",
      points: [
        "Define invalidation before entry — know exactly what price action proves the thesis wrong",
        "Avoid oversizing around known high-volatility events (macro data, major unlocks, options expiries)",
        "Scale position size to the distance between entry and invalidation, not to conviction level",
      ],
    },
  ];

  return (
    <Layout>
      <main style={styles.page}>
        <div style={styles.container}>
          <Link href="/research" style={styles.backButton}>
            ← Back to Research
          </Link>

          <header style={styles.header}>
            <span style={styles.badge}>Institutional Report</span>
            <h1 style={styles.mainTitle}>Bitcoin Trend Watch</h1>
            <p style={styles.subtitle}>
              Key support, resistance, and momentum zones to watch this week.
            </p>
          </header>

          <div style={styles.feed}>
            {sections.map((section, i) => (
              <section key={i} style={styles.card}>
                <h2 style={styles.cardTitle}>{section.title}</h2>
                <ul style={styles.pointsList}>
                  {section.points.map((point, j) => (
                    <li key={j} style={styles.pointItem}>
                      <span style={styles.bullet}>•</span> {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <p style={styles.disclaimer}>
            This analysis is for research and educational purposes only and is not financial advice.
            Levels and zones are observations, not guarantees — always confirm with your own analysis and risk plan.
          </p>
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
  backButton: {
    color: "#22c55e",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "700",
    display: "inline-block",
    marginBottom: "24px",
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
    gap: "24px",
  },
  card: {
    background: "#0f1b2d",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0 0 16px 0",
    color: "#ffffff",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    paddingBottom: "12px",
  },
  pointsList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  pointItem: {
    color: "#cbd5e1",
    fontSize: "14px",
    lineHeight: "1.6",
    display: "flex",
    gap: "8px",
  },
  bullet: {
    color: "#22c55e",
    fontWeight: "900",
  },
  disclaimer: {
    color: "#7a8aa0",
    fontSize: "12px",
    lineHeight: "1.6",
    marginTop: "30px",
    textAlign: "center",
  },
};
