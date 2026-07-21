/**
 * Token helpers — access JWT + opaque refresh (hashed at rest).
 * Production: move secrets to a vault; consider asymmetric signing (RS256).
 */
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

function hashToken(raw) {
  return crypto.createHash("sha256").update(raw).digest("hex");
}

function issueAccessToken(user) {
  const secret = process.env.JWT_ACCESS_SECRET || "dev-only-change-me";
  const expiresIn = process.env.JWT_ACCESS_TTL || "15m";
  const accessToken = jwt.sign(
    { sub: user.id, email: user.email, roles: user.roles },
    secret,
    { expiresIn }
  );
  return { accessToken, expiresIn };
}

function issueRefreshToken() {
  // Opaque random token — client stores it; DB stores hash only.
  const refreshToken = crypto.randomBytes(48).toString("base64url");
  return { refreshToken, tokenHash: hashToken(refreshToken) };
}

function refreshTtlDate() {
  const days = Number(process.env.REFRESH_TTL_DAYS || 7);
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

/**
 * Optional access-token denylist sketch (Redis in production):
 *   await redis.set(`bl:access:${jti}`, "1", "EX", remainingTtlSeconds);
 * Prefer short-lived access tokens so denylist stays small.
 */
function verifyAccessToken(token) {
  const secret = process.env.JWT_ACCESS_SECRET || "dev-only-change-me";
  return jwt.verify(token, secret);
}

module.exports = {
  hashToken,
  issueAccessToken,
  issueRefreshToken,
  refreshTtlDate,
  verifyAccessToken,
};
