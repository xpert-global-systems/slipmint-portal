import Link from "next/link";
import Layout from "../../components/Layout";

export default function WeeklyMarketBrief() {
  const sections = [
    {
      title: "Macro Backdrop",
      points: [
        "Risk sentiment across crypto remains tied to broader macro liquidity conditions and rate expectations",
        "BTC continues to act as the market's liquidity barometer — strength or weakness here tends to lead altcoin moves",
        "Watch for correlation shifts between crypto and traditional risk assets (equities, especially tech) as a signal of regime change",
      ],
    },
    {
      title: "Market Structure",
      points: [
        "Volume and volatility patterns matter more than single-day price moves for gauging real conviction",
        "Range-bound conditions favor patience over forced entries — most edge is lost chasing breakouts that fail",
        "Funding rates and open interest on majors offer a read on whether positioning is overheated in either direction",
      ],
    },
    {
      title: "Sentiment Check",
      points: [
        "Extremes in fear or greed are typically better faded than followed",
        "Social and search volume spikes often lag price rather than lead it — useful for confirmation, not timing",
        "Disciplined positioning beats reactive positioning across every market cycle",
      ],
    },
    {
      title: "This Week's Takeaway",
      points: [
        "Structure first, conviction second — confirm the trend before sizing into it",
        "Keep risk per trade fixed regardless of how confident a setup looks",
        "Re-evaluate thesis only on new information, not on price movement alone",
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
            <h1 style={styles.mainTitle}>Weekly Market Brief</h1>
            <p style={styles.subtitle}>
              A structured overview of major crypto market movement and sentiment.
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
            This brief is for research and educational purposes only and is not financial advice.
            Always apply your own risk management before acting on any market view.
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
