import express from 'express';
import tasksRouter from './routes/tasks.js';
import { errorHandler, notFound } from './middleware/errors.js';
const app = express();
app.use(express.json({ limit: '100kb' }));
app.use('/api/tasks', tasksRouter);
app.use(notFound);
app.use(errorHandler);
export default app;
