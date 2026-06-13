import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    return res.status(200).json({
      success: true,
      apps: admin.apps.length,
      projectId: admin.apps.length
        ? admin.app().options.projectId
        : "NOT_INITIALIZED",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
    });
  }
}