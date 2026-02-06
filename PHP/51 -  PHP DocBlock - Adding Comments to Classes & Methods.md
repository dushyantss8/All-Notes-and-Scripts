# PHP DocBlocks: -

## 1. Overview of DocBlocks

DocBlocks are structured multi-line comments used to document PHP code.
They enhance readability, support IDE auto-completion, allow generation of API documentation, and may influence behavior through annotations (or attributes in modern PHP).

**Syntax:**
A DocBlock begins with `/**` and ends with `*/`, similar to multi-line comments but with an extra asterisk.

```php
/**
 * This is a DocBlock.
 */
```

DocBlocks can be placed above:

* Classes
* Methods and functions
* Properties and variables
* Interfaces
* Constants

---

# 2. Common DocBlock Tags

## 2.1 `@param` and `@return`

These tags document method/function arguments and return types.
Useful when:

* Not using type hints
* Providing additional context
* Defining multiple accepted types (before PHP 8 union types)

### Example: Method Documentation

```php
class Transaction
{
    /**
     * Processes a payment.
     *
     * @param Customer $customer  The customer making the payment.
     * @param float    $amount    The amount of the transaction.
     * @return bool               Returns true on success, false on failure.
     */
    public function process($customer, $amount)
    {
        return true;
    }
}
```

### Modern alternative (PHP 7.4+ / PHP 8+)

Instead of DocBlocks, you can type-hint directly:

```php
public function process(Customer $customer, float $amount): bool
{
    return true;
}
```

### When DocBlocks remain useful:

* When adding descriptive text
* When documenting union types before PHP 8
* When providing meta information (e.g., business logic explanation)

---

## 2.2 `@throws`

Documents which exceptions a method may throw.

```php
/**
 * @throws InvalidArgumentException
 * @throws RuntimeException
 */
public function process(...)
{
    ...
}
```

This tag does not influence execution; it only informs developers and IDEs.

---

## 2.3 `@var`

Documents the type of a property or variable.

### Before PHP 7.4

Properties could not be typed:

```php
class Transaction
{
    /**
     * @var Customer
     */
    private $customer;

    /**
     * @var float
     */
    private $amount;
}
```

### After PHP 7.4

Typed properties reduce the need for `@var`:

```php
private Customer $customer;
private float $amount;
```

### `@var` in loops (IDE autocompletion)

When iterating over arrays of objects:

```php
/**
 * @var Customer[] $customers
 */
foreach ($customers as $customer) {
    echo $customer->name;
}
```

Alternatively, attach DocBlock to method signature:

```php
/**
 * @param Customer[] $customers
 */
public function foo(array $customers) {
    ...
}
```

This enables IDEs to infer available properties/methods.

---

## 2.4 `@property` and `@method`

Used to document dynamic or magic properties/methods generated via magic methods (`__get`, `__set`, `__call`, `__callStatic`).

### Example: Magic Properties

```php
/**
 * @property int   $x
 * @property float $y
 */
class Transaction
{
    public function __get(string $name)
    {
        // TODO: Implement __get() method.
    }

    public function __set(string $name, $value): void
    {
        // TODO: Implement __set() method.
    }
}
```

### Example: Magic Methods

```php
/**
 * @method int    foo(string $x)
 * @method static float bar(int $a)
 */
class Transaction
{
    // __call and __callStatic implemented here
}
```

This enables IDE auto-completion for methods that do not exist physically in the class.

### Read-only or write-only:

```php
@property-read int $x
@property-write float $y
```

These produce IDE warnings if misused.

---

# 3. DocBlocks vs PHP Type Declarations

## Why many developers use fewer DocBlocks today:

1. **PHP 7.4+ typed properties** reduce the need for `@var`.
2. **PHP 8+ union types** reduce the need for `@param` and `@return` with multiple types.
3. Method signatures can often fully describe method behavior.
4. Excessive DocBlocks add noise without real value.

DocBlocks remain valuable for:

* Additional context/explanations
* Edge cases
* Framework-specific annotations
* Tools that parse metadata
* Legacy codebases

---

# 4. Annotations vs Attributes

DocBlocks historically supported "annotations" (metadata processed by frameworks, e.g., Doctrine).
PHP 8 introduced **attributes**, a structured language feature replacing annotation-style metadata.

Attributes will be covered separately in the course.

---

# 5. Best Practices

* Do not document trivial methods where type hints already describe everything.
* Use DocBlocks only when providing meaningful additional information.
* Overuse of DocBlocks may indicate overly complex methods—consider refactoring.
* The choice to document extensively or minimally is personal and team-driven.

---

# End of Tutorial