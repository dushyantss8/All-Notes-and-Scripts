/**
 * Task model — owner-scoped work items with status, priority, and due dates.
 * Index { userId: 1, _id: -1 } supports cursor list for a single owner.
 */
const { Schema, model } = require("mongoose");

const STATUSES = ["todo", "in_progress", "done"];
const PRIORITIES = ["low", "medium", "high"];

const taskSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, default: "", maxlength: 5000 },
    status: { type: String, enum: STATUSES, default: "todo", index: true },
    priority: { type: String, enum: PRIORITIES, default: "medium" },
    dueDate: { type: Date, default: null },
    // Set from authenticated identity only — never from untrusted body.userId.
    userId: { type: Schema.Types.ObjectId, required: true, index: true },
  },
  { timestamps: true, versionKey: false }
);

taskSchema.index({ userId: 1, _id: -1 });
taskSchema.index({ userId: 1, status: 1, dueDate: 1 });

module.exports = model("Task", taskSchema);
module.exports.STATUSES = STATUSES;
module.exports.PRIORITIES = PRIORITIES;
