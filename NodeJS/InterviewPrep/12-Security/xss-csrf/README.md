# XSS and CSRF

XSS runs attacker-controlled script in an origin; CSRF causes a browser to send ambient credentials.

## What to know

- **XSS:** Escape output by context, sanitize rich HTML, avoid unsafe DOM sinks, and use CSP.
- **CSRF:** For cookie-authenticated writes, use intentional SameSite plus CSRF token or origin validation.
- **Distinction:** HttpOnly blocks JavaScript reads but does not stop cookie sending, so it does not solve CSRF.

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
