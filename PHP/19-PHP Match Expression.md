# PHP Match Expression Tutorial (PHP 8)

## 1. Overview

The **match expression**, introduced in **PHP 8**, provides functionality similar to the `switch` statement but with notable differences. It compares a single expression against multiple conditions and returns a value based on the matching case.

Unlike `switch`, **match is an expression**, meaning it evaluates to a value and can be assigned to variables.

---

## 2. Basic Syntax

```php
match (expression) {
    condition => return_expression,
    condition2 => return_expression2,
    default => return_expression_default
};
```

Each entry is a **key–value pair**, where:

* **Key**: a single condition (or multiple conditions separated by commas)
* **Value**: an expression returned when that condition matches

Example recreated from a typical switch:

```php
match ($paymentStatus) {
    1 => 'Paid',
    2 => 'Payment Declined',
    0 => 'Pending Payment',
    default => 'Unknown Payment Status',
};
```

---

## 3. Comparison with Switch Statement

### 3.1 Match Is an Expression

`match` returns a value and can be assigned:

```php
$paymentStatusDisplay = match ($paymentStatus) {
    1 => 'Paid',
    2 => 'Payment Declined',
    0 => 'Pending Payment',
    default => 'Unknown Payment Status',
};

echo $paymentStatusDisplay;
```

In contrast, `switch` is a statement and does not return a value.

A value expression can be any valid PHP expression, including function calls.

---

### 3.2 No Fall-Through Behavior

The `switch` statement requires `break` to prevent fall-through:

```php
switch ($paymentStatus) {
    case 1:
        echo 'Paid';
        break;
}
```

**Match never falls through.** Once a condition matches, execution stops automatically.

---

### 3.3 Multiple Conditions per Case

Match supports comma-separated conditions, similar to logical OR:

```php
match ($paymentStatus) {
    2, 3 => 'Payment Declined',
    1    => 'Paid',
    default => 'Unknown Payment Status'
};
```

This behaves like:

```
if ($paymentStatus === 2 || $paymentStatus === 3)
```

---

### 3.4 Exhaustiveness Requirement (Default Is Required)

A `match` must handle **all possible input values**. If no condition matches and no default is defined, PHP throws an error.

Example causing an error:

```php
match ($paymentStatus) {
    1 => 'Paid'
};
```

To avoid an error:

```php
default => 'Unknown Payment Status'
```

In contrast, `switch` does not require a default case.

---

### 3.5 Strict Comparison

`match` uses **strict comparison (===)**.

Example:

```php
$paymentStatus = '1';  // string
```

* `switch` will match `case 1:` (loose comparison)
* `match` will **not** match `1` because types differ, so it falls to `default`

Equivalent behavior:

```
switch → ==
match  → ===
```

---

## 4. Advanced Notes

### 4.1 Conditions and Return Expressions Can Be Complex

Both keys and values accept any valid expression:

```php
match (true) {
    (1 > 2) => 'Unreachable',
    someFunction() => anotherFunction(),
    default => 'Fallback'
};
```

Boolean expressions such as `1 > 2` evaluate to `false`, which can be compared directly.

---

### 4.2 Match Does Not Replace Switch

Some use cases still favor `switch`:

* `switch` can execute **multiple statements** in each case.
* `match` requires each branch to be a single expression.

Example invalid in match:

```php
1 => {
    echo 'Paid';
    processPayment();
}
```

To replicate multi-statement logic, extract into a function:

```php
1 => handlePaidStatus()
```

---

## 5. Choosing Between Match, Switch, and If–Else

There is no strict rule. Use based on:

* need for strict comparison (match)
* need for returned values (match)
* need for multi-statement case blocks (switch)
* need for complex conditional logic (if–else)

---