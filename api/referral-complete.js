const {
  completeInvitation,
  isPostgresConfigured,
  isValidInviteToken,
  isValidReferralCode,
  normalizeInviteToken,
  normalizeReferralCode,
  parseRequestBody,
} = require("./referralStore");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isPostgresConfigured()) {
    return res.status(500).json({ error: "Postgres is not configured." });
  }

  const body = parseRequestBody(req.body);
  const code = normalizeReferralCode(body.code);
  const invitedToken = normalizeInviteToken(body.invitedToken);
  const invitedEmail = body.invitedEmail || body.email || "";

  if (!isValidReferralCode(code) || !isValidInviteToken(invitedToken)) {
    return res.status(400).json({ error: "A valid referral code and invite token are required." });
  }

  try {
    const progress = await completeInvitation(code, invitedToken, invitedEmail);

    if (!progress) {
      return res.status(404).json({ error: "Referral code was not found." });
    }

    return res.status(200).json({
      completed: progress.counted !== false,
      selfReferral: progress.selfReferral === true,
      progress,
    });
  } catch (error) {
    console.error("Referral completion error:", error);
    return res.status(500).json({ error: "Could not record referral completion." });
  }
};
