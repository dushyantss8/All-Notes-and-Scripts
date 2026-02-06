# 1. Introduction to PHP Functions

A **function** in PHP is a reusable block of code that performs a specific task. Functions help organize code, avoid repetition, and improve maintainability.

PHP supports:

* **User-defined functions**
* **Built-in functions** (e.g., `strlen()`, `array_merge()`)
* **Anonymous functions / Closures**
* **Arrow functions**
* **Recursive functions**

---

# 2. Declaring a Basic Function

### Syntax

```php
function functionName() {
    // code to execute
}
```

### Example

```php
function greet() {
    echo "Hello World";
}

greet(); // Output: Hello World
```

---

# 3. Function Parameters

### Example with one parameter

```php
function greetUser($name) {
    echo "Hello, $name";
}

greetUser("Dushyant"); // Output: Hello, Dushyant
```

### Example with multiple parameters

```php
function fullName($firstName, $lastName) {
    return $firstName . " " . $lastName;
}

echo fullName("Dushyant", "Vishwakarma");
```

---

# 4. Default Parameter Values

Default values allow a function to be called without passing all arguments.

```php
function connectDB($host = "localhost", $port = 3306) {
    echo "Connecting to $host on port $port...";
}

connectDB();                    // Uses defaults
connectDB("db.example.com",80); // Custom arguments
```

---

# 5. Return Statement

The `return` statement stops function execution and returns a value.

```php
function add($a, $b) {
    return $a + $b;
}

$result = add(10, 20);
echo $result; // 30
```

---

# 6. Variable Scope in Functions

### Local Scope

Variables defined inside a function exist only inside that function.

```php
function test() {
    $x = 10; // local
    echo $x;
}
```

### Global Keyword

Access a global variable inside a function.

```php
$x = 100;

function show() {
    global $x;
    echo $x;
}

show(); // Output: 100
```

### $GLOBALS Superglobal

```php
$x = 50;

function updateValue() {
    $GLOBALS['x'] = 200;
}

updateValue();
echo $x; // Output: 200
```

### Static Variables

Static variables preserve value across function calls.

```php
function counter() {
    static $count = 0;
    $count++;
    echo $count . "\n";
}

counter(); // 1
counter(); // 2
counter(); // 3
```

---

# 7. Type Hinting (Type Declarations)

PHP allows specifying data types for:

* **Function parameters**
* **Return values**

Supported types include:

* `int`, `float`, `string`, `bool`
* `array`
* `object`
* `callable`
* `iterable`
* Class/interface names
* `mixed`
* `void`
* `?Type` (nullable types)
* Union types (`int|string`)

### Example: Parameter Type Hinting

```php
function multiply(int $a, int $b) {
    return $a * $b;
}

echo multiply(5, 3);
```

### Example: Return Type Declaration

```php
function message(): string {
    return "Hello PHP";
}
```

### Example: Nullable Types

```php
function findUser(?int $id): ?array {
    if ($id === null) return null;
    return ["id" => $id, "name" => "User"];
}
```

### Example: Union Types (PHP 8)

```php
function calculate(int|float $a, int|float $b): int|float {
    return $a + $b;
}
```

---

# 8. Strict Types

Enable strict mode at the top of the file.

```php
<?php
declare(strict_types=1);

function add(int $x, int $y) {
    return $x + $y;
}

echo add(2, 3);       // OK
echo add("2", 3);     // TypeError in strict mode
```

---

# 9. Passing Arguments: By Value vs Reference

### By Value (Default)

```php
function increase($num) {
    $num++;
}

$x = 10;
increase($x);
echo $x; // 10
```

### By Reference

Use `&` to modify the original variable.

```php
function increaseRef(&$num) {
    $num++;
}

$x = 10;
increaseRef($x);
echo $x; // 11
```

---

# 10. Variadic Functions (`...$variable`)

Used when the number of arguments is unknown.

```php
function sum(...$numbers) {
    return array_sum($numbers);
}

echo sum(1, 2, 3, 4); // 10
```

---

# 11. Anonymous Functions & Closures

### Anonymous Function Example

```php
$greet = function($name) {
    return "Hello $name";
};

echo $greet("Dushyant");
```

### Using `use` to Import Variables from Parent Scope

```php
$message = "Welcome";

$welcome = function($name) use ($message) {
    return "$message, $name";
};

echo $welcome("Dushyant");
```

---

# 12. Arrow Functions (PHP 7.4+)

Short syntax for simple closures.

```php
$add = fn($a, $b) => $a + $b;

echo $add(5, 7);
```

Arrow functions automatically capture variables from parent scope.

---

# 13. Recursive Functions

A function that calls itself.

```php
function factorial(int $n): int {
    if ($n <= 1) return 1;
    return $n * factorial($n - 1);
}

echo factorial(5); // 120
```

---

# 14. Named Arguments (PHP 8.0+)

Arguments can be passed by specifying parameter names.

```php
function createUser($name, $role = "user", $active = true) {
    return compact('name', 'role', 'active');
}

$user = createUser(role: "admin", name: "Dushyant");
print_r($user);
```

---

# 15. Best Practices for PHP Functions

1. **Use strict types** where possible.
2. **Always specify return types** for clarity and safety.
3. **Keep functions small and single-purpose.**
4. **Avoid using global variables**; pass dependencies as parameters.
5. **Use meaningful function names** following camelCase.
6. **Document functions with PHPDoc** when working in teams or large codebases.

### Example with PHPDoc

```php
/**
 * Calculates the net price.
 *
 * @param float $price
 * @param float $tax
 * @return float
 */
function netPrice(float $price, float $tax): float {
    return $price + ($price * $tax);
}
```

---

# 16. Complete Example Demonstrating All Concepts

```php
<?php
declare(strict_types=1);

/**
 * Example demonstrating advanced function features.
 */
function createInvoice(
    int $id,
    string $customer,
    float $amount,
    ?float $discount = null
): array {
    $netAmount = $discount
        ? calculateNet($amount, $discount)
        : $amount;

    return [
        "id"        => $id,
        "customer"  => $customer,
        "amount"    => $amount,
        "netAmount" => $netAmount
    ];
}

function calculateNet(float $amount, float $discount): float {
    return $amount - ($amount * $discount);
}

$invoice = createInvoice(
    id: 101,
    customer: "Dushyant",
    amount: 1000.00,
    discount: 0.10
);

print_r($invoice);
```

---