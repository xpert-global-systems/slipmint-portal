// slipmint-portal/pages/api/ai-research.js

export default async function handler(req, res) {
  // 1. Enforce POST requests to align with your dashboard submit forms
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: "Method not allowed. Use POST." 
    });
  }

  // 2. Extract query parameter from the POST body sent by your React hook
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Query parameter is required",
    });
  }

  try {
    // 3. Forward seamlessly to the ScrapeLLM API endpoint
    const response = await fetch(
      `https://api.scrapellm.com/scrapers/perplexity?prompt=${encodeURIComponent(query)}`,
      {
        method: 'GET', // The external ScrapeLLM scraper expects a GET call
        headers: {
          "X-API-Key": process.env.SCRAPELLM_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`ScrapeLLM service responded with status: ${response.status}`);
    }

    const data = await response.json();

    // 4. Return formatted payload to match your portal's frontend expectations
    return res.status(200).json({
      success: true,
      answer: data.result || data.answer || "No response received.",
      sources: data.links || [] // Converts ScrapeLLM sources array into your component format
    });

  } catch (error) {
    console.error('[slipmint-portal] Proxy Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
