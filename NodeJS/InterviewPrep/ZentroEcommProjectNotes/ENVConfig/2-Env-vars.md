# DB vars in .env config

These tune **Sequelize** (your ORM) for MySQL. They’re read in `backend/src/config/index.js` and also in `sequelize.cjs` for migrations/CLI.

| Variable | Your value | Meaning |
|---|---|---|
| `DB_DIALECT` | `mysql` | Which DB engine Sequelize talks to (`mysql`, `postgres`, `sqlite`, etc.). |
| `DB_LOGGING` | `false` | Whether Sequelize prints every SQL query to the console. Off = quieter logs; set `true` when debugging queries. |
| `DB_POOL_MAX` | `10` | Max open DB connections at once. |
| `DB_POOL_MIN` | `0` | Min connections kept alive (0 = don’t keep idle ones when unused). |
| `DB_POOL_ACQUIRE` | `30000` | Max ms to wait for a free connection before failing (30s). |
| `DB_POOL_IDLE` | `10000` | Max ms a connection can sit unused before being closed (10s). |

**Why they’re here:** connection details (`DB_HOST`, etc.) tell Sequelize *where* the DB is; these tell it *how* to talk to it and manage the connection pool so the app doesn’t open/close a new connection on every request.

# JWT vars in .env config

These configure **JWT auth** (signing secrets, token lifetimes, cookie flags). They’re loaded in `backend/src/config/index.js` and used in `backend/src/utils/jwt.js` / `auth.service.js`.

| Variable | Your value | Meaning |
|---|---|---|
| `JWT_ACCESS_SECRET` | `example-access-secret` | Secret key used to sign/verify **access tokens** (short-lived API auth). |
| `JWT_REFRESH_SECRET` | `example-refresh-secret` | Separate secret for **refresh tokens**, so a leaked access secret doesn’t also forge refresh tokens. |
| `JWT_ACCESS_EXPIRES_IN` | `60m` | How long an access token is valid (`60m` = 1 hour). |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Refresh token lifetime when “remember me” is off (7 days). |
| `JWT_REMEMBER_ME_EXPIRES_IN` | `30d` | Refresh token lifetime when “remember me” is on (30 days). |
| `JWT_COOKIE_SECURE` | `false` | If `true`, auth cookies are only sent over HTTPS. `false` is fine for local HTTP; use `true` in production. |

# Rate limiting config

These configure **API rate limiting** via `express-rate-limit` (`backend/src/middlewares/rateLimit.middleware.js`).

| Variable | Your value | Meaning |
|---|---|---|
| `RATE_LIMIT_WINDOW_MS` | `900000` | Time window for counting requests, in ms (`900000` = 15 minutes). |
| `RATE_LIMIT_MAX` | `100` | Max requests per IP in that window for general API traffic (`globalRateLimiter`). |
| `AUTH_RATE_LIMIT_MAX` | `20` | Stricter max for auth/sensitive routes (`authRateLimiter`) — e.g. login — to slow brute-force attempts. |

So: within each 15 minutes, a client can make up to **100** normal API calls, but only **20** on auth endpoints.
