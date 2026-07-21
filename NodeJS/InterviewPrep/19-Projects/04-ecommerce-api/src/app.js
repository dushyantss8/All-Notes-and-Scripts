const express = require("express");
const helmet = require("helmet");
const pinoHttp = require("pino-http");
const { randomUUID } = require("crypto");
const { ZodError } = require("zod");

const app = express();
app.use(helmet());
app.use(express.json({ limit: "100kb" }));
app.use((req, res, next) => {
  req.requestId = req.get("x-request-id") || randomUUID();
  res.set("x-request-id", req.requestId);
  next();
});
app.use(pinoHttp());

app.get("/health", (_req, res) => res.json({ ok: true, service: "ecommerce-api" }));
app.use("/v1/products", require("./routes/products"));
app.use("/v1/cart", require("./routes/cart"));
app.use("/v1/orders", require("./routes/orders"));

app.use((err, req, res, _next) => {
  if (err instanceof ZodError) {
    return res.status(400).json({
      type: "about:blank",
      title: "Validation Error",
      status: 400,
      errors: err.flatten(),
      requestId: req.requestId,
    });
  }
  req.log?.error(err);
  res.status(err.statusCode || 500).json({
    type: "about:blank",
    title: err.statusCode ? err.message : "Internal Server Error",
    status: err.statusCode || 500,
    requestId: req.requestId,
  });
});

module.exports = app;
