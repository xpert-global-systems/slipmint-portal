// slipmint-portal/pages/api/env-test.js

export default async function handler(req, res) {
  // 1. Generate baseline presence checklist
  const diagnostics = {
    test: process.env.NEXT_PUBLIC_TEST_VALUE || "Not found",
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "Missing",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Loaded" : "Missing",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Loaded" : "Missing",
    scrapeLlmKey: process.env.SCRAPELLM_API_KEY ? "Loaded" : "Missing"
  };

  // 2. Fail early if required variables are physically missing from the runtime
  const criticalKeys = ['SCRAPELLM_API_KEY', 'NEXT_PUBLIC_FIREBASE_API_KEY', 'NEXT_PUBLIC_FIREBASE_PROJECT_ID'];
  const missingKeys = criticalKeys.filter(key => !process.env[key]);

  if (missingKeys.length > 0) {
    return res.status(500).json({
      success: false,
      message: `Configuration incomplete. Missing variables: ${missingKeys.join(', ')}`,
      diagnostics
    });
  }

  // Define target endpoint URLs
  const firebaseTestUrl = `https://googleapis.com{process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`;
  const testQuery = "Crypto market sentiment structural overview";
  const llmTestUrl = `https://scrapellm.com{encodeURIComponent(testQuery)}`;

  try {
    // 3. Fire requests simultaneously using parallel execution
    const [firebaseResult, llmResult] = await Promise.allSettled([
      // Test Firebase API key validity via Auth REST API (sending an empty payload)
      fetch(firebaseTestUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({})
      }),
      // Test ScrapeLLM Connectivity
      fetch(llmTestUrl, {
        method: "GET",
        headers: { "X-API-Key": process.env.SCRAPELLM_API_KEY }
      })
    ]);

    // 4. Process Firebase connection response
    let firebaseStatus = { connected: false, details: "Request failed to initiate" };
    if (firebaseResult.status === "fulfilled") {
      const fbResponse = firebaseResult.value;
      const fbData = await fbResponse.json().catch(() => ({}));
      
      // An API key error returns a 400 with specific bad key strings. 
      // MISSING_REQUEST_BODY or INVALID_EMAIL means the key is working, but the payload was intentionally empty.
      const errorMsg = fbData.error?.message || "";
      if (fbResponse.ok || errorMsg === "MISSING_REQUEST_BODY" || errorMsg === "INVALID_EMAIL") {
        firebaseStatus = { connected: true, details: "Firebase endpoint reached. API key is valid." };
      } else {
        firebaseStatus = { connected: false, details: `Rejected by Google API Gateway: ${errorMsg || fbResponse.statusText}` };
      }
    } else {
      firebaseStatus.details = firebaseResult.reason?.message || "Network exception";
    }

    // 5. Process ScrapeLLM connection response
    let llmStatus = { connected: false, details: "Request failed to initiate", preview: null };
    if (llmResult.status === "fulfilled") {
      const llmResponse = llmResult.value;
      if (llmResponse.ok) {
        const llmData = await llmResponse.json().catch(() => ({}));
        llmStatus = {
          connected: true,
          details: "ScrapeLLM connection verified.",
          preview: {
            answer: llmData.result || llmData.answer || "No string payload generated",
            sourcesCount: llmData.links ? llmData.links.length : 0
          }
        };
      } else {
        llmStatus.details = `API rejected request with status code: ${llmResponse.status}`;
      }
    } else {
      llmStatus.details = llmResult.reason?.message || "Network exception";
    }

    // 6. Aggregate results and return final response
    const overallSuccess = firebaseStatus.connected && llmStatus.connected;
    
    return res.status(overallSuccess ? 200 : 500).json({
      success: overallSuccess,
      message: overallSuccess 
        ? "SlipMint live subsystem network verification complete!" 
        : "Subsystem verification failed. Check specific status properties below.",
      diagnostics,
      subsystems: {
        firebase: firebaseStatus,
        scrapeLlm: llmStatus
      }
    });

  } catch (globalError) {
    return res.status(500).json({
      success: false,
      message: "An unexpected fatal runtime exception occurred during execution.",
      error: globalError.message,
      diagnostics
    });
  }
}
