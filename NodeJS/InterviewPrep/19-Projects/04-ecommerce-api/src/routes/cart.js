const router = require("express").Router();
const { z } = require("zod");
const mongoose = require("mongoose");
const Cart = require("../models/cart");
const Product = require("../models/product");
const { authRequired } = require("../middleware/auth");

const upsertSchema = z.object({
  productId: z.string().refine((id) => mongoose.isValidObjectId(id)),
  qty: z.number().int().min(1).max(99),
});

router.use(authRequired);

router.get("/", async (req, res, next) => {
  try {
    const cart =
      (await Cart.findOne({ userId: req.user.id }).populate("items.productId").lean()) ||
      { userId: req.user.id, items: [] };
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

router.put("/items", async (req, res, next) => {
  try {
    const input = upsertSchema.parse(req.body);
    const product = await Product.findOne({ _id: input.productId, active: true });
    if (!product) return res.status(404).json({ title: "Product not found", status: 404 });
    if (product.stock < input.qty) {
      return res.status(409).json({ title: "Insufficient stock", status: 409 });
    }

    let cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) cart = new Cart({ userId: req.user.id, items: [] });

    const idx = cart.items.findIndex(
      (i) => String(i.productId) === String(input.productId)
    );
    if (idx >= 0) cart.items[idx].qty = input.qty;
    else cart.items.push({ productId: input.productId, qty: input.qty });

    await cart.save();
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

router.delete("/items/:productId", async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.id });
    if (!cart) return res.status(204).send();
    cart.items = cart.items.filter(
      (i) => String(i.productId) !== String(req.params.productId)
    );
    await cart.save();
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
