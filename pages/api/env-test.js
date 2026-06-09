export default async function handler(req, res) {
console.log("API KEY:", process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? "Loaded" : "Missing");
console.log("AUTH DOMAIN:", process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? "Loaded" : "Missing");
console.log("PROJECT ID:", process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? "Loaded" : "Missing");
console.log("SCRAPELLM:", process.env.SCRAPELLM_API_KEY ? "Loaded" : "Missing");

const diagnostics = {
test: process.env.NEXT_PUBLIC_TEST_VALUE || “Not found”,
apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? “Loaded” : “Missing”,
projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? “Loaded” : “Missing”,
authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? “Loaded” : “Missing”,
scrapeLlmKey: process.env.SCRAPELLM_API_KEY ? “Loaded” : “Missing”
};

const criticalKeys = [
“SCRAPELLM_API_KEY”,
“NEXT_PUBLIC_FIREBASE_API_KEY”,
“NEXT_PUBLIC_FIREBASE_PROJECT_ID”
];

const missingKeys = criticalKeys.filter(key => !process.env[key]);

if (missingKeys.length > 0) {
return res.status(500).json({
success: false,
message: Configuration incomplete. Missing variables: ${missingKeys.join(", ")},
diagnostics
});
}

const firebaseTestUrl =
https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY};

const testQuery = “Crypto market sentiment structural overview”;

const llmTestUrl =
https://api.scrapellm.com/scrapers/chatgpt?prompt=${encodeURIComponent(testQuery)};

try {
const [firebaseResult, llmResult] = await Promise.allSettled([
fetch(firebaseTestUrl, {
method: “POST”,
headers: {
“Content-Type”: “application/json”
},
body: JSON.stringify({})
}),

  fetch(llmTestUrl, {
    method: "GET",
    headers: {
      "X-API-Key": process.env.SCRAPELLM_API_KEY
    }
  })
]);
let firebaseStatus = {
  connected: false,
  details: "Request failed"
};
if (firebaseResult.status === "fulfilled") {
  const fbResponse = firebaseResult.value;
  const fbData = await fbResponse.json().catch(() => ({}));
  const errorMsg = fbData?.error?.message || "";
  if (
    fbResponse.ok ||
    errorMsg === "MISSING_REQUEST_BODY" ||
    errorMsg === "INVALID_EMAIL"
  ) {
    firebaseStatus = {
      connected: true,
      details: "Firebase endpoint reached successfully."
    };
  } else {
    firebaseStatus = {
      connected: false,
      details: errorMsg || fbResponse.statusText
    };
  }
} else {
  firebaseStatus.details =
    firebaseResult.reason?.message || "Network exception";
}
let llmStatus = {
  connected: false,
  details: "Request failed",
  preview: null
};
if (llmResult.status === "fulfilled") {
  const llmResponse = llmResult.value;
  if (llmResponse.ok) {
    const llmData = await llmResponse.json().catch(() => ({}));
    llmStatus = {
      connected: true,
      details: "ScrapeLLM connection verified.",
      preview: {
        answer:
          llmData.result ||
          llmData.answer ||
          llmData.response ||
          "No response",
        sourcesCount: llmData.links?.length || 0
      }
    };
  } else {
    llmStatus.details =
      `API rejected request with status ${llmResponse.status}`;
  }
} else {
  llmStatus.details =
    llmResult.reason?.message || "Network exception";
}
const overallSuccess =
  firebaseStatus.connected && llmStatus.connected;
return res.status(overallSuccess ? 200 : 500).json({
  success: overallSuccess,
  diagnostics,
  subsystems: {
    firebase: firebaseStatus,
    scrapeLlm: llmStatus
  }
});

} catch (error) {
return res.status(500).json({
success: false,
error: error.message,
diagnostics
});
}
}