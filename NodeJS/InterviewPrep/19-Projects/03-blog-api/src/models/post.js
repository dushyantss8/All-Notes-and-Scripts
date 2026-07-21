/**
 * Post model — slug, tags, publish + soft delete.
 */
const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    body: { type: String, required: true, maxlength: 100_000 },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tags: {
      type: [{ type: String, trim: true, lowercase: true, maxlength: 40 }],
      default: [],
      validate: [(v) => v.length <= 20, "Too many tags"],
    },
    publishedAt: { type: Date, default: null, index: true },
    deletedAt: { type: Date, default: null, index: true },
  },
  { timestamps: true, versionKey: false }
);

postSchema.index({ tags: 1, publishedAt: -1 });
postSchema.index({ authorId: 1, _id: -1 });

// Default query helper: callers still must opt into including deleted.
postSchema.query.notDeleted = function notDeleted() {
  return this.where({ deletedAt: null });
};

module.exports = model("Post", postSchema);
