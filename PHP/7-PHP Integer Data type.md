# PHP Integers:

## 1. What Is an Integer in PHP

An **integer** is a whole number without any decimal point. Integers can be:

* Positive numbers (e.g., `1`, `5`, `100`)
* Zero (`0`)
* Negative numbers (e.g., `-5`, `-42`)

Examples:

```php
$x = 5;
$y = -10;
$z = 0;
```

---

## 2. Integer Size and Platform Limits

The size and range of integers in PHP depend on the system architecture:

### 2.1 32-bit Systems

* Minimum value: approximately `-2,147,483,648`
* Maximum value: approximately `2,147,483,647`

### 2.2 64-bit Systems

* Supports much larger integer values.

### 2.3 Checking Integer Limits in PHP

PHP provides predefined constants to inspect integer limits:

```php
echo PHP_INT_MIN;
echo PHP_INT_MAX;
echo PHP_INT_SIZE;
```

* `PHP_INT_MIN` → Minimum integer value
* `PHP_INT_MAX` → Maximum integer value
* `PHP_INT_SIZE` → Integer size in bytes (typically `4` or `8`)

---

## 3. Ways to Define Integers in PHP

PHP allows integers to be defined in multiple numeric bases.

### 3.1 Decimal (Base 10)

This is the most common representation:

```php
$x = 5;
echo $x; // Output: 5
```

---

### 3.2 Hexadecimal (Base 16)

* Prefixed with `0x`

```php
$x = 0x2A;
echo $x; // Output: 42
```

---

### 3.3 Octal (Base 8)

* Prefixed with `0`

```php
$x = 055;
echo $x; // Output: 45
```

Explanation:

* `055` (octal) = `45` (decimal)

---

### 3.4 Binary (Base 2)

* Prefixed with `0b`

```php
$x = 0b11;
echo $x; // Output: 3

$y = 0b110;
echo $y; // Output: 6
```

---

## 4. Integer Overflow Behavior

### 4.1 What Is Integer Overflow

An **integer overflow** occurs when a value exceeds the maximum integer limit supported by the platform.

### 4.2 Example of Integer Overflow

```php
$x = PHP_INT_MAX;
var_dump($x); // int

$x = $x + 1;
var_dump($x); // float
```

### 4.3 Key Observation

* When an integer exceeds its allowed range, PHP **automatically converts it to a float**.
* This change can be verified using `var_dump()`.

---

## 5. Casting Values to Integers

PHP allows explicit type casting using `(int)` or `(integer)`.

```php
$x = (int) $value;
// or
$x = (integer) $value;
```

Both forms behave identically.

---

## 6. Casting Different Data Types to Integers

### 6.1 Boolean to Integer

```php
(int) true;  // 1
(int) false; // 0
```

---

### 6.2 Float to Integer

* Decimal portion is **discarded**, not rounded.

```php
(int) 5.98; // 5
```

---

### 6.3 String to Integer

#### Numeric Strings

```php
(int) "5.9"; // 5
(int) "10";  // 10
```

#### Strings Containing Numbers and Text

PHP extracts the leading numeric portion:

```php
(int) "87abc"; // 87
```

#### Non-numeric Strings

If the string cannot be resolved to a number:

```php
(int) "hello"; // 0
```

---

### 6.4 Null to Integer

```php
(int) null; // 0
```

---

## 7. Checking If a Variable Is an Integer

PHP provides helper functions to verify integer types.

### 7.1 Using `is_int()` or `is_integer()`

```php
$x = 10;
var_dump(is_int($x)); // true

$y = 10.5;
var_dump(is_int($y)); // false
```

Both `is_int()` and `is_integer()` behave the same.

---

## 8. Using Underscores in Integers (PHP 7.4+)

### 8.1 Purpose

Underscores can be used to improve readability of large numbers.

```php
$x = 100_000;
echo $x; // 100000
```

* Underscores are ignored by PHP during execution.
* They do not affect the numeric value.

---

### 8.2 Practical Example

```php
$x = 1_000_000_000;
echo $x; // 1000000000
```

---

### 8.3 Important Limitation

Underscores work **only in integer literals**, not in strings.

```php
$x = "100_000";
echo (int) $x; // 100
```

Explanation:

* The string is parsed until a non-numeric character (`_`) is encountered.
* Everything after that is discarded.

---

## 9. Key Takeaways

* Integers represent whole numbers without decimals.
* Integer limits depend on system architecture.
* PHP supports decimal, hexadecimal, octal, and binary integers.
* Integer overflow automatically converts the value to a float.
* Casting truncates values rather than rounding them.
* PHP 7.4+ allows underscores in integer literals for readability.
* Type-checking functions help ensure data integrity.

---