const crypto = require("crypto");
const { Pool } = require("pg");

const REFERRAL_GOAL = Number(process.env.REFERRAL_GOAL || 5);

let pool;
let schemaReadyPromise;

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeReferralCode(code) {
  return String(code || "").trim().toUpperCase();
}

function isValidReferralCode(code) {
  return /^[A-Z0-9_-]{6,64}$/.test(normalizeReferralCode(code));
}

function normalizeInviteToken(token) {
  return String(token || "").trim();
}

function isValidInviteToken(token) {
  return /^[A-Za-z0-9_-]{16,128}$/.test(normalizeInviteToken(token));
}

function generateReferrerCode(email) {
  const secret = process.env.REFERRER_CODE_SECRET || "professional-leverage-referrals";
  return crypto.createHmac("sha256", secret).update(email).digest("base64url").slice(0, 12).toUpperCase();
}

function parseRequestBody(body) {
  if (typeof body !== "string") return body || {};

  try {
    return JSON.parse(body || "{}");
  } catch (error) {
    return {};
  }
}

function isPostgresConfigured() {
  return Boolean(process.env.DATABASE_URL || process.env.PGHOST || process.env.DB_HOST);
}

function getPoolConfig() {
  const sslMode = process.env.PGSSLMODE || "";
  const databaseUrl = process.env.DATABASE_URL || "";
  const needsSsl = sslMode === "require" || databaseUrl.includes("sslmode=require");
  const config = databaseUrl
    ? { connectionString: databaseUrl }
    : {
        host: process.env.PGHOST || process.env.DB_HOST,
        port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
        database: process.env.PGDATABASE || process.env.DB_DATABASE,
        user: process.env.PGUSER || process.env.DB_USERNAME,
        password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
      };

  if (sslMode === "disable") {
    config.ssl = false;
  } else if (needsSsl) {
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

function getPool() {
  if (!pool) {
    pool = new Pool(getPoolConfig());
  }

  return pool;
}

async function ensureSchema() {
  if (!schemaReadyPromise) {
    schemaReadyPromise = getPool().query(`
      CREATE TABLE IF NOT EXISTS users (
        id BIGSERIAL PRIMARY KEY,
        email TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS referrer_codes (
        id BIGSERIAL PRIMARY KEY,
        user_id BIGINT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        code TEXT NOT NULL UNIQUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS invitations (
        id BIGSERIAL PRIMARY KEY,
        referrer_code_id BIGINT NOT NULL REFERENCES referrer_codes(id) ON DELETE CASCADE,
        invited_token TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'completed',
        invited_email TEXT,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        UNIQUE (referrer_code_id, invited_token)
      );

      ALTER TABLE invitations ADD COLUMN IF NOT EXISTS invited_email TEXT;

      CREATE INDEX IF NOT EXISTS idx_referrer_codes_code ON referrer_codes(code);
      CREATE INDEX IF NOT EXISTS idx_invitations_referrer_code_id ON invitations(referrer_code_id);
    `);
  }

  return schemaReadyPromise;
}

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || "").trim().replace(/\/+$/, "");
}

function getConfiguredBaseUrl() {
  return normalizeBaseUrl(process.env.BASE_URL || process.env.APP_URL || process.env.SITE_URL);
}

function buildReferrerUrl(code, baseUrl) {
  const resolvedBaseUrl = normalizeBaseUrl(baseUrl || getConfiguredBaseUrl() || "http://localhost:3001");
  return new URL(`/s/${encodeURIComponent(code)}`, resolvedBaseUrl).toString();
}

async function getOrCreateReferrer(email, baseUrl) {
  await ensureSchema();

  const normalizedEmail = normalizeEmail(email);
  const code = generateReferrerCode(normalizedEmail);
  const client = await getPool().connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query(
      `
        INSERT INTO users (email)
        VALUES ($1)
        ON CONFLICT (email)
        DO UPDATE SET updated_at = NOW()
        RETURNING id, email
      `,
      [normalizedEmail]
    );

    const user = userResult.rows[0];
    const codeResult = await client.query(
      `
        INSERT INTO referrer_codes (user_id, code)
        VALUES ($1, $2)
        ON CONFLICT (user_id)
        DO UPDATE SET updated_at = NOW()
        RETURNING code
      `,
      [user.id, code]
    );

    await client.query("COMMIT");

    return {
      email: user.email,
      code: codeResult.rows[0].code,
      url: buildReferrerUrl(codeResult.rows[0].code, baseUrl),
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function findReferrerCode(code) {
  await ensureSchema();

  const normalizedCode = normalizeReferralCode(code);
  const result = await getPool().query(
    `
      SELECT referrer_codes.id, referrer_codes.code, users.email AS owner_email
      FROM referrer_codes
      INNER JOIN users ON users.id = referrer_codes.user_id
      WHERE referrer_codes.code = $1
      LIMIT 1
    `,
    [normalizedCode]
  );

  return result.rows[0] || null;
}

async function completeInvitation(code, invitedToken, invitedEmail = "") {
  const normalizedCode = normalizeReferralCode(code);
  const normalizedToken = normalizeInviteToken(invitedToken);
  const normalizedEmail = isValidEmail(normalizeEmail(invitedEmail)) ? normalizeEmail(invitedEmail) : null;
  const referrerCode = await findReferrerCode(normalizedCode);

  if (!referrerCode) {
    return null;
  }

  if (normalizedEmail && normalizeEmail(referrerCode.owner_email) === normalizedEmail) {
    const progress = await getReferralProgress(normalizedCode);
    return progress ? { ...progress, selfReferral: true, counted: false } : null;
  }

  await getPool().query(
    `
      INSERT INTO invitations (referrer_code_id, invited_token, status, invited_email, completed_at)
      VALUES ($1, $2, 'completed', $3, NOW())
      ON CONFLICT (referrer_code_id, invited_token)
      DO UPDATE SET
        status = 'completed',
        invited_email = COALESCE(invitations.invited_email, EXCLUDED.invited_email),
        completed_at = invitations.completed_at
    `,
    [referrerCode.id, normalizedToken, normalizedEmail]
  );

  const progress = await getReferralProgress(normalizedCode);
  return progress ? { ...progress, selfReferral: false, counted: true } : null;
}

async function getReferralProgress(code) {
  const normalizedCode = normalizeReferralCode(code);
  const referrerCode = await findReferrerCode(normalizedCode);

  if (!referrerCode) {
    return null;
  }

  const result = await getPool().query(
    `
      SELECT COUNT(*)::int AS completed
      FROM invitations
      WHERE referrer_code_id = $1 AND status = 'completed'
    `,
    [referrerCode.id]
  );
  const invitationsResult = await getPool().query(
    `
      SELECT invited_email, completed_at
      FROM invitations
      WHERE referrer_code_id = $1 AND status = 'completed'
      ORDER BY completed_at DESC
      LIMIT 25
    `,
    [referrerCode.id]
  );

  const completed = Number(result.rows[0]?.completed || 0);

  return {
    code: referrerCode.code,
    completed,
    goal: REFERRAL_GOAL,
    invitations: invitationsResult.rows.map((row, index) => ({
      name: row.invited_email ? row.invited_email.split("@")[0] : `Invite ${index + 1}`,
      email: row.invited_email || "Email not captured",
      completedAt: row.completed_at,
    })),
  };
}

module.exports = {
  completeInvitation,
  getOrCreateReferrer,
  getReferralProgress,
  isPostgresConfigured,
  isValidEmail,
  isValidInviteToken,
  isValidReferralCode,
  normalizeEmail,
  normalizeInviteToken,
  normalizeReferralCode,
  parseRequestBody,
};

