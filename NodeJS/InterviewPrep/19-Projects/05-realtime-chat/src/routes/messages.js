/**
 * REST message history for reconnect / initial load.
 */
const router = require("express").Router({ mergeParams: true });
const mongoose = require("mongoose");
const Message = require("../models/message");
const RoomMember = require("../models/roomMember");
const { authRequired } = require("../middleware/auth");

router.get("/", authRequired, async (req, res, next) => {
  try {
    const { roomId } = req.params;
    const member = await RoomMember.findOne({ roomId, userId: req.user.id });
    if (!member) {
      // Auto-join sketch for demos — remove in production.
      await RoomMember.create({ roomId, userId: req.user.id });
    }

    const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100);
    const filter = { roomId };
    if (req.query.cursor && mongoose.isValidObjectId(req.query.cursor)) {
      filter._id = { $lt: req.query.cursor };
    }

    const rows = await Message.find(filter).sort({ _id: -1 }).limit(limit).lean();
    res.json({
      data: rows,
      nextCursor: rows.length === limit ? String(rows.at(-1)._id) : null,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
