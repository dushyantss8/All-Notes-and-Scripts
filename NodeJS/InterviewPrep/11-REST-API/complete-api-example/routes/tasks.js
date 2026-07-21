import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { createTask, listTasks } from '../controllers/tasks.js';
const router = Router();
router.use(requireAuth);
router.get('/', listTasks);
router.post('/', createTask);
export default router;
