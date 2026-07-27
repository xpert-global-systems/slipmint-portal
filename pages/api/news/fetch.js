export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWSAPI_KEY;

    const response = await fetch(
      `https://newsapi.org/v2/top-headlines?category=business&language=en&pageSize=10&apiKey=${apiKey}`
    );

    const data = await response.json();

    if (!data.articles) {
      return res.status(500).json({ error: "No articles found" });
    }

    const articles = data.articles.map((article) => ({
      title: article.title,
      description: article.description,
      url: article.url,
      image: article.urlToImage,
      publishedAt: article.publishedAt,
      source: article.source?.name,
    }));

    return res.status(200).json({
      success: true,
      count: articles.length,
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
