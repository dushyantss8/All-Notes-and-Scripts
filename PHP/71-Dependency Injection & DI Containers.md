# Dependency Injection in PHP: From Tight Coupling to IoC Containers

## 1. Problem Context: Testing and Hard-Coded Dependencies

In earlier lessons, unit tests were written for simple classes without dependencies. As soon as classes begin to depend on other services, **hard-coded dependencies** become a major problem:

* Tight coupling
* Poor testability
* Difficult refactoring
* Dependency explosion in higher-level classes

---

## 2. What Is Dependency Injection?

**Dependency Injection (DI)** is a technique where an object receives its dependencies instead of creating them internally.

### Formal Definition

In DI, dependencies are **provided to a class from the outside**, rather than instantiated by the class itself.

DI is a **specific implementation** of a broader principle called **Inversion of Control (IoC)**.

---

## 3. The Core Problem: Hard-Coded Dependencies

### ❌ Bad Design: Dependencies Created Internally

```php
class InvoiceService
{
    private PaymentGateway $paymentGateway;
    private TaxCalculator $taxCalculator;
    private EmailService $emailService;

    public function __construct()
    {
        $this->paymentGateway = new PaymentGateway();
        $this->taxCalculator  = new TaxCalculator();
        $this->emailService   = new EmailService();
    }

    public function process(array $data): void
    {
        // Process invoice
    }
}
```

### Problems

* `InvoiceService` controls object creation
* Impossible to swap dependencies
* Difficult to mock in unit tests
* Strong coupling to concrete implementations

---

## 4. Inversion of Control via Constructor Injection

### ✅ Solution: Constructor Dependency Injection

```php
class InvoiceService
{
    public function __construct(
        private PaymentGateway $paymentGateway,
        private TaxCalculator $taxCalculator,
        private EmailService $emailService
    ) {}

    public function process(array $data): void
    {
        // Process invoice
    }
}
```

### Benefits

* Loose coupling
* Dependencies can be mocked or replaced
* Improved testability
* Clear dependency graph

---

## 5. Using Interfaces for Even Better Decoupling

Instead of depending on concrete classes, depend on **abstractions**.

```php
interface PaymentGatewayInterface
{
    public function charge(float $amount): bool;
}
```

```php
class StripePaymentGateway implements PaymentGatewayInterface
{
    public function charge(float $amount): bool
    {
        return true;
    }
}
```

```php
class InvoiceService
{
    public function __construct(
        private PaymentGatewayInterface $paymentGateway
    ) {}
}
```

Now implementations can be swapped **at runtime**.

---

## 6. The Next Problem: Dependency Injection Moves the Problem Upward

### Controller Needs the Service

```php
class InvoiceController
{
    public function store(): void
    {
        $invoiceService = new InvoiceService(
            new PaymentGateway(),
            new TaxCalculator(),
            new EmailService()
        );

        $invoiceService->process($_POST);
    }
}
```

### Issue

* Controller is now tightly coupled
* Dependencies are still manually created
* Dependency trees become deeply nested

---

## 7. Applying Dependency Injection to Controllers

### ✅ Refactored Controller

```php
class InvoiceController
{
    public function __construct(
        private InvoiceService $invoiceService
    ) {}

    public function store(): void
    {
        $this->invoiceService->process($_POST);
    }
}
```

Now:

* Controller is clean
* Business logic is separated
* Dependencies are explicit

---

## 8. The Real Question: Who Creates the Controller?

At some point, something **must instantiate everything**.

Example: A Router

```php
class Router
{
    public function dispatch(string $controller, string $method)
    {
        $instance = new $controller();
        $instance->$method();
    }
}
```

### Problem

* Router cannot guess dependencies
* Controllers have different constructors
* Manual wiring everywhere is not scalable

---

## 9. Dependency Explosion (Why Manual Wiring Fails)

Consider this dependency graph:

```
Controller
 └── InvoiceService
     ├── PaymentGateway
     │   └── ApiClient
     │       └── Logger
     ├── TaxCalculator
     └── EmailService
```

Manually wiring this becomes unmanageable.

---

## 10. The Solution: Dependency Injection Container

### What Is a DI Container?

A **Dependency Injection Container** is a class that:

* Knows how to build objects
* Resolves dependencies automatically
* Manages object creation centrally

### Conceptually

```php
$container->get(InvoiceService::class);
```

The container:

1. Inspects the constructor
2. Resolves required dependencies
3. Instantiates everything recursively

---

## 11. Role of PSR-11

**PSR-11** defines a standard interface for containers.

```php
interface ContainerInterface
{
    public function get(string $id);
    public function has(string $id): bool;
}
```

This allows:

* Interoperability between libraries
* Framework-agnostic containers
* Consistent dependency resolution APIs

---

## 12. Framework Example: Automatic IoC Resolution

Frameworks like **Laravel** provide:

* Automatic constructor resolution
* Reflection-based auto-wiring
* Interface-to-implementation binding

```php
class InvoiceController
{
    public function __construct(InvoiceService $service) {}
}
```

No manual wiring is required.

---

## 13. What Comes Next

Upcoming topics introduced in this lesson:

* Building a simple DI container
* Reflection API for auto-wiring
* Recursive dependency resolution
* How IoC containers work internally
* Laravel’s container as a real-world example

---

## Key Takeaways

* Dependency Injection removes tight coupling
* Constructor injection is preferred
* Interfaces improve flexibility
* DI shifts object creation responsibility upward
* DI Containers solve dependency explosion
* PSR-11 standardizes container behavior

---