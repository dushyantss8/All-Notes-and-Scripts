# PHP Operators Tutorial -

This tutorial covers several advanced operator categories in PHP, including error-control operators, increment/decrement behavior, logical operators, bitwise operators, and array operators. It also briefly introduces execution, type, and null-safe operators.

---

## 1. Error Control Operator (`@`)

### Purpose

The error control operator suppresses error messages that would normally be triggered by an expression.

### Usage Example

```php
$x = @file('file.txt');   // file.txt does not exist
```

Without `@`:

* PHP displays a warning.

With `@`:

* The warning is suppressed.

### Important Notes

* Suppresses errors based on the configured PHP error settings.
* Not recommended in normal application code because:

  * It hides problems.
  * It complicates debugging.
  * It can silently break application behavior.

Use proper error handling instead of suppressing errors.

---

## 2. Increment and Decrement Operators (`++` and `--`)

These operators increase or decrease a variable’s value by 1.

### Types

1. **Post-increment (`x++`)**
2. **Post-decrement (`x--`)**
3. **Pre-increment (`++x`)**
4. **Pre-decrement (`--x`)**

### Pre vs. Post Behavior

* **Post-increment/decrement:** Returns the current value, then modifies it.
* **Pre-increment/decrement:** Modifies the value first, then returns it.

### Example

```php
$x = 5;

echo $x++;  // Output: 5 (then x becomes 6)
echo $x;    // Output: 6

$x = 5;
echo ++$x;  // Output: 6 (x already incremented)
```

### Data Type Effects

Increment/decrement affect only some data types:

| Data Type | Increment                            | Decrement |
| --------- | ------------------------------------ | --------- |
| Numbers   | Works                                | Works     |
| Strings   | Increments alphabetically            | No effect |
| Null      | Becomes 1                            | No effect |
| Boolean   | Converts to integer, then increments | No effect |
| Arrays    | No effect                            | No effect |

#### Example: Strings

```php
$x = "abc";
echo ++$x;  // abd
echo $x--;  // no effect for decrement
```

---

## 3. Logical Operators

Used to combine multiple conditions.

### Standard Logical Operators

| Operator | Meaning     |   |            |
| -------- | ----------- | - | ---------- |
| `&&`     | Logical AND |   |            |
| `        |             | ` | Logical OR |
| `!`      | Logical NOT |   |            |

### Basic Examples

```php
$x = true;
$y = false;

var_dump($x && $y); // false
var_dump($x || $y); // true
var_dump(!$x);      // false
```

### Type Conversion

Non-boolean values are converted to boolean when evaluated.

---

### Alternative Keyword Operators

PHP also provides keyword equivalents:

| Symbol | Keyword |   |      |
| ------ | ------- | - | ---- |
| `&&`   | `and`   |   |      |
| `      |         | ` | `or` |
| `xor`  | `xor`   |   |      |

**Important:** These differ in *operator precedence*.

#### Example Showing Precedence Difference

```php
$x = true;
$y = false;

$z = $x && $y;  // false
$z = $x and $y; // $z becomes true
```

Explanation:

* `=` has higher precedence than `and`
* Expression interpreted as:
  `($z = $x) and $y`

---

### Short-Circuiting Behavior

PHP stops evaluating remaining expressions once the result is known.

#### Logical OR (`||`)

If the first operand is true, the rest are skipped.

#### Logical AND (`&&`)

If the first operand is false, the rest are skipped.

##### Example Using a Function

```php
function hello() {
    echo "Hello World";
    return false;
}

$x = true;
$y = false;

$x || hello();   // hello() not executed
$x && hello();   // hello() executed because x is true
```

---

## 4. Bitwise Operators

Operate at the bit level on integers or ASCII values of strings.

### Available Operators

| Operator | Description |            |
| -------- | ----------- | ---------- |
| `&`      | Bitwise AND |            |
| `        | `           | Bitwise OR |
| `^`      | Bitwise XOR |            |
| `~`      | Bitwise NOT |            |
| `<<`     | Shift left  |            |
| `>>`     | Shift right |            |

### Example: AND (`&`)

```php
$x = 6; // 110
$y = 3; // 011

var_dump($x & $y); // 010 → 2
```

### Example: OR (`|`)

```php
var_dump($x | $y); // 111 → 7
```

### Example: XOR (`^`)

```php
var_dump($x ^ $y); // 101 → 5
```

### Example: NOT (`~`)

Applies bit inversion.

### Bit Shifting

#### Left Shift (`<<`)

Multiplies by 2 for each shift step.

```php
6 << 3  // 6 × 2 × 2 × 2 = 48
```

#### Right Shift (`>>`)

Divides by 2 for each shift step.

```php
6 >> 1  // 6 / 2 = 3
```

### Notes

* Operands are converted to integers unless both are strings.
* Common uses:

  * Flags
  * Permission systems
  * Compression of multiple values into a single integer
  * Low-level optimizations

---

## 5. Array Operators

Array behavior changes for some operators.

### Union Operator (`+`)

Appends elements from the right-hand array only if keys do not already exist.

#### Example

```php
$x = ["a", "b", "c"];
$y = ["d", "e"];

$z = $x + $y;
// Output: ["a", "b", "c", "d", "e"]
```

If keys overlap:

```php
$x = ["a" => 1];
$y = ["a" => 4];

$x + $y  // ["a" => 1]
```

### Comparison Operators

| Operator | Meaning                                                |
| -------- | ------------------------------------------------------ |
| `==`     | Equal (key-value pairs match regardless of type/order) |
| `===`    | Identical (keys, values, types, and order must match)  |
| `!=`     | Not equal                                              |
| `<>`     | Alternate “not equal”                                  |
| `!==`    | Not identical                                          |

#### Examples

```php
$x = ["a" => 1, "b" => 2];
$y = ["b" => 2, "a" => 1];

var_dump($x == $y);   // true
var_dump($x === $y);  // false (order differs)
```

---

## 6. Other Operators Introduced (but not covered in detail)

### Execution Operator (`` `command` ``)

* Executes shell commands if `shell_exec` is enabled.
* Rarely used in modern PHP applications.

### Type Operators and Null-Safe Operator

Covered later in object-oriented PHP sections.

---

# End of Tutorial