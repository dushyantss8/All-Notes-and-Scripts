/**
 * Chat message — immutable-ish body stored per room.
 */
const { Schema, model } = require("mongoose");

const messageSchema = new Schema(
  {
    roomId: { type: String, required: true, index: true, maxlength: 120 },
    senderId: { type: Schema.Types.ObjectId, required: true, index: true },
    body: { type: String, required: true, trim: true, maxlength: 4000 },
  },
  { timestamps: { createdAt: true, updatedAt: false }, versionKey: false }
);

// Room history: newest-first cursor on _id within a room.
messageSchema.index({ roomId: 1, _id: -1 });

module.exports = model("Message", messageSchema);
