# PHP Superglobals and Basic Routing Tutorial

## 1. Introduction to Superglobals

Superglobals are built-in PHP variables that are always available in all scopes. They are primarily used for:

* Accessing request data (GET, POST)
* Handling file uploads
* Managing cookies and sessions
* Accessing server/environment information

In this tutorial, focus is placed on the `$_SERVER` superglobal, with later tutorials covering GET, POST, FILES, COOKIE, SESSION, ENV, and REQUEST.

---

# 2. The `$_SERVER` Superglobal

`$_SERVER` contains server and execution environment data. Its contents vary by server configuration but commonly include:

### Key Useful Entries

| Key                           | Description                                     |
| ----------------------------- | ----------------------------------------------- |
| `$_SERVER['HTTP_HOST']`       | Host header from the current request.           |
| `$_SERVER['SCRIPT_FILENAME']` | Absolute path of the executed script.           |
| `$_SERVER['SERVER_PORT']`     | Port number (80, 443).                          |
| `$_SERVER['SERVER_ADDR']`     | Server IP address.                              |
| `$_SERVER['DOCUMENT_ROOT']`   | Document root directory.                        |
| `$_SERVER['REQUEST_URI']`     | The full requested URI, including query string. |
| `$_SERVER['REQUEST_METHOD']`  | HTTP method (GET, POST, etc.).                  |
| `$_SERVER['QUERY_STRING']`    | Query parameters portion after `?`.             |
| `$_SERVER['REMOTE_ADDR']`     | Client IP.                                      |
| `$_SERVER['HTTP_USER_AGENT']` | Browser information.                            |

Example:
Visiting
`http://localhost/foo/bar?test=1`
Sets:

* `REQUEST_URI` = `/foo/bar?test=1`
* `QUERY_STRING` = `test=1`

---

# 3. When to Use `$_SERVER`

Common use cases include:

* Implementing routing based on `REQUEST_URI`
* Conditional logic depending on request method
* Logging user agent, IP, or referrer
* Building custom request-handling utilities

Routing is used as the example in this tutorial.

---

# 4. Building a Simple Router (Educational Only)

A custom router demonstrates how `$_SERVER['REQUEST_URI']` and HTTP methods can drive application behavior.

The router will:

* Register routes
* Resolve the requested URL
* Run associated callbacks or controller methods
* Throw a 404 exception for unknown routes

---

# 5. Step-by-Step Router Implementation

## 5.1 Router Class Skeleton

```php
<?php
declare(strict_types=1);

namespace App;

class Router
{
    private array $routes = [];

    public function register(string $route, callable|array $action): self
    {
        $this->routes[$route] = $action;
        return $this;
    }

    public function resolve(string $requestUri)
    {
        // Implementation added later
    }
}
```

## 5.2 Register Routes

In `index.php`:

```php
$router = new App\Router();

$router
    ->register('/', function () { return 'home'; })
    ->register('/invoices', function () { return 'invoices'; });
```

However, no resolution occurs yet.

---

# 6. Implementing Route Resolution

## 6.1 Extract the Route (ignore query string)

`REQUEST_URI` may contain parameters, so split on `?`:

```php
$route = explode('?', $requestUri)[0];
```

## 6.2 Look Up Registered Action

```php
$action = $this->routes[$route] ?? null;

if (!$action) {
    throw new RouteNotFoundException();
}
```

## 6.3 Execute the Action

If the action is callable, run it:

```php
if (is_callable($action)) {
    return call_user_func($action);
}
```

---

# 7. Adding 404 Exception Handling

Define a custom exception:

```php
namespace App\Exceptions;

class RouteNotFoundException extends \Exception
{
    protected $message = '404 Not Found';
}
```

---

# 8. Supporting Controller Classes and Methods

Developers often want to map routes to controller classes instead of callbacks:

```php
$router
    ->register('/', [App\Controllers\Home::class, 'index'])
    ->register('/invoices', [App\Controllers\Invoice::class, 'index'])
    ->register('/invoices/create', [App\Controllers\Invoice::class, 'create']);
```

### Controller Example

```php
namespace App\Controllers;

class Home
{
    public function index()
    {
        return 'home';
    }
}
```

### Updating `resolve()` to Support Arrays

```php
if (is_array($action)) {
    [$class, $method] = $action;

    if (!class_exists($class)) {
        throw new RouteNotFoundException();
    }

    $instance = new $class();

    if (!method_exists($instance, $method)) {
        throw new RouteNotFoundException();
    }

    return call_user_func_array([$instance, $method], []);
}
```

---

# 9. Testing the Router

Examples:

### 1. `/`

Returns:

```
home
```

### 2. `/invoices`

Returns:

```
invoices
```

### 3. `/invoices/create`

Returns:

```
create invoice
```

### 4. Unknown route, e.g. `/invalid`

Throws:

```
RouteNotFoundException: 404 Not Found
```

---

# 10. Notes and Limitations

This router:

* Assumes all routes are GET routes.
* Does not support dynamic parameters.
* Is not suitable for production.
* Exists solely to illustrate routing concepts used in frameworks and MVC architectures.

Future tutorials will extend this to support GET/POST/PUT/DELETE differentiation.

---

# End of Tutorial