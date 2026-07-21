import jwt from 'jsonwebtoken';
export function requireAuth(req, res, next) {
  const [, token] = req.get('authorization')?.match(/^Bearer (.+)$/) || [];
  if (!token) return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'mini-api', audience: 'mini-api-client' }); return next(); }
  catch { return res.status(401).json({ error: { code: 'UNAUTHENTICATED', message: 'Authentication required' } }); }
}
