const mongoose = require("mongoose");

const DEMO_USER_ID = "000000000000000000000001";

function authRequired(req, res, next) {
  const demoUser = req.get("x-demo-user");
  const header = req.get("authorization") || "";
  if (demoUser && mongoose.isValidObjectId(demoUser)) {
    req.user = { id: demoUser };
    return next();
  }
  if (header.toLowerCase().startsWith("bearer ")) {
    req.user = { id: DEMO_USER_ID };
    return next();
  }
  return res.status(401).json({ title: "Unauthorized", status: 401, requestId: req.requestId });
}

module.exports = { authRequired, DEMO_USER_ID };
