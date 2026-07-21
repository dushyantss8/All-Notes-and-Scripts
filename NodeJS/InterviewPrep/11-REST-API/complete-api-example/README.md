# Complete Mini API

A small tasks API keeps routes, middleware, controllers, services, and models distinct. Controllers translate HTTP; services own rules; models persist.

## What to know

- **Structure:** `app.js`, routes, middleware, controllers, services, and models separate composition from policy.
- **Boundary:** JWT verification and validation happen before controller work; service enforces owner scope.
- **Testing:** Export the Express app independently from `listen()` for in-process Supertest.

## Flow

```mermaid
flowchart LR
  Route --> Auth[JWT middleware] --> Validation --> Controller --> Service --> Model[(MongoDB)]
  Controller --> Errors[error middleware]
```

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
