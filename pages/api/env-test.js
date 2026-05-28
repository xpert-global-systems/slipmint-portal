export default function handler(req, res) {
  res.json({
    test: process.env.NEXT_PUBLIC_TEST_VALUE || "Not found",
    apiKey: process.env.FIREBASE_API_KEY ? "Loaded" : "Missing",
    projectId: process.env.FIREBASE_PROJECT_ID ? "Loaded" : "Missing",
    authDomain: process.env.FIREBASE_AUTH_DOMAIN ? "Loaded" : "Missing"
  });
}
