# Dependency Injection Container: Interface Binding and Resolution (PHP)

## 1. Problem Statement

Our custom DI container (PSR-11–style) currently supports **auto-wiring concrete classes** via reflection.
However, it **cannot resolve interfaces**, because interfaces are **not instantiable**.

### Example Failure

If a class depends on an interface:

```php
public function __construct(PaymentGatewayServiceInterface $paymentGateway)
```

The container throws:

```
PaymentGatewayServiceInterface is not instantiable
```

This is expected behavior and must be addressed via **explicit bindings**.

---

## 2. Creating a Service Interface

### Payment Gateway Interface

```php
namespace App\Services;

interface PaymentGatewayServiceInterface
{
    public function charge(float $amount): bool;
}
```

---

## 3. Implementing the Interface

### Concrete Implementation

```php
namespace App\Services;

class PaymentGatewayService implements PaymentGatewayServiceInterface
{
    public function charge(float $amount): bool
    {
        return true;
    }
}
```

---

## 4. Injecting the Interface (Not the Implementation)

### Invoice Service

```php
namespace App\Services;

class InvoiceService
{
    protected PaymentGatewayServiceInterface $paymentGateway;

    public function __construct(
        PaymentGatewayServiceInterface $paymentGateway
    ) {
        $this->paymentGateway = $paymentGateway;
    }

    public function process(): bool
    {
        return $this->paymentGateway->charge(100);
    }
}
```

At this point, the container **cannot resolve the interface automatically**.

---

## 5. Binding Interfaces in the Container

Interfaces must be **manually mapped to concrete implementations**.

---

## 6. Refactoring the App Bootstrap Class

Instead of using a static container, inject it explicitly.

### `App.php`

```php
namespace App;

use App\Services\PaymentGatewayService;
use App\Services\PaymentGatewayServiceInterface;
use App\Container;

class App
{
    protected Container $container;

    public function __construct(Container $container)
    {
        $this->container = $container;

        $this->container->set(
            PaymentGatewayServiceInterface::class,
            function (Container $container) {
                return $container->get(PaymentGatewayService::class);
            }
        );
    }
}
```

---

## 7. Fixing the Bootstrap (index.php)

The container must now be passed into `App`.

```php
$container = new Container();
$router = new Router();

$app = new App($container);
```

---

## 8. Improving the Container: Removing Closures

We want to bind interfaces **directly to class names**, without closures.

### Desired API

```php
$container->set(
    PaymentGatewayServiceInterface::class,
    PaymentGatewayService::class
);
```

---

## 9. Refactoring the Container (`set` Method)

### Before

```php
public function set(string $id, callable $concrete): void
```

### After (PHP 8 Union Types)

```php
public function set(string $id, callable|string $concrete): void
{
    $this->entries[$id] = $concrete;
}
```

---

## 10. Refactoring the `get()` Method

### Key Logic

```php
public function get(string $id)
{
    if (isset($this->entries[$id])) {
        $entry = $this->entries[$id];

        if (is_callable($entry)) {
            return $entry($this);
        }

        // Assume class name
        $id = $entry;
    }

    return $this->resolve($id);
}
```

### What This Enables

* Callable bindings (factories)
* Class-to-class bindings
* Interface → implementation mapping
* Reflection-based auto-wiring fallback

---

## 11. How Interface Resolution Works (Step-by-Step)

1. `InvoiceService` requests `PaymentGatewayServiceInterface`
2. Container finds a binding for the interface
3. Binding points to `PaymentGatewayService`
4. Container resolves `PaymentGatewayService`
5. Reflection auto-wiring instantiates it
6. Dependency is injected successfully

---

## 12. Why Interfaces Matter (Real-World Example)

### Problem: Tight Coupling

If your service depends on a concrete gateway:

```php
StripePayment $paymentGateway
```

Switching payment providers later requires **code changes everywhere**.

---

## 13. Renaming the Concrete Implementation

### Stripe Implementation

```php
class StripePayment implements PaymentGatewayInterface
{
    public function charge(float $amount): bool
    {
        return true;
    }
}
```

### Binding

```php
$container->set(
    PaymentGatewayInterface::class,
    StripePayment::class
);
```

---

## 14. Switching to a New Provider (Zero Refactor)

### Paddle Implementation

```php
class PaddlePayment implements PaymentGatewayInterface
{
    public function charge(float $amount): bool
    {
        echo "Charging via Paddle";
        return true;
    }
}
```

### Swap the Binding

```php
$container->set(
    PaymentGatewayInterface::class,
    PaddlePayment::class
);
```

✅ **No changes required in `InvoiceService` or elsewhere**

---

## 15. Key Benefits of Interface Injection

* Loose coupling
* Easier maintenance
* Simple provider swaps
* Clear contracts
* Testability (mock interfaces)

---

## 16. Relation to Framework Containers

Frameworks like **Laravel** use the **same concept**:

```php
$this->app->bind(
    PaymentGatewayInterface::class,
    StripePayment::class
);
```

Your container is simpler, but **architecturally equivalent**.

---

## 17. Recommended Exercises

### Exercise 1: Study Laravel’s Container

* Read the container implementation
* Identify similarities:

  * Bindings
  * Reflection
  * Deferred resolution

### Exercise 2: Write PHPUnit Tests

Test:

* Concrete resolution
* Interface bindings
* Callable factories
* Missing bindings
* Non-instantiable exceptions

---

## 18. Final Takeaway

You now have a DI container that supports:

* Reflection-based auto-wiring
* Interface → implementation binding
* Class aliasing
* Clean architecture principles

This is the **core mechanism behind modern PHP frameworks**.
