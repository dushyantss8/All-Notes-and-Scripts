# Webhooks

A webhook receiver must verify signatures over the raw body, acknowledge quickly, enqueue work, deduplicate by delivery ID, and tolerate retries/out-of-order delivery. Store delivery status and observability context.

**Interview angles:** replay protection, idempotency, secret rotation, timeout behavior, dead letters, and outbound retry policy.
