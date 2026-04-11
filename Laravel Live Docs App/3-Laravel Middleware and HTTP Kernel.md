# Laravel Kernel and Middleware – Complete Technical Guide

This guide explains:

* What middleware is in Laravel
* How middleware works internally
* How to create custom middleware
* How the HTTP Kernel processes requests
* Global middleware, middleware groups, and route middleware
* How parameters and termination work

All explanations focus strictly on Laravel’s internal mechanics and implementation details.

---

# 1. Understanding Middleware in Laravel

## 1.1 What is Middleware?

In Laravel, **middleware is a class that filters HTTP requests entering your application**.

It acts as an intermediary layer between:

```
Client Request → Middleware → Router → Controller → Response
```

### Responsibilities of Middleware

A middleware can:

* Inspect the incoming request
* Modify the request
* Block the request
* Perform authentication/authorization
* Transform the response
* Perform cleanup after response is sent

In short:

> Middleware runs before the request reaches the router and may also run after the response is generated.

---

# 2. How Laravel Processes an Incoming Request

The request lifecycle begins in:

```
public/index.php
```

This file boots the application and calls the HTTP Kernel.

Simplified flow:

```php
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
)->send();

$kernel->terminate($request, $response);
```

The important methods inside the Kernel are:

* `handle()`
* `terminate()`

We will examine them in detail later.

---

# 3. The HTTP Kernel Structure

Location:

```
app/Http/Kernel.php
```

You will see three important middleware-related properties:

```php
protected $middleware = [];

protected $middlewareGroups = [];

protected $routeMiddleware = [];
```

---

## 3.1 Global Middleware (`$middleware`)

Global middleware runs on **every HTTP request**.

Example:

```php
protected $middleware = [
    \App\Http\Middleware\TrustProxies::class,
    \Illuminate\Http\Middleware\PreventRequestsDuringMaintenance::class,
    \Illuminate\Foundation\Http\Middleware\ValidatePostSize::class,
    \App\Http\Middleware\TrimStrings::class,
    \Illuminate\Foundation\Http\Middleware\ConvertEmptyStringsToNull::class,
];
```

### Examples of Built-in Global Middleware

| Middleware                         | Purpose                                 |
| ---------------------------------- | --------------------------------------- |
| `PreventRequestsDuringMaintenance` | Blocks requests during maintenance mode |
| `TrimStrings`                      | Trims whitespace from input             |
| `ConvertEmptyStringsToNull`        | Converts empty strings to `null`        |

These are executed sequentially in the order defined.

---

## 3.2 Middleware Groups (`$middlewareGroups`)

Middleware groups allow you to bundle multiple middleware under a single key.

Example:

```php
protected $middlewareGroups = [
    'web' => [
        \App\Http\Middleware\EncryptCookies::class,
        \Illuminate\Session\Middleware\StartSession::class,
        \Illuminate\View\Middleware\ShareErrorsFromSession::class,
        \App\Http\Middleware\VerifyCsrfToken::class,
    ],

    'api' => [
        'throttle:api',
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

These groups are assigned to route files:

* `routes/web.php` → uses `web` group
* `routes/api.php` → uses `api` group

---

## 3.3 Route Middleware (`$routeMiddleware`)

Route middleware are assigned aliases.

Example:

```php
protected $routeMiddleware = [
    'auth' => \App\Http\Middleware\Authenticate::class,
    'can' => \Illuminate\Auth\Middleware\Authorize::class,
    'throttle' => \Illuminate\Routing\Middleware\ThrottleRequests::class,
];
```

These can be applied to routes:

```php
Route::get('/dashboard', function () {
    return 'Dashboard';
})->middleware('auth');
```

---

# 4. Creating Custom Middleware

## 4.1 Generate Middleware

Use Artisan:

```bash
php artisan make:middleware SayCheeseMiddleware
```

File created at:

```
app/Http/Middleware/SayCheeseMiddleware.php
```

---

## 4.2 Middleware Class Structure

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SayCheeseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        return $next($request);
    }
}
```

---

# 5. Understanding the `handle()` Method

Signature:

```php
public function handle(Request $request, Closure $next)
```

### Parameters

* `$request` → Current HTTP request
* `$next` → Callback to pass request to next middleware

### Important Rule

If you do NOT call:

```php
return $next($request);
```

the request will stop here.

---

## 5.1 Example: Allow Request to Continue

```php
public function handle(Request $request, Closure $next)
{
    \Log::info('SayCheese middleware executed');

    return $next($request);
}
```

---

## 5.2 Example: Block Request

```php
public function handle(Request $request, Closure $next)
{
    return response()->json([
        'message' => 'Access denied'
    ], 403);
}
```

This prevents the request from reaching the router.

---

# 6. Registering Custom Middleware

Add to `Kernel.php`.

## 6.1 As Global Middleware

```php
protected $middleware = [
    \App\Http\Middleware\SayCheeseMiddleware::class,
];
```

