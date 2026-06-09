export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const apiKey = process.env.SCRAPELLM_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: "SCRAPELLM_API_KEY not found",
      });
    }

    const response = await fetch(
      `https://api.scrapellm.com/scrapers/chatgpt?prompt=${encodeURIComponent(message)}`,
      {
        method: "GET",
        headers: {
          "X-API-Key": apiKey,
        },
      }
    );

    const data = await response.json();

    return res.status(200).json({
      reply:
        data.result ||
        data.answer ||
        data.response ||
        "No response received.",
    });
  } catch (error) {
    console.error("AI Error:", error);

    return res.status(500).json({
      error: error.message,
    });
  }
}