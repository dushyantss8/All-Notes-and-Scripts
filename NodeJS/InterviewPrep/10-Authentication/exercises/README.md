# Authentication Exercises

1. Build `requireAuth` that handles missing, malformed, expired, and invalid JWTs without leaking verification details.
2. Implement refresh rotation with token-family reuse detection.
3. Guard `PATCH /projects/:id` with RBAC, ownership, and tenant checks.
4. Diagram OAuth code + PKCE and explain `state`, `nonce`, and verifier.

**Done means:** success, unauthenticated, unauthorized, expired, revoked, and replayed-token paths have automated tests.
