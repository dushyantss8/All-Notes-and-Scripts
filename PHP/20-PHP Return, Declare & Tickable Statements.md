# PHP Return, Declare, and Goto Statements

---

## 1. The `return` Statement

### Purpose

`return` transfers control back to the calling environment.
Its behavior depends on whether it is used **inside** a function or **in the global scope**.

### 1.1 Using `return` Inside a Function

When `return` is executed within a function:

* It **immediately stops** the function’s execution.
* It **returns** the provided expression or value.
* Script execution continues **after** the function call.

#### Example

```php
function sum($x, $y) {
    $z = $x + $y;
    return $z;
}

$x = sum(5, 10);
echo $x;            // 15
echo "<br>";
echo "Hello World"; // This still executes
```

### 1.2 Using `return` in the Global Scope

A `return` used outside a function:

* Terminates the **execution of the entire script** at that point.
* The expression is optional; `null` is returned if omitted.

#### Example

```php
echo sum(5, 10); // 15
return;          // Script stops here
echo "Hello";    // Not executed
```

---

## 2. The `declare` Statement

The `declare` statement configures certain **per-script directives**.
PHP currently supports three directives:

1. `ticks`
2. `encoding`
3. `strict_types`

### Syntax

```php
declare(directive = value);
```

---

## 2.1 Tick Directive (`ticks`)

### Concept

A "tick" is a low-level event triggered by PHP when executing tickable statements.
You can register a function to run **every N tickable statements**.

### Steps to Use Ticks

#### 1. Define a tick handler:

```php
function on_tick() {
    echo "Tick<br>";
}
```

#### 2. Register the handler:

```php
register_tick_function('on_tick');
```

#### 3. Use `declare(ticks=...)`:

```php
declare(ticks=3); // Trigger handler every 3 tickable statements
```

#### 4. Code that generates ticks:

```php
$i = 0;
$length = 10;

while ($i < $length) {
    echo $i++ . "<br>";
}
```

### Use Cases

Ticks are rarely needed. A typical use case is **profiling** or low-level **benchmarking**.

---

## 2.2 Encoding Directive (`encoding`)

* Specifies per-script encoding.
* Obsolete for most use cases; normally **not needed**.

---

## 2.3 Strict Types Directive (`strict_types`)

### Purpose

Enforces **strict type checking** on function arguments and return values.
Must be declared at the **top of the file**.

### Example

```php
declare(strict_types=1);

function sum(int $x, int $y) {
    return $x + $y;
}

echo sum(5, 10);   // 15
echo sum("5", 10); // Fatal error under strict types
```

### Important Behavior

* `strict_types` applies **only to the file where it is declared**.
* If a strict-typed function is called from another file that does **not** declare strict types, PHP will allow type coercion.

### Demonstration with Included Files

#### index.php

```php
declare(strict_types=1);

function sum(int $x, int $y) {
    return $x + $y;
}
```

#### foo.php

```php
require 'index.php';

echo sum("5", 10);  // No error (foo.php has no strict types)
```

To enforce strict types in both files:

```php
declare(strict_types=1);
```

must be added to `foo.php` as well.

---

## 3. The `goto` Statement

The transcript only notes its existence but does not provide usage examples.
Key points:

* `goto` allows jumping to another code label within the same file.
* Rarely used and generally discouraged.
* Included in PHP for completeness.

Example (not in transcript but relevant for completeness):

```php
goto skip;
echo "This will not run";

skip:
echo "Jumped here";
```

---

# End of Tutorial