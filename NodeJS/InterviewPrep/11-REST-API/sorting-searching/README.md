# Sorting and Searching

Treat query strings as a small allow-listed query language, never as direct database commands.

## What to know

- **Sorting:** Map known fields and `asc`/`desc` only; add `_id` as deterministic tiebreaker.
- **Search:** Use text indexes or Atlas Search; unbounded regex can be expensive and poorly indexed.
- **Safety:** Validate all query values and do not forward arbitrary request objects to MongoDB.

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
