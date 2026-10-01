const {
  getReferralProgress,
  isPostgresConfigured,
  isValidReferralCode,
  normalizeReferralCode,
  parseRequestBody,
} = require("./referralStore");

function getCodeFromRequest(req, body) {
  if (body.code) return body.code;
  if (req.query?.code) return req.query.code;

  try {
    const requestUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    return requestUrl.searchParams.get("code");
  } catch (error) {
    return "";
  }
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isPostgresConfigured()) {
    return res.status(500).json({ error: "Postgres is not configured." });
  }

  const body = parseRequestBody(req.body);
  const code = normalizeReferralCode(getCodeFromRequest(req, body));

  if (!isValidReferralCode(code)) {
    return res.status(400).json({ error: "A valid referral code is required." });
  }

  try {
    const progress = await getReferralProgress(code);

    if (!progress) {
      return res.status(404).json({ error: "Referral code was not found." });
    }

    return res.status(200).json(progress);
  } catch (error) {
    console.error("Referral progress error:", error);
    return res.status(500).json({ error: "Could not load referral progress." });
  }
};
