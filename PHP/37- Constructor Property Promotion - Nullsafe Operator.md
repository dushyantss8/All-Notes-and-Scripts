# 1. Constructor Property Promotion in PHP

## 1.1 Overview

Constructor Property Promotion (CPP) was introduced in **PHP 8** to reduce boilerplate code when defining class properties that are initialized through a constructor.

Traditionally, you needed:

1. Property declaration
2. Constructor parameters
3. Manual assignment

### Without Property Promotion (pre–PHP 8):

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

This approach is verbose. PHP 8 solves this with Constructor Property Promotion.

---

## 1.2 Using Constructor Property Promotion

With CPP, you declare and assign properties **directly inside the constructor parameter list**.

### Example using your `Transaction` class:

```php
class Transaction {

    public ?Customer $customer = null;

    public function __construct(
        private float $amount,
        private string $description
    ) {
    }
}
```

### What CPP does automatically:

For each promoted parameter:

* Declares a class property (`private float $amount`)
* Assigns the constructor parameter to that property (`$this->amount = $amount`)
* Makes the property available in the class scope

### Supported Visibility Keywords:

* `public`
* `protected`
* `private`

### Supported Types:

* Scalar types (`int`, `string`, `float`, `bool`)
* Class types (e.g., `Customer`)
* Nullable types (`?Customer`)
* Union types (`int|string`)
* Mixed (`mixed`)
* Iterable (`iterable`)

### Not Allowed:

* `callable`
  (as your comment correctly points out—callable cannot be promoted)

---

## 1.3 Why CPP is useful

Benefits:

* Reduces boilerplate and improves readability
* Promotes strict typing
* Encourages immutable design when combined with `private` properties
* Simplifies domain models and DTOs

Your `Transaction` constructor is a correct and efficient use of CPP.

---

# 2. Nullsafe Operator (`?->`) in PHP

## 2.1 Overview

Before PHP 8, trying to access a property on `null` caused a fatal error:

```php
$transaction->customer->paymentProfile->id;
```

If `customer` is `null`, it triggers:

> Fatal error: Uncaught Error: Attempt to read property "paymentProfile" on null

To avoid this, developers typically wrote lengthy null-checks:

```php
echo isset($transaction->customer)
     && isset($transaction->customer->paymentProfile)
     ? $transaction->customer->paymentProfile->id
     : "Not Available";
```

### The nullsafe operator simplifies all of this:

```php
$transaction->customer?->paymentProfile?->id
```

If anything in the chain is `null`, evaluation stops and returns `null`.

---

## 2.2 Your Example

### Code:

```php
echo $transaction->customer?->paymentProfile->id ?? "Not Available";
```

### Step-by-step evaluation:

1. `$transaction->customer`

   * Initially null? Then result → `null` and entire expression → `"Not Available"`
   * In your setup, you later assign:

     ```php
     $transaction->customer = new Customer();
     ```

2. `$transaction->customer?->paymentProfile`

   * `Customer->paymentProfile` is `null` since default is `null`.
   * Because you used `?->`, PHP stops here and returns `null`.

3. `->id`

   * Never evaluated because the previous expression resulted in `null`.

4. `?? "Not Available"`

   * Null coalescing operator returns the fallback string.

### Output:

```
Not Available
```

---

## 2.3 Why nullsafe operator is important

* Avoids deeply nested `if` statements
* Prevents runtime fatal errors
* Makes object navigation safer and cleaner
* Essential for working with optional or lazily-loaded object graphs (e.g., ORM entities)

---

# 3. Full Working Example (Combined)

Below is your entire example reorganized for clarity, demonstrating both features.

```php
<?php

declare(strict_types=1);

require_once "./app/PaymentProfile.php";
require_once "./app/Customer.php";
require_once "./app/Transaction.php";

// Create a transaction
$transaction = new Transaction(55, "Test Transaction");

// Customer exists, but has no PaymentProfile yet
$transaction->customer = new Customer();

// If paymentProfile is null, provide fallback output
echo $transaction->customer?->paymentProfile->id ?? "Not Available";
```

### Supporting Classes

```php
<?php

declare(strict_types=1);

class Customer {
    public ?PaymentProfile $paymentProfile = null;
}
```

```php
<?php

declare(strict_types=1);

class PaymentProfile {
    public int $id;

    public function __construct() {
        $this->id = rand();
    }
}
```

```php
<?php

declare(strict_types=1);

class Transaction {

    public ?Customer $customer = null;

    // Constructor Property Promotion
    public function __construct(
        private float $amount,
        private string $description,
    ) {
    }
}
```

---

# 4. Expected Behavior When Adding a PaymentProfile

If later you do:

```php
$transaction->customer->paymentProfile = new PaymentProfile();
echo $transaction->customer?->paymentProfile?->id ?? "Not Available";
```

You will get a random integer id.

---

# Summary

## Constructor Property Promotion (CPP)

* Lets you declare and assign properties directly in the constructor parameters.
* Reduces boilerplate.
* Encourages typed, clean object models.

## Nullsafe Operator (`?->`)

* Prevents fatal errors when navigating properties on potentially null objects.
* Returns null if any part of the chain is null.
* Works seamlessly with `??` null coalescing operator.

Both features improve code readability, safety, and maintainability, particularly when dealing with object graphs where some objects may be optional or nullable.

---

# End of Tutorial