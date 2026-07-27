import { useEffect, useState } from "react";

export default function LatestNews() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/news/fetch");
        const data = await res.json();

        if (data.success) {
          setArticles(data.articles);
        }
      } catch (error) {
        console.error("Failed to load news:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <section style={{ padding: "40px 20px" }}>
        <h2>📰 Latest Crypto News</h2>
        <p>Loading latest news...</p>
      </section>
    );
  }

  return (
    <section style={{ padding: "40px 20px" }}>
      <h2
        style={{
          color: "#fff",
          marginBottom: "20px",
          textAlign: "center",
        }}
      >
        📰 Latest Crypto News
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))",
          gap: "20px",
        }}
      >
        {articles.map((article, index) => (
          <div
            key={index}
            style={{
              background: "#111827",
              borderRadius: "12px",
              overflow: "hidden",
              boxShadow: "0 4px 10px rgba(0,0,0,.3)",
              color: "#fff",
            }}
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ padding: "15px" }}>
              <p
                style={{
                  color: "#22c55e",
                  fontSize: "12px",
                  marginBottom: "10px",
                }}
              >
                {article.source}
              </p>

              <h3
                style={{
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                {article.title}
              </h3>

              <p
                style={{
                  color: "#d1d5db",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {article.description}
              </p>

              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  color: "#3b82f6",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                Read More →
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
