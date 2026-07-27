export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWSAPI_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "NEWSAPI_KEY is missing from Vercel Environment Variables.",
      });
    }

    const url = `https://newsapi.org/v2/everything?q=forex OR gold OR bitcoin OR crypto OR stocks&language=en&sortBy=publishedAt&pageSize=10&apiKey=${apiKey}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        error: "Failed to fetch news from NewsAPI.",
      });
    }

    const data = await response.json();

    const articles = (data.articles || []).map((article) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      image: article.urlToImage,
      source: article.source?.name,
      url: article.url,
      publishedAt: article.publishedAt,
    }));

    return res.status(200).json({
      success: true,
      total: articles.length,
      articles,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}