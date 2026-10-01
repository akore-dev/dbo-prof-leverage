const crypto = require("crypto");

const COOKIE_NAME = "pl_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function config() {
  return {
    username: process.env.ADMIN_USERNAME || "",
    password: process.env.ADMIN_PASSWORD || "",
    secret: process.env.ADMIN_SESSION_SECRET || "",
  };
}

function safeEqual(left, right) {
  const a = Buffer.from(String(left));
  const b = Buffer.from(String(right));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function isConfigured() {
  const value = config();
  return Boolean(value.username && value.password && value.secret.length >= 32);
}

function verifyCredentials(username, password) {
  const value = config();
  return isConfigured() && safeEqual(username, value.username) && safeEqual(password, value.password);
}

function sign(value) {
  return crypto.createHmac("sha256", config().secret).update(value).digest("base64url");
}

function createSessionToken() {
  const payload = Buffer.from(JSON.stringify({
    sub: config().username,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

function parseCookies(header = "") {
  return header.split(";").reduce((cookies, pair) => {
    const separator = pair.indexOf("=");
    if (separator >= 0) cookies[pair.slice(0, separator).trim()] = decodeURIComponent(pair.slice(separator + 1).trim());
    return cookies;
  }, {});
}

function hasValidSession(req) {
  if (!isConfigured()) return false;
  const token = parseCookies(req.headers.cookie)[COOKIE_NAME];
  if (!token) return false;
  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra || !safeEqual(signature, sign(payload))) return false;
  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return session.sub === config().username && Number(session.exp) > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}

function sessionCookie(token, req, maxAge = SESSION_TTL_SECONDS) {
  const protocol = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const secure = protocol === "https" || process.env.NODE_ENV === "production";
  return `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}

module.exports = { createSessionToken, hasValidSession, isConfigured, sessionCookie, verifyCredentials };
