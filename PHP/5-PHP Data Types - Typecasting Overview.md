# PHP Data Types and Typecasting —

## 1. Overview of PHP’s Type System

PHP is a **dynamically typed (weakly typed) language**, meaning:

* You do **not** need to declare a variable type explicitly.
* Variable types can **change at runtime**.
* Type checking happens **at runtime**, unlike statically typed languages (Java, C++, C#) that validate types at compile time.

PHP’s flexibility can introduce performance overhead and unexpected behavior, but modern versions provide stronger type features, including **strict types** and **type hinting**.

---

## 2. Primitive Types in PHP

PHP supports **10 primitive types**, grouped as:

### Scalar Types (4)

1. **boolean** – true or false
2. **integer** – whole numbers (e.g., 1, 0, -5)
3. **float (double)** – decimal numbers (e.g., 1.5, -9.2, 0.005)
4. **string** – sequence of characters wrapped in quotes

### Compound Types (4)

1. **array**
2. **object**
3. **callable**
4. **iterable**

### Special Types (2)

1. **resource**
2. **null**

### Pseudotypes (2) – for readability only

* mixed
* void

---

## 3. Examples of Scalar Types

### Example Code

```php
$completed = true;
$score = 75;
$price = 0.99;
$greeting = "Hello Jon Doe";

echo $completed . "<br>";
echo $score . "<br>";
echo $price . "<br>";
echo $greeting . "<br>";
```

### Output Characteristics

* `true` prints as `1`
* `false` prints as an empty string
* This does not reflect the type; it is simply output formatting.

---

## 4. Determining a Variable’s Type

### Using `gettype()`

```php
echo gettype($completed); // boolean
echo gettype($score);     // integer
echo gettype($price);     // double
echo gettype($greeting);  // string
```

### Using `var_dump()`

Provides both type and value:

```php
var_dump($completed); // bool(true)
var_dump($score);     // int(75)
var_dump($price);     // float(0.99)
var_dump($greeting);  // string(9) "Hello Jon Doe"
```

---

## 5. Arrays

Arrays are lists of values and may contain mixed types.

### Example

```php
$companies = [1, 2, 3, 0.5, -9.2, "hello", true];
```

### Printing arrays

* `echo $array` → prints `Array` and throws a notice.
* `print_r($array)` → prints in human-readable structure.

---

## 6. Special Types

### resource

Represents external resources (e.g., files, DB connections).

### null

Represents the absence of a value.

---

## 7. Dynamic Type Determination

PHP analyzes the assigned value at runtime.

Example:

```php
$score = 75;        // integer
$score = "75";      // string
```

Using quotes forces string interpretation.

---

## 8. Type Hinting in Functions

You can enforce expected parameter and return types.

### Basic Example

```php
function sum($x, $y) {
    return $x + $y;
}

echo sum(2, 3);   // 5
```

### Using Type Hints

```php
function sum(int $x, int $y) {
    return $x + $y;
}

echo sum(2, "3");  // outputs 5 (PHP converts "3" → 3)
```

PHP attempts to **coerce** types automatically; this behavior is known as **type juggling** or **type coercion**.

#### Example of coercion

* Passing `"3"` to `int` → converted to `3`
* Passing `2.5` to `int` → converted to `2`

If conversion is not possible:

```php
function demo(array $x) {}
demo("hello"); // Fatal error
```

### Type Guarantee Scope

Type hints guarantee types **only inside the function before reassignment**:

```php
function test(int $x) {
    $x = 5.5; // valid: now $x is float
}
```

---

## 10. Enabling Strict Types

Strict mode prevents type coercion.

### Syntax (must be the first line of the file):

```php
declare(strict_types=1);
```

### Effect of Strict Mode

```php
function sum(int $x, int $y) {
    return $x + $y;
}

sum(2, "3");   // Fatal error in strict mode
```

### Exception in strict mode

Passing integers to float parameters is allowed:

```php
function calc(float $a, float $b) {
    return $a + $b;
}

calc(2, 3);   // Valid even in strict mode
```

---

## 11. Typecasting (Manual Type Conversion)

You can explicitly convert (cast) variables.

### Example

```php
$x = "5";
var_dump($x);          // string(1) "5"

$x = (int) $x;
var_dump($x);          // int(5)
```

### Supported cast types

* (int), (integer)
* (bool), (boolean)
* (float), (double), (real)
* (string)
* (array)
* (object)
* (unset) → null

---

## Summary

* PHP’s dynamic typing system
* Primitive, compound, special, and pseudo types
* Techniques for inspecting variable types
* Arrays and their output functions
* Type hinting and type coercion
* Enabling strict typing
* Explicit typecasting

These concepts form the foundation for writing reliable, type-aware PHP applications and will be expanded further in specialized lessons for each type category.

---
