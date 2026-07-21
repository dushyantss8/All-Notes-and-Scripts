// Pagination and Filtering: compact runnable starting point
import express from 'express';
const app = express();
app.use(express.json());
app.get('/health', (_req, res) => res.json({ status: 'ok', topic: 'pagination-filtering' }));
if (process.argv[1] === new URL(import.meta.url).pathname) console.log('Read README.md before adapting this example.');
export default app;
