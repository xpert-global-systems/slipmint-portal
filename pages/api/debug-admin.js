import admin from “../../lib/firebaseAdmin”;

export default async function handler(req, res) {
try {
return res.status(200).json({
success: true,
projectId: admin.app().options.projectId || null,
appInitialized: admin.apps.length > 0
});
} catch (error) {
return res.status(500).json({
success: false,
error: error.message,
stack: error.stack
});
}
}