# PHP Exceptions: A Comprehensive Tutorial

## 1. Introduction to Exceptions

**Exceptions** are objects that represent errors or abnormal conditions during execution. They interrupt the normal flow of code and can be:

* **Thrown manually** using `throw`.
* **Thrown automatically** by PHP or built-in functions.

### Key Rules

* The thrown object **must be** an instance of:

  * `Exception` class, or
  * A class implementing the `Throwable` interface.

---

## 2. Basic Example Setup

A sample implementation includes:

* **Invoice class**

  * Constructor using property promotion (accepts a `Customer` object).
  * `process($amount)` method that processes invoices.
* **Customer class**

  * Property `billingInfo`.
  * Getter method for billing information.

### Validation Requirements

Two conditions prevent invoice processing:

1. `$amount` must be > 0.
2. Customer must have valid `billingInfo`.

---

## 3. Throwing Exceptions

### 3.1 Throwing Built-in Exceptions

```php
if ($amount <= 0) {
    throw new InvalidArgumentException("Invalid invoice amount.");
}
```

* `InvalidArgumentException` is appropriate because the method receives an invalid argument.

### Behavior

* If `$amount` is valid, processing continues.
* If invalid, execution stops and the exception propagates upward.

---

## 4. Understanding PHP’s Exception Hierarchy

### Exception Class Features

* Properties: `message`, `code`, `file`, `line`
* Methods:

  * Final: `getMessage()`, `getFile()`, `getLine()`, `getTrace()`, etc.
  * Cannot be overridden.

### Built-in Exception Types

* `Exception` → Base class for user exceptions.
* `Error` → Base class for PHP internal errors.
* Both implement **Throwable**.

---

## 5. Creating Custom Exceptions

### Why Custom Exceptions?

* To represent domain-specific or meaningful error states.
* To avoid overusing generic `Exception`.

### Example: MissingBillingInfoException

```php
namespace App\Exceptions;

class MissingBillingInfoException extends \Exception
{
    protected $message = "Missing billing information.";
}
```

Usage:

```php
if (empty($customer->getBillingInfo())) {
    throw new MissingBillingInfoException();
}
```

---

## 6. Handling Exceptions using try/catch

### Basic Syntax

```php
try {
    $invoice->process(25);
} catch (Exception $e) {
    echo $e->getMessage();
}
```

### Notes

* Before PHP 8: catch variable was required.
* Since PHP 8:

  ```php
  catch (Exception) { ... }
  ```

### Accessing Error Information

* `$e->getMessage()`
* `$e->getFile()`
* `$e->getLine()`

---

## 7. Multiple catch Blocks

### Example:

```php
try {
    $invoice->process(-5);
} catch (InvalidArgumentException $e) {
    echo "Invalid amount.";
} catch (MissingBillingInfoException $e) {
    echo "Missing billing info.";
}
```

### How it works

* The **first matching catch** handles the exception.
* Additional catch blocks are ignored unless rethrowing.

### Catching Multiple Exceptions Together

```php
catch (InvalidArgumentException | MissingBillingInfoException $e) {
    echo $e->getMessage();
}
```

### Catching All Exceptions

```php
catch (Exception $e) { ... }
```

---

## 8. Using finally Blocks

### Behavior of finally

* Always executes regardless of:

  * exceptions thrown,
  * exceptions caught,
  * return statements executed.

### Return Semantics

* If try/catch has a return, it executes but final return occurs **after finally**.
* If finally also returns → finally’s return **overrides** previous returns.

**Example:**

```php
function process() {
    try {
        return true;
    } catch (Exception $e) {
        return false;
    } finally {
        return -1; // overrides previous returns
    }
}
```

---

## 9. Exception Propagation (Bubbling)

When thrown:

1. Travels up the call stack.
2. Executes all finally blocks.
3. Looks for a matching catch.
4. If none is found:

   * PHP checks the global exception handler (if registered).
   * Otherwise: fatal error.

---

## 10. Global Exception Handler

### Registering a handler

```php
set_exception_handler(function (Throwable $e) {
    echo $e->getMessage();
});
```

### Why Throwable?

* Since PHP 7, internal PHP errors throw `Error` types.
* `Error` does not extend `Exception`, but both implement `Throwable`.

### Example error:

```php
array_rand([], 1); // Throws ValueError
```

Must be caught via:

```php
catch (Throwable $e)
```

or handled globally with a Throwable handler.

---

## 11. PHP 7/8 Changes in Error Reporting

* Many warnings and notices (e.g., passing empty array to `array_rand`) now throw exceptions (`ValueError`, `TypeError`, etc.).
* These are catchable via `Throwable`.

---

## 12. When to Throw Exceptions vs. Return Values

### Use `return` when:

* The scenario is expected and normal.
* The caller can gracefully handle the alternative outcome.

### Use `throw` when:

* The condition is exceptional.
* The system should not continue execution without explicit handling.

---

## 13. Using Exception Factory Methods

A common pattern is defining **static constructors** in a domain-specific exception class.

### Example

```php
class InvoiceException extends \Exception
{
    public static function missingBillingInfo()
    {
        return new static("Missing billing info.");
    }

    public static function invalidAmount()
    {
        return new static("Invalid amount.");
    }
}
```

Usage:

```php
throw InvoiceException::missingBillingInfo();
throw InvoiceException::invalidAmount();
```

### Benefits

* Centralizes error messages.
* Avoids duplication.
* Provides a clean, expressive API.

---

# End of Tutorial