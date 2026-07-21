# Password Hashing with bcrypt

Passwords need a slow, salted, one-way password hash—not encryption and not a fast digest. bcrypt is common; Argon2id is often preferred for new deployments.

## What to know

- **Work factor:** Benchmark a cost that is acceptable for login volume, then raise it over time.
- **Comparison:** Use the library compare routine; do not create custom hash comparison.
- **Lifecycle:** Require TLS, rate-limit login, avoid logs, and issue short-lived single-use reset tokens.

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
