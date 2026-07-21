/**
 * Lightweight User stub for populate demos.
 * In a real system this lives in the auth service / shared package.
 */
const { Schema, model } = require("mongoose");

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true, versionKey: false }
);

module.exports = model("User", userSchema);
