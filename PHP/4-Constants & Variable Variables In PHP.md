# PHP Constants and Variable Variables

A Technical and Instructional Summary

## 1. Understanding Constants in PHP

Constants are identifiers for values that **cannot be changed after they are defined**. Unlike variables, constants retain the same value throughout code execution.

### 1.1 Variable Example (for comparison)

```php
$firstName = "Peter";
echo $firstName; // Prints Peter

$firstName = "Walter";
echo $firstName; // Prints Walter
```

Variables can be reassigned. Execution occurs top-to-bottom, so the last value is used.

---

## 2. Defining Constants in PHP

There are two primary mechanisms:

1. Using the `define()` function
2. Using the `const` keyword

### 2.1 Defining Constants with `define()`

Syntax:

```php
define(name, value);
```

**Key details:**

* Names follow the same rules as variables (letter/underscore first, no special characters).
* Names are case-sensitive.
* Convention: use **uppercase names** for constants.
* Constants do **not** use `$` when referenced.

**Example:**

```php
define("STATUS_PAID", "paid");
echo STATUS_PAID; // prints paid
```

### 2.2 Checking if a Constant Is Defined

Use the `defined()` function:

```php
echo defined("STATUS_PAID");
// Prints 1 if true, prints nothing if false
```

`defined()` returns a boolean (true = 1).

---

## 3. Defining Constants with `const`

```php
const STATUS_PAID = "paid";
echo STATUS_PAID;
```

### 3.1 Key Differences Between `define()` and `const`

| Feature                                       | `define()` | `const`      |
| --------------------------------------------- | ---------- | ------------ |
| Execution                                     | Runtime    | Compile-time |
| Allowed inside control structures (if, loops) | Yes        | No           |
| Allows variable-based constant names          | Yes        | No           |

### Example: Using `define()` inside control structures

```php
if (true) {
    define("STATUS_PAID", "paid"); // valid
}

if (true) {
    const STATUS_VOID = "void"; // invalid, compile-time error
}
```

---

## 4. Dynamic Constant Names

`define()` allows variables to be used to build constant names.

### Example:

```php
$paid = "PAID";
define("STATUS_" . $paid, "paid");

echo STATUS_PAID; // prints paid
```

You can dynamically set both the name and value:

```php
$name = "FOUR";
define("STATUS_" . $name, 4);
echo STATUS_FOUR; // prints 4
```

---

## 5. When to Use Constants

Use constants for **static, rarely changing values**, such as:

* Status codes (PAID, VOID, PENDING)
* Configuration values
* Fixed text identifiers

---

## 6. Predefined and Magic Constants

### 6.1 Predefined Constants

PHP provides many predefined constants. Example:

```php
echo PHP_VERSION;
```

This prints the current PHP version.

### 6.2 Magic Constants

Magic constants change depending on **where they are used**. Examples include:

| Constant   | Purpose                      |
| ---------- | ---------------------------- |
| `__LINE__` | Current line number          |
| `__FILE__` | Full file path of the script |

**Example:**

```php
echo __LINE__;  // prints the line number where this statement is written
echo __FILE__;  // prints the full path of the current file
```

If the `__LINE__` constant is moved to another line, its output changes accordingly.

---

## 7. Variable Variables in PHP

Variable variables allow dynamic creation of variables using the value of another variable.

### 7.1 Basic Example

```php
$foo = "bar";
$$foo = "buzz"; // Creates $bar = "buzz";
```

Explanation:

* `$foo` contains `"bar"`
* `$$foo` becomes `$bar`
* `$bar` is assigned `"buzz"`

**Output:**

```php
echo $foo; // bar
echo $bar; // buzz
```

### 7.2 Accessing Variable Variables

Valid:

```php
echo $$foo; // buzz
```

Invalid (when used inside quoted strings):

```php
echo "$$foo"; // prints "$bar" not "buzz"
```

Correct way using braces:

```php
echo "${$foo}"; // buzz
```

Or:

```php
echo $${foo}; // buzz
```

### 7.3 Why Use Variable Variables?

Dynamic variable creation is useful for:

* Dynamic form handling
* Creating variable names programmatically
* Working with arrays/objects in more advanced scenarios

More advanced use cases will be covered later (arrays, objects).

---

# Summary

This lesson covered:

* What constants are and how they differ from variables.
* Defining constants using `define()` and `const`.
* Runtime vs compile-time behavior.
* Dynamic constant creation using variables.
* PHP predefined and magic constants.
* The concept and usage of variable variables.

The next lesson discusses **PHP data types and casting**.

If you want, I can also create a code-only cheat sheet or practice exercises based on this topic.
