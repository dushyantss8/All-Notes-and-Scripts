# PHP Sessions and Cookies: -

## 1. Overview of State Management in PHP

PHP is a stateless, request–response–driven language. Each request is independent, and no state is preserved automatically. To retain state across requests, developers typically use:

* Sessions
* Cookies
* Databases
* Cache systems
* Files

This tutorial focuses on sessions and cookies.

### Key Differences

| Aspect    | Sessions                              | Cookies                                    |
| --------- | ------------------------------------- | ------------------------------------------ |
| Stored in | Server                                | Client machine (browser)                   |
| Lifetime  | Ends when browser closes (by default) | Until expiration time or manual deletion   |
| Security  | More secure (server-side)             | Less secure (client-side; visible to user) |

---

# 2. Working with Sessions

## 2.1 Starting a Session

Sessions must be started with:

```php
session_start();
```

**Important:**
`session_start()` must run **before any output is sent** (including whitespace, HTML, or echo/print), or PHP will issue:

```
Warning: session cannot be started after headers have already been sent
```

Headers are transmitted as soon as PHP outputs anything. Sessions rely on headers; therefore, they must be started early.

### Output Buffering Effect

Many environments enable output buffering (e.g., `output_buffering = 4096`). This temporarily stores output and delays sending it to the browser.

This allows code like:

```php
echo "Hello";
session_start();
```

to run without errors, but this is misleading. If buffering is disabled, the error appears.

### Demonstration of Output Buffering

```php
echo 1;
sleep(3);
echo 2;
```

In browser mode (with buffering), output appears after the full script runs.

In CLI mode (buffering disabled), output displays immediately.

---

## 2.2 Where to Place `session_start()`

Because all application requests pass through `public/index.php`, the ideal placement is at the top of that file, before any HTML or echo statements.

Avoid closing PHP tags (`?>`) in pure-PHP files.
Accidental whitespace after the tag can also send headers prematurely.

---

## 2.3 Session ID and Cookies

When a session starts:

* PHP generates a **session ID**.
* A cookie named `PHPSESSID` (or similar) is created on the client side.

This cookie is submitted to the server with each request.

You can inspect the session ID:

Developer Tools → Application → Cookies.

Deleting this cookie creates a new session on the next request.

---

## 2.4 Storing and Accessing Session Data

Use the `$_SESSION` superglobal.

### Example: Persistent Counter

```php
session_start();

if (!isset($_SESSION['count'])) {
    $_SESSION['count'] = 0;
}

$_SESSION['count']++;
```

The counter increments on each refresh and persists across pages while the session is active.

### Access on other pages

```php
var_dump($_SESSION);
```

### Unsetting a specific session key

```php
unset($_SESSION['count']);
```

### Important Notes

* Prefer managing session state through `$_SESSION`, not `session_destroy()` or `session_unset()` for typical use cases.
* Deleting the session cookie resets the entire session.

---

# 3. Working with Cookies

## 3.1 What Cookies Are

Cookies are small text files stored on the client’s machine. They are sent to the server automatically with every request.

Common use cases:

* Session management
* Tracking
* Personalization

Avoid storing sensitive data directly in cookies.

---

## 3.2 Creating Cookies with `setcookie()`

Basic usage:

```php
setcookie(
    "username",        // name
    "Geo",             // value
    time() + 10,       // expiration (10 seconds from now)
);
```

### Important:

`setcookie()` must run before any output (like `session_start()`).

### Cookie Parameters

`setcookie(name, value, expires, path, domain, secure, httponly)`

* **expires:** timestamp when cookie expires
* **path:** path for which cookie is valid
* **domain:** domain and subdomains
* **secure:** send only over HTTPS
* **httponly:** inaccessible via JavaScript when true

From PHP 7.3+, you may pass an associative array:

```php
setcookie("username", "Geo", [
    "expires" => time() + 86400,
    "path"    => "/",
    "secure"  => false,
    "httponly"=> false,
    "samesite"=> "Lax"
]);
```

---

## 3.3 Verifying Cookies

Use browser dev tools:

Application → Cookies.

Cookies created via PHP should appear immediately and remain until expiration or deletion.

---

## 3.4 Automatic Cookie Deletion via Expiration

To delete a cookie:

```php
setcookie("username", "", time() - 3600);
```

* Setting expiration time in the past removes the cookie.

---

## 3.5 Accessing Cookie Data

Use the `$_COOKIE` superglobal:

```php
var_dump($_COOKIE);
```

You will see both session cookies and manually created cookies.

---

# 4. Security Considerations

### Do NOT store sensitive data in cookies.

Cookies are client-visible and easy to steal via:

* XSS attacks
* Device compromise
* Social engineering

If storing semi-sensitive values:

* Hash or encrypt the data.
* Use HTTP-only cookies.
* Use secure cookies (HTTPS only).

Encryption and hashing are covered later in the course.

---

# 5. Summary of Key Rules

1. Start sessions using `session_start()` before any output.
2. Use `$_SESSION` for storing server-side state.
3. Cookies must also be set before output.
4. Use `$_COOKIE` to read cookies.
5. Delete cookies by setting expiration to a past timestamp.
6. Avoid sensitive data in cookies.
7. Output buffering may mask header-related errors; do not rely on it.

---

# End of Tutorial