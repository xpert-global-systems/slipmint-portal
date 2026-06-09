// slipmint-portal/pages/api/env-test.js

export default async function handler(req, res) {
  // 1. Diagnostics baseline check
const diagnostics = {
  test: process.env.NEXT_PUBLIC_TEST_VALUE || "Not found",
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "Missing",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Loaded" : "Missing",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Loaded" : "Missing",
  scrapeLlmKey: process.env.SCRAPELLM_API_KEY ? "Loaded" : "Missing"
};
  // 2. If the key is missing, exit early with the diagnostics status map
  if (!process.env.SCRAPELLM_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "Deep search environment variable configuration is incomplete.",
      diagnostics
    });
  }

  try {
    // 3. Run a quick, automated network check against the ScrapeLLM engine
    const testQuery = "Crypto market sentiment structural overview";
    const response = await fetch(
      `https://scrapellm.com{encodeURIComponent(testQuery)}`,
      {
        method: 'GET',
        headers: {
          "X-API-Key": process.env.SCRAPELLM_API_KEY,
        },
      }
    );

    if (!response.ok) {
      return res.status(response.status).json({
        success: false,
        message: `ScrapeLLM API rejected request with status code: ${response.status}`,
        diagnostics
      });
    }

    const data = await response.json();

    // 4. Return an operational payload showing that the key is valid and working
    return res.status(200).json({
      success: true,
      message: "SlipMint Deep Search End-to-End Test Passed!",
      diagnostics,
      preview: {
        answer: data.result || data.answer || "No string payload generated",
        sourcesCount: data.links ? data.links.length : 0
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Network exception thrown while executing research request.",
      error: error.message,
      diagnostics
    });
  }
}
