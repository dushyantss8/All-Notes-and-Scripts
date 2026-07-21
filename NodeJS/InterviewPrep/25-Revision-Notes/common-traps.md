# Common Traps

- Claiming Node is single-threaded without discussing workers/libuv.
- Retrying non-idempotent writes blindly.
- Using offset pagination for deep mutable datasets.
- Treating `401` and `403` as identical.
- Adding indexes without checking write cost or query plans.
- Logging credentials or PII.
- Forgetting timeouts, cancellation, and graceful shutdown.
