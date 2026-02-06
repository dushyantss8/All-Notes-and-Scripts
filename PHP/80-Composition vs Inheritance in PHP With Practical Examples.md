# Composition vs Inheritance in Object-Oriented Programming (PHP)

## 1. Introduction

In object-oriented programming (OOP), **inheritance** and **composition** are two primary ways to establish relationships between classes. While inheritance is often introduced first, composition is frequently the better design choice in real-world applications.

This guide explains:

* Why inheritance is often misused
* How composition solves common design problems
* When inheritance is still appropriate
* How interfaces complement composition

All examples are written in **PHP**, but the principles apply to OOP in general.

---

## 2. The Initial Problem: An Overloaded `Invoice` Class

Consider an `Invoice` class whose responsibility is to create invoices.

### Responsibilities:

* Calculate line item totals
* Calculate sales tax
* Create the invoice

### Example Implementation

```php
class Invoice
{
    public function create(array $lineItems): void
    {
        $subtotal = array_sum(array_map(
            fn($item) => $item['unit_price'] * $item['quantity'],
            $lineItems
        ));

        $salesTax = $subtotal * 0.07;

        echo "Subtotal: {$subtotal}\n";
        echo "Sales Tax: {$salesTax}\n";
        echo "Total: " . ($subtotal + $salesTax) . "\n";
    }
}
```

### Usage

```php
$invoice = new Invoice();

$invoice->create([
    ['unit_price' => 100, 'quantity' => 1],
    ['unit_price' => 50, 'quantity' => 2],
    ['unit_price' => 25, 'quantity' => 4],
]);
```

This works, but there is a **design issue**.

---

## 3. Identifying the Design Smell

The `Invoice` class is responsible for **sales tax calculation**, but:

* Sales tax logic is not invoice-specific
* Other classes (e.g., `Payment`) may also need tax calculation
* Duplication violates the **DRY (Don’t Repeat Yourself)** principle

---

## 4. Attempt #1: Code Duplication (Rejected)

Copying tax logic into multiple classes leads to:

* Maintenance problems
* Inconsistent behavior
* Difficult refactoring

This approach should be avoided.

---

## 5. Attempt #2: Inheritance for Code Reuse (Misuse)

### Extracting a Parent Class

```php
class SalesTaxCalculator
{
    public function calculate(float $total): float
    {
        return $total * 0.07;
    }
}
```

```php
class Invoice extends SalesTaxCalculator
{
    public function create(array $lineItems): void
    {
        $subtotal = array_sum(array_map(
            fn($item) => $item['unit_price'] * $item['quantity'],
            $lineItems
        ));

        $salesTax = $this->calculate($subtotal);
        echo $subtotal + $salesTax;
    }
}
```

### Why This Is Wrong

Using inheritance here introduces multiple problems:

1. **Incorrect Relationship**

   * An invoice is **not** a sales tax calculator
   * The “is-a” relationship does not make sense

2. **Tight Coupling**

   * `Invoice` is now tightly bound to tax calculation logic

3. **Unwanted Inherited Behavior**

   * Any future public/protected methods added to `SalesTaxCalculator` are inherited automatically

4. **Inheritance Used for Code Reuse**

   * Inheritance is meant for polymorphism, not reuse

---

## 6. The Correct Solution: Composition

Instead of inheriting behavior, **inject it as a dependency**.

### Sales Tax Calculator

```php
class SalesTaxCalculator
{
    public function calculate(float $total): float
    {
        return $total * 0.07;
    }
}
```

### Invoice Using Composition

```php
class Invoice
{
    private SalesTaxCalculator $taxCalculator;

    public function __construct(SalesTaxCalculator $taxCalculator)
    {
        $this->taxCalculator = $taxCalculator;
    }

    public function create(array $lineItems): void
    {
        $subtotal = array_sum(array_map(
            fn($item) => $item['unit_price'] * $item['quantity'],
            $lineItems
        ));

        $salesTax = $this->taxCalculator->calculate($subtotal);
        echo $subtotal + $salesTax;
    }
}
```

### Benefits

* Proper **has-a** relationship
* No unnecessary inherited methods
* Easy reuse across multiple classes
* Loosely coupled and testable

---

## 7. Customizing Behavior Without Inheritance

A class can still customize behavior while using composition:

```php
class Invoice
{
    public function calculateTax(float $total): float
    {
        // Custom logic
        return $this->taxCalculator->calculate($total);
    }
}
```

Composition does not limit flexibility.

---

## 8. When “Is-A” Still Fails: The Payment Example

### Initial Design

```php
class Payment {}
class CreditCardPayment extends Payment {}
class AchPayment extends Payment {}
```

This seems reasonable.

### Problem Over Time

* New payment types (e.g., Crypto)
* Some subclasses don’t need all base functionality
* Methods must be overridden or disabled
* Exceptions thrown to block behavior

This leads to fragile and hard-to-maintain code.

---

## 9. The Game NPC Example: Inheritance Collapse

### Initial Design

```php
abstract class Npc
{
    public function move() {}
    public function attack() {}
}
```

```php
class Dragon extends Npc {}
class Gorilla extends Npc {}
class Alligator extends Npc {}
```

### New Requirements

* Quest givers cannot attack
* Pets can attack but are not monsters
* Some NPCs can fly, swim, both, or neither

### Resulting Problems

* Methods overridden only to throw exceptions
* Artificial class hierarchies
* Duplicated behavior
* Incorrect inheritance chains

This is a classic example of **inheritance predicting the future—and failing**.

---

## 10. Composition as the Scalable Alternative

Instead of inheritance, extract **behaviors**:

```php
interface Attackable
{
    public function attack(): void;
}

interface Movable
{
    public function move(): void;
}
```

```php
class Npc
{
    public function __construct(
        private ?Attackable $attack,
        private ?Movable $move
    ) {}
}
```

Now behaviors are:

* Opt-in
* Reusable
* Independent

---

## 11. Enhancing Composition with Interfaces

### Problem

The `SalesTaxCalculator` depends on a **specific implementation**.

### Solution: Interface Abstraction

```php
interface SalesTaxService
{
    public function calculate(float $total): float;
}
```

```php
class TaxJarService implements SalesTaxService
{
    public function calculate(float $total): float
    {
        // External API call
        return $total * 0.07;
    }
}
```

```php
class SalesTaxCalculator
{
    public function __construct(
        private SalesTaxService $service
    ) {}

    public function calculate(float $total): float
    {
        return $this->service->calculate($total);
    }
}
```

### Benefits

* Decoupled from implementation
* Easily swappable services
* Cleaner dependency inversion

---

## 12. Key Notes, Best Practices, and Considerations

### Prefer Composition When:

* You only need part of another class’s behavior
* Future requirements are uncertain
* You want loose coupling
* You want easier unit testing

### Use Inheritance Only If:

* The **is-a** relationship is undeniably correct
* Subclasses fully support parent behavior
* No methods need to be disabled or overridden to throw exceptions
* Substitutability is guaranteed (LSP compliant)

### Warning Signs of Bad Inheritance:

* Overriding methods to disable functionality
* Throwing exceptions in overridden parent methods
* Subclasses that use only a fraction of parent behavior
* Frequent refactoring of base classes

### Design Guidelines:

* Inheritance models **identity**
* Composition models **capability**
* Interfaces define **contracts**
* Behavior should be **opt-in**, not forced

---

## Conclusion

Inheritance is not inherently bad—but it is often misapplied. Composition offers greater flexibility, better separation of concerns, and long-term maintainability. In modern PHP applications, **composition + interfaces** should be your default approach, with inheritance reserved for well-defined, stable hierarchies.

---
