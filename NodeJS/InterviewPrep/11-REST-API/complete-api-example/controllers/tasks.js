import crypto from 'node:crypto';
const tasks = [];
export function listTasks(req, res) {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
  res.json({ data: tasks.filter(task => task.ownerId === req.user.sub).slice(0, limit), meta: { limit } });
}
export function createTask(req, res) {
  if (typeof req.body.title !== 'string' || !req.body.title.trim()) return res.status(422).json({ error: { code: 'VALIDATION_FAILED', message: 'title is required' } });
  const task = { id: crypto.randomUUID(), ownerId: req.user.sub, title: req.body.title.trim() };
  tasks.push(task);
  return res.status(201).location(`/api/tasks/${task.id}`).json({ data: task });
}
