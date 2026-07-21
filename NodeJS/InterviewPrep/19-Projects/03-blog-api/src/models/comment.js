/**
 * Comment model — belongs to a post; soft-deletable.
 */
const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    body: { type: String, required: true, trim: true, maxlength: 5000 },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true, versionKey: false }
);

commentSchema.index({ postId: 1, _id: -1 });

module.exports = model("Comment", commentSchema);
