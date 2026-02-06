# PHP Variable Scope and Static Variables

## 1. Understanding Variable Scope in PHP

### 1.1 What Is Variable Scope?

Variable scope determines where a variable can be accessed within a script. PHP primarily uses two scopes:

* **Global scope**
* **Local (function) scope**

Most variables in PHP have a *single global scope*, which extends across included or required files.

---

## 2. Global Scope

### 2.1 Defining Global Variables

A variable defined outside any function resides in the global scope and is accessible throughout the script.

```php
$x = 5; // Global scope
```

### 2.2 Availability in Included Files

Global variables automatically become available in files included with `include` or `require`.

**Example:**

```php
// index.php
$x = 5;
include 'script1.php';
```

```php
// script1.php
echo $x; // prints 5
```

### 2.3 Modifying Global Variables in Included Files

Changes made inside the included file reflect back in the parent script:

```php
// script1.php
$x = 10;

// index.php
echo $x; // prints 10
```

---

## 3. Local Scope Inside Functions

Variables declared inside functions have **local scope**, meaning they are not accessible outside the function unless explicitly passed in.

### 3.1 Local Scope Example

```php
$x = 5;

function foo() {
    echo $x; // Warning: Undefined variable $x
}
foo();
```

---

## 4. Methods to Use Global Values Inside Functions

There are **three valid approaches**:

### 4.1 Option 1: Declare the Variable Inside the Function

```php
function foo() {
    $x = 1;
    echo $x;
}
```

### 4.2 Option 2: Pass as a Function Parameter

```php
$x = 5;

function foo($x) {
    echo $x;
}
foo($x); // prints 5
```

### 4.3 Option 3: Use the `global` Keyword

The `global` keyword imports a global variable into the local function scope.

```php
$x = 5;

function foo() {
    global $x;
    echo $x; // prints 5
}
foo();
```

#### Mutating a Global Variable Inside a Function

Changes apply to the original variable since it is referenced:

```php
function foo() {
    global $x;
    $x = 10;
}
foo();
echo $x; // prints 10
```

---

## 5. Accessing Global Variables Using `$GLOBALS`

PHP automatically stores all global variables in a superglobal associative array called `$GLOBALS`.

### 5.1 Access Example

```php
$x = 5;

function foo() {
    echo $GLOBALS['x']; // prints 5
}
foo();
```

### 5.2 Mutating via `$GLOBALS`

```php
function foo() {
    $GLOBALS['x'] = 10;
}
foo();
echo $x; // prints 10
```

---

## 6. Best Practices and Warnings

* Avoid using the `global` keyword and `$GLOBALS` in typical application development.
* Excessive reliance on global variables:

  * Reduces code clarity
  * Increases maintenance difficulty
  * Makes bugs harder to track
* Prefer **function parameters** and **return values** for data movement.

Additional superglobals (e.g., `$_SESSION`, `$_COOKIE`, `$_REQUEST`) will be covered separately.

---

# 7. Static Variables in PHP Functions

Static variables inside functions behave like local variables but **do not get destroyed** after function execution.

### 7.1 Purpose

Useful for caching expensive computations or persisting state during multiple calls.

---

## 7.2 Example Without Static Variable

### Expensive function:

```php
function expensiveCalculation() {
    sleep(2); // simulate heavy processing
    return 10;
}
```

### Wrapper function:

```php
function getValue() {
    $value = expensiveCalculation();
    return $value;
}
```

Calling the wrapper multiple times causes multiple delays:

```php
echo getValue();
echo getValue();
echo getValue();
// Total ~6 seconds
```

---

## 7.3 Using a Static Variable for Caching

### Optimized Function

```php
function getValue() {
    static $value = null;

    if ($value === null) {
        $value = expensiveCalculation();
    }

    return $value;
}
```

### Benefit

* Expensive function executes **only once**.
* All subsequent calls return the cached value instantly.

### Verification Example

Add an echo to observe when the expensive calculation runs:

```php
function getValue() {
    static $value = null;

    if ($value === null) {
        echo "Calculating...<br>";
        $value = expensiveCalculation();
    }

    return $value;
}
```

Result:

* “Calculating...” appears only once.
* Values print quickly afterward.

Removing `static` causes recalculation on every call.

---

## 8. Summary of Static Variables

* Preserved across function calls.
* Useful for caching immutable or expensive results.
* Will be revisited in object-oriented contexts (e.g., static properties/methods).

---