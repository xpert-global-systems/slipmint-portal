export default async function handler(req, res) {
  // Security check
  const auth = req.headers.authorization;

  if (auth !== `Bearer ${process.env.NEWS_CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Call your fetcher
    const response = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/news/fetch`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEWS_CRON_SECRET}`,
      },
    });

    const data = await response.json();

    return res.status(200).json({
      success: true,
      articles: data.articles || 0,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
