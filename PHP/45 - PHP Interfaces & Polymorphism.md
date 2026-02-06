# PHP Interfaces: -

## 1. Introduction to Interfaces

An **interface** defines a contract that specifies *what* methods a class must implement, but not *how* they are implemented. Interfaces enable multiple different classes to provide their own implementations of the same required methods.

Key principle:

* An interface provides the required actions.
* Concrete classes choose how those actions are executed.

---

## 2. Declaring an Interface

Interfaces are created with the `interface` keyword.

Example:

```php
namespace App;

interface DebtCollector
{
    public function collect(float $owed): float;
}
```

Conventions vary:

* Some teams append `Interface` or `Contract` to the name.
* Consistency across the codebase is most important.

---

## 3. Implementing an Interface

A concrete class uses the `implements` keyword to adopt an interface.

Example:

```php
namespace App;

class CollectionAgency implements DebtCollector
{
    public function collect(float $owed): float
    {
        // Implementation goes here
    }
}
```

Key rules:

* All methods declared in an interface **must** be implemented.
* Method signatures must match exactly.
* Interface methods are always **public**.

---

## 4. Additional Interface Rules

### 4.1. Constructors in Interfaces

Interfaces can require magic methods including constructors:

```php
public function __construct();
```

Any implementing class must define that constructor.

### 4.2. Multiple Interface Implementation

A class can implement *multiple* interfaces:

```php
class SomeClass implements InterfaceA, InterfaceB
{
    // Must implement all methods in both interfaces
}
```

If two interfaces declare methods with identical names but incompatible signatures, PHP will throw errors.

---

## 5. Interface Inheritance

Interfaces can extend *multiple* interfaces:

```php
interface DebtCollector extends InterfaceA, InterfaceB
{
}
```

Any class implementing `DebtCollector` must implement:

* All methods in `DebtCollector`
* All methods required by `InterfaceA` and `InterfaceB`

---

## 6. Constants and Properties in Interfaces

* Interfaces **cannot have properties**.
* Interfaces **can have constants**:

```php
public const MY_CONSTANT = 1;
```

Differences from class constants:

* Interface constants **cannot be overridden** in implementing classes.

---

## 7. Implementing Logic: Debt Collection Example

Concrete implementation using randomness:

```php
public function collect(float $owed): float
{
    $guaranteed = $owed * 0.5;
    return mt_rand($guaranteed, $owed);
}
```

Another implementation (e.g., Rocky):

```php
class Rocky implements DebtCollector
{
    public function collect(float $owed): float
    {
        return $owed * 0.65;
    }
}
```

Each implementation varies, but follows the required contract.

---

## 8. Why Interfaces Matter: The Problem They Solve

### Without interfaces:

A service might hard-code a specific class type:

```php
public function collectDebt(CollectionAgency $collector)
```

Problem:

* The method cannot accept another implementation (e.g., `Rocky`).
* The code becomes rigid and hard to change.

### With interfaces:

Use interface type-hinting:

```php
public function collectDebt(DebtCollector $collector)
```

Benefits:

* Any implementation (`CollectionAgency`, `Rocky`, etc.) can be injected.
* Code becomes flexible and easily maintainable.

---

## 9. Polymorphism and Interfaces

Polymorphism = “many forms.”
An object is polymorphic if it can satisfy multiple type checks:

```php
$collector instanceof Rocky;             // possible
$collector instanceof CollectionAgency;  // also possible
```

When type-hinting the interface, the argument can take different forms, enabling polymorphism.

---

## 10. Comparison: Interfaces vs Abstract Classes

| Feature                            | Interface            | Abstract Class                 |
| ---------------------------------- | -------------------- | ------------------------------ |
| Method bodies allowed?             | No                   | Yes                            |
| Properties allowed?                | No                   | Yes                            |
| Method visibility                  | Must be public       | Any (public/protected/private) |
| Multiple inheritance               | Yes (implement many) | No (extend only one)           |
| Can enforce constructor signature? | Yes                  | Yes                            |

---

## 11. Using Interfaces with Abstract Classes Together

You can combine them:

```php
abstract class BaseField implements Renderable
{
    abstract public function render(): string;
}
```

Interface:

```php
interface Renderable
{
    public function render(): string;
}
```

Benefit:

* Abstract class provides shared base logic.
* Interface acts as a cross-cutting contract usable by unrelated classes.

---

## 12. When to Use Interfaces

Use interfaces when:

1. A class can have **multiple implementations**.
2. You see repeated `instanceof` checks or switch statements — a sign of poor abstraction.
3. You need to define a **contract** without specifying behavior.
4. You need polymorphism and flexibility in dependency injection.

Avoid interfaces:

* For every class unnecessarily. Use only when future variability is expected.

---

## 13. Real-World Examples (PSR Standards)

Modern PHP uses extensive interface-driven design.

Examples:

* **PSR-3 LoggerInterface**: Multiple logging drivers implement common methods.
* **PSR-6 CacheInterface**: Swap Redis, Memcached, filesystem caching.
* **PSR-11 ContainerInterface**: Common contract for dependency injection containers.

Benefit:

* Frameworks like Laravel let you plug in new drivers simply by implementing an interface.

---

## 14. Summary

Interfaces:

* Define required methods.
* Cannot include implementations.
* Allow multiple implementations and polymorphism.
* Enable clean, maintainable, scalable architectures.
* Work well with abstract classes where shared base functionality is needed.

They are fundamental for designing robust, flexible PHP applications and are widely used in frameworks and standards (PSR).

---

# End of Tutorial