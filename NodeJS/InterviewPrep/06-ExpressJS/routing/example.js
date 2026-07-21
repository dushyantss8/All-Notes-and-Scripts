import express from "express";
const app = express();
app.use(express.json({ limit: "100kb" }));

app.get("/api/v1/widgets/:id", async (req, res, next) => {
  try {
    const widget = await loadWidget(req.params.id); // service owns persistence
    if (!widget) return res.status(404).json({ error: { code: "NOT_FOUND" } });
    res.json({ data: widget });
  } catch (error) { next(error); }
});

app.use((error, req, res, next) => {
  if (res.headersSent) return next(error);
  console.error({ error, requestId: req.id }); // redact sensitive fields in real logger
  res.status(error.statusCode || 500).json({ error: { code: "INTERNAL_ERROR" } });
});
