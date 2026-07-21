# Sessions and Cookies

A server session stores state centrally and gives a browser an opaque identifier in a cookie. A cookie is only a transport mechanism, not authorization.

## What to know

- **Cookie flags:** Use `HttpOnly`, `Secure`, appropriate `SameSite`, and narrow Path/Domain scope.
- **Fixation:** Regenerate the identifier on login and privilege change; destroy it on logout.
- **Scale:** Use a shared expiring store such as Redis in production, not an in-memory session store.

## Flow

```mermaid
sequenceDiagram
  Browser->>App: POST /login
  App->>Session Store: create session
  App-->>Browser: Set-Cookie opaque ID
  Browser->>App: request with cookie
  App->>Session Store: load session
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
