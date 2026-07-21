export function notFound(req, res) { res.status(404).json({ error: { code: 'NOT_FOUND', message: `No route for ${req.method} ${req.path}` } }); }
export function errorHandler(error, _req, res, _next) { console.error(error); res.status(500).json({ error: { code: 'INTERNAL_ERROR', message: 'Unexpected server error' } }); }
