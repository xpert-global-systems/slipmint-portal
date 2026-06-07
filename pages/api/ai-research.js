export default async function handler(req, res) {
  const { prompt } = req.query;

  if (!prompt) {
    return res.status(400).json({
      error: "Prompt is required",
    });
  }

  try {
    const response = await fetch(
      `https://api.scrapellm.com/scrapers/perplexity?prompt=${encodeURIComponent(prompt)}`,
      {
        headers: {
          "X-API-Key": process.env.SCRAPELLM_API_KEY,
        },
      }
    );

    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
