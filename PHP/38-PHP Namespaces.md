# PHP Namespaces: -

## 1. Overview of Namespaces

Namespaces in PHP provide a way to avoid name collisions between classes, functions, and constants. They act as virtual directory structures for your code. When no namespace is defined, all functions, constants, and classes are placed in the global namespace.

### Why Namespaces Matter

Without namespaces:

* Multiple classes with the same name will cause fatal errors.
* Same issues occur with duplicate function names and constant names.
* Code organization becomes difficult as a project grows.

---

## 2. Name Collision Problem (Without Namespaces)

### Example: Two Classes With the Same Name

```
/paymentGateway/stripe/Transaction.php
/paymentGateway/paddle/Transaction.php
```

If both are required:

```php
require_once "stripe/Transaction.php";
require_once "paddle/Transaction.php";
```

Result:

```
Fatal error: Cannot declare class Transaction
```

Same issue applies to:

* Functions
* Constants
* Interfaces
* Traits
* Abstract classes

---

## 3. Declaring a Namespace

### Syntax

Place the namespace declaration:

* After `declare(strict_types=1);`
* Before any other code

```php
<?php

declare(strict_types=1);

namespace PaymentGateway\Paddle;

class Transaction {}
```

Namespaces can be:

* Single level: `namespace App;`
* Multi-level: `namespace PaymentGateway\Paddle;`

---

## 4. Using Namespaced Classes

### 4.1 Fully Qualified Class Name (FQCN)

```php
$transaction = new PaymentGateway\Paddle\Transaction();
```

### 4.2 Importing with `use`

```php
use PaymentGateway\Paddle\Transaction;

$transaction = new Transaction();
```

---

## 5. Matching Namespace to Directory Structure

This is recommended and widely used in modern PHP projects:

```
namespace PaymentGateway\Paddle;
```

matches:

```
paymentGateway/paddle/Transaction.php
```

This is not mandatory, but is considered standard practice.

---

## 6. Working With Classes Inside the Same Namespace

If two classes are in the same namespace:

```php
namespace PaymentGateway\Paddle;

class Transaction {
    public function __construct() {
        var_dump(new CustomerProfile());
    }
}

class CustomerProfile {}
```

No need for:

* Full namespace prefix
* `use` statements

PHP automatically looks for the class inside the current namespace.

---

## 7. Namespace Resolution Rules

### 7.1 Local Lookup

Inside a namespaced file, PHP checks:

1. Current namespace
2. Imported namespaces (`use`)
3. Global namespace (only for functions & constants; not for classes)

### 7.2 Built-in Classes Require a Leading Backslash

Because PHP first checks the local namespace:

```php
// ERROR: PHP looks for PaymentGateway\Paddle\DateTime
$newDate = new DateTime();

// FIX: Tell PHP to use global namespace
$newDate = new \DateTime();
```

or:

```php
use DateTime;
$newDate = new DateTime();
```

---

## 8. Interaction With Built-In Functions

Built-in functions behave differently from classes:

* If a function is not found in the current namespace,
* PHP automatically falls back to global functions.

Example:

```php
explode(" ", "hello world"); // resolves to global explode()
```

If you define a local explode():

```php
namespace PaymentGateway\Paddle;

function explode($sep, $str) {
    return "foo";
}

echo explode(" ", "Hello World"); // "foo"
```

To force global:

```php
\explode(" ", "Hello World");
```

This is sometimes used for performance clarity and to avoid collisions.

---

## 9. Using Classes From Other Namespaces

### Example Problem

```php
namespace PaymentGateway\Paddle;

class Transaction {
    public function __construct() {
        new Notification\Email();
    }
}
```

PHP tries to resolve:

```
PaymentGateway\Paddle\Notification\Email
```

which is incorrect.

### Solutions

#### Option 1: Fully Qualified Name (leading backslash)

```php
new \Notification\Email();
```

#### Option 2: Import using `use`

```php
use Notification\Email;
new Email();
```

---

## 10. Aliasing Namespaces and Classes

Aliasing resolves conflicts when two imported classes share the same name.

### Example

```php
use PaymentGateway\Paddle\Transaction as PaddleTransaction;
use PaymentGateway\Stripe\Transaction as StripeTransaction;

$paddle = new PaddleTransaction();
$stripe = new StripeTransaction();
```

### Aliasing a whole namespace

```php
use PaymentGateway\Paddle as PG;

new PG\Transaction();
new PG\CustomerProfile();
```

---

## 11. Grouped Use Declarations

Instead of writing:

```php
use PaymentGateway\Paddle\Transaction;
use PaymentGateway\Paddle\CustomerProfile;
```

You can write:

```php
use PaymentGateway\Paddle\{Transaction, CustomerProfile};
```

All classes must belong to the same parent namespace.

---

## 12. Importing an Entire Namespace

An alternative:

```php
use PaymentGateway\Paddle;

new Paddle\Transaction();
new Paddle\CustomerProfile();
```

However, many developers prefer explicit imports for clarity.

---

## 13. Importing is File-Scoped

When you do:

```php
use PaymentGateway\Paddle\Transaction;
```

This import applies only to the file where it is declared.

Included files do *not* inherit use statements.

Example:

```php
include 'views/layout.php'; // does NOT inherit imported classes
```

If `layout.php` also needs imported classes, add the use statements there.

---

# Final Notes

This tutorial demonstrated:

* Why namespaces exist
* How to declare and use namespaces
* Class/function resolution rules
* Importing and aliasing techniques
* Common pitfalls and namespace collision scenarios

Further topics like PSR standards, autoloading, and Composer are referenced as follow-up topics in the original transcript.

---

# End of Tutorial