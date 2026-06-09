export default async function handler(req, res) {
  try {
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

    return res.status(200).json({
      exists: !!raw,
      length: raw?.length || 0,
      startsWith: raw?.substring(0, 30) || null
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}