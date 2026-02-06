# PHP Operators Part I:

## 1. Introduction to Operators

An **operator** takes one or more expressions (operands) and produces a value.

Types of operators:

* **Unary operators**: Work on a single operand.
* **Binary operators**: Work on two operands (most common in PHP).
* **Ternary operators**: Require three operands (e.g., ternary conditional operator).

---

# 2. Arithmetic Operators

Arithmetic operators perform mathematical operations.

Supported operators:
`+` (addition), `-` (subtraction), `*` (multiplication), `/` (division), `%` (modulus), `**` (exponentiation)

### Example Setup

```php
$x = 10;
$y = 2;
```

### Examples

```php
var_dump($x + $y);   // 12
var_dump($x - $y);   // 8
var_dump($x * $y);   // 20
var_dump($x / $y);   // 5
var_dump($x % $y);   // 0
var_dump($x ** $y);  // 100
```

### Working with negative numbers

Values behave as expected:

```php
$x = -10;
$y = 2;

$x * $y;  // -20
$x - $y;  // -12
```

---

## 2.1 Special Notes on Arithmetic Operators

### (A) Plus and Minus as Unary Type Conversion

Prefixing a value with `+` or `-` forces a numeric cast.

```php
$x = "10";
var_dump(+$x);  // int(10)
var_dump(-$x);  // int(-10)
```

### (B) Division Behavior

* Result is **float** unless both operands are integers and divide evenly.
* Division by zero throws an error in PHP 8+.

#### Dividing by zero safely: `fdiv()`

```php
fdiv(10, 0);  // INF (no fatal error)
```

### (C) Modulus Operator Notes

* `%` always casts operands to integers:

```php
10.5 % 2.9;  // 0 (equivalent to 10 % 2)
```

* For float modulus, use `fmod()`:

```php
fmod(10.5, 2.9);  // proper float remainder
```

* Sign of result comes from the dividend:

```php
10 % -3;   // 1
-10 % 3;   // -1
```

---

# 3. Assignment Operators

### Basic Assignment

```php
$x = 5;
```

Do not confuse with comparison operators (`==`, `===`).

### Multiple Assignments

```php
$x = $y = 10;
```

### Complex Assignment (not recommended)

```php
$x = ($y = 10) + 5;  // $x = 15, $y = 10
```

---

## 3.1 Combined Assignment Operators

Shorthand for applying an operation and assignment simultaneously.

Examples:

```php
$x = 5;

$x += 3;  // 8
$x -= 2;  // 6
$x *= 4;  // 24
$x /= 2;  // 12
$x **= 2; // 144
```

Note: Using `x += 3` without predefining `$x` causes an undefined variable warning.

---

# 4. String Operators

### Concatenation

```php
$x = "Hello";
$x = $x . " World";
```

### Combined concatenation

```php
$x .= " World";  // Same result
```

---

# 5. Comparison Operators

## 5.1 Loose vs. Strict Comparison

### Loose Comparison (`==`)

Performs type juggling.

### Strict Comparison (`===`)

Checks both value *and* type.

Example:

```php
var_dump(5 == "5");   // true
var_dump(5 === "5");  // false
```

### Inequality Versions

* Loose: `!=` or `<>`
* Strict: `!==`

---

## 5.2 Relational Operators

Operators:

* `<`  (less than)
* `>`  (greater than)
* `<=` (less than or equal)
* `>=` (greater than or equal)

Behave as expected.

---

## 5.3 Spaceship Operator `<=>`

Returns:

* `0` if equal
* `-1` if left < right
* `1` if left > right

Example:

```php
5 <=> 10;  // -1
50 <=> 10; // 1
10 <=> 10; // 0
```

---

## 5.4 Important Comparison Behavior Differences (PHP 7 vs PHP 8)

### Non-numeric string vs number:

**PHP 7.4 behavior:**

```php
0 == "hello"; // true (string "hello" converted to 0)
```

**PHP 8 behavior:**

```php
0 == "hello"; // false (string becomes string comparison "0" == "hello")
```

### Numeric string still converts:

```php
0 == "0"; // true (in both PHP 7 and 8)
```

---

## 5.5 Why Strict Comparison Matters: Example with `strpos`

`strpos()` returns `0` if the substring is found at index 0.

Incorrect check (loose):

```php
if ($y == false) echo "Not found";
```

Loose comparison converts `0` to `false`, giving incorrect result.

Correct check (strict):

```php
if ($y === false) echo "Not found";
else echo "Found at index $y";
```

---

# 6. Conditional Operators

## 6.1 Ternary Operator

General syntax:

```php
condition ? value_if_true : value_if_false;
```

Example:

```php
$message = ($age >= 18) ? "Adult" : "Minor";
```

When nesting ternary operators, **parentheses are required as of PHP 8**.

---

## 6.2 Null Coalescing Operator `??`

Use when you want a fallback only if something is `null`.

```php
$x = null;
$y = $x ?? "Hello";   // "Hello"
```

If `$x` is undefined:

```php
$y = $x ?? "Default";  // "Default" (no warning)
```

If `$x = false`:

```php
$y = $x ?? "Hello";   // false (because $x is not null)
```

Great for safely accessing undefined variables or array keys.

---

# End of Tutorial
