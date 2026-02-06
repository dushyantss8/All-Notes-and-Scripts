# Covariance and Contravariance in PHP (with Practical Examples)

## 1. Why Variance Matters in PHP

When a class **extends another class** or **implements an interface**, PHP must ensure that overridden methods remain **type-safe**.

This involves checking:

* **Parameter types**
* **Return types**

Different languages enforce these rules differently:

* **Invariant typing** → exact type match required
* **Variant typing** → compatible but not necessarily identical types allowed

PHP supports **variance**, starting from **PHP 7.4**, to allow safer and more flexible inheritance.

---

## 2. Key Terminology

| Term               | Meaning                                 |
| ------------------ | --------------------------------------- |
| **Invariant**      | Exact type match required               |
| **Covariance**     | Return type can be **more specific**    |
| **Contravariance** | Parameter type can be **less specific** |

---

## 3. Covariant Return Types (PHP 7.4+)

### Definition

> **Covariance** allows a child method to return a **more specific type** than its parent method.

---

### Example: Animal Shelter

#### Base Classes

```php
<?php
declare(strict_types=1);

abstract class Animal
{
    abstract public function speak(): string;
}

class Dog extends Animal
{
    public function speak(): string
    {
        return 'Woof!';
    }
}

class Cat extends Animal
{
    public function speak(): string
    {
        return 'Meow!';
    }
}
```

---

#### Interface Definition

```php
interface AnimalShelter
{
    public function adopt(string $name): Animal;
}
```

---

#### Implementations (Covariant Return Types)

```php
class DogShelter implements AnimalShelter
{
    public function adopt(string $name): Dog
    {
        return new Dog();
    }
}

class CatShelter implements AnimalShelter
{
    public function adopt(string $name): Cat
    {
        return new Cat();
    }
}
```

**Why this works**

* `Dog` and `Cat` are **subclasses of `Animal`**
* Returning a **more specific type** is allowed

---

#### Usage

```php
$catShelter = new CatShelter();
$dogShelter = new DogShelter();

$cat = $catShelter->adopt('Whiskers');
$dog = $dogShelter->adopt('Buddy');

echo $cat->speak(); // Meow!
echo $dog->speak(); // Woof!
```

---

### Summary: Covariance

* ✔ Allowed in PHP (7.4+)
* ✔ Applies to **return types**
* ✔ Less specific → more specific (`Animal → Dog`)

---

## 4. Contravariant Parameter Types

### Definition

> **Contravariance** allows a child method to accept a **less specific parameter type** than its parent method.

---

### Example: Feeding Animals

#### Food Hierarchy

```php
class Food {}

class AnimalFood extends Food {}
```

---

#### Base Class

```php
class Animal
{
    public function eat(AnimalFood $food): void
    {
        echo "Eating animal food\n";
    }
}
```

---

#### Child Class (Contravariant Parameter)

```php
class Dog extends Animal
{
    public function eat(Food $food): void
    {
        echo "Dog eating food\n";
    }
}
```

**Why this works**

* `Food` is **less specific** than `AnimalFood`
* The child method **widens** the accepted input

---

#### Usage

```php
$dog = new Dog();
$animalFood = new AnimalFood();
$food = new Food();

$dog->eat($animalFood);
$dog->eat($food);
```

---

### Summary: Contravariance

* ✔ Allowed in PHP (7.4+)
* ✔ Applies to **parameters**
* ✔ More specific → less specific (`AnimalFood → Food`)

---

## 5. PHP Version Compatibility

| PHP Version | Covariance      | Contravariance  |
| ----------- | --------------- | --------------- |
| ≤ PHP 7.3   | ❌ Not supported | ❌ Not supported |
| PHP 7.4+    | ✔ Supported     | ✔ Supported     |

In PHP ≤ 7.3, the above examples would produce **fatal compatibility errors**.

---

## 6. What PHP Does NOT Support

### ❌ Covariant Parameter Types

```php
// NOT ALLOWED
class Dog extends Animal
{
    public function eat(AnimalFood $food): void {}
}
```

You **cannot narrow parameter types** in child methods.

---

### ❌ Contravariant Return Types

```php
interface Shelter
{
    public function adopt(): Dog;
}

class AnimalShelter implements Shelter
{
    public function adopt(): Animal {} // ❌ Not allowed
}
```

You **cannot return a more general type** than the parent.

---

## 7. Constructors Are an Exception

Constructors **do not follow variance rules**.

```php
class Food {}

class AnimalFood extends Food
{
    public function __construct(string $type) {}
}
```

Child constructors may:

* Change parameters
* Add new dependencies

As long as `parent::__construct()` is handled correctly (if used).

---

## 8. Variance with Union and Intersection Types (PHP 8+)

### Covariance with Union Types (Return Types)

```php
// Parent
public function getFood(): Food|AnimalFood {}

// Child (covariant)
public function getFood(): AnimalFood {}
```

Removing union members = **more specific** → covariant.

---

### Contravariance with Union Types (Parameters)

```php
// Parent
public function eat(AnimalFood $food) {}

// Child (contravariant)
public function eat(Food|AnimalFood $food) {}
```

Adding union members = **less specific** → contravariant.

---

## 9. Relation to Liskov Substitution Principle (LSP)

### LSP Definition

> Subclasses must be **substitutable** for their parent classes without breaking behavior.

---

### Why Contravariance Is Safe

```php
Animal $animal = new Dog();
$animal->eat(new AnimalFood());
```

* Child accepts **everything the parent accepts**
* Behavior remains valid

---

### Why Covariant Parameters Would Break LSP

If PHP allowed:

```php
class Dog extends Animal
{
    public function eat(AnimalFood $food) {}
}
```

Then:

```php
Animal $animal = new Dog();
$animal->eat(new Food()); // ❌ breaks
```

This **narrows** behavior → violates LSP.

---

## 10. Final Summary

| Concept                  | PHP Support | Direction          |
| ------------------------ | ----------- | ------------------ |
| Covariant return types   | ✔ Yes       | General → Specific |
| Contravariant parameters | ✔ Yes       | Specific → General |
| Covariant parameters     | ❌ No        | Unsafe             |
| Contravariant returns    | ❌ No        | Unsafe             |

---

### Key Takeaway

PHP’s variance rules are designed to:

* Preserve **type safety**
* Enforce **Liskov Substitution Principle**
* Prevent unsafe narrowing of behavior

If inheritance starts to violate these rules, **composition** is usually the better design choice.

---