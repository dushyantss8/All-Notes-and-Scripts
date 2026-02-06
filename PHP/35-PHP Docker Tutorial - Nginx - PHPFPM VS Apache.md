# Docker-Based PHP Development Environment Tutorial

## 1. Why Move from XAMPP to Docker?

Traditional stacks like XAMPP are useful for quickly spinning up local projects, but they pose limitations:

* Limited configurability; not intended for production.
* Difficult to maintain parity between local and production environments.
* Cannot reliably run multiple projects requiring different PHP versions or service configurations.

**Docker solves this:**

* You can containerize your application and its dependencies.
* Different projects can run isolated PHP versions, web servers, and databases.
* Environments are portable, reproducible, and easy to share.

---

## 2. Containers, Images, Dockerfiles, and Repositories

### 2.1 Containers

A **container** is an isolated system containing everything your application needs—source code, runtime, system tools, libraries, and configuration.

You can:

* Put everything in a single container (PHP + Nginx + DB)
  Not recommended.
* Split services into multiple containers (PHP-FPM, web server, DB)
  Recommended (decoupled, maintainable, replaceable components).

### 2.2 Images

A **Docker image** is a read-only template that defines what goes inside a container:

* Source code
* Dependencies
* Configurations
* Environment variables

Containers run **from** images.

### 2.3 Dockerfile

A **Dockerfile** describes how to build an image—what base image to use, what packages to install, and what configuration to apply.

### 2.4 Repositories

Images can be stored in:

* Public registries like Docker Hub
* Private repositories

You pull images from repositories into local or production environments.

---

## 3. Choosing a Web Server: Apache vs Nginx

The course previously used Apache via XAMPP. For Docker-based development, Nginx is introduced.

### 3.1 Apache with mod_php

* PHP interpreter is embedded inside the Apache process.
* Server API shows: **Apache 2.0 Handler**.
* Downsides:

  * Larger memory footprint.
  * Interpreter loaded even for static files (CSS, images).

### 3.2 PHP-FPM (FastCGI Process Manager)

* A standalone process that handles PHP execution.
* Web servers (Apache or Nginx) pass PHP requests to PHP-FPM.
* Efficient: static files served without invoking PHP.

### 3.3 Nginx + PHP-FPM

Advantages:

* Clean configuration.
* Efficient handling of static and dynamic content.
* Flexible and lightweight.

---

## 4. Project Structure

```
project/
│
├─ docker/           # Docker, Nginx config
│   ├─ Dockerfile
│   ├─ nginx.conf
│
└─ src/
    └─ public/
        └─ index.php
```

The `src/public/index.php` contains:

```php
<?php
phpinfo();
```

---

## 5. Dockerfile Explained

A simplified Dockerfile using PHP-FPM 8.0:

```dockerfile
FROM php:8.0-fpm

# Install dependencies (example)
RUN apt-get update && apt-get install -y \
    zip unzip curl

# Optional: user/group setup, permissions...

WORKDIR /var/www
```

Key points:

* **FROM** pulls `php:8.0-fpm` from Docker Hub.
* **RUN** installs additional packages.
* **WORKDIR** sets the container’s working directory.

---

## 6. Using Docker Compose

Docker Compose allows running multiple containers with a single YAML config.

### 6.1 docker-compose.yml (Two Services: app + web server)

```yaml
version: "3.8"

services:
  app:
    build:
      context: .
      dockerfile: docker/Dockerfile
    container_name: php_app
    volumes:
      - ./src:/var/www

  nginx:
    image: nginx:1.19-alpine
    container_name: nginx_server
    ports:
      - "8000:80"
    volumes:
      - ./src:/var/www
      - ./docker/nginx.conf:/etc/nginx/conf.d/default.conf
```

#### Key Concepts

| Component       | Meaning                                      |
| --------------- | -------------------------------------------- |
| `build.context` | Directory containing Dockerfile              |
| `volumes`       | Map local folders into container file system |
| `ports`         | Expose container ports (8000 → 80)           |
| `image`         | Base Nginx image used                        |

### Example Volume Mapping

```
./src   →  /var/www  (in app and nginx containers)
```

This ensures live source code editing.

---

## 7. Nginx Configuration (nginx.conf)

```nginx
server {
    listen 80;

    index index.php;

    root /var/www/public;

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass app:9000;        # PHP-FPM from "app" container
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location / {
        try_files $uri $uri/ /index.php;
    }

    gzip on;
}
```

### Key configurations

* `fastcgi_pass app:9000`: Nginx forwards PHP requests to PHP-FPM running in the `app` container.
* `try_files`: Implements front-controller pattern; routes all requests to `index.php`.
* `error_page 404 /index.php`: Custom handling rather than default Nginx 404.

This setup is similar to modern MVC frameworks (Laravel, Symfony, CodeIgniter 4).

---

## 8. Running the Containers

### Start containers:

```
docker compose up
```

Or run in background:

```
docker compose up -d
```

### Check running containers:

```
docker ps
```

Expected:

* php_app
* nginx_server

---

## 9. Testing the Environment

Browse:

1. XAMPP Apache version:

```
http://localhost
```

Shows:

* Apache 2.0 Handler
* Old PHP version

2. Docker environment:

```
http://localhost:8000
```

Shows:

* PHP 8.0.x
* Server API: FPM/FastCGI

---

## 10. Demonstrating Front Controller Routing

In `index.php`:

```php
<?php
var_dump($_SERVER);
```

Even URLs like:

* `/posts/post1`
* `/hello.php` (nonexistent)

Still load `index.php`.

This is due to Nginx rule:

```
try_files $uri $uri/ /index.php;
```

This behavior enables custom routing and is foundational to MVC frameworks.

---

## 11. Notes on Production Readiness

This setup is:

* Suitable for development.
* Not production optimized.

Production adjustments typically include:

* Different Nginx configurations.
* Optimized PHP-FPM settings.
* Security headers.
* Persistent volumes for DB.
* Separate Docker networks.
* Reverse proxies, etc.

---

## 12. Alternatives: Laragon

Laragon:

* Modern, flexible alternative to XAMPP.
* Simple version switching.
* Useful for developers who do not want Docker.
* Cannot reliably run multiple different PHP versions concurrently.

---

# End of Tutorial