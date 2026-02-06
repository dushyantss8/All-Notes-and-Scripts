# PHP Operator Precedence and Associativity

This tutorial explains how PHP evaluates complex expressions that contain multiple operators. It focuses on operator precedence, associativity, grouping rules, and potential pitfalls when combining logical operators and assignment.

---

## 1. Understanding Operator Precedence

### Definition

Operator precedence determines the order in which different operators are evaluated when they appear together in an expression.

Operators with **higher precedence** execute **before** operators with lower precedence.

### Basic Example

```php
$x = 5 + 3 * 5;
```

Without precedence, this would be interpreted as:

```
(5 + 3) * 5 = 40
```

But multiplication has higher precedence than addition, so PHP evaluates:

```
3 * 5 = 15
5 + 15 = 20
```

Final result:

```php
echo $x; // 20
```

### Overriding Precedence with Parentheses

You can force custom grouping:

```php
$x = (5 + 3) * 5;
echo $x; // 40
```

Parentheses always take highest precedence.

---

## 2. Operator Associativity

When two operators have **the same precedence**, associativity determines the evaluation direction.

Types of associativity:

* **Left-associative**: evaluated left-to-right
* **Right-associative**: evaluated right-to-left
* **Non-associative**: cannot be combined directly

### Example: Assignment (Right-Associative)

```php
$x = $y = 5;
```

Assignment operators are **right-associative**, so PHP groups this as:

```
$y = 5
$x = (result of $y = 5)
```

Both variables end up as `5`.

### Example: Multiplication and Division (Left-Associative)

```php
$result = $x / $y * $z;
```

Since `/` and `*` have equal precedence and are left-associative:

```
($x / $y) * $z
```

---

## 3. Non-Associative Operators

Certain operators cannot be chained because they are non-associative.

Invalid example:

```php
$x < $y > $z;   // Not allowed
```

However, mixing operators of *different precedence levels* works:

```php
$x < $y && $y > $z; // Valid
```

---

## 4. Logical Operators and Precedence

PHP has two sets of logical operators:

| Symbolic Operators | Keyword Operators |
| ------------------ | ----------------- |
| &&, ||, !          | and, or, xor      |

They **do not** have the same precedence:

* `!` (logical NOT) has high precedence
* `&&` has higher precedence than `||`
* `and` and `or` have **very low** precedence

### Example: Unary NOT is evaluated first

```php
$x = true;
$y = false;

var_dump($x && ! $y); // true
```

Because `!` has higher precedence than `&&`, PHP evaluates:

```
!$y  → true
$x && true → true
```

### Example: Combining AND and OR

```php
$x = true;
$y = false;
$z = true;

var_dump($x && $y || $z);
```

Precedence: `&&` is evaluated before `||`:

```
$x && $y → false
false || $z → true
```

Output: `true`

---

## 5. Understanding "and" vs "&&" Precedence Differences

This is a common source of bugs.

### Example with `&&` (higher precedence than assignment)

```php
$x = true;
$y = false;

$z = $x && $y;
var_dump($z); // false
```

Grouping:

```
($x && $y) → false
$z = false
```

### Example with `and` (lower precedence than assignment)

```php
$z = $x and $y;
```

Grouping:

```
($z = $x) and $y
```

This means:

```
$z = true;
true and false → false   // This result is discarded
```

So `$z` becomes `true`.

### Correcting it with parentheses

```php
$z = ($x and $y); // Evaluates inside parentheses first
var_dump($z); // false
```

---

## 6. Why Parentheses Are Essential

The tutorial emphasizes always using parentheses when mixing:

* logical operators
* assignment operators
* comparison operators

Benefits:

1. **Clarity** – makes code readable and intention explicit.
2. **Reliability** – removes dependency on precedence rules.

Example:

```php
$z = ($x and $y);  // clear and correct
```

---

# Summary

This tutorial covered:

* How operator precedence determines execution order.
* How associativity affects operators of equal precedence.
* Why certain operators cannot be chained (non-associative).
* How logical operators differ in precedence.
* The critical difference between symbolic (&&, ||) and keyword (and, or) logical operators.
* The importance of parentheses to enforce predictable evaluation.

This knowledge is essential for writing safe, predictable, and maintainable PHP expressions, especially when combining multiple operator types.

---