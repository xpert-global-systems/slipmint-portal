export default async function handler(req, res) {
  try {
    const apiKey = process.env.NEWSAPI_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: "NEWSAPI_KEY is not configured.",
      });
    }

    const url =
      `https://newsapi.org/v2/everything?` +
      `q=crypto OR bitcoin OR ethereum OR blockchain OR web3` +
      `&language=en` +
      `&sortBy=publishedAt` +
      `&pageSize=12` +
      `&apiKey=${apiKey}`;

    const response = await fetch(url);

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const articles = (data.articles || []).map((article) => ({
      title: article.title,
      description: article.description,
      image: article.urlToImage,
      url: article.url,
      source: article.source?.name,
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
