# PHP Integers:

## 1. Introduction to Integers

In PHP, an **integer** is a number without any decimal component. Examples include:

* Positive numbers: `1`, `2`, `500`
* Zero: `0`
* Negative numbers: `-5`, `-100`

The range of integer values depends on the system architecture:

* **32-bit systems**: approximately −2 billion to +2 billion
* **64-bit systems**: significantly larger range

You can check these platform-specific limits using predefined PHP constants:

```php
echo PHP_INT_MAX;
echo PHP_INT_MIN;
echo PHP_INT_SIZE;   // size in bytes
```

---

## 2. Integer Notations in PHP

PHP supports multiple ways to represent integer literals.

### 2.1 Decimal (Base 10)

Standard number notation.

```php
$x = 5;     // Base 10
echo $x;    // Outputs 5
```

### 2.2 Hexadecimal (Base 16)

Prefixed with `0x`.

```php
$hex = 0x2A;  // 2A hex = 42 decimal
echo $hex;    // Outputs 42
```

### 2.3 Octal (Base 8)

Prefixed with `0`.

```php
$oct = 055;   // Octal 55 = decimal 45
echo $oct;
```

### 2.4 Binary (Base 2)

Prefixed with `0b`.

```php
$bin = 0b11;     // Binary 11 = decimal 3
$bin2 = 0b110;   // Binary 110 = decimal 6
```

---

## 3. Integer Overflow and Type Conversion

If an integer exceeds its maximum limit:

```php
$x = PHP_INT_MAX;
$x = $x + 1;
```

Once the value passes the integer boundary, PHP **automatically converts it to a float**.

```php
var_dump($x);
// float(…) rather than int(…)
```

---

## 4. Casting Values to Integers

You can explicitly cast a value to integer using:

```php
(int)$value
(integer)$value
```

### 4.1 Boolean → Integer

* `true` becomes `1`
* `false` becomes `0`

### 4.2 Float → Integer

Decimals are **truncated**, not rounded.

```php
(int)5.98;   // 5
(int)-3.99;  // -3
```

### 4.3 String → Integer

Behavior depends on the string contents:

| String Type           | Example   | Result |
| --------------------- | --------- | ------ |
| Numeric float         | `"5.9"`   | `5`    |
| Numeric integer       | `"12"`    | `12`   |
| Leading number + text | `"87abc"` | `87`   |
| No numeric content    | `"abc"`   | `0`    |

### 4.4 Null → Integer

`null` becomes `0`.

---

## 5. Checking for Integers

Use either function:

```php
is_int($value);
is_integer($value);
```

Both return `true` or `false`.

```php
$x = (int)"5";
var_dump(is_int($x));   // true
```

---

## 6. Using Underscores for Readability (PHP 7.4+)

PHP allows underscores in numeric literals to improve readability.

```php
$number = 200_000;
echo $number;        // 200000
```

Important notes:

* Underscores are ignored by PHP in **integer literals**.
* They **cannot** be used inside numeric strings:

```php
$str = "200_000";   // This is a string, not an int
(int)$str;          // Results in 200
```

---
