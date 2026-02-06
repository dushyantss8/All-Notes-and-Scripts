# PHP Class Constants and the Scope Resolution Operator

---

## 1. Overview of Class Constants

Class constants provide immutable values bound to a class rather than an instance. They are defined with the `const` keyword and:

* Cannot be changed after declaration.
* Conventionally use uppercase letters with underscores (e.g., `STATUS_PAID`).
* Can optionally specify visibility (`public`, `protected`, `private`). If omitted, they are public by default.

### Example: Declaring Constants in a Class

```php
class Transaction
{
    public const STATUS_PAID = 'paid';
    public const STATUS_PENDING = 'pending';
    public const STATUS_DECLINED = 'declined';
}
```

---

## 2. Accessing Class Constants

Class constants are accessed using the **scope resolution operator** (`::`).

### Access via Class Name

```php
echo Transaction::STATUS_PAID; // paid
```

### Access via Object Instance

Although constants belong to the class, PHP also allows access through an instance:

```php
$transaction = new Transaction();
echo $transaction::STATUS_PAID;
```

### Visibility Rules

If a constant is declared as `private`, it becomes accessible **only inside the class**.

```php
private const STATUS_PAID = 'paid';

echo Transaction::STATUS_PAID;  // Error
```

---

## 3. Accessing Constants Inside the Class

Within a class, constants can be accessed in two ways:

### Using the Class Name

```php
var_dump(Transaction::STATUS_PAID);
```

### Using `self`

`self` refers to the current class (resolved at compile time).

```php
var_dump(self::STATUS_PAID);
```

---

## 4. Magic Constant: `class`

PHP provides a magic constant that returns the fully qualified class name.

```php
echo Transaction::class;
echo $transaction::class;
```

Both output the full class namespace and name.

---

## 5. Why Use Class Constants?

Use class constants for:

1. **Values that never change** (e.g., status codes, configuration options).
2. **Avoiding hard-coding string values across the codebase**.
3. **Preventing typos and introducing controlled enumerated values**.

---

## 6. Replacing Hard-Coded Status Values with Constants

### Step 1: Define a Property and Setter Method

```php
private string $status = self::STATUS_PENDING;

public function setStatus(string $status): self
{
    $this->status = $status;
    return $this;
}
```

### Step 2: Use Constants Instead of Hard-Coded Strings

```php
$transaction->setStatus(Transaction::STATUS_PAID);
```

---

## 7. Validating Allowed Status Values

Hard-coded validation via conditionals becomes complex as more statuses are added.

Instead of this:

```php
if ($status === self::STATUS_PAID
    || $status === self::STATUS_PENDING
    || $status === self::STATUS_DECLINED) {
    // OK
}
```

Use a **lookup table** constant that defines all allowed values.

### Example: Lookup Table Constant

```php
public const ALL_STATUSES = [
    self::STATUS_PAID     => 'Paid',
    self::STATUS_PENDING  => 'Pending',
    self::STATUS_DECLINED => 'Declined',
];
```

### Updated Validation Logic

```php
public function setStatus(string $status): self
{
    if (!array_key_exists($status, self::ALL_STATUSES)) {
        throw new InvalidArgumentException("Invalid status");
    }

    $this->status = $status;
    return $this;
}
```

This eliminates duplicated conditionals and keeps validation centralized.

---

## 8. Decoupling Status Constants from the Transaction Class

Having status constants embedded inside `Transaction` couples status data with business logic.
A better approach is separating these into a dedicated **enum-like class**.

### Step 1: Create an Enum-Style Class

Directory: `app/Enums/Status.php`

```php
namespace App\Enums;

class Status
{
    public const PAID     = 'paid';
    public const PENDING  = 'pending';
    public const DECLINED = 'declined';

    public const ALL = [
        self::PAID     => 'Paid',
        self::PENDING  => 'Pending',
        self::DECLINED => 'Declined',
    ];
}
```

### Step 2: Update Transaction to Use Status Enum

```php
use App\Enums\Status;

private string $status = Status::PENDING;

public function setStatus(string $status): self
{
    if (!array_key_exists($status, Status::ALL)) {
        throw new InvalidArgumentException("Invalid status");
    }

    $this->status = $status;
    return $this;
}
```

This improves maintainability and reduces coupling.

---

## 9. Upcoming Native PHP Enums (PHP 8.1+)

The transcript references the RFC introducing native enum support in PHP 8.1.
This will eventually eliminate the need for custom classes that hold constants for enumerations.

---

# End of Tutorial