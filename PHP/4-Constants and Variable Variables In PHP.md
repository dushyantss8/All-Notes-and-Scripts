# PHP Constants and Variable Variables —

## 1. Variables vs Constants in PHP

### 1.1 Variables

* Variables can be **reassigned** after their initial declaration.
* PHP executes code **top to bottom**, so later assignments override earlier ones.

#### Example

```php
<?php
$firstName = "John Doe";
$firstName = "Mark Doe";

echo $firstName; // Output: Mark Doe
```

**Explanation**

* `$firstName` is first assigned `"John Doe"`.
* It is later reassigned to `"Mark Doe"`.
* The final value (`"Mark Doe"`) is printed.

---

## 2. Constants in PHP

### 2.1 What Are Constants?

* Constants are values that **cannot be changed once defined**.
* They are used for **static data** that should remain immutable.

Common use cases:

* Status values (PAID, PENDING, VOID)
* Configuration values
* Environment flags

---

## 3. Defining Constants Using `define()`

### 3.1 Syntax

```php
define(string $name, mixed $value);
```

* **First parameter**: Constant name
* **Second parameter**: Constant value
* The third parameter (case-insensitivity) is **deprecated** and should not be used.

### 3.2 Naming Rules

* Must start with a **letter or underscore**
* Cannot contain special characters
* **Case-sensitive**
* Convention: use **UPPERCASE** names

### 3.3 Example

```php
<?php
define("STATUS_PAID", "paid");

echo STATUS_PAID; // Output: paid
```

**Important**

* Constants do **not** use a `$` sign when referenced.

### 3.4 Immutability

Attempting to redefine a constant causes an error:

```php
define("STATUS_PAID", "paid");
define("STATUS_PAID", "void"); // ❌ Error
```

---

## 4. Checking If a Constant Is Defined

### 4.1 Using `defined()`

```php
<?php
echo defined("STATUS_PAID"); // Output: 1 (true)
echo defined("STATUS_VOID"); // Output: (nothing)
```

**Explanation**

* `defined()` returns a boolean.
* `true` is displayed as `1` in PHP output.

---

## 5. Defining Constants Using `const`

### 5.1 Syntax

```php
const STATUS_PAID = "paid";
```

### 5.2 Example

```php
<?php
const STATUS_PAID = "paid";

echo STATUS_PAID;
```

---

## 6. `define()` vs `const`

### 6.1 Key Differences

| Feature                       | `define()` | `const`      |
| ----------------------------- | ---------- | ------------ |
| Evaluation Time               | Runtime    | Compile-time |
| Allowed in Control Structures | Yes        | No           |
| Dynamic Names                 | Yes        | No           |

### 6.2 Control Structure Example

#### Using `define()` (Valid)

```php
<?php
if (true) {
    define("STATUS_PAID", "paid");
}
```

#### Using `const` (Invalid)

```php
<?php
if (true) {
    const STATUS_PAID = "paid"; // ❌ Error
}
```

---

## 7. Dynamic Constant Names

### 7.1 Using Variables as Constant Names

```php
<?php
$status = "PAID";

define("STATUS_" . $status, "paid");

echo STATUS_PAID; // Output: paid
```

**Explanation**

* Constant names can be built dynamically using `define()`.
* IDEs may underline these constants, but they are valid at runtime.

---

## 8. When to Use Constants

Use constants when:

* The value should **never change**
* The value represents **fixed states or configuration**
* Examples:

  * Payment statuses
  * Application modes
  * Environment flags

---

## 9. Predefined Constants in PHP

PHP provides many built-in constants.

### 9.1 PHP Version

```php
<?php
echo PHP_VERSION;
```

Example Output:

```
7.4
```

> PHP 8 is recommended for modern development.

---

## 10. Magic Constants

### 10.1 What Are Magic Constants?

* Special constants whose values **depend on where they are used**
* Their names start and end with double underscores

### 10.2 Common Magic Constants

#### Line Number

```php
<?php
echo __LINE__;
```

Output depends on the line number where it appears.

#### File Path

```php
<?php
echo __FILE__;
```

Prints the full path of the current file.

---

## 11. Variable Variables in PHP

### 11.1 What Are Variable Variables?

* A variable whose **name is taken from the value of another variable**

### 11.2 Basic Example

```php
<?php
$foo = "bar";
$$foo = "baz";

echo $bar; // Output: baz
```

**Explanation**

* `$foo` contains `"bar"`
* `$$foo` becomes `$bar`
* Equivalent to:

  ```php
  $bar = "baz";
  ```

---

## 12. Printing Variable Variables

### 12.1 Direct Access

```php
echo $bar;
```

### 12.2 Correct Usage in Strings

❌ Incorrect:

```php
echo "$$foo"; // Prints literal text
```

✅ Correct:

```php
echo ${$foo};
```

OR

```php
echo "$" . ${$foo};
```

---

## 13. Why Variable Variables Are Useful

* Enable **dynamic variable creation**
* Common in:

  * Arrays
  * Objects
  * Advanced meta-programming scenarios

More advanced usage is typically combined with arrays or objects.

---

## 14. Summary

* **Variables** can change; **constants cannot**
* Constants can be defined using:

  * `define()` (runtime, dynamic)
  * `const` (compile-time, static)
* PHP includes:

  * Predefined constants (e.g., `PHP_VERSION`)
  * Magic constants (e.g., `__LINE__`, `__FILE__`)
* **Variable variables** allow dynamic variable naming

---