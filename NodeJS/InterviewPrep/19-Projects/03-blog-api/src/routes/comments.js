/**
 * Comment routes nested under posts.
 */
const router = require("express").Router({ mergeParams: true });
const { z } = require("zod");
const mongoose = require("mongoose");
const Post = require("../models/post");
const Comment = require("../models/comment");
const { authRequired } = require("../middleware/auth");

const createSchema = z.object({
  body: z.string().trim().min(1).max(5000),
});

router.post("/", authRequired, async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ title: "Invalid post id", status: 400 });
    }
    const post = await Post.findOne({
      _id: postId,
      deletedAt: null,
      publishedAt: { $ne: null },
    });
    if (!post) return res.status(404).json({ title: "Post not found", status: 404 });

    const input = createSchema.parse(req.body);
    const comment = await Comment.create({
      postId,
      authorId: req.user.id,
      body: input.body,
    });
    res.status(201).json(comment);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const { postId } = req.params;
    if (!mongoose.isValidObjectId(postId)) {
      return res.status(400).json({ title: "Invalid post id", status: 400 });
    }
    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const rows = await Comment.find({ postId, deletedAt: null })
      .sort({ _id: -1 })
      .limit(limit)
      .populate("authorId", "name email")
      .lean();
    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
