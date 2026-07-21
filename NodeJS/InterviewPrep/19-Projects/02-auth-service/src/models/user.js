/**
 * User model — credentials and roles. Password never returned by default.
 */
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 320,
    },
    passwordHash: { type: String, required: true, select: false },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    roles: { type: [String], default: ["user"] },
  },
  { timestamps: true, versionKey: false }
);

userSchema.methods.toSafeJSON = function toSafeJSON() {
  return {
    id: this.id,
    email: this.email,
    name: this.name,
    roles: this.roles,
    createdAt: this.createdAt,
  };
};

module.exports = model("User", userSchema);
