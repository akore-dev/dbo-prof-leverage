const { Pool } = require("pg");
const { isPostgresConfigured } = require("./referralStore");

let pool;

function getPool() {
  if (!pool) {
    const url = process.env.DATABASE_URL || "";
    const sslMode = process.env.PGSSLMODE || "";
    const options = url ? { connectionString: url } : {
      host: process.env.PGHOST || process.env.DB_HOST,
      port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
      database: process.env.PGDATABASE || process.env.DB_DATABASE,
      user: process.env.PGUSER || process.env.DB_USERNAME,
      password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
    };
    if (sslMode === "disable") options.ssl = false;
    else if (sslMode === "require" || url.includes("sslmode=require")) options.ssl = { rejectUnauthorized: false };
    pool = new Pool(options);
  }
  return pool;
}

async function getAdminDashboard() {
  if (!isPostgresConfigured()) throw new Error("Postgres is not configured.");
  const [totalsResult, membersResult] = await Promise.all([
    getPool().query(`
      SELECT
        (SELECT COUNT(*)::int FROM invitations) AS total_invites,
        (SELECT COUNT(*)::int FROM invitations WHERE status = 'completed') AS total_accepted,
        (SELECT COUNT(*)::int FROM users) AS total_participants
    `),
    getPool().query(`
      SELECT users.email, referrer_codes.code AS referral_code,
        COUNT(invitations.id)::int AS invitees,
        COUNT(invitations.id) FILTER (WHERE invitations.status = 'completed')::int AS accepted_invitees
      FROM users
      LEFT JOIN referrer_codes ON referrer_codes.user_id = users.id
      LEFT JOIN invitations ON invitations.referrer_code_id = referrer_codes.id
      GROUP BY users.id, users.email, users.created_at, referrer_codes.code
      ORDER BY accepted_invitees DESC, invitees DESC, users.created_at DESC
    `),
  ]);
  const totals = totalsResult.rows[0] || {};
  return {
    totals: {
      invites: Number(totals.total_invites || 0),
      accepted: Number(totals.total_accepted || 0),
      participants: Number(totals.total_participants || 0),
    },
    members: membersResult.rows.map((row) => ({
      email: row.email,
      referralCode: row.referral_code || "—",
      invitees: Number(row.invitees || 0),
      acceptedInvitees: Number(row.accepted_invitees || 0),
    })),
  };
}

module.exports = { getAdminDashboard };
