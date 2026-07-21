# Nginx and PM2

Nginx terminates TLS, serves static content, proxies upstream requests, and can rate-limit. PM2 supervises Node processes, supports cluster mode, log handling, and graceful reloads. Avoid assuming PM2 replaces containers/orchestration.

**Interview angles:** `X-Forwarded-*`, `trust proxy`, keep-alive, TLS, zero-downtime reload, and health checks.
