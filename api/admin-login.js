const { createSessionToken, isConfigured, sessionCookie, verifyCredentials } = require("./adminAuth");
const { parseRequestBody } = require("./referralStore");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  if (!isConfigured()) return res.status(503).json({ error: "Admin login is not configured." });
  const body = parseRequestBody(req.body);
  if (!verifyCredentials(body.username, body.password)) return res.status(401).json({ error: "Invalid username or password." });
  res.setHeader("Set-Cookie", sessionCookie(createSessionToken(), req));
  res.setHeader("Cache-Control", "no-store");
  return res.status(200).json({ authenticated: true });
};
