# PHP Switch Statement —

## 1. Purpose of the `switch` Statement

The `switch` statement provides a clean, readable mechanism for comparing a single expression against multiple possible values. It functions similarly to a series of `if` / `elseif` / `else` conditions but is optimized for scenarios where the same expression must be evaluated repeatedly.

### Basic Structure

```php
switch ($expression) {
    case value1:
        // Code block
        break;

    case value2:
        // Code block
        break;

    default:
        // Code executed when no case matches
}
```

* `$expression` can be as simple as a variable or a more complex expression.
* `default` is optional; it runs only when no `case` matches.

---

## 2. How Switch Execution Works Internally

### Line-by-Line Execution

A `switch` operates linearly but only begins executing *after* the first matching `case`. Once a match occurs:

* It executes statements sequentially.
* It continues executing subsequent cases and statements until:

  * A `break` is encountered, or
  * The end of the `switch` block is reached.

### Example Scenario

```php
$paymentStatus = 'paid';

switch ($paymentStatus) {
    case 'paid':
        echo "Paid";
        break;

    case 'declined':
        echo "Payment Declined";
        break;

    default:
        echo "Unknown Status";
}
```

With `paymentStatus = 'paid'`, only the first case is executed because the `break` stops further execution.

---

## 3. Importance and Function of `break`

`break` prevents execution from “falling through” to later cases.

### Without `break`

If `break` is removed:

* All subsequent statements will run, regardless of whether their case matches.

Example:

```php
$paymentStatus = 'paid';

switch ($paymentStatus) {
    case 'paid':
        echo "Paid";
        // No break

    case 'declined':
        echo "Payment Declined";  // This will run unintentionally
        break;

    default:
        echo "Unknown Status";
}
```

This produces:

```
Paid
Payment Declined
```

---

## 4. Intentional Fall-Through for Shared Logic

Fall-through can be used constructively to avoid duplication.

### Example: Declined or Rejected Should Trigger Same Code

Instead of duplicating code:

```php
case 'declined':
case 'rejected':
    echo "Payment Declined";
    break;
```

This executes the same block for both values.

---

## 5. Loose Comparison Behavior

`switch` uses PHP’s loose comparison (`==`) rather than strict comparison (`===`).

### Example

```php
$paymentStatus = "1";
```

If a case is:

```php
case 1:
```

This will match, because `"1" == 1` is true.

Loose comparison also makes values like `true` match `1`.

---

## 6. `switch` Inside Loops — Break Levels and Continue Behavior

### Break affects only the switch

In loops:

```php
foreach (...) {
    switch (...) {
        case ...:
            break;   // Breaks out of switch ONLY
    }
}
```

### Breaking out of multiple levels

Use:

```php
break 2;
```

This breaks out of both the switch and the loop.

### Continue inside a switch

`continue` inside a switch produces a warning because it behaves as `break` unless a level is specified.

To skip the current loop iteration:

```php
continue 2;
```

---

## 7. Comparison: Switch vs. If/Else-If Performance

### Key Difference

* `switch` evaluates the expression **once**.
* `if` / `elseif` reevaluates the expression **in each condition**.

### Example with Expensive Function Call

Consider:

```php
function x() {
    sleep(3);
    echo "Done";
    return 3;
}
```

#### Using `if` / `elseif`:

```php
if (x() == 1) { ... }
elseif (x() == 2) { ... }
elseif (x() == 3) { ... }
```

`x()` runs three times → total of ~9 seconds.

#### Optimized `if`:

```php
$value = x();
if ($value == 1) { ... }
elseif ($value == 2) { ... }
```

Runs only once.

#### Using `switch`:

```php
switch (x()) {
    case 1: echo 1; break;
    case 2: echo 2; break;
    case 3: echo 3; break;
}
```

The function executes only once because `switch` evaluates the expression a single time before matching cases.

### Performance Note

While `switch` can be marginally faster, the advantage is small except in cases like expensive function calls.

---