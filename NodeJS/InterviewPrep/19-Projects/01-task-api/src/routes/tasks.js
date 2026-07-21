/**
 * Task CRUD routes — validated, owner-scoped, cursor-paginated.
 */
const router = require("express").Router();
const { z } = require("zod");
const mongoose = require("mongoose");
const Task = require("../models/task");
const { STATUSES, PRIORITIES } = Task;
const { authRequired } = require("../middleware/auth");

const createSchema = z.object({
  title: z.string().trim().min(1).max(200),
  description: z.string().max(5000).optional().default(""),
  status: z.enum(STATUSES).optional(),
  priority: z.enum(PRIORITIES).optional(),
  dueDate: z.coerce.date().nullable().optional(),
});

const updateSchema = createSchema.partial();

router.use(authRequired);

router.post("/", async (req, res, next) => {
  try {
    const input = createSchema.parse(req.body);
    const task = await Task.create({
      ...input,
      userId: req.user.id,
    });
    res.status(201).location(`/v1/tasks/${task.id}`).json(task);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const filter = { userId: req.user.id };

    if (req.query.status) {
      filter.status = z.enum(STATUSES).parse(req.query.status);
    }
    if (req.query.cursor && mongoose.isValidObjectId(req.query.cursor)) {
      filter._id = { $lt: req.query.cursor };
    }

    const rows = await Task.find(filter)
      .sort({ _id: -1 })
      .limit(limit)
      .lean();

    res.json({
      data: rows,
      nextCursor: rows.length === limit ? String(rows.at(-1)._id) : null,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ title: "Invalid id", status: 400 });
    }
    const task = await Task.findOne({
      _id: req.params.id,
      userId: req.user.id,
    }).lean();
    if (!task) return res.status(404).json({ title: "Not found", status: 404 });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ title: "Invalid id", status: 400 });
    }
    const input = updateSchema.parse(req.body);
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $set: input },
      { new: true, runValidators: true }
    );
    if (!task) return res.status(404).json({ title: "Not found", status: 404 });
    res.json(task);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ title: "Invalid id", status: 400 });
    }
    const deleted = await Task.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!deleted) return res.status(404).json({ title: "Not found", status: 404 });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
