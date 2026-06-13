export default function handler(req, res) {
  try {
    // Intentionally test import patterns safely
    const test = require("../../src/lib/firebaseAdmin");

    res.json({
      loaded: true,
      keys: Object.keys(test),
      hasGetAuth: typeof test.getAuth === "function",
      hasDefault: !!test.default,
    });
  } catch (e) {
    res.status(500).json({
      error: e.message,
      stack: e.stack?.split("\n").slice(0, 5),
    });
  }
}
