## 1. Laravel Architecture, Files & Folders

Laravel follows the **MVC (Model–View–Controller)** architectural pattern with a strong emphasis on **Dependency Injection (DI)** and **Inversion of Control (IoC)** via its Service Container.

### High-Level Architecture

* **Model** → Business logic & database interaction (Eloquent ORM)
* **View** → Presentation layer (Blade templates)
* **Controller** → Handles HTTP requests & coordinates responses
* **Service Container** → Resolves dependencies
* **Service Providers** → Bootstraps services
* **Kernel** → Handles request lifecycle & middleware

---

### Important Directories (Root Structure)

#### 1️⃣ `app/`

Core application logic.

```
app/
 ├── Console/
 ├── Exceptions/
 ├── Http/
 │   ├── Controllers/
 │   ├── Middleware/
 │   └── Kernel.php
 ├── Models/
 └── Providers/
```

* `Http/Controllers` → Route controllers
* `Http/Middleware` → Request filters
* `Providers` → Custom service providers
* `Http/Kernel.php` → Middleware registration

---

#### 2️⃣ `bootstrap/`

* `app.php` → Creates the Laravel application instance
* `cache/` → Cached configs, routes, services

---

#### 3️⃣ `config/`

Configuration files:

* `app.php`
* `database.php`
* `services.php`
* `queue.php`

---

#### 4️⃣ `public/`

* `index.php` → Entry point of the application

---

#### 5️⃣ `routes/`

* `web.php`
* `api.php`
* `console.php`
* `channels.php`

---

#### 6️⃣ `resources/`

* `views/`
* `js/`
* `css/`

---

#### 7️⃣ `storage/`

* `logs/`
* `framework/`
* `app/`

---

## 2. Laravel Request Lifecycle (Step-by-Step)

We’ll trace the full request lifecycle starting from:

```
public/index.php
```

---

### Step 1: Request Hits `public/index.php`

```php
// public/index.php

define('LARAVEL_START', microtime(true));

require __DIR__.'/../vendor/autoload.php';

$app = require_once __DIR__.'/../bootstrap/app.php';

$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);

$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
)->send();

$kernel->terminate($request, $response);
```

---

### Step 2: Autoloading (Composer)

```php
require __DIR__.'/../vendor/autoload.php';
```

Loads Composer’s autoloader (PSR-4).

---

### Step 3: Application Instance (bootstrap/app.php)

```php
// bootstrap/app.php

$app = new Illuminate\Foundation\Application(
    $_ENV['APP_BASE_PATH'] ?? dirname(__DIR__)
);
```

Here Laravel creates the **Application instance**, which:

* Extends the Service Container
* Acts as IoC container
* Holds bindings & service providers

---

### Step 4: Bind Important Interfaces

Inside `bootstrap/app.php`:

```php
$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);
```

This binds:

```
Http Kernel Interface → Concrete Http Kernel
```

---

### Step 5: Maintenance Mode Check

Inside the Kernel’s `handle()` method:

`Illuminate\Foundation\Http\Kernel`

Laravel checks:

```php
$this->app->maintenanceMode()->active();
```

If active → throws `MaintenanceModeException`

---

### Step 6: Bootstrapping

Before request handling, Laravel runs bootstrap classes:

Located in:

```
Illuminate\Foundation\Http\Kernel
```

Bootstrappers include:

* LoadEnvironmentVariables
* LoadConfiguration
* HandleExceptions
* RegisterFacades
* RegisterProviders
* BootProviders

---

### Step 7: Service Providers Registered

* All providers in `config/app.php` are registered.
* `register()` method runs first.
* `boot()` method runs after all providers are registered.

---

### Step 8: Middleware Execution

Defined in:

```
app/Http/Kernel.php
```

```php
protected $middleware = [
    \App\Http\Middleware\TrustProxies::class,
    \Illuminate\Foundation\Http\Middleware\HandleCors::class,
];
```

Middleware pipeline is built using:

```
Illuminate\Pipeline\Pipeline
```

---

### Step 9: Route Resolution

