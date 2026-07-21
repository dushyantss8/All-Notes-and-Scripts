const router = require("express").Router();
const Order = require("../models/order");
const { createOrderFromCart, OrderError } = require("../services/orderService");
const { authRequired } = require("../middleware/auth");

router.use(authRequired);

router.post("/", async (req, res, next) => {
  try {
    const idempotencyKey =
      req.get("idempotency-key") || req.body?.idempotencyKey || null;
    const { order, replayed } = await createOrderFromCart(req.user.id, idempotencyKey);
    res.status(replayed ? 200 : 201).json(order);
  } catch (error) {
    if (error instanceof OrderError) {
      return res.status(error.statusCode).json({
        title: error.message,
        status: error.statusCode,
        requestId: req.requestId,
      });
    }
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const rows = await Order.find({ userId: req.user.id })
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
