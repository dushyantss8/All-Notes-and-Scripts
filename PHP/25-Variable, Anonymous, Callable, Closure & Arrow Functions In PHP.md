# PHP Functions: Variable Functions, Anonymous Functions, Closures, Callbacks, and Arrow Functions

A Detailed Tutorial Summary

## 1. Variable Functions

### Concept

A *variable function* refers to invoking a function using the value stored in a variable. When PHP detects parentheses immediately after a variable, it attempts to call a function whose name matches the variable's value.

### Example: Basic Usage

```php
function sum(int ...$numbers) {
    return array_sum($numbers);
}

$x = 'sum';
echo $x(1, 2, 3);   // Calls sum(1, 2, 3)
```

### Behavior

* If the variable's value does not correspond to an existing function name, PHP throws an error.

### Error-Safe Invocation

Use `is_callable()` to verify that the value can be called as a function:

```php
if (is_callable($x)) {
    echo $x(1, 2);
} else {
    echo "Not callable";
}
```

### Limitations

Variable functions **do not** work with PHP *language constructs* such as:

* `isset`, `empty`, `unset`
* `print`, `echo`
* `include`, `require`

To call these indirectly, wrap them in a normal function.

---

## 2. Anonymous Functions (Lambdas)

### What They Are

Anonymous functions are functions **without a name**. They must end with a semicolon and are treated as expressions.

### Example

```php
$sum = function ($a, $b) {
    return $a + $b;
};
echo $sum(2, 3);
```

### Using with Variables

They can be stored in variables, passed as arguments, or returned from other functions.

### Scope Behavior

Anonymous functions have local scope. To access variables from the parent scope, you must use the `use` keyword.

### Example: Using External Variables

```php
$x = 1;
$fn = function () use ($x) {
    echo $x;
};
$fn();   // Outputs 1
```

### Value Copy vs Reference

By default, variables included via `use` are **copied by value**.
To pass by reference:

```php
$x = 1;
$fn = function () use (&$x) {
    $x = 15;
};
$fn();
echo $x;   // Outputs 15
```

These enhanced anonymous functions with bound variables are known as **closures**.

---

## 3. Callable Type and Callback Functions

### Callback Concept

A *callback function* is a function passed as an argument to another function and executed within it.

### PHP Built-ins That Use Callbacks

* `array_map`
* `array_filter`
* `usort`
* and many others

### Using Anonymous Functions as Callbacks

```php
$array = [1, 2, 3, 4];
$result = array_map(function ($n) {
    return $n * 2;
}, $array);
```

### Using a Function Name as a Callback

```php
function foo($n) {
    return $n * 2;
}

$result = array_map('foo', $array);
```

### Using Callback Type Hinting

```php
function processNumbers(callable $callback, array $values) {
    return $callback($values);
}

processNumbers('foo', [1, 2, 3]);
```

### Callable vs Closure

* `callable`: can be any callable entity (string function names, object methods, anonymous functions).
* `Closure`: specifically anonymous function instances.

---

## 4. Arrow Functions (PHP 7.4+)

### Purpose

Arrow functions provide a short, clean syntax for single-expression anonymous functions—mostly used as inline callbacks.

### Syntax

```php
fn (parameter_list) => expression
```

### Example (Array Map)

```php
$array = [1, 2, 3, 4];
$result = array_map(fn($n) => $n * $n, $array);
```

### Differences from Anonymous Functions

#### 1. Automatic Variable Capture

Arrow functions automatically inherit variables from the parent scope **by value**—no `use` keyword needed.

```php
$y = 5;
$fn = fn($n) => $n * $y;
```

Variable `y` cannot be modified inside the arrow function.

#### 2. Single Expression Only

Arrow functions can only contain **one expression**.
They implicitly return the result of that expression.

Invalid multi-line example:

```php
fn($n) => { $x = $n + 1; return $x; };  // Not allowed
```

Valid multi-line *array literal* example:

```php
fn() => [
    'a' => 1,
    'b' => 2
];
```

---

# Summary of Key Takeaways

1. **Variable Functions** allow calling functions dynamically via variables.
2. **Anonymous Functions** are unnamed functions assignable to variables, usable as callbacks, and capable of capturing external variables.
3. **Closures** are anonymous functions using variables from the parent scope (by value or reference).
4. **Callback Functions** are frequently used with array functions and can be typed as `callable` or `Closure`.
5. **Arrow Functions** offer concise syntax, automatically capture external variables (by value), and must contain a single expression.

---