Router matches request to route:

```php
Route::get('/users', [UserController::class, 'index']);
```

Controller method executed.

---

### Step 10: Response Returned

Controller returns:

```php
return response()->json(['status' => 'success']);
```

Response sent via:

```php
$response->send();
```

---

### Step 11: Termination Phase

After response:

```php
$kernel->terminate($request, $response);
```

Runs:

* Terminable middleware
* Cleanup tasks

---

## 3. Service Container & Service Providers

### Service Container

Laravel’s **IoC container** manages dependency resolution.

Example:

```php
class UserService
{
    public function getAll()
    {
        return User::all();
    }
}
```

Controller:

```php
class UserController extends Controller
{
    public function __construct(UserService $service)
    {
        $this->service = $service;
    }
}
```

Laravel auto-resolves `UserService`.

---

### Manual Resolution

```php
$service = app(UserService::class);
```

or

```php
$service = resolve(UserService::class);
```

---

## 4. Binding Services (Singleton vs Bind)

### bind() → New instance every time

```php
$this->app->bind(UserService::class, function ($app) {
    return new UserService();
});
```

Each `app(UserService::class)` call creates a new object.

---

### singleton() → Same instance reused

```php
$this->app->singleton(UserService::class, function ($app) {
    return new UserService();
});
```

All resolutions return same instance.

---

### Binding Interface to Implementation

```php
$this->app->bind(
    App\Contracts\PaymentInterface::class,
    App\Services\StripePaymentService::class
);
```

Now:

```php
public function __construct(PaymentInterface $payment)
```

Automatically injects `StripePaymentService`.

---

## 5. Service Providers (Register & Boot)

Create:

```bash
php artisan make:provider PaymentServiceProvider
```

Example:

```php
class PaymentServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->bind(
            PaymentInterface::class,
            StripePaymentService::class
        );
    }

    public function boot()
    {
        // Runs after all providers are registered
    }
}
```

Register in:

```php
config/app.php
```

---

## 6. Making App Instance using Kernel & Handling Request

Back to `public/index.php`:

```php
$app = require_once __DIR__.'/../bootstrap/app.php';
```

### Creating Kernel Instance

```php
$kernel = $app->make(
    Illuminate\Contracts\Http\Kernel::class
);
```

Since it was bound as singleton:

```php
$app->singleton(
    Illuminate\Contracts\Http\Kernel::class,
    App\Http\Kernel::class
);
```

Container resolves it.

---

### Handling Request

```php
$response = $kernel->handle(
    $request = Request::capture()
);
```

Inside Kernel:

1. Bootstrap application
2. Run middleware pipeline
3. Dispatch to router
4. Get response

---

### Sending Response

```php
$response->send();
```

---

### Terminating Application

```php
$kernel->terminate($request, $response);
```

Executes:

* Terminable middleware
* Queue tasks
* Session writes

---

# 🔎 Complete Lifecycle Flow Summary

```
1. public/index.php
2. Composer autoload
3. bootstrap/app.php → Create App instance
4. Bind Http Kernel
5. Make Kernel from container
6. Maintenance mode check
7. Bootstrappers run
8. Service providers register & boot
9. Middleware pipeline
10. Route resolution
11. Controller execution
12. Response sent
13. Termination phase
```

---

# ⚙️ Best Practices & Important Notes

### 1️⃣ Always bind interfaces, not concrete classes

✔ Good:

```php
$this->app->bind(
    PaymentInterface::class,
    StripePaymentService::class
);
```

❌ Avoid:

```php
new StripePaymentService();
```

---

### 2️⃣ Use singleton for:

* Config managers
* External API clients
* Heavy services

---

### 3️⃣ Keep Service Providers clean

* `register()` → Bind things only
* `boot()` → Events, routes, observers

---

### 4️⃣ Understand Kernel types

Laravel has:

* HTTP Kernel → Web requests
* Console Kernel → Artisan commands

---

### 5️⃣ Container is everywhere

Facades internally resolve from container:

```php
Cache::get();
```

Resolves via container binding.

---