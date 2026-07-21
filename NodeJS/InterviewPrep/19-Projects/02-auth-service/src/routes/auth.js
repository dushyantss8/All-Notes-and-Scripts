/**
 * Auth routes — register, login, refresh rotation, logout/revoke.
 */
const router = require("express").Router();
const { z } = require("zod");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const RefreshSession = require("../models/refreshSession");
const {
  hashToken,
  issueAccessToken,
  issueRefreshToken,
  refreshTtlDate,
} = require("../services/tokens");

const credentialsSchema = z.object({
  email: z.string().email().max(320),
  password: z.string().min(8).max(128),
  name: z.string().trim().min(1).max(120).optional(),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(20),
});

async function attachSession(user, req) {
  const { accessToken, expiresIn } = issueAccessToken(user);
  const { refreshToken, tokenHash } = issueRefreshToken();
  await RefreshSession.create({
    userId: user.id,
    tokenHash,
    expiresAt: refreshTtlDate(),
    userAgent: req.get("user-agent") || "",
    ip: req.ip || "",
  });
  return {
    user: user.toSafeJSON ? user.toSafeJSON() : user,
    accessToken,
    refreshToken,
    tokenType: "Bearer",
    expiresIn,
  };
}

router.post("/register", async (req, res, next) => {
  try {
    const input = credentialsSchema.parse(req.body);
    if (!input.name) {
      return res.status(400).json({ title: "name is required on register", status: 400 });
    }
    const existing = await User.findOne({ email: input.email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ title: "Email already registered", status: 409 });
    }
    const rounds = Number(process.env.BCRYPT_ROUNDS || 12);
    const passwordHash = await bcrypt.hash(input.password, rounds);
    const user = await User.create({
      email: input.email,
      name: input.name,
      passwordHash,
    });
    const payload = await attachSession(user, req);
    res.status(201).json(payload);
  } catch (error) {
    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const input = credentialsSchema.omit({ name: true }).parse(req.body);
    const user = await User.findOne({ email: input.email.toLowerCase() }).select(
      "+passwordHash"
    );
    if (!user) {
      // Same message as bad password to reduce user enumeration.
      return res.status(401).json({ title: "Invalid credentials", status: 401 });
    }
    const ok = await bcrypt.compare(input.password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ title: "Invalid credentials", status: 401 });
    }
    const payload = await attachSession(user, req);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.post("/refresh", async (req, res, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokenHash = hashToken(refreshToken);
    const session = await RefreshSession.findOne({ tokenHash });
    if (!session || session.revokedAt || session.expiresAt < new Date()) {
      // Reuse of a revoked token → possible theft; revoke all user sessions in production.
      return res.status(401).json({ title: "Invalid refresh token", status: 401 });
    }

    session.revokedAt = new Date();
    await session.save();

    const user = await User.findById(session.userId);
    if (!user) {
      return res.status(401).json({ title: "Invalid refresh token", status: 401 });
    }

    const payload = await attachSession(user, req);
    res.json(payload);
  } catch (error) {
    next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = refreshSchema.parse(req.body);
    const tokenHash = hashToken(refreshToken);
    await RefreshSession.findOneAndUpdate(
      { tokenHash, revokedAt: null },
      { $set: { revokedAt: new Date() } }
    );
    // Access JWT remains valid until expiry unless you maintain a denylist.
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
