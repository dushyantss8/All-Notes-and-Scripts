/**
 * Order create flow — stock check, transactional decrement, price snapshot.
 * Requires a replica set for multi-document transactions.
 */
const mongoose = require("mongoose");
const Product = require("../models/product");
const Cart = require("../models/cart");
const Order = require("../models/order");

class OrderError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

async function createOrderFromCart(userId, idempotencyKey) {
  if (!idempotencyKey) {
    throw new OrderError(400, "Idempotency-Key header is required");
  }

  const existing = await Order.findOne({ userId, idempotencyKey }).lean();
  if (existing) return { order: existing, replayed: true };

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0) {
      throw new OrderError(400, "Cart is empty");
    }

    const lineSnapshots = [];
    let totalCents = 0;

    for (const line of cart.items) {
      const product = await Product.findOne({
        _id: line.productId,
        active: true,
      }).session(session);

      if (!product) {
        throw new OrderError(400, `Product ${line.productId} unavailable`);
      }
      if (product.stock < line.qty) {
        throw new OrderError(
          409,
          `Insufficient stock for SKU ${product.sku} (have ${product.stock}, need ${line.qty})`
        );
      }

      // Atomic conditional decrement — aborts if concurrent checkout wins the race.
      const updated = await Product.findOneAndUpdate(
        { _id: product._id, stock: { $gte: line.qty } },
        { $inc: { stock: -line.qty } },
        { new: true, session }
      );
      if (!updated) {
        throw new OrderError(409, `Stock race for SKU ${product.sku}`);
      }

      const unitPriceCents = product.priceCents;
      totalCents += unitPriceCents * line.qty;
      lineSnapshots.push({
        productId: product._id,
        sku: product.sku,
        name: product.name,
        qty: line.qty,
        unitPriceCents,
      });
    }

    const [order] = await Order.create(
      [
        {
          userId,
          items: lineSnapshots,
          totalCents,
          status: "pending_payment",
          idempotencyKey,
        },
      ],
      { session }
    );

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    return { order, replayed: false };
  } catch (error) {
    await session.abortTransaction();
    // Duplicate idempotency under concurrency → return original.
    if (error?.code === 11000) {
      const order = await Order.findOne({ userId, idempotencyKey }).lean();
      if (order) return { order, replayed: true };
    }
    throw error;
  } finally {
    session.endSession();
  }
}

module.exports = { createOrderFromCart, OrderError };
