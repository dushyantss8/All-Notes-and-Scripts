const router = require("express").Router();
const { z } = require("zod");
const Product = require("../models/product");
const { authRequired } = require("../middleware/auth");

const createSchema = z.object({
  name: z.string().trim().min(1).max(200),
  sku: z.string().trim().min(1).max(64),
  priceCents: z.number().int().min(0),
  stock: z.number().int().min(0).default(0),
});

router.post("/", authRequired, async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const product = await Product.create(input);
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const rows = await Product.find({ active: true })
      .sort({ _id: -1 })
      .limit(limit)
      .lean();
    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
