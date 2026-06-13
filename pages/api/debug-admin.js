import * as lib from "../../lib/firebaseAdmin";
import * as src from "../../src/lib/firebaseAdmin";

export default function handler(req, res) {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;

  let parsed = null;
  let parseError = null;

  try {
    if (raw) parsed = JSON.parse(raw);
  } catch (e) {
    parseError = e.message;
  }

  res.status(200).json({
    // FILE DETECTION
    lib_source: lib.FIREBASE_SOURCE || "NOT_FOUND",
    src_source: src.FIREBASE_SOURCE || "NOT_FOUND",

    lib_loaded: !!lib,
    src_loaded: !!src,

    // ENV CHECK
    exists: !!raw,
    length: raw?.length || 0,
    preview_start: raw?.slice(0, 80) || null,
    preview_end: raw?.slice(-80) || null,

    // JSON VALIDATION
    isValidJson: !parseError && !!parsed,
    jsonError: parseError,

    // FIREBASE DATA
    project_id: parsed?.project_id || null,
    client_email: parsed?.client_email || null,
    has_private_key: !!parsed?.private_key,
  });
}
