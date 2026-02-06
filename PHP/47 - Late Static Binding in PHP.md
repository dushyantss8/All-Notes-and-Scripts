# PHP Static Methods, Inheritance, and Late Static Binding

## 1. Introduction

This tutorial explains how static properties and methods behave with inheritance and why **late static binding (LSB)** exists. It contrasts **early binding** with **late binding**, demonstrates the limitations of `self`, and introduces the correct use of `static` for dynamic inheritance-aware calls.

---

# 2. Early Binding vs. Late Binding

### 2.1 Late Binding (Runtime Binding)

When calling methods on **objects**, PHP resolves the class using **runtime information**.

**Example:**

```php
class A {
    public $name = 'a';
    public function getName() {
        return $this->name;
    }
}

class B extends A {
    public $name = 'b';
}

$a = new A();
$b = new B();

echo $a->getName(); // a
echo $b->getName(); // b
```

`$this` refers to the **calling object**, not the class where the method is defined.
Hence, calls on `B` properly return `'b'`.

---

# 3. The Problem: Static Context Creates Early Binding

If we convert the properties and methods to **static**:

```php
class A {
    public static $name = 'a';
    public static function getName() {
        return self::$name;
    }
}

class B extends A {
    public static $name = 'b';
}

echo A::getName(); // a
echo B::getName(); // a ← Problem
```

### Why does this happen?

Because `self` is **early bound**.
It always resolves to the class where the method is **defined**, not where it is **called**.

`self` ignores inheritance hierarchy the moment it is evaluated at compile time.

---

# 4. Verifying Early Binding

Dumping the resolved class illustrates this:

```php
var_dump(self::class);
```

Both `A::getName()` and `B::getName()` output:

```
string(1) "A"
```

This proves `self` always binds to **A**, even when called on `B`.

---

# 5. Workarounds Before Late Static Binding

Before PHP implemented LSB, developers used:

### 5.1 Overriding methods in every subclass

Not ideal; breaks inheritance reusability.

### 5.2 `get_called_class()`

This function returns the class used in the static call:

```php
get_called_class(); // A or B depending on call
```

Developers used it to manually forward calls, but this was cumbersome.

---

# 6. Late Static Binding (PHP 5.3)

### Purpose

Late static binding allows static properties/methods/constant resolution to follow **runtime inheritance**, just like `$this` does for objects.

### Syntax

Replace `self` with **`static`**:

```php
class A {
    public static $name = 'a';
    public static function getName() {
        return static::$name;
    }
}

class B extends A {
    public static $name = 'b';
}

echo A::getName(); // a
echo B::getName(); // b  ← Correct
```

### How it works

When a static method is called:

1. PHP stores the class used in the **initial non-forwarding call** (e.g., `B::method()`).
2. Any usage of `static::` inside the method resolves to that stored class.

This provides runtime-aware static inheritance.

---

# 7. Forwarding vs. Non-Forwarding Calls

### Non-forwarding calls

Explicit calls such as:

```php
B::getName();
```

These store the calling class (`B`) for LSB.

### Forwarding calls

Calls involving:

* `self::`
* `parent::`

These can forward execution to another class and do **not** update the stored class.

---

# 8. Using `static` in Non-Static Context

`static` can be used inside non-static methods as well:

```php
public function getName() {
    return static::$name;
}
```

In object context, `static` resolves based on the **object’s class**, similar to `$this`, but with key differences.

### `$this` vs `static`

1. `$this` can access private methods of the same class; `static` may resolve differently.
2. `static` cannot access non-static properties.

---

# 9. Late Static Binding for Constants

LSB also applies to overwritten class constants:

```php
class A {
    const ROLE = 'A';
    public static function getRole() {
        return static::ROLE;
    }
}

class B extends A {
    const ROLE = 'B';
}

echo B::getRole(); // B
```

---

# 10. Using `static` for Object Creation (Factory Pattern)

Before PHP 8, return types allowed `self` or `parent`, which always bound early.

### Problem Example:

```php
class A {
    public static function make(): self {
        return new self;
    }
}

class B extends A {}

var_dump(B::make()); // object(A) ← Incorrect
```

### Using `static` solves this:

```php
class A {
    public static function make(): static {
        return new static;
    }
}

class B extends A {}

var_dump(B::make()); // object(B)
```

`new static` uses late static binding to instantiate the correct subclass, enabling inheritance-friendly factory methods.

---

# 11. Key Takeaways

1. **`self` is early-bound**
   Always resolves to the class where the method is defined.

2. **Static context breaks inheritance**
   Unless late static binding is used.

3. **`static` is late-bound**
   Resolves to the class used in the calling context at runtime.

4. **Use `static` instead of `self`** when:

   * Subclasses should inherit static behavior dynamically.
   * You want polymorphic static access to properties, constants, or constructors.

5. **PHP 8 allows `static` return types**, enabling inheritance-aware factories and fluent APIs.

---

# End of Tutorial