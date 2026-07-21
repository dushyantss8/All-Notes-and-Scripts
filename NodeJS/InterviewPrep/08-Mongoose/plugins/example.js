import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  name: { type: String, required: true, minlength: 2 },
}, { timestamps: true });

// Document hooks are explicit about changed fields.
userSchema.pre("save", function () {
  if (this.isModified("email")) this.email = this.email.toLowerCase();
});

export const User = mongoose.model("User", userSchema);
// For updates, request validation explicitly:
// await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
