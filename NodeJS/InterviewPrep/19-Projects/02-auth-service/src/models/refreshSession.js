/**
 * Refresh session — stores only a hash of the refresh token.
 * On logout set revokedAt; on rotation mark old session revoked and insert new.
 */
const { Schema, model } = require("mongoose");

const refreshSessionSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    expiresAt: { type: Date, required: true, index: true },
    revokedAt: { type: Date, default: null },
    userAgent: { type: String, default: "" },
    ip: { type: String, default: "" },
  },
  { timestamps: true, versionKey: false }
);

// TTL-style cleanup can use a TTL index on expiresAt in production:
// refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = model("RefreshSession", refreshSessionSchema);
