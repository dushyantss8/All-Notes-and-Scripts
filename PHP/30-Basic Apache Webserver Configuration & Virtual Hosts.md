# Apache Configuration and URL Rewriting: -

## 1. Overview

Apache comes pre-installed and pre-configured in XAMPP. However, understanding how to modify Apache’s configuration, work with virtual hosts, review logs, and implement URL rewriting (via `.htaccess` or the main configuration) is essential for both development and production environments.

---

# 2. Apache Configuration File (`httpd.conf`)

## 2.1 Location of Configuration File

The configuration file location depends on the environment:

* **XAMPP on Windows**:
  `xampp/apache/conf/httpd.conf` (accessible via XAMPP Control Panel → Apache → Config → `httpd.conf`)
* **Linux/macOS (default Apache)**:
  Often located in `/usr/local/apache2/conf`

## 2.2 Log Files

Apache logs are stored in the `logs` directory under the Apache installation:

* Access Log
* Error Log
  XAMPP Panel → Logs → Apache (Access/Error)

Default Linux log path may be `/var/log/httpd`, but XAMPP uses its own directory.

---

# 3. Inside `httpd.conf`: Key Concepts

## 3.1 Directives and Comments

* **One directive per line**
* Lines starting with `#` are comments

## 3.2 Server Settings and Ports

Configuration includes:

```
Listen 80
ServerAdmin you@example.com
ServerName localhost
```

These define the listening port and domain name.

## 3.3 Modules

Apache loads various modules:

```
LoadModule rewrite_module modules/mod_rewrite.so
LoadModule php_module modules/libphp.so
```

Modules extend server functionality.

## 3.4 Conditional Module Directives

Example:

```
<IfModule unixd_module>
  ...
</IfModule>
```

Directives inside run only if the module exists.

---

# 4. Scope Directives

Scope directives restrict configurations to specific areas:

### Common Sections

```
<Directory> ... </Directory>
<File> ... </File>
<Location> ... </Location>
```

### Example: Global filesystem lockout

```
<Directory />
  AllowOverride none
  Require all denied
</Directory>
```

This denies access to the entire filesystem unless explicitly overridden.

### Example: Allow access to document root

```
<Directory "htdocs">
  AllowOverride All
  Require all granted
</Directory>
```

This allows access and permits use of `.htaccess` files.

---

# 5. Document Root

Defines the directory served as the website root:

```
DocumentRoot "C:/xampp/htdocs"
```

---

# 6. Preventing Access to Sensitive Files

Files beginning with `.ht` should not be accessible:

```
<FilesMatch "^\.ht">
  Require all denied
</FilesMatch>
```

---

# 7. Including Additional Configuration Files

Apache allows splitting configuration into multiple files:

```
Include conf/extra/httpd-vhosts.conf
```

This keeps the `httpd.conf` organized.

---

# 8. Virtual Hosts (`httpd-vhosts.conf`)

## 8.1 Purpose

Virtual hosts allow multiple websites on one server using:

* Different IPs (IP-based hosting)
* Different domain names (Name-based hosting)

## 8.2 Basic Virtual Host Structure

```
<VirtualHost *:80>
  DocumentRoot "C:/xampp/htdocs/project"
  ServerName project.local
</VirtualHost>
```

## 8.3 Adding a Custom Local Domain

### Step 1: Define virtual host

```
<VirtualHost *:80>
  DocumentRoot "C:/xampp/htdocs/programwithgio"
  ServerName programwithgio.local
</VirtualHost>
```

### Step 2: Modify Windows hosts file

Path: `C:\Windows\System32\drivers\etc\hosts`

Add entry:

```
127.0.0.1 programwithgio.local
```

### Step 3: Restart Apache

Required after updating configuration files.

Now the site is accessible at:

```
http://programwithgio.local
```

---

# 9. `.htaccess` Files (Distributed Configuration)

## 9.1 Purpose

* Allow per-directory configuration
* Often used when you **do not** have access to the main Apache config (e.g., shared hosting)

## 9.2 Behavior

* Loaded **on every request**
* Changes take effect **immediately**
* Can affect performance

## 9.3 Enable or Disable `.htaccess`

Controlled using `AllowOverride`:

```
AllowOverride None    # Disables .htaccess
AllowOverride All     # Enables all .htaccess directives
```

If you have access to the main config, it is recommended to disable `.htaccess` entirely for performance.

---

# 10. URL Rewriting with mod_rewrite

## 10.1 Prerequisites

Ensure `mod_rewrite` is enabled:

```
LoadModule rewrite_module modules/mod_rewrite.so
```

---

# 11. Pretty URLs Using `.htaccess`

### Scenario

You have:

```
public/index.php     ← Application entry point
public/about.php
```

You want URLs like:

```
/about
/blog/post-1
```

### Step 1: Add `.htaccess` in `public/`

```
<IfModule mod_rewrite.c>
  RewriteEngine On

  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d

  RewriteRule ^ index.php [QSA,L]
</IfModule>
```

### Explanation

* Conditions ensure **real files and directories** are served normally
* All other URLs route to `index.php`
* `index.php` parses the URL and loads the appropriate page

---

# 12. Doing URL Rewriting *Without* `.htaccess`

You can put the same rewrite rules into the Virtual Host:

```
<VirtualHost *:80>
  DocumentRoot "C:/xampp/htdocs/programwithgio/public"
  ServerName programwithgio.local

  <Directory "C:/xampp/htdocs/programwithgio/public">
    AllowOverride None
    Require all granted

    <IfModule mod_rewrite.c>
      RewriteEngine On
      RewriteCond %{REQUEST_FILENAME} !-f
      RewriteCond %{REQUEST_FILENAME} !-d
      RewriteRule ^ /index.php [QSA,L]
    </IfModule>
  </Directory>
</VirtualHost>
```

### Restart Apache

Configuration changes require server restart.

### Key Advantage

**No performance penalty** because `.htaccess` is not used.

---

# 13. Summary of Best Practices

* Prefer modifying the **main Apache config** or **virtual hosts** instead of using `.htaccess`.
* Use `.htaccess` only when server-level configuration access is unavailable.
* Group related rules into separate config files and include them for maintainability.
* Restart Apache after modifying configuration files (except `.htaccess`, which applies instantly).

---