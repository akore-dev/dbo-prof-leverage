const fs = require("fs");
const http = require("http");
const path = require("path");
const { URL } = require("url");

loadEnvFile(path.join(__dirname, ".env"));
loadEnvFile(path.join(__dirname, ".env.admin"));

const handlers = [
  ["/api/admin/login", require("./api/admin-login")],
  ["/api/admin/logout", require("./api/admin-logout")],
  ["/api/admin/dashboard", require("./api/admin-dashboard")],
  ["/api/interpret", require("./api/interpret")],
  ["/api/referrer-link", require("./api/referrer")],
  ["/api/referral-complete", require("./api/referral-complete")],
  ["/api/referral-progress", require("./api/referral-progress")],
];

const PORT = Number(process.env.PORT || 8080);
const HOST = process.env.HOST || "0.0.0.0";
const BUILD_DIR = path.join(__dirname, "build");

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  fs.readFileSync(filePath, "utf8").split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const equalsIndex = trimmed.indexOf("=");
    if (equalsIndex === -1) return;
    const key = trimmed.slice(0, equalsIndex).trim();
    const value = trimmed.slice(equalsIndex + 1).trim();
    if (key && process.env[key] === undefined) process.env[key] = value.replace(/^["']|["']$/g, "");
  });
}

function sendJson(res, statusCode, body) {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

function getContentType(filePath) {
  return {
    ".css": "text/css", ".html": "text/html", ".ico": "image/x-icon",
    ".jpeg": "image/jpeg", ".jpg": "image/jpeg", ".js": "text/javascript",
    ".json": "application/json", ".map": "application/json", ".png": "image/png",
    ".svg": "image/svg+xml", ".txt": "text/plain",
  }[path.extname(filePath).toLowerCase()] || "application/octet-stream";
}

function sendFile(res, filePath) {
  fs.readFile(filePath, (error, content) => {
    if (error) return sendJson(res, 404, { error: "Not found" });
    res.writeHead(200, { "Content-Type": getContentType(filePath) });
    res.end(content);
  });
}

function createApiResponse(res) {
  return {
    setHeader(name, value) { res.setHeader(name, value); return this; },
    status(statusCode) { res.statusCode = statusCode; return this; },
    json(body) { sendJson(res, res.statusCode || 200, body); },
  };
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let rawBody = "";
    req.on("data", (chunk) => {
      rawBody += chunk;
      if (rawBody.length > 100000) reject(new Error("Request body too large"));
    });
    req.on("end", () => {
      if (!rawBody) return resolve({});
      try { resolve(JSON.parse(rawBody)); } catch (error) { reject(error); }
    });
    req.on("error", reject);
  });
}

async function handleApiRequest(req, res, handler) {
  try {
    req.body = await readJsonBody(req);
    await handler(req, createApiResponse(res));
  } catch {
    if (!res.headersSent) sendJson(res, 400, { error: "Invalid JSON body" });
  }
}

function handleStaticRequest(req, res) {
  if (!fs.existsSync(BUILD_DIR)) return sendJson(res, 500, { error: "Build folder not found. Run npm run build first." });
  const requestUrl = new URL(req.url, `http://${req.headers.host}`);
  const safePath = path.normalize(decodeURIComponent(requestUrl.pathname)).replace(/^(\.\.[/\\])+/, "");
  const requestedPath = path.join(BUILD_DIR, safePath);
  if (requestedPath.startsWith(BUILD_DIR) && fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
    return sendFile(res, requestedPath);
  }
  const routeIndexPath = requestUrl.pathname.startsWith("/s/")
    ? path.join(BUILD_DIR, "s", "index.html")
    : path.join(requestedPath, "index.html");
  if (routeIndexPath.startsWith(BUILD_DIR) && fs.existsSync(routeIndexPath)) return sendFile(res, routeIndexPath);
  sendFile(res, path.join(BUILD_DIR, "index.html"));
}

const server = http.createServer((req, res) => {
  const match = handlers.find(([route]) => req.url.startsWith(route));
  if (match) return handleApiRequest(req, res, match[1]);
  handleStaticRequest(req, res);
});

server.listen(PORT, HOST, () => {
  console.log(`App and API running together at http://${HOST}:${PORT}`);
});
