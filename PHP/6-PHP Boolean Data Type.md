# PHP Booleans:

## 1. Overview of Booleans in PHP

A **boolean** represents a truth value:

* `true`
* `false`

In PHP, `true` and `false` are **predefined constants** and are **case-insensitive**. Examples:

```php
$isComplete = true;
$isComplete = TRUE;
$isComplete = TrUe;   // All valid
```

Recommended practice: use consistent lowercase values (`true`, `false`).

---

## 2. Booleans in Control Structures

Booleans are most commonly used with conditionals and loops. Example using `if`:

```php
if ($isComplete) {
    // Executes when expression evaluates to true
} else {
    // Executes when expression evaluates to false
}
```

Any expression inside the `if` condition is evaluated to either true or false.

---

## 3. Type Juggling: Values Automatically Converted to Boolean

PHP automatically converts non-boolean values to booleans in conditional expressions.

### Values that Evaluate to **false**

1. Integer: `0`, `-0`
2. Float: `0.0`, `-0.0`
3. Empty string: `""`
4. String `"0"`
5. Empty array: `[]`
6. `null`

### Everything else evaluates to **true**

Examples of truthy values:

* Any nonzero number (positive or negative)
* Any non-empty string (even `"false"`)
* Any array with at least one element

---

## 4. Examples of Boolean Evaluation

Testing values in a conditional:

```php
$isComplete = false;   // Output: fail
$isComplete = true;    // Output: success
$isComplete = 5;       // Output: success (non-zero integer → true)
$isComplete = -0;      // Output: fail
$isComplete = [];      // Output: fail (empty array)
$isComplete = [1, 2];  // Output: success (non-empty array)
```

Example:

```php
if ($isComplete) {
    echo 'success';
} else {
    echo 'fail';
}
```

---

## 5. Printing Boolean Values

### Method 1: Use conditionals to convert booleans to text

```php
echo $isComplete ? 'true' : 'false';
```

### Method 2: Echo the boolean directly

```php
echo $isComplete; // true prints "1", false prints nothing (empty string)
```

Why?

* PHP automatically **casts booleans to strings** when echoing.

  * `true` → `"1"`
  * `false` → `""` (empty string)

---

## 6. Using `var_dump()` to Inspect Type and Value

`var_dump()` shows both the type and the actual value:

```php
var_dump($isComplete);
```

Output examples:

```
bool(false)
bool(true)
```

Casting to string for demonstration:

```php
var_dump((string) $isComplete);
```

* For `true` → `string(1) "1"`
* For `false` → `string(0) ""`

---

## 7. Checking If a Variable Is Boolean: `is_bool()`

PHP provides `is_bool()` to check whether a variable is explicitly of boolean type.

Example:

```php
var_dump(is_bool($isComplete));
```

* Returns `true` only if `$isComplete` is actually `true` or `false`
* Returns `false` if `$isComplete` contains another type (e.g., array, string, integer)

---

## 8. Important Edge Case: The String `"false"`

The string `"false"` **does not** evaluate to false.

Reason:

* It is a non-empty string
* It is not `"0"`
* Therefore, it evaluates to **true**

Example:

```php
$isComplete = "false";

if ($isComplete) {
    echo 'success'; // This will execute
}
```

---