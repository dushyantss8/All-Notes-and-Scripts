# Building a Simple Dependency Injection (DI) Container in PHP (PSR-11)

This tutorial explains how to **build a minimal Dependency Injection (DI) container in PHP**, following **PSR-11** standards. The goal is to understand how DI containers work internally, including **manual bindings** and **auto-wiring using reflection**.

> ⚠️ This implementation is **educational only** and **not production-ready**.

---

## 1. Problem Overview

Consider a service like `InvoiceService` that depends on other services:

```php
class InvoiceService
{
    public function __construct(
        SalesTaxService $salesTaxService,
        PaymentGatewayService $paymentGatewayService,
        EmailService $emailService
    ) {}

    public function process(array $data): void
    {
        echo "Invoice has been processed";
    }
}
```

Without a DI container, every consumer must manually instantiate **all dependencies**, leading to:

* Tight coupling
* Difficult testing
* Poor scalability

A **DI container** solves this by **centralizing object creation and dependency resolution**.

---

## 2. Installing PSR-11 Interfaces

PSR-11 defines standard interfaces for containers.

```bash
composer require psr/container
```

This provides:

* `Psr\Container\ContainerInterface`
* `NotFoundExceptionInterface`
* `ContainerExceptionInterface`

---

## 3. Creating the Container Class

### 3.1 Container Skeleton

```php
use Psr\Container\ContainerInterface;
use App\Exceptions\Container\NotFoundException;
use App\Exceptions\Container\ContainerException;

class Container implements ContainerInterface
{
    private array $entries = [];

    public function has(string $id): bool
    {
        return isset($this->entries[$id]);
    }

    public function set(string $id, callable $concrete): void
    {
        $this->entries[$id] = $concrete;
    }

    public function get(string $id)
    {
        if ($this->has($id)) {
            return $this->entries[$id]($this);
        }

        return $this->resolve($id);
    }
}
```

---

## 4. PSR-11 Exception Implementations

### 4.1 NotFoundException

```php
namespace App\Exceptions\Container;

use Exception;
use Psr\Container\NotFoundExceptionInterface;

class NotFoundException extends Exception implements NotFoundExceptionInterface {}
```

### 4.2 ContainerException

```php
namespace App\Exceptions\Container;

use Exception;
use Psr\Container\ContainerExceptionInterface;

class ContainerException extends Exception implements ContainerExceptionInterface {}
```

---

## 5. Manual Bindings (Configuration-Based DI)

Example of registering services manually:

```php
$container = new Container();

$container->set(InvoiceService::class, function ($container) {
    return new InvoiceService(
        $container->get(SalesTaxService::class),
        $container->get(PaymentGatewayService::class),
        $container->get(EmailService::class)
    );
});

$container->set(SalesTaxService::class, fn () => new SalesTaxService());
$container->set(PaymentGatewayService::class, fn () => new PaymentGatewayService());
$container->set(EmailService::class, fn () => new EmailService());
```

Usage:

```php
$invoiceService = $container->get(InvoiceService::class);
$invoiceService->process([]);
```

This works—but **does not scale well**.

---

## 6. Auto-Wiring with Reflection

To eliminate manual configuration, we implement **auto-wiring**.

---

## 7. Auto-Wiring Strategy

### Resolution Steps

1. Inspect the class
2. Ensure it is instantiable
3. Inspect the constructor
4. Resolve constructor dependencies recursively
5. Instantiate the class

---

## 8. Implementing `resolve()` Method

```php
use ReflectionClass;
use ReflectionNamedType;
use ReflectionUnionType;

public function resolve(string $id)
{
    $reflectionClass = new ReflectionClass($id);

    if (!$reflectionClass->isInstantiable()) {
        throw new ContainerException("Class {$id} is not instantiable");
    }

    $constructor = $reflectionClass->getConstructor();

    if (!$constructor) {
        return new $id;
    }

    $parameters = $constructor->getParameters();

    if (!$parameters) {
        return new $id;
    }

    $dependencies = array_map(function ($param) use ($id) {
        $type = $param->getType();

        if (!$type) {
            throw new ContainerException(
                "Failed to resolve {$id}: missing type hint for {$param->getName()}"
            );
        }

        if ($type instanceof ReflectionUnionType) {
            throw new ContainerException(
                "Failed to resolve {$id}: union types not supported"
            );
        }

        if ($type instanceof ReflectionNamedType && !$type->isBuiltin()) {
            return $this->get($type->getName());
        }

        throw new ContainerException(
            "Failed to resolve {$id}: invalid parameter {$param->getName()}"
        );
    }, $parameters);

    return $reflectionClass->newInstanceArgs($dependencies);
}
```

---

## 9. Using the Container Without Bindings

```php
$container = new Container();

$invoiceService = $container->get(InvoiceService::class);
$invoiceService->process([]);
```

✔ No configuration
✔ Dependencies resolved recursively
✔ Constructor injection works automatically

---

## 10. Controller Injection with DI

### 10.1 Controller with Constructor Injection

```php
class HomeController
{
    public function __construct(
        private InvoiceService $invoiceService
    ) {}

    public function index(): void
    {
        $this->invoiceService->process([]);
    }
}
```

---

## 11. Integrating the Container with the Router

### 11.1 Router Constructor

```php
class Router
{
    public function __construct(
        private Container $container
    ) {}

    public function resolve(string $controller)
    {
        return $this->container->get($controller);
    }
}
```

---

### 11.2 `public/index.php`

```php
$container = new Container();
$router = new Router($container);

$controller = $router->resolve(HomeController::class);
$controller->index();
```

✔ Controllers are now **fully resolved by the container**
✔ No `new` keyword in controllers or router
✔ Clean, decoupled architecture

---

## 12. What This Container Does NOT Support

This implementation **intentionally omits**:

* Singleton / shared instances
* Interface-to-implementation bindings
* Configuration files
* Scalar parameters
* Variadic / optional parameters
* Caching
* Union type resolution

---

## 13. Key Takeaways

* A DI container centralizes object creation
* PSR-11 standardizes container interfaces
* Reflection enables auto-wiring
* Recursive dependency resolution is the core mechanism
* Controllers and routers should **never manually instantiate dependencies**

---

### Final Result

You now have:

* A **PSR-11 compliant DI container**
* **Auto-wired dependency resolution**
* Clean constructor injection across your application

This is the **core idea behind modern PHP frameworks** like Laravel and Symfony.

---
