# PHP Data Types and Type Casting –

## 1. PHP Type System Overview

### 1.1 Dynamic (Weak) Typing in PHP

* PHP is a **dynamically typed** (also called **weakly typed**) language.
* You do **not** need to explicitly declare a variable’s type.
* A variable’s type can **change at runtime**.
* Type checking happens **at runtime**, not at compile time.

### 1.2 Comparison with Statically Typed Languages

* **Statically typed languages** (e.g., Java, C++, C#):

  * Types are checked at compile time.
  * Variables must have explicitly defined types.
* PHP’s flexibility:

  * Easier and faster to write code.
  * Can lead to performance overhead and unexpected bugs if not handled carefully.

### 1.3 Modern PHP Improvements

* PHP now supports:

  * **Type hinting**
  * **Return types**
  * **Strict typing**
* These features help reduce bugs and improve code reliability.

---

## 2. PHP Primitive Data Types

PHP supports **10 primitive types**, grouped into categories:

### 2.1 Scalar Types (4)

#### 1. Boolean

* Represents truth values.
* Possible values:

  ```php
  true, false
  ```

#### 2. Integer

* Whole numbers without decimals.

  ```php
  -5, 0, 1, 100
  ```

#### 3. Float (Double)

* Numbers with decimal points.

  ```php
  1.5, 0.99, -15.8
  ```

#### 4. String

* A sequence of characters enclosed in quotes.

  ```php
  "Hello", 'John Doe'
  ```

---

## 3. Defining and Printing Scalar Variables

### 3.1 Variable Definitions

```php
$completed = true;
$score = 75;
$price = 0.99;
$greeting = "Hello John Doe";
```

### 3.2 Output Using `echo`

```php
echo $completed . "<br>";
echo $score . "<br>";
echo $price . "<br>";
echo $greeting . "<br>";
```

### 3.3 Boolean Output Behavior

* `true` → prints as `1`
* `false` → prints nothing (empty output)

---

## 4. Determining Variable Types

### 4.1 Using `gettype()`

Returns the data type as a string.

```php
echo gettype($completed); // boolean
echo gettype($score);     // integer
echo gettype($price);     // double
echo gettype($greeting);  // string
```

### 4.2 Using `var_dump()`

Displays both **value** and **type**.

```php
var_dump($completed); // bool(true)
var_dump($score);     // int(75)
var_dump($price);     // float(0.99)
var_dump($greeting);  // string(9) "Hello John Doe"
```

---

## 5. Compound Types Overview

### 5.1 Arrays

#### Defining an Array

```php
$companies = [1, 2, 3, 0.5, -9.2, "Apple", true];
```

#### Printing Arrays (Incorrect Way)

```php
echo $companies;
// Outputs: "Array" + notice (array to string conversion)
```

#### Printing Arrays (Correct Way)

```php
print_r($companies);
```

> Arrays can contain **mixed data types**.

---

### 5.2 Other Compound Types (Overview Only)

* Objects
* Callables
* Iterables

These are advanced types and are covered separately.

---

## 6. Special Types

### 6.1 `null`

* Represents **no value** or **nothing**.

### 6.2 `resource`

* Used for external resources (files, database connections, etc.).

---

## 7. How PHP Determines Variable Types

PHP infers types based on **assigned values**.

```php
$score = 75;
var_dump($score); // int(75)
```

```php
$score = "75";
var_dump($score); // string(2) "75"
```

* No quotes → integer
* Quotes → string

---

## 8. Type Hinting in Functions

### 8.1 Function Without Type Hinting

```php
function sum($x, $y) {
    return $x + $y;
}

echo sum(2, 3); // 5
```

### 8.2 Passing Mixed Types

```php
echo sum(2, "3"); // 5 (string coerced to integer)
```

This behavior is known as **type juggling** or **type coercion**.

---

## 9. Function Type Hinting

### 9.1 Enforcing Parameter Types

```php
function sum(int $x, int $y) {
    return $x + $y;
}
```

```php
echo sum(2, "3"); // Still works (string converted to int)
```

* PHP attempts to **coerce** values into the expected type.

### 9.2 When Conversion Fails

```php
sum(2, []);
```

* Results in a **fatal error** (array cannot be converted to int).

---

## 10. Variable Type Mutability

* Type guarantees only apply **up to that point**.
* Variables can still be reassigned:

```php
$x = 5;
$x = 5.5; // Valid, type changes to float
```

---

## 11. Strict Types in PHP

### 11.1 Enabling Strict Mode

```php
declare(strict_types=1);
```

* Must be declared at the **top of the file**.
* Disables automatic type coercion.

### 11.2 Strict Mode Example

```php
declare(strict_types=1);

function sum(int $x, int $y) {
    return $x + $y;
}

sum(2, "3"); // Fatal error
```

### 11.3 Exception Rule

* **Integers can be passed where floats are expected**, even in strict mode.

```php
function sum(float $x, float $y) {
    return $x + $y;
}

sum(2, 3); // Valid
```

---

## 12. Best Practices: Type Hinting and Strict Types

* Improves code quality
* Prevents unexpected bugs
* Makes function contracts explicit
* Strongly recommended for modern PHP applications

---

## 13. Type Casting in PHP

### 13.1 Explicit Type Casting

You can manually convert a value to a specific type.

```php
$x = "5";
var_dump($x); // string(1) "5"
```

### 13.2 Casting to Integer

```php
$x = (int) $x;
var_dump($x); // int(5)
```

### 13.3 Common Casts

```php
(int), (float), (string), (bool), (array), (object)
```

---

## 14. Summary

* PHP uses **dynamic typing** by default.
* Supports **scalar**, **compound**, and **special** data types.
* Provides tools like `gettype()` and `var_dump()` for debugging.
* Type hinting and `strict_types` offer better safety and predictability.
* Explicit type casting gives full control over data types.

This foundation is critical for writing **clean, predictable, and maintainable PHP code**, especially when building large applications or frameworks.
