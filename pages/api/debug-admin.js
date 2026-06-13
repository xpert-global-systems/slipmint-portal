import admin from "../../lib/firebaseAdmin";

export default async function handler(req, res) {
  try {
    const apps = admin.apps.length;

    const projectId =
      admin.apps.length > 0
        ? admin.app().options.projectId
        : "NOT_INITIALIZED";

    return res.status(200).json({
      success: true,
      apps,
      projectId,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack,
    });
  }
}