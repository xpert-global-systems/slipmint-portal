import { useEffect, useState } from "react";

export default function LatestNews() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function loadNews() {
      try {
        const res = await fetch("/api/news/fetch");
        const data = await res.json();

        if (data.success) {
          setArticles(data.articles);
        }
      } catch (err) {
        console.error(err);
      }
    }

    loadNews();
  }, []);

  return (
    <section style={{ padding: "40px 20px" }}>
      <h2 style={{ marginBottom: "20px" }}>🔥 Latest Crypto News</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
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
              color: "#fff",
              boxShadow: "0 4px 10px rgba(0,0,0,.3)",
            }}
          >
            {article.image && (
              <img
                src={article.image}
                alt={article.title}
                style={{
                  width: "100%",
                  height: "180px",
                  objectFit: "cover",
                }}
              />
            )}

            <div style={{ padding: "15px" }}>
              <h3>{article.title}</h3>

              <p
                style={{
                  color: "#9ca3af",
                  fontSize: "14px",
                }}
              >
                {article.description}
              </p>

              <a
                href={article.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#3b82f6",
                  textDecoration: "none",
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