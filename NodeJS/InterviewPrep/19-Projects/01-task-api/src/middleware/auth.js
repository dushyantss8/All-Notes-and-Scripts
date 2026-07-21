/**
 * Auth middleware stub.
 * Production: verify JWT (or session), load user, attach { id, roles }.
 * Demo: accept Authorization Bearer <anything> with x-demo-user ObjectId,
 * or fall back to a fixed demo user for local smoke tests.
 */
const mongoose = require("mongoose");

const DEMO_USER_ID = "000000000000000000000001";

function authRequired(req, res, next) {
  const header = req.get("authorization") || "";
  const demoUser = req.get("x-demo-user");

  if (demoUser && mongoose.isValidObjectId(demoUser)) {
    req.user = { id: demoUser, roles: ["user"] };
    return next();
  }

  if (header.toLowerCase().startsWith("bearer ")) {
    // Stub: treat any Bearer token as authenticated demo user.
    // Replace with jwt.verify(token, process.env.JWT_ACCESS_SECRET).
    req.user = { id: DEMO_USER_ID, roles: ["user"] };
    return next();
  }

  return res.status(401).json({
    type: "about:blank",
    title: "Unauthorized",
    status: 401,
    detail: "Missing or invalid Authorization bearer token",
    requestId: req.requestId,
  });
}

module.exports = { authRequired, DEMO_USER_ID };
