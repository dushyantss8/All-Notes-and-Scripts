import express from 'express';
import session from 'express-session';
const app = express();
app.use(session({ secret: process.env.SESSION_SECRET || 'development-only', resave: false, saveUninitialized: false, cookie: { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 1_800_000 } }));
app.post('/login', (_req, res) => { res.req.session.regenerate(() => { res.req.session.userId = 'user_42'; res.sendStatus(204); }); });
export default app;
