# PHP Functions: Arguments, Types, Defaults, References, Splat Operator, Unpacking, and Named Arguments

This tutorial expands on PHP function fundamentals by covering how to define and use parameters, type hinting, default values, union types, passing by reference, variable-length parameters (splat operator), argument unpacking, and named arguments.

---

## 1. Defining Parameters and Passing Arguments

A function can accept parameters defined inside its parentheses.

### Example

```php
function foo($x, $y) {
    return $x * $y;
}

echo foo(5, 10); // 50
```

### Terminology

* **Parameters**: Variables declared in the function signature (`$x`, `$y`).
* **Arguments**: Actual values passed during function call (`5`, `10`).

---

## 2. Type Hinting Parameters

PHP allows specifying the expected type for parameters.

### Example

```php
function foo(int $x, int $y): int {
    return $x * $y;
}
```

If strict types are enabled:

```php
declare(strict_types=1);
```

Passing incorrect types produces an error.

---

## 3. Union Types (PHP 8+)

To allow multiple types for a parameter:

```php
function foo(int|float $x, int|float $y): int|float {
    return $x * $y;
}
```

Union types help accept numeric inputs while still enforcing strict type checking.

---

## 4. Default Parameter Values

You can define default values for parameters. Defaults must be constant expressions (scalar, array, null).

### Example

```php
function foo(int $x, int $y = 10) {
    return $x * $y;
}

echo foo(5); // 5 * 10 = 50
```

### Rules

* Optional parameters must come **after all required parameters**.

Invalid:

```php
function foo($x = 10, $y) {} // Error
```

---

## 5. Passing Arguments by Reference

By default, arguments are passed **by value**.
To modify the caller’s variable, pass by **reference** using `&`.

### Example

```php
function foo(&$x, $y) {
    if ($x % 2 === 0) {
        $x = $x / 2;
    } else {
        $x = $x * $y;
    }
}

$a = 6;
foo($a, 7);
echo $a; // 3 (modified inside function)
```

---

## 6. Variable-Length Parameters (Splat Operator `...`)

Use `...` to accept a dynamic number of arguments. They are captured into an array.

### Example

```php
function sum(...$numbers) {
    return array_sum($numbers);
}

echo sum(1, 2, 3, 4); // 10
```

### Splat After Fixed Parameters

```php
function sum(int|float $x, int|float $y, int|float ...$numbers) {
    return $x + $y + array_sum($numbers);
}
```

### Type Hinting With Splat

```php
function sum(int|float ...$numbers) {
    return array_sum($numbers);
}
```

Each item must match the type.

---

## 7. Argument Unpacking (Using `...` When Calling)

The splat operator can unpack an array into individual arguments.

### Example

```php
function sum(int|float ...$numbers) {
    return array_sum($numbers);
}

$nums = [1, 2, 3, 4];
echo sum(...$nums); // 10
```

Associative array keys are treated as **named argument identifiers**.

---

## 8. Named Arguments (PHP 8+)

Named arguments allow passing values using parameter names instead of relying on order.

### Example

```php
function foo($x, $y) {
    return $x % $y === 0 ? $x / $y : $x;
}

echo foo(y: 3, x: 6); // Works even though order is reversed
```

### Benefits

1. Order no longer matters.
2. Helps when functions have many parameters with default values (e.g., `setcookie`).
3. Reduces the need to pass placeholder parameters.

### Example: Using Named Arguments in Built-in Functions

Without named arguments:

```php
setcookie("foo", "bar", 0, "", "", false, true);
```

With named arguments:

```php
setcookie(
    name: "foo",
    value: "bar",
    httponly: true
);
```

### Rules

* Named arguments must come **after positional arguments**.
* Duplicate parameter names cause errors.
* Changing a parameter name in the function requires updating all named-argument calls.

---

## 9. Argument Unpacking + Named Arguments

When unpacking arrays:

* Associative array keys act as named arguments.
* Numeric keys act as positional arguments.

### Example

```php
$data = ['x' => 1, 'y' => 2];
foo(...$data); // x=1, y=2
```

If keys are missing or reused, errors can occur.

---

# Summary

* Parameter definition and argument passing
* Type hinting and union types
* Default parameter values
* Passing by reference
* Splat operator for variable-length parameters
* Argument unpacking
* Named arguments and their practical use cases

These features enable writing more robust, readable, and maintainable PHP functions.

---