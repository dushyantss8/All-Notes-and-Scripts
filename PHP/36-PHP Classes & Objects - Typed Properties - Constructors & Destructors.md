# PHP Classes and Objects: -

## 1. Overview of Objects in PHP

PHP provides several data types. Prior lessons covered:

* Scalar types (int, float, string, bool)
* Arrays
* Callables
* Resources
* Null

Remaining:

* Iterables (covered later)
* Objects (covered in this lesson)

Objects are instances of classes. A class serves as a blueprint, while an object represents a concrete instance created from that blueprint.

PHP includes a generic built-in class (`stdClass`) usable for generic objects, but most development relies on custom classes.

---

# 2. Defining a Class

### Basic Syntax

```php
class Transaction {
    // class body
}
```

Rules:

* Class names must start with a letter or underscore.
* File naming conventions vary, but the recommended practice is **one class per file** and filename matching the class name.

---

# 3. Creating Objects

### Instantiation

```php
$transaction = new Transaction();
```

The `new` keyword creates a new instance. Parentheses should be included even if the class has no constructor.

### Importing class files

Without autoloading (to be covered later), you must manually include class definitions:

```php
require_once '../Transaction.php';
```

If omitted, instantiation causes a fatal error.

---

# 4. Class Properties

### Defining Properties

Properties require visibility modifiers:

```php
class Transaction {
    public $amount;
    public $description;
}
```

Visibility types:

* `public`: Accessible anywhere.
* `private`: Accessible only within the class.
* `protected`: Accessible within the class and child classes (covered in inheritance).

Default property values without type declarations are `null`.

### Accessing Properties Using the Object Operator (`->`)

```php
echo $transaction->amount;
$transaction->amount = 15;
```

Changing properties works only if visibility allows access.

---

# 5. Typed Properties (PHP 7.4+)

You may declare types:

```php
public float $amount;
public string $description;
```

Typed properties without default values begin in an **uninitialized** state. Accessing them before assignment causes a fatal error.

### Nullable Types

Declared using `?`, but still require initialization:

```php
public ?float $amount; // Can be null, but still uninitialized until assigned.
```

### Default Values

You may assign constant default values:

```php
public float $amount = 0.0;
```

Cannot use function calls or complex expressions.

---

# 6. Constructors

Constructors initialize properties when a class instance is created.

### Defining a Constructor

```php
class Transaction {
    private float $amount;
    private string $description;

    public function __construct(float $amount, string $description) {
        $this->amount = $amount;
        $this->description = $description;
    }
}
```

Usage:

```php
$transaction = new Transaction(15, 'Transaction 1');
```

`$this` refers to the current object instance.

Strict typing may be enabled using:

```php
declare(strict_types=1);
```

---

# 7. Methods

Methods are functions inside classes. They also require access modifiers.

### Example: Adding Tax

```php
public function addTax(float $rate): void {
    $this->amount += ($this->amount * $rate) / 100;
}
```

### Example: Applying Discount

```php
public function applyDiscount(float $rate): void {
    $this->amount -= ($this->amount * $rate) / 100;
}
```

### Private vs Public Methods

* `private` methods cannot be called from outside.
* Methods should typically be `public` unless meant for internal use only.

---

# 8. Encapsulation with Getters

Since properties may be private, getters expose values safely:

```php
public function getAmount(): float {
    return $this->amount;
}
```

---

# 9. Method Chaining

To chain methods, return `$this`:

```php
public function addTax(float $rate): Transaction {
    $this->addTaxLogic();
    return $this;
}

public function applyDiscount(float $rate): Transaction {
    $this->applyDiscountLogic();
    return $this;
}
```

Usage:

```php
$amount = (new Transaction(100, 'T1'))
    ->addTax(8)
    ->applyDiscount(10)
    ->getAmount();
```

Method chaining is suitable when building up internal state, not when functions must return computed values.

---

# 10. Multiple Instances

You can create unlimited objects:

```php
$t1 = new Transaction(100, 'T1');
$t2 = new Transaction(200, 'T2');
```

Each instance maintains its own state.

---

# 11. Destructors

Destructors are magic methods triggered when an object is destroyed or when no references remain.

### Declaring a Destructor

```php
public function __destruct() {
    echo "Destruct: {$this->description}";
}
```

### When destructors run:

* At the end of script execution.
* When `unset($object)` is called.
* When `$object = null` is assigned.

### Special notes:

* `exit` triggers destructors before termination.
* An `exit` statement inside a destructor prevents destructors of other objects from running.

Destructors are often used for cleanup tasks such as:

* Closing database connections
* Releasing resources
* Freeing handles or locks

---

# 12. Working with `stdClass`

### JSON Decode

```php
$json = '{"a":1,"c":3}';
$object = json_decode($json);
```

`json_decode()` without the associative flag returns an `stdClass` object.

Accessing properties:

```php
echo $object->a; // 1
```

### Creating Generic Objects

```php
$obj = new stdClass();
$obj->a = 1;
$obj->b = 2;
```

---

# 13. Casting to Objects

### Arrays → Objects

```php
$arr = [1, 2, 3];
$obj = (object) $arr;
```

Keys become property names:

* `$obj->{0}`
* `$obj->{1}`

### Scalars → Objects

```php
$intObj = (object) 5;
echo $intObj->scalar; // 5
```

Casting applies to int, float, string, and bool. Value appears under a property named `scalar`.

### Null → Object

```php
$obj = (object) null; // empty stdClass object
```

---

# 14. Summary

This lesson introduces:

* Classes, objects, visibility, properties, and methods
* Typed properties, constructors, destructors
* Encapsulation with getters
* Method chaining for fluent interfaces
* `stdClass` usage and type casting behaviors

Upcoming topics include PHP 8 features like:

* Constructor property promotion
* Nullsafe operator

These extend the object-oriented features introduced above.

---

# End of Tutorial