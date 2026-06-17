import { useState } from "react";
import Link from "next/link";
import Layout from "../../components/Layout";

export default function RiskStructureGuide() {
  const [searchTerm, setSearchTerm] = useState("");

  const guidePages = [
    { num: 1, title: "Introduction to Forex Risk Management", points: ["Risk management = controlling potential losses in trading", "Most traders fail not because of strategy, but poor risk control", "Goal: preserve capital first, grow it second"] },
    { num: 2, title: "Why Risk Management Matters", points: ["Forex is highly volatile", "Leverage increases both profit and loss", "One bad trade can wipe months of gains", "Survival = long-term profitability"] },
    { num: 3, title: "Understanding Trading Risk", points: ["Risk = potential loss per trade", "Influenced by: Position size, Stop loss distance, Market volatility"] },
    { num: 4, title: "Types of Forex Risk", points: ["Market risk (price movement)", "Leverage risk", "Emotional risk", "Liquidity risk", "Event/news risk"] },
    { num: 5, title: "Capital Preservation Rule", points: ["Never risk more than you can afford to lose", "Professional traders protect capital first", "“No capital = no trading”"] },
    { num: 6, title: "The 1–2% Risk Rule", points: ["Risk only 1–2% per trade", "Example: $1,000 account → max risk = $10–$20 per trade", "Prevents account blowout"] },
    { num: 7, title: "Position Sizing Basics", points: ["Position size determines risk level", "Key formula: Lot size = Risk amount ÷ Stop loss distance", "Essential skill for consistency"] },
    { num: 8, title: "Understanding Lot Sizes", points: ["Standard lot = 100,000 units", "Mini lot = 10,000", "Micro lot = 1,000", "Beginners should use micro lots"] },
    { num: 9, title: "Stop Loss Fundamentals", points: ["A stop loss limits losses automatically", "Always required for every trade", "No stop loss = unlimited risk"] },
    { num: 10, title: "Take Profit Strategy", points: ["Defines exit for profit", "Helps maintain risk-reward balance", "Avoids emotional decision-making"] },
    { num: 11, title: "Risk-Reward Ratio", points: ["Ideal ratio: 1:2 or higher", "Example: Risk $10 → target $20+", "Ensures long-term profitability"] },
    { num: 12, title: "Win Rate vs Risk-Reward", points: ["High win rate not required for profit", "Even 40% win rate can be profitable with good RR", "Focus on expectancy"] },
    { num: 13, title: "Trading Expectancy", points: ["Formula: (Win rate × Avg win) − (Loss rate × Avg loss)", "Positive expectancy = profitable system"] },
    { num: 14, title: "Drawdown Explained", points: ["Drawdown = peak-to-loss decline", "Measures account damage", "Lower drawdown = safer strategy"] },
    { num: 15, title: "Maximum Drawdown Control", points: ["Set max daily loss limit (e.g. 5%)", "Stop trading after limit hit", "Prevents emotional revenge trading"] },
    { num: 16, title: "Leverage Risks", points: ["Leverage increases exposure", "1:100 = high risk if unmanaged", "Use low leverage as beginner"] },
    { num: 17, title: "Margin Explained", points: ["Margin = collateral for trades", "Low margin = more flexibility", "Overusing margin leads to margin call"] },
    { num: 18, title: "Margin Call & Stop Out", points: ["Margin call = broker warning", "Stop out = forced closure", "Caused by excessive risk"] },
    { num: 19, title: "Emotional Risk in Trading", points: ["Fear and greed cause losses", "Emotional trading = inconsistent results", "Discipline is a key skill"] },
    { num: 20, title: "Revenge Trading", points: ["Trying to recover losses quickly", "Leads to bigger losses", "Solution: pause after loss"] },
    { num: 21, title: "Overtrading", points: ["Too many trades = reduced quality", "Increases fees and losses", "Stick to high-probability setups"] },
    { num: 22, title: "Risk Per Session Strategy", points: ["Limit number of trades per day", "Example: Max 3 trades/day", "Improves discipline"] },
    { num: 23, title: "News Trading Risk", points: ["High volatility during news", "Examples: NFP, CPI, Interest rates", "Avoid or reduce lot size"] },
    { num: 24, title: "Economic Calendar Usage", points: ["Track news events", "Plan trades around volatility", "Avoid unexpected spikes"] },
    { num: 25, title: "Correlation Risk", points: ["Some pairs move together", "Example: EUR/USD & GBP/USD correlation", "Avoid doubling exposure"] },
    { num: 26, title: "Hedging Basics", points: ["Holding opposite positions", "Reduces exposure temporarily", "Not a profit strategy alone"] },
    { num: 27, title: "Diversification in Forex", points: ["Trade different pairs", "Spread risk across assets", "Avoid overexposure to one currency"] },
    { num: 28, title: "Risk Management Plan Creation", points: ["Define: Risk per trade, Daily loss limit, Strategy rules", "Must be written and followed"] },
    { num: 29, title: "Trading Journal Importance", points: ["Records all trades", "Helps identify mistakes", "Improves discipline"] },
    { num: 30, title: "Journal Metrics to Track", points: ["Entry/exit", "Risk per trade", "Emotional state", "Outcome analysis"] },
    { num: 31, title: "Backtesting Risk Strategy", points: ["Test strategy historically", "Identify risk weaknesses", "Improve before live trading"] },
    { num: 32, title: "Demo Trading vs Live Trading", points: ["Demo builds skill", "Live introduces emotion", "Risk rules must stay same"] },
    { num: 33, title: "Scaling Accounts Safely", points: ["Increase lot size gradually", "Only after consistent profits", "Never double risk suddenly"] },
    { num: 34, title: "Capital Growth Strategy", points: ["Compound profits slowly", "Withdraw profits regularly", "Avoid aggressive growth"] },
    { num: 35, title: "Psychological Capital Protection", points: ["Protect mental health", "Avoid burnout", "Take breaks after losses"] },
    { num: 36, title: "Trading Discipline Framework", points: ["Follow rules strictly", "No impulsive trades", "Consistency > frequency"] },
    { num: 37, title: "Risk Management Checklist", points: ["Stop loss set?", "Risk calculated?", "RR acceptable?", "News checked?"] },
    { num: 38, title: "Common Risk Mistakes", points: ["No stop loss", "Oversizing trades", "Trading emotions", "Ignoring news"] },
    { num: 39, title: "Beginner Risk Blueprint", points: ["1% risk per trade", "Micro lots only", "1–2 trades daily max"] },
    { num: 40, title: "Intermediate Risk Blueprint", points: ["2% max risk", "Multi-pair trading", "Structured journal"] },
    { num: 41, title: "Professional Risk Model", points: ["Portfolio-style trading", "Strict DD limits", "Capital allocation strategy"] },
    { num: 42, title: "Real Market Case Study", points: ["Account: $500", "Risk: 2% ($10)", "3 losses in a row = -6%", "Lesson: discipline preserves account"] },
    { num: 43, title: "Winning Trader Mindset", points: ["Focus on survival", "Accept losses as part of system", "Think long-term"] },
    { num: 44, title: "Risk Automation Tools", points: ["Trading calculators", "Position sizing tools", "Alerts for news events"] },
    { num: 45, title: "Building Consistency", points: ["Follow same rules daily", "Avoid strategy hopping", "Track performance weekly"] },
    { num: 46, title: "Final Risk Management Rules", points: ["Never risk more than 2%", "Always use stop loss", "Protect capital at all costs", "Trade less, think more"] },
    { num: 47, title: "Conclusion & Trader Growth Path", points: ["Risk management = foundation of trading success", "Profit comes AFTER discipline", "Focus: survive → stabilize → grow → scale"] }
  ];

  const filteredPages = guidePages.filter(page => 
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.points.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Layout>
      <main style={styles.page}>
        <div style={styles.container}>
          
          <Link href="/research" style={styles.backButton}>
            ← Back to Research
          </Link>

          <header style={styles.header}>
            <span style={styles.badge}>Vault Document</span>
            <h1 style={styles.mainTitle}>Forex Risk Management Master Guide</h1>
            <p style={styles.subtitle}>Complete 47-Page Architecture Protocol</p>
          </header>

          <div style={styles.filterContainer}>
            <input 
              type="text" 
              placeholder="Search across all 47 pages..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <div style={styles.feed}>
            {filteredPages.map((page) => (
              <section key={page.num} style={styles.pageCard}>
                <div style={styles.cardHeader}>
                  <span style={styles.pageNumber}>PAGE {page.num}</span>
                  <h2 style={styles.cardTitle}>{page.title}</h2>
                </div>
                <ul style={styles.pointsList}>
                  {page.points.map((point, index) => (
                    <li key={index} style={styles.pointItem}>
                      <span style={styles.bullet}>•</span> {point}
                    </li>
                  ))}
                </ul>
              </section>
            ))}
            {filteredPages.length === 0 && (
              <p style={styles.noResults}>No chapters match your search query.</p>
            )}
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
    textTransform: "uppercase" as const,
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
  filterContainer: {
    marginBottom: "30px",
  },
  searchInput: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "#0f1b2d",
    color: "#fff",
    fontSize: "15px",
    outline: "none",
  },
  feed: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  pageCard: {
    background: "#0f1b2d",
    borderRadius: "16px",
    padding: "24px",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  cardHeader: {
    display: "flex",
    alignItems: "flex-start" as const,
    flexDirection: "column" as const,
    gap: "4px",
    marginBottom: "16px",
    borderBottom: "1px solid rgba(255,255,255,0.06)",
    paddingBottom: "12px",
  },
  pageNumber: {
    color: "#22c55e",
    fontSize: "11px",
    fontWeight: "800",
    letterSpacing: "1px",
  },
  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    margin: 0,
    color: "#ffffff",
  },
  pointsList: {
    listStyleType: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column" as const,
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
  noResults: {
    color: "#b8c7d9",
    textAlign: "center" as const,
    marginTop: "20px",
  }
};