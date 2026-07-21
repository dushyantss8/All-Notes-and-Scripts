const { Schema, model } = require("mongoose");

const cartItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    qty: { type: Number, required: true, min: 1, max: 99 },
  },
  { _id: false }
);

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, unique: true },
    items: { type: [cartItemSchema], default: [] },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("Cart", cartSchema);
