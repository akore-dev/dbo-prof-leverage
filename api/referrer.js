const {
  getOrCreateReferrer,
  isPostgresConfigured,
  isValidEmail,
  normalizeEmail,
  parseRequestBody,
} = require("./referralStore");

function getRequestBaseUrl(req) {
  const configuredBaseUrl = process.env.BASE_URL || process.env.APP_URL || process.env.SITE_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl;
  }

  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const protocol = req.headers["x-forwarded-proto"] || (host?.includes("localhost") ? "http" : "https");

  return host ? `${protocol}://${host}` : "http://localhost:3001";
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = parseRequestBody(req.body);
  const email = normalizeEmail(body.email);

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "A valid email is required." });
  }

  if (!isPostgresConfigured()) {
    return res.status(500).json({ error: "Postgres is not configured." });
  }

  try {
    const referrer = await getOrCreateReferrer(email, getRequestBaseUrl(req));
    return res.status(200).json(referrer);
  } catch (error) {
    console.error("Referrer link error:", error);
    return res.status(500).json({ error: "Could not create referrer link." });
  }
};

