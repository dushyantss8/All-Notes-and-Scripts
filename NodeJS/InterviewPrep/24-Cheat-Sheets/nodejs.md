# Nodejs Cheat Sheet

- Node excels at I/O; move CPU work to workers or queues.
- Set timeouts, validate config, and shut down on `SIGTERM`.
- Use `pipeline` for streams and respect backpressure.
- Bound retries and concurrency; do not log secrets.

**Production:** structured logs, request IDs, metrics, traces.
