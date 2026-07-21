# Clustering and Worker Threads

Cluster uses processes; worker threads run JS in separate threads and fit CPU-bound work.

## What to know

- **Choice:** Use workers for isolated CPU jobs and queues/processes for distribution/resilience.
- **Safety:** Bound work, handle failures, and do not casually share mutable state.

## Interview answer framework

State the problem first, identify the trust or responsibility boundary, explain the implementation choice, and finish with a trade-off or failure mode. Server-side validation and authorization are mandatory even when a client also performs checks.

## Run the example

```bash
node example.js
```

Examples show the essential control-flow shape. Install the named dependencies, validate configuration at startup, and use real secrets only through a secret manager or environment.

## Questions to rehearse

1. What threat, failure, or scaling problem does this solve?
2. Which input or dependency is untrusted, and where is it constrained?
3. What metric, test, or log would prove it works in production?
