export default function handler(req, res) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  let parsed = null;
  let error = null;

  try {
    if (raw) parsed = JSON.parse(raw);
  } catch (e) {
    error = e.message;
  }

  res.status(200).json({
    exists: !!raw,
    length: raw?.length || 0,
    preview_start: raw?.slice(0, 80) || null,
    preview_end: raw?.slice(-80) || null,
    isValidJson: !error && !!parsed,
    jsonError: error,
    project_id: parsed?.project_id || null,
    client_email: parsed?.client_email || null,
  });
}