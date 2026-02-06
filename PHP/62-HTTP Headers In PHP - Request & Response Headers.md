# HTTP Requests, Responses, Headers, and Status Codes in PHP

## 1. What Is an HTTP Message?

Every interaction with a web application—loading a page, submitting a form, uploading a file—results in an **HTTP request** from the client and an **HTTP response** from the server.

Both **requests** and **responses** follow a similar structure:

1. **Start Line**
2. **Headers**
3. **Body**

---

## 2. HTTP Message Structure

### 2.1 Start Line

#### Request Start Line

```
METHOD /path HTTP/version
```

Example:

```
GET /upload HTTP/1.1
```

#### Response Start Line

```
HTTP/version status_code status_text
```

Example:

```
HTTP/1.1 404 Not Found
```

---

### 2.2 HTTP Headers

Headers carry metadata about the request or response.

Common header categories:

* **Request headers** (e.g., `Accept`, `User-Agent`)
* **Response headers**
* **Representation headers** (e.g., `Content-Type`)
* **Authentication headers**
* **Caching headers**
* **Cookies**

#### Common Headers You Will Use in PHP

| Header         | Purpose                    |
| -------------- | -------------------------- |
| `Accept`       | Preferred response formats |
| `Content-Type` | Type of returned content   |
| `Location`     | Redirect URL               |
| `Set-Cookie`   | Send cookies to client     |
| `User-Agent`   | Client information         |

---

### 2.3 Body

* **Request body**: Data sent to the server (form data, JSON, files).
* **Response body**: Data sent back (HTML, JSON, file contents).

---

## 3. HTTP Status Codes (Overview)

### 3.1 Informational (100–199)

* Rarely used directly.

### 3.2 Success (200–299)

| Code  | Meaning             |
| ----- | ------------------- |
| `200` | OK                  |
| `201` | Created             |
| `204` | Success, no content |

---

### 3.3 Redirects (300–399)

| Code  | Meaning              |
| ----- | -------------------- |
| `301` | Moved permanently    |
| `302` | Temporary redirect   |
| `304` | Not modified (cache) |

---

### 3.4 Client Errors (400–499)

| Code  | Meaning                      |
| ----- | ---------------------------- |
| `401` | Unauthenticated              |
| `403` | Unauthorized (no permission) |
| `404` | Not found                    |
| `405` | Method not allowed           |

**401 vs 403**

* `401`: User is **not logged in**
* `403`: User **is logged in** but lacks permission

---

### 3.5 Server Errors (500–599)

| Code  | Meaning               |
| ----- | --------------------- |
| `500` | Internal server error |
| `502` | Bad gateway           |

---

## 4. Inspecting HTTP Messages in the Browser

Using browser **DevTools → Network**:

* View request URL, method, headers
* View response headers and body
* Inspect status codes

---

## 5. Handling 404 Errors Properly in PHP

### Problem

A non-existent route throws an exception but still returns `200 OK`.

### Solution

Catch the exception and send a proper `404 Not Found` status.

---

### 5.1 Catching a Route Not Found Exception

```php
try {
    $router->resolve($_SERVER['REQUEST_URI'], $_SERVER['REQUEST_METHOD']);
} catch (RouteNotFoundException $e) {
    http_response_code(404);
    echo view('errors/404');
}
```

---

### 5.2 Creating a 404 View

**`views/errors/404.php`**

```php
<!DOCTYPE html>
<html>
<head>
    <title>404 Not Found</title>
</head>
<body>
    <h1>404 - Page Not Found</h1>
</body>
</html>
```

---

### 5.3 Sending Status Codes with Headers

#### Method 1: Using `header()`

```php
header('HTTP/1.1 404 Not Found');
```

#### Method 2 (Recommended): Using `http_response_code()`

```php
http_response_code(404);
```

> ⚠️ Headers **must be sent before any output** unless output buffering is enabled.

---

## 6. Redirecting Users with Headers

### Example: Redirect After File Upload

```php
header('Location: /');
exit;
```

* Automatically sends a `302 Found` status.
* Always call `exit` after a redirect.

---

### Why `exit` Is Required

Without `exit`, PHP continues executing code **after** the redirect.

#### Incorrect Example

```php
header('Location: /');
unlink($filePath); // Still executes
```

#### Correct Example

```php
header('Location: /');
exit;
```

---

## 7. Header Function Options

```php
header(string $header, bool $replace = true, int $response_code = 0);
```

* **`$replace`**: Replace existing headers (default `true`)
* **`$response_code`**: Explicit status code

Example:

```php
header('Location: /', true, 302);
exit;
```

---

## 8. Sending Files for Download

### Step-by-Step File Download Example

```php
public function download()
{
    $filePath = storage_path('myfile.pdf');

    header('Content-Type: application/pdf');
    header('Content-Disposition: attachment; filename="myfile.pdf"');

    readfile($filePath);
    exit;
}
```

---

### Register the Route

```php
$router->get('/download', [HomeController::class, 'download']);
```

---

### What These Headers Do

| Header                | Purpose                       |
| --------------------- | ----------------------------- |
| `Content-Type`        | Tells browser file type       |
| `Content-Disposition` | Forces download with filename |

---

## 9. Common Pitfalls

### 9.1 Headers Already Sent Error

Occurs when output is sent before headers.

**Solutions**

* Use output buffering
* Check with:

```php
if (!headers_sent()) {
    header('Location: /');
}
```

---

### 9.2 Hardcoding Protocol Versions

Acceptable for learning:

```php
header('HTTP/1.1 404 Not Found');
```

More robust:

```php
header($_SERVER['SERVER_PROTOCOL'] . ' 404 Not Found');
```

---

## 10. Architectural Note (Important Concept)

Manually managing headers and responses works for learning but **does not scale well**.

In real applications:

* Use **Request objects** for input
* Use **Response objects** for headers and output
* Leverage established libraries/frameworks

This lesson provides **foundational understanding** so that higher-level abstractions (MVC frameworks and HTTP components) make sense later.

---

## 11. Key Takeaways

* HTTP requests and responses share a common structure
* Status codes must accurately reflect the response outcome
* Headers control redirects, content types, cookies, and downloads
* Always send headers before output
* Always terminate scripts after redirects
* Proper error handling improves correctness and user experience

---