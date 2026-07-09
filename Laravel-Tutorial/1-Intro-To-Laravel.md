# Laravel Development Environment Setup

## Introduction

Before building Laravel applications, the first step is to properly set up a local development environment. While PHP development traditionally required manually installing and configuring multiple tools, modern solutions have simplified the process considerably.

The course recommends using **Laravel Herd**, a one-click development environment that provides everything needed to start building Laravel applications.

---

# Traditional PHP Development Environment Options

Historically, developers had several options for setting up PHP locally:

* **XAMPP**
* **MAMP**
* **WAMP** (Windows)
* **Laragon** (Windows)
* **Homebrew** (macOS)

  * Install PHP manually
  * Install MySQL manually
* **Docker + Laravel Sail**

All of these tools are still actively maintained and are excellent choices.

However, for beginners, the recommended option is **Laravel Herd** because it removes almost all manual configuration.

---

# Laravel Herd

Laravel Herd is a lightweight local development environment specifically designed for PHP and Laravel development.

### Advantages

* One-click installation
* Automatically installs:

  * PHP
  * Composer
  * Laravel Installer
* Minimal configuration
* Ready to create Laravel applications immediately
* Supports multiple PHP versions
* Automatically serves Laravel projects

---

# Installation

After downloading and installing Herd:

During setup it automatically installs:

* Latest supported PHP version (PHP 8.3 at the time of recording)
* Composer
* Laravel Installer

Laravel Herd is available in:

* macOS
* Windows

Linux users generally install PHP manually or use their preferred package manager.

---

# Free vs Pro Version

Laravel Herd offers:

### Free Version

Includes everything required to:

* Develop PHP applications
* Develop Laravel applications
* Follow Laravel courses
* Manage local projects

### Pro Version

Adds additional productivity features ("bells and whistles"), but it is **not required** for Laravel development.

---

# Herd Features

## 1. PHP Version Management

Herd allows installing multiple PHP versions simultaneously.

Example:

* PHP 8.1
* PHP 8.2
* PHP 8.3

Projects requiring different PHP versions can run without conflicts.

Updating PHP versions is also possible with a single click.

---

## 2. Project Discovery

Herd watches specific directories (called **Paths**).

Example:

```
~/Herd
~/Code
```

Any Laravel project placed inside these folders becomes automatically available in the browser.

No virtual host configuration is required.

---

# Creating a Laravel Project

Herd includes the Laravel Installer.

Create a new project using:

```bash
laravel new example
```

During project creation Laravel asks several questions.

Example options:

### Starter Kit

Provides:

* Authentication
* Layouts
* Templates
* Pre-built frontend

For learning Laravel from scratch, choose:

```
None
```

---

### Testing Framework

Laravel allows selecting a testing framework.

The default option is sufficient for beginners.

---

### Git Repository

Laravel asks whether to initialize Git.

For experimentation, this can be skipped.

---

### Database

Laravel supports multiple databases.

For beginners, the recommended choice is:

```
SQLite
```

SQLite is:

* File-based
* Lightweight
* Requires no database server
* Perfect for development and learning

---

# Project Structure

After installation:

```bash
cd example
```

The generated folder contains the complete Laravel framework, application code, configuration files, and dependencies.

Composer automatically installs all required packages during project creation.

Users do not need prior Composer knowledge to create their first Laravel application.

---

# Running the Application

One of Herd's major features is automatic local domain mapping.

If the project folder is named:

```
example
```

The application becomes accessible at:

```
http://example.test
```

without any additional configuration.

Opening this URL displays Laravel's default welcome page, confirming that the application is correctly installed and ready for development.

---

# Alternative Development Environments

Although Laravel Herd is recommended, Laravel projects can also be developed using:

* Laragon
* XAMPP
* Docker
* Laravel Sail
* MAMP
* WAMP
* Homebrew (manual PHP installation)

Each option has a different installation process, but all are valid choices.

---

# Key Takeaways

* Setting up the development environment is the first step before building Laravel applications.
* Laravel Herd is the recommended tool for beginners due to its simplicity.
* Herd installs PHP, Composer, and the Laravel Installer automatically.
* It supports multiple PHP versions simultaneously.
* Projects inside Herd's registered directories are automatically served.
* Laravel projects can be created using the `laravel new` command.
* Beginners should avoid installing a Starter Kit initially to better understand Laravel fundamentals.
* SQLite is the recommended database for learning because it is lightweight and serverless.
* Herd automatically maps project folders to `.test` domains (e.g., `example.test`).
* Other tools such as XAMPP, Laragon, Docker, and Laravel Sail remain excellent alternatives but require different setup procedures.
