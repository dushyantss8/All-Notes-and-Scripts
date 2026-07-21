/**
 * Post routes — slug generation, soft delete, public vs owner visibility.
 */
const router = require("express").Router();
const { z } = require("zod");
const mongoose = require("mongoose");
const Post = require("../models/post");
const { slugify, slugWithSuffix } = require("../utils/slugify");
const { authRequired, authOptional } = require("../middleware/auth");

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  body: z.string().min(1).max(100_000),
  tags: z.array(z.string().trim().max(40)).max(20).optional().default([]),
  publish: z.boolean().optional().default(false),
});

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(),
  body: z.string().min(1).max(100_000).optional(),
  tags: z.array(z.string().trim().max(40)).max(20).optional(),
  publish: z.boolean().optional(),
});

async function uniqueSlug(title) {
  const base = slugify(title);
  for (let n = 0; n < 20; n += 1) {
    const candidate = slugWithSuffix(base, n);
    // eslint-disable-next-line no-await-in-loop
    const exists = await Post.exists({ slug: candidate });
    if (!exists) return candidate;
  }
  return `${base}-${Date.now()}`;
}

router.post("/", authRequired, async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const slug = await uniqueSlug(input.title);
    const post = await Post.create({
      title: input.title,
      body: input.body,
      tags: input.tags,
      slug,
      authorId: req.user.id,
      publishedAt: input.publish ? new Date() : null,
    });
    res.status(201).location(`/v1/posts/${post.slug}`).json(post);
  } catch (error) {
    next(error);
  }
});

router.get("/", authOptional, async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const filter = { deletedAt: null };

    if (req.query.mine === "1" && req.user) {
      filter.authorId = req.user.id;
    } else {
      filter.publishedAt = { $ne: null, $lte: new Date() };
    }
    if (req.query.tag) {
      filter.tags = String(req.query.tag).toLowerCase();
    }

    const rows = await Post.find(filter)
      .sort({ publishedAt: -1, _id: -1 })
      .limit(limit)
      .populate("authorId", "name email")
      .lean();

    res.json({ data: rows });
  } catch (error) {
    next(error);
  }
});

router.get("/:idOrSlug", authOptional, async (req, res, next) => {
  try {
    const key = req.params.idOrSlug;
    const filter = mongoose.isValidObjectId(key)
      ? { _id: key, deletedAt: null }
      : { slug: key, deletedAt: null };

    const post = await Post.findOne(filter)
      .populate("authorId", "name email")
      .lean();

    if (!post) return res.status(404).json({ title: "Not found", status: 404 });

    const isOwner = req.user && String(post.authorId?._id || post.authorId) === String(req.user.id);
    const isPublic = post.publishedAt && post.publishedAt <= new Date();
    if (!isPublic && !isOwner) {
      return res.status(404).json({ title: "Not found", status: 404 });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", authRequired, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ title: "Invalid id", status: 400 });
    }
    const input = updateSchema.parse(req.body);
    const $set = {};
    if (input.title !== undefined) $set.title = input.title;
    if (input.body !== undefined) $set.body = input.body;
    if (input.tags !== undefined) $set.tags = input.tags;
    if (input.publish === true) $set.publishedAt = new Date();
    if (input.publish === false) $set.publishedAt = null;

    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, authorId: req.user.id, deletedAt: null },
      { $set },
      { new: true, runValidators: true }
    );
    if (!post) return res.status(404).json({ title: "Not found", status: 404 });
    res.json(post);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", authRequired, async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ title: "Invalid id", status: 400 });
    }
    const post = await Post.findOneAndUpdate(
      { _id: req.params.id, authorId: req.user.id, deletedAt: null },
      { $set: { deletedAt: new Date() } },
      { new: true }
    );
    if (!post) return res.status(404).json({ title: "Not found", status: 404 });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
