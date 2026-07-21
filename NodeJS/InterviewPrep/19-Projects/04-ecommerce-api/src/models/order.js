const { Schema, model } = require("mongoose");

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, required: true },
    sku: String,
    name: String,
    qty: { type: Number, required: true, min: 1 },
    unitPriceCents: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
    items: { type: [orderItemSchema], required: true },
    totalCents: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending_payment", "paid", "cancelled", "fulfilled"],
      default: "pending_payment",
    },
    // Unique with userId so the same key can be reused across users safely.
    idempotencyKey: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

orderSchema.index({ userId: 1, idempotencyKey: 1 }, { unique: true });
orderSchema.index({ userId: 1, _id: -1 });

module.exports = model("Order", orderSchema);
