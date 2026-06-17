import { useState } from "react";
import Link from "next/link";
import Layout from "../components/Layout";

export default function Research() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  // Added distinct slugs for each framework to route dynamically
  const posts = [
    {
      title: "Weekly Market Brief",
      summary: "A structured overview of major crypto market movement and sentiment.",
      slug: "/research/weekly-brief", 
    },
    {
      title: "Bitcoin Trend Watch",
      summary: "Key support, resistance, and momentum zones to watch this week.",
      slug: "/research/bitcoin-trend",
    },
    {
      title: "Risk and Structure",
      summary: "Why disciplined positioning matters more than hype in volatile markets.",
      slug: "/research/risk-structure", // This hooks into your updated guide page
    },
  ];

  async function runResearch() {
    if (!query.trim()) return;

    setLoading(true);
    setResult("");

    try {
      const res = await fetch("/api/ai-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: query }),
      });

      const data = await res.json();
      setResult(data.result || data.answer || "No research result was returned.");
    } catch (error) {
      console.error(error);
      setResult("Unable to retrieve research at this time.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Layout>
      <section style={styles.page}>
        <div style={styles.container}>
          
          <span style={styles.tag}>SlipMint Research Hub</span>

          <h1 style={styles.title}>
            AI-Powered Crypto Research &<br />Market Intelligence
          </h1>

          <p style={styles.subtitle}>
            Search macro environments, digital assets, validation layers, algorithmic trend configurations, and risk structural guidelines using enterprise deep analytical computing models.
          </p>

          <div style={styles.searchCard}>
            <div style={styles.inputContainer}>
              <span style={styles.searchIcon}>🔍</span>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about crypto, Bitcoin, Ethereum, forex, stocks, or macro markets..."
                style={styles.input}
              />
            </div>

            <button
              onClick={runResearch}
              disabled={loading}
              style={{
                ...styles.searchButton,
                ...(loading ? styles.searchButtonDisabled : {}),
              }}
            >
              {loading ? "Analyzing Engine..." : "Run Analysis"}
            </button>
          </div>

          {result && (
            <div style={styles.resultCard}>
              <div style={styles.resultHeader}>
                <span style={styles.resultBadge}>Generated Intelligence Log</span>
              </div>
              <p style={styles.resultText}>{result}</p>
            </div>
          )}

          <div style={styles.sectionDivider}></div>

          <h2 style={styles.sectionTitle}>
            Featured Intelligence Protocols
          </h2>

          <div style={styles.grid}>
            {posts.map((post, index) => (
              <article key={index} style={styles.card}>
                <div style={styles.cardMeta}>
                  <span style={styles.cardType}>Institutional Report</span>
                </div>
                <h3 style={styles.cardTitle}>{post.title}</h3>
                <p style={styles.cardText}>{post.summary}</p>
                
                {/* Fixed Action Route: Wrapped inside Link component */}
                <Link href={post.slug} style={{ textDecoration: "none" }}>
                  <button style={styles.button}>
                    Access Terminal →
                  </button>
                </Link>
              </article>
            ))}
          </div>
          
        </div>
      </section>
    </Layout>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#050a11", // Deep premium midnight dark backdrop
    color: "#f8fafc",
    padding: "60px 24px 100px",
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto",
  },
  tag: {
    display: "inline-block",
    color: "#22c55e",
    background: "rgba(34, 197, 94, 0.08)",
    border: "1px solid rgba(34, 197, 94, 0.15)",
    padding: "6px 14px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "20px",
  },
  title: {
    fontSize: "40px",
    lineHeight: "1.2",
    fontWeight: "800",
    letterSpacing: "-0.8px",
    color: "#ffffff",
    marginBottom: "16px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "16px",
    maxWidth: "760px",
    lineHeight: "1.6",
    margin: "0 0 36px 0",
  },
  searchCard: {
    display: "flex",
    gap: "12px",
    marginBottom: "40px",
    flexWrap: "wrap" as const,
  },
  inputContainer: {
    position: "relative" as const,
    flex: 1,
    minWidth: "290px",
    display: "flex",
    alignItems: "center",
  },
  searchIcon: {
    position: "absolute" as const,
    left: "16px",
    fontSize: "16px",
    opacity: 0.5,
  },
  input: {
    width: "100%",
    padding: "16px 16px 16px 46px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.07)",
    background: "#0b121f",
    color: "#ffffff",
    fontSize: "15px",
    outline: "none",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
  },
  searchButton: {
    padding: "16px 28px",
    borderRadius: "10px",
    border: "none",
    background: "#22c55e",
    color: "#050a11",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(34, 197, 94, 0.2)",
    transition: "transform 0.15s, opacity 0.15s",
  },
  searchButtonDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  resultCard: {
    background: "#0b121f",
    borderRadius: "12px",
    padding: "24px",
    marginBottom: "40px",
    border: "1px solid rgba(255,255,255,0.06)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
  },
  resultHeader: {
    marginBottom: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
    paddingBottom: "10px",
  },
  resultBadge: {
    color: "#22c55e",
    fontSize: "11px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  resultText: {
    whiteSpace: "pre-wrap" as const,
    lineHeight: "1.7",
    color: "#cbd5e1",
    fontSize: "15px",
    margin: 0,
  },
  sectionDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.06)",
    margin: "48px 0 36px 0",
  },
  sectionTitle: {
    fontSize: "22px",
    fontWeight: "700",
    letterSpacing: "-0.3px",
    marginBottom: "24px",
    color: "#ffffff",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#0b121f",
    borderRadius: "12px",
    padding: "26px",
    border: "1px solid rgba(255,255,255,0.05)",
    display: "flex",
    flexDirection: "column" as const,
    justifyContent: "space-between" as const,
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  },
  cardMeta: {
    marginBottom: "12px",
  },
  cardType: {
    fontSize: "11px",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    background: "rgba(255,255,255,0.03)",
    padding: "3px 8px",
    borderRadius: "4px",
  },
  cardTitle: {
    fontSize: "20px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 10px 0",
    letterSpacing: "-0.2px",
  },
  cardText: {
    color: "#94a3b8",
    fontSize: "14px",
    lineHeight: "1.55",
    margin: "0 0 24px 0",
    flexGrow: 1,
  },
  button: {
    background: "transparent",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    color: "#4ade80",
    padding: "10px 16px",
    borderRadius: "6px",
    fontSize: "13px",
    fontWeight: "600",
    cursor: "pointer",
    width: "100%",
    textAlign: "center" as const,
    transition: "all 0.2s",
  }
};