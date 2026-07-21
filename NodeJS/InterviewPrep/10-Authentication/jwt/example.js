import jwt from 'jsonwebtoken';
const secret = process.env.JWT_SECRET || 'development-only-secret-change-me';
const token = jwt.sign({ sub: 'user_42', role: 'member' }, secret, { algorithm: 'HS256', issuer: 'tasks-api', audience: 'tasks-web', expiresIn: '15m' });
const claims = jwt.verify(token, secret, { algorithms: ['HS256'], issuer: 'tasks-api', audience: 'tasks-web' });
console.log({ subject: claims.sub, expiresAt: new Date(claims.exp * 1000).toISOString() });
