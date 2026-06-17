import { useState } from "react";
import Layout from "../components/Layout";

export default function Research() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const posts = [
    {
      title: "Weekly Market Brief",
      summary:
        "A structured overview of major crypto market movement and sentiment.",
    },
    {
      title: "Bitcoin Trend Watch",
      summary:
        "Key support, resistance, and momentum zones to watch this week.",
    },
    {
      title: "Risk and Structure",
      summary:
        "Why disciplined positioning matters more than hype in volatile markets.",
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
  body: JSON.stringify({
    query: query,
  }),
});


      const data = await res.json();

      setResult(
        data.result ||
          data.answer ||
          "No research result was returned."
      );
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
            AI-Powered Crypto Research & Market Intelligence
          </h1>

          <p style={styles.subtitle}>
            Search markets, crypto projects, macroeconomic events,
            trading opportunities, blockchain trends, and investment
            research using real-time AI analysis.
          </p>

          <div style={styles.searchCard}>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask anything about crypto, Bitcoin, Ethereum, forex, stocks, or macro markets..."
              style={styles.input}
            />

            <button
              onClick={runResearch}
              disabled={loading}
              style={styles.searchButton}
            >
              {loading ? "Analyzing..." : "Research"}
            </button>
          </div>

          {result && (
            <div style={styles.resultCard}>
              <h2>Research Result</h2>
              <p style={styles.resultText}>{result}</p>
            </div>
          )}

          <div style={styles.sectionDivider}></div>

          <h2 style={styles.sectionTitle}>
            Featured Research Reports
          </h2>

          <div style={styles.grid}>
            {posts.map((post, index) => (
              <article key={index} style={styles.card}>
                <h2 style={styles.cardTitle}>{post.title}</h2>
                <p style={styles.cardText}>{post.summary}</p>
                <button style={styles.button}>
                  Read More
                </button>
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
    background: "#081120",
    color: "#fff",
    padding: "40px 20px 60px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  tag: {
    display: "inline-block",
    color: "#22c55e",
    fontWeight: 700,
    marginBottom: "12px",
  },

  title: {
    fontSize: "42px",
    marginBottom: "15px",
  },

  subtitle: {
    color: "#b8c7d9",
    maxWidth: "800px",
    lineHeight: 1.7,
    marginBottom: "30px",
  },

  searchCard: {
    display: "flex",
    gap: "12px",
    marginBottom: "30px",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    minWidth: "280px",
    padding: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.15)",
    background: "#0f1b2d",
    color: "#fff",
  },

  searchButton: {
    padding: "14px 24px",
    borderRadius: "12px",
    border: "none",
    background: "#22c55e",
    color: "#081120",
    fontWeight: "700",
    cursor: "pointer",
  },

  resultCard: {
    background: "#0f1b2d",
    borderRadius: "18px",
    padding: "24px",
    marginBottom: "40px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  resultText: {
    whiteSpace: "pre-wrap",
    lineHeight: 1.8,
    color: "#d7e3f4",
  },

  sectionDivider: {
    height: "1px",
    background: "rgba(255,255,255,0.08)",
    margin: "40px 0",
  },

  sectionTitle: {
    marginBottom: "20px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
    gap: "20px",
  },

  card: {
    background: "#0f1b2d",
    borderRadius: "18px",
    padding: "22px",
    border: "1px solid rgba(255,255,255,0.08)",
  },

  cardTitle: {
    marginBottom: "12px",
  },

  cardText: {
    color: "#b8c7d9",
    lineHeight: 1.6,
    marginBottom: "18px",
  },

  button: {
    background: "#22c55e",
    border: "none",
    color: "#081120",
    padding: "12px 18px",
    borderRadius: "10px",
    fontWeight: "700",
    cursor: "pointer",
  },
};
