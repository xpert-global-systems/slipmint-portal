// slipmint-portal/pages/api/ai-research.js
//
// Calls Gemini directly (with Google Search grounding) instead of proxying through
// a third-party scraping service. Requires GEMINI_API_KEY in your environment.

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: "Method not allowed. Use POST.",
    });
  }

  const { query } = req.body;

  if (!query) {
    return res.status(400).json({
      success: false,
      error: "Query parameter is required",
    });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[ai-research] GEMINI_API_KEY not configured');
    return res.status(500).json({
      success: false,
      error: "Research engine is not configured. Missing GEMINI_API_KEY.",
    });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: query }] }],
          tools: [{ google_search: {} }], // enables real-time web grounding
          generationConfig: { maxOutputTokens: 1024 },
        }),
        signal: AbortSignal.timeout(20000),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API responded with status ${response.status}: ${errText}`);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];
    const parts = candidate?.content?.parts || [];
    const answer = parts.map((p) => p.text || '').join('\n').trim() || 'No response received.';

    // Extract grounding sources, if present, into the { url, text } shape the frontend expects.
    const groundingChunks = candidate?.groundingMetadata?.groundingChunks || [];
    const sources = groundingChunks
      .map((c) => c.web && { url: c.web.uri, text: c.web.title })
      .filter(Boolean);

    return res.status(200).json({
      success: true,
      answer,
      sources,
    });

  } catch (error) {
    console.error('[slipmint-portal] ai-research error:', error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
}
