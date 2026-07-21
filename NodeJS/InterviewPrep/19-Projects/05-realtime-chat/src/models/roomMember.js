/**
 * Room membership sketch — enforce join/send only for members.
 * Seed rows in mongo shell for demos, or auto-upsert in join handler below.
 */
const { Schema, model } = require("mongoose");

const roomMemberSchema = new Schema(
  {
    roomId: { type: String, required: true, maxlength: 120 },
    userId: { type: Schema.Types.ObjectId, required: true },
    role: { type: String, enum: ["member", "admin"], default: "member" },
  },
  { timestamps: true, versionKey: false }
);

roomMemberSchema.index({ roomId: 1, userId: 1 }, { unique: true });

module.exports = model("RoomMember", roomMemberSchema);
