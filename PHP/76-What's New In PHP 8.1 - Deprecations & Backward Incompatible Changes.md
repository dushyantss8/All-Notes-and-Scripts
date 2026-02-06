# PHP 8.1 — New Features, Changes, and Deprecations (Technical Guide)

## 1. Installing PHP 8.1 with Docker

### Update Docker Image

PHP 8.1 was initially available via Release Candidates (RC).

```dockerfile
FROM php:8.1.0RC6-fpm
```

Rebuild containers:

```bash
docker-compose up -d --build
```

Verify:

```bash
php -v
```

---

## 2. Array Unpacking with String Keys (New in 8.1)

### Before PHP 8.1 (Not Supported)

```php
$arr1 = ['a' => 1];
$arr2 = ['b' => 2];

$result = [...$arr1, ...$arr2]; // ❌ Fatal error in PHP < 8.1
```

### PHP 8.1+

```php
$arr1 = ['a' => 1, 'b' => 2];
$arr2 = ['b' => 5, 'c' => 3];

$result = [...$arr1, ...$arr2];
print_r($result);
```

**Output**

```php
[
  'a' => 1,
  'b' => 5, // overwritten
  'c' => 3
]
```

➡️ Behavior is identical to `array_merge()`.

---

## 3. Native Enumerations (Enums)

### Problem with Constants

```php
class PaymentStatus {
    public const PAID = 1;
}

function updateStatus($status) {
    // accepts anything
}

updateStatus(5); // ❌ allowed
```

---

### Enum Definition

```php
enum PaymentStatus {
    case PAID;
    case VOID;
    case DECLINED;
}
```

### Type-Safe Usage

```php
class Invoice {
    public function setStatus(PaymentStatus $status): void {
        $this->status = $status;
    }
}
```

```php
$invoice->setStatus(PaymentStatus::PAID); // ✅
$invoice->setStatus(5);                   // ❌ TypeError
```

---

### Enum as Object

```php
var_dump(PaymentStatus::PAID);
```

---

### Accessing Case Name

```php
echo PaymentStatus::PAID->name; // "PAID"
```

---

### Enum Methods

```php
enum PaymentStatus {
    case PAID;
    case VOID;
    case DECLINED;

    public function text(): string {
        return match ($this) {
            self::PAID => 'Paid',
            self::VOID => 'Void',
            self::DECLINED => 'Declined',
        };
    }
}
```

```php
echo PaymentStatus::PAID->text(); // Paid
```

---

### Backed Enums (Scalar Values)

```php
enum PaymentStatus: int {
    case PAID = 1;
    case VOID = 2;
    case DECLINED = 3;
}
```

```php
echo PaymentStatus::PAID->value; // 1
```

⚠️ Backed enums support **only one scalar type** (`int` or `string`).

---

## 4. Readonly Properties

### Before PHP 8.1

DTOs required private properties + getters.

---

### PHP 8.1 Readonly Properties

```php
class Address {
    public function __construct(
        public readonly string $street,
        public readonly string $city
    ) {}
}
```

```php
$address = new Address('Main St', 'NY');
echo $address->street;
```

❌ Modification is forbidden:

```php
$address->street = 'Other St'; // Fatal error
```

---

### Rules

* Must be **typed**
* Cannot have default values (except promoted parameters)
* Can be `public`

---

## 5. Intersection Types

### Union Type (PHP 8.0)

```php
function process(Payable|Syncable $obj) {}
```

### Intersection Type (PHP 8.1)

```php
function process(Payable&Syncable $obj) {}
```

➡️ Object **must implement both interfaces**

### Limitations

* Cannot mix union & intersection
* Only class/interface types allowed

---

## 6. `never` Return Type

### Definition

A function that **never returns** (exits or throws).

```php
function fail(): never {
    throw new Exception('Fatal');
}
```

```php
function redirect(): never {
    header('Location: /');
    exit;
}
```

### Difference from `void`

| Type  | Execution Continues |
| ----- | ------------------- |
| void  | ✅ Yes               |
| never | ❌ No                |

---

## 7. `array_is_list()` Function

A **list** must:

* Start at index `0`
* Have sequential keys

```php
$array1 = ['a', 'b', 'c'];
$array2 = [1 => 'a', 2 => 'b'];

var_dump(array_is_list($array1)); // true
var_dump(array_is_list($array2)); // false
```

---

### Common Pitfall with `array_filter`

```php
$list = ['a', 'b', 'c'];
$list = array_filter($list, fn($v) => $v !== 'b');

array_is_list($list); // false
```

### Fix

```php
$list = array_values($list);
array_is_list($list); // true
```

---

## 8. First-Class Callable Syntax

### Before

```php
$closure = Closure::fromCallable('array_sum');
```

### PHP 8.1

```php
$closure = array_sum(...);
echo $closure([1, 2, 3]); // 6
```

---

## 9. `new` in Initializers

### Before

```php
class Customer {
    public function __construct(?Address $address = null) {
        $this->address = $address ?? new Address();
    }
}
```

### PHP 8.1

```php
class Customer {
    public function __construct(
        public Address $address = new Address()
    ) {}
}
```

✔ Object created **only if no argument is passed**

⚠️ Still **not allowed** in:

* Property defaults
* Constants

---

## 10. Final Class Constants

### Before

```php
class Base {
    public const LIMIT = 25;
}

class Child extends Base {
    public const LIMIT = 50; // allowed
}
```

---

### PHP 8.1

```php
class Base {
    final public const LIMIT = 25;
}
```

```php
class Child extends Base {
    public const LIMIT = 50; // ❌ Fatal error
}
```

---

## 11. Backward Incompatible Changes

### Static Variables in Inherited Methods

**Now shared across inheritance**

```php
class A {
    public static function counter() {
        static $count = 0;
        return ++$count;
    }
}

class B extends A {}
```

**PHP 8.0**

```
A::counter(); // 1
A::counter(); // 2
B::counter(); // 1
```

**PHP 8.1**

```
A::counter(); // 1
A::counter(); // 2
B::counter(); // 3
```

---

### PDO Emulated Prepares

Even with emulation **enabled**, integers and floats now return as **native PHP types**.

---

## 12. Deprecations

### Implicit Float → Int Conversion (Precision Loss)

```php
function foo(int $x) {
    echo $x;
}

foo(2.5); // Deprecated (PHP 8.1)
```

✔ Allowed if **no precision loss**

```php
foo(2.0); // OK
```

❌ Still fatal with `declare(strict_types=1)`

---

### Other Deprecations

* `Serializable` without `serialize()` / `unserialize()`
* Passing `null` to non-nullable internal functions

---

## 13. Summary

PHP 8.1 introduces:

* **Enums**
* **Readonly properties**
* **Intersection types**
* **never return type**
* **Better array handling**
* **Cleaner object initialization**
* **Stronger type safety**

➡️ Strongly recommended for modern, maintainable PHP codebases.
