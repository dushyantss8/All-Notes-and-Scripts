# PHP Control Structures: If, Elseif, and Else

### Tutorial-Style Summary

## 1. Introduction to PHP Statements and Control Structures

A PHP script is composed of **statements**, such as:

* Assignments
* Function calls
* Loops
* Conditional structures (if/else, switch, etc.)

Each statement in PHP **ends with a semicolon**. Multiple statements can be grouped using **curly braces `{}`**.

A **control structure** allows you to:

* Group multiple statements
* Control execution flow based on conditions

Examples:

* Execute a block only if a condition is true
* Repeat a block until a condition is met

---

# 2. The `if` Conditional Statement

## Syntax

```php
if (condition) {
    // statements executed if condition is true
}
```

* The condition can be **any valid PHP expression**.
* It may involve variables, comparison operators, logical operators, or complex expressions.

## Example: Simple Grading System

```php
$score = 95;

if ($score >= 90) {
    echo "A";
}
```

If `$score` is 95, the output is:

```
A
```

If `$score` becomes 85, nothing is printed.

### One-line `if` without braces

For a single statement, braces are optional:

```php
if ($score >= 90) echo "A";
```

However, **using braces is recommended** for readability and maintainability.

---

# 3. Using `else`

When the `if` condition evaluates to **false**, you can provide a default block:

```php
if ($score >= 90) {
    echo "A";
} else {
    echo "F";
}
```

---

# 4. Using `elseif` for Multiple Conditions

You can chain multiple conditions using `elseif`:

```php
if ($score >= 90) {
    echo "A";
} elseif ($score >= 80) {
    echo "B";
} elseif ($score >= 70) {
    echo "C";
} elseif ($score >= 60) {
    echo "D";
} else {
    echo "F";
}
```

Examples:

* `$score = 85` prints `B`
* `$score = 65` prints `D`
* `$score = 50` prints `F`

### Alternative `elseif` keyword form

PHP allows:

```php
else if () { }
```

But this version **cannot be used** in alternative/colon syntax (explained later).
Recommended: always use `elseif` (no space).

---

# 5. Nested `if` Statements

You may nest conditionals to achieve more granular logic:

```php
if ($score >= 90) {
    if ($score >= 95) {
        echo "A+";
    } else {
        echo "A";
    }
}
```

Example:

* `$score = 95` prints `A+`
* `$score = 94` prints `A`

You can nest blocks inside `if`, `elseif`, or `else`.

---

# 6. Embedding Conditionals Inside HTML (Default Syntax Issues)

When writing PHP inside HTML:

* Frequent opening and closing `<?php ?>` tags become messy.
* Echoing long HTML blocks reduces readability.

Example of unreadable structure:

```php
<?php
if ($score >= 90) {
    echo "<p style='color:green'>A</p>";
} elseif ($score >= 80) {
    echo "<p style='color:orange'>B</p>";
} else {
    echo "<p style='color:red'>F</p>";
}
?>
```

---

# 7. PHP Alternative Syntax for Control Structures

Designed for mixing PHP with HTML cleanly.

## Syntax

Replace `{}` with `:` and end with `endif;`

### Example with Colon Syntax

```php
<?php if ($score >= 90): ?>
    <p style="color:green">A</p>
<?php elseif ($score >= 80): ?>
    <p style="color:orange">B</p>
<?php else: ?>
    <p style="color:red">F</p>
<?php endif; ?>
```

### Notes:

* This format is more readable when embedding HTML.
* You **must use** `elseif` (no space).
  `else if` will cause a syntax error in alternative syntax.

---

# 8. Using HTML and Styling in Conditional Blocks

Example:

```php
<?php $score = 55; ?>

<?php if ($score >= 90): ?>
    <span style="color:green">A</span>
<?php elseif ($score >= 80): ?>
    <span style="color:blue">B</span>
<?php elseif ($score >= 70): ?>
    <span style="color:orange">C</span>
<?php else: ?>
    <span style="color:red">F</span>
<?php endif; ?>
```

This approach enables:

* Cleaner HTML structure
* Easier styling and layout integration
* Better readability compared to heavy `echo` usage

---

# 9. Summary

You learned:

* How `if`, `elseif`, and `else` conditionals work in PHP
* The correct syntax and execution flow
* How to nest conditional statements
* Best practices regarding curly braces
* The differences between `elseif` and `else if`
* How to embed PHP conditionals inside HTML effectively
* How to use **alternative colon syntax** to improve readability

---
