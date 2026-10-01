const { hasValidSession, isConfigured } = require("./adminAuth");
const { getAdminDashboard } = require("./adminStore");
const { isPostgresConfigured } = require("./referralStore");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  res.setHeader("Cache-Control", "no-store");
  if (!isConfigured()) return res.status(503).json({ error: "Admin login is not configured." });
  if (!hasValidSession(req)) return res.status(401).json({ error: "Authentication required." });
  if (!isPostgresConfigured()) return res.status(503).json({ error: "Postgres is not configured." });
  try {
    return res.status(200).json(await getAdminDashboard());
  } catch (error) {
    console.error("Admin dashboard error:", error);
    return res.status(500).json({ error: "Could not load dashboard activity." });
  }
};
