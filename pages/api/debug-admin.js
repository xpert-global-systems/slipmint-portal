import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    return res.status(200).json({
      success: true,
      apps: admin.apps.length,
      projectId: admin.app().options.projectId || null
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
}