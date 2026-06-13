import getApp from "../../lib/firebaseAdmin";

export default function handler(req, res) {
  try {
    const app = getApp();

    return res.status(200).json({
      success: true,
      projectId: app.options.projectId || "NO_PROJECT_ID",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}