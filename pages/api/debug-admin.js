import { getFirebaseApp } from "../../src/lib/firebaseAdmin";

export default function handler(req, res) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  let parsed = null;
  let parseError = null;

  try {
    if (raw) parsed = JSON.parse(raw);
  } catch (e) {
    parseError = e.message;
  }

  let firebaseStatus = "NOT_INITIALIZED";
  let appsCount = 0;
  let projectId = null;

  try {
    const app = getFirebaseApp();
    appsCount = app ? 1 : 0;
    projectId = app?.options?.projectId || null;
    firebaseStatus = "INITIALIZED";
  } catch (e) {
    firebaseStatus = "ERROR: " + e.message;
  }

  res.status(200).json({
    firebase_status: firebaseStatus,
    apps: appsCount,
    projectId,

    env_exists: !!raw,
    env_length: raw?.length || 0,

    isValidJson: !parseError && !!parsed,
    jsonError: parseError,

    project_id: parsed?.project_id || null,
    client_email: parsed?.client_email || null,
    has_private_key: !!parsed?.private_key,
  });
}