---

## 6.2 As Route Middleware

```php
protected $routeMiddleware = [
    'saycheese' => \App\Http\Middleware\SayCheeseMiddleware::class,
];
```

Use it:

```php
Route::get('/test', function () {
    return 'Hello World';
})->middleware('saycheese');
```

---

# 7. Middleware Execution Chain

Middleware runs like a pipeline:

```
Request
   ↓
Middleware A
   ↓
Middleware B
   ↓
Middleware C
   ↓
Controller
   ↑
Middleware C
   ↑
Middleware B
   ↑
Middleware A
   ↑
Response
```

Each middleware wraps around the next one.

---

# 8. Middleware Parameters

You can pass parameters using a colon syntax.

Example in route:

```php
Route::get('/users', function () {
    return 'Users';
})->middleware('throttle:60,1');
```

Inside middleware:

```php
public function handle(Request $request, Closure $next, $maxAttempts, $decayMinutes)
{
    // $maxAttempts = 60
    // $decayMinutes = 1

    return $next($request);
}
```

The parameters are passed after `$next`.

---

# 9. The HTTP Kernel Internals

Location:

```
Illuminate\Foundation\Http\Kernel
```

## 9.1 The `handle()` Method

```php
public function handle($request)
{
    $this->bootstrap();

    return $this->sendRequestThroughRouter($request);
}
```

Two major responsibilities:

1. Bootstrap the application
2. Send request through middleware and router

---

# 10. Bootstrapping the Application

Inside:

```php
protected function bootstrap()
```

Laravel loads bootstrappers such as:

```php
protected $bootstrappers = [
    \Illuminate\Foundation\Bootstrap\LoadEnvironmentVariables::class,
    \Illuminate\Foundation\Bootstrap\LoadConfiguration::class,
    \Illuminate\Foundation\Bootstrap\HandleExceptions::class,
    \Illuminate\Foundation\Bootstrap\RegisterFacades::class,
    \Illuminate\Foundation\Bootstrap\RegisterProviders::class,
    \Illuminate\Foundation\Bootstrap\BootProviders::class,
];
```

### What Bootstrapping Does

* Loads `.env` variables
* Loads configuration files
* Registers service providers
* Registers facades
* Sets up exception handling

Bootstrapping prepares the application before handling requests.

---

# 11. Sending Request Through Router

Method:

```php
protected function sendRequestThroughRouter($request)
```

This method:

1. Creates a middleware pipeline
2. Passes the request through global middleware
3. Dispatches request to router
4. Returns response

Simplified internal logic:

```php
return (new Pipeline($this->app))
    ->send($request)
    ->through($this->middleware)
    ->then($this->dispatchToRouter());
```

---

# 12. The `terminate()` Method

After response is sent, Laravel calls:

```php
$kernel->terminate($request, $response);
```

Kernel implementation:

```php
public function terminate($request, $response)
{
    $this->terminateMiddleware($request, $response);
}
```

---

## 12.1 Middleware Termination Method

You can define:

```php
public function terminate($request, $response)
{
    \Log::info('Request completed');
}
```

This runs **after response is sent to client**.

### Use Cases

* Logging
* Cleaning resources
* Final processing
* Queue dispatching

---

# 13. Complete Example Middleware with Terminate

```php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class SayCheeseMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        \Log::info('Before controller execution');

        return $next($request);
    }

    public function terminate($request, $response)
    {
        \Log::info('After response sent');
    }
}
```

---

# 14. Complete Request Lifecycle Summary

1. Request enters `public/index.php`
2. Kernel `handle()` is called
3. Application bootstraps
4. Request passes through:

   * Global middleware
   * Route middleware groups
   * Route middleware
5. Router dispatches request
6. Controller returns response
7. Response travels back through middleware
8. Response is sent
9. Kernel calls `terminate()`

---

# 15. Key Notes and Best Practices

## Middleware Best Practices

* Always return either:

  * `return $next($request);`
  * OR a valid `Response`
* Do not perform heavy logic in middleware
* Keep middleware single-responsibility
* Order of middleware matters
* Use middleware groups for cleaner route definitions

---

## Kernel Best Practices

* Avoid modifying core Kernel logic unless necessary
* Register middleware carefully in correct array
* Understand execution order before debugging request issues

---

## Parameter Handling Tips

* Parameters are passed after `$next`
* Use colon syntax: `middleware:parameter`
* Multiple parameters are comma-separated

---

## Termination Guidelines

* Only use `terminate()` when post-response processing is needed
* Avoid long-running logic inside `terminate()`

---

# Final Takeaways

* Middleware is a request filtering mechanism.
* The `handle()` method controls request flow.
* The Kernel bootstraps the application and builds the middleware pipeline.
* Middleware groups simplify route definitions.
* Route middleware aliases improve readability.
* `terminate()` allows post-response execution.
* The request lifecycle is pipeline-based and sequential.