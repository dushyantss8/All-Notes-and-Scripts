# Docker and Compose

```bash
docker build -t api:local .
docker run --env-file .env -p 3000:3000 api:local
docker compose up --build
docker compose logs -f api
```

Use multi-stage builds, a small non-root runtime image, `.dockerignore`, health checks, pinned base images, and injected—not baked—secrets.
