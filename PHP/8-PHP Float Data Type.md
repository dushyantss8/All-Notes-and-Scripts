# PHP Floating Point Numbers —

## 1. Introduction to Floating Point Numbers

Floating point numbers (floats) represent numbers with decimal points in PHP.

**Example:**

```php
$x = 13.5;
echo $x;   // 13.5
```

Floats also support exponential notation:

```php
$x = 13.5e3;  // 13500
$x = 13.5e-3; // 0.0135
```

To inspect the type:

```php
var_dump($x); // float(...)
```

Even without visible decimals, exponential float expressions are still floats.

---

## 2. Numeric Readability Using Underscores

Since PHP 7.4, underscores can be used inside numbers for readability.

**Example:**

```php
$x = 13_000.50;
var_dump($x); // float
```

PHP ignores the underscores during computation.

---

## 3. Floating-Point Size Limits

Float sizes depend on the platform. PHP provides constants to inspect these bounds:

```php
echo PHP_FLOAT_MAX;
echo PHP_FLOAT_MIN;
```

These give the maximum and minimum representable floating values.

---

## 4. Precision Limitations of Floats

Floating point numbers are stored in binary (base 2). Certain decimal values cannot be represented precisely. This leads to unexpected results in arithmetic operations.

### Example: Precision Issue with `floor()`

```php
echo floor((0.1 + 0.7) * 10); // Expected: 8, Actual: 7
```

Internally:

```
0.1 + 0.7 ≈ 0.799999999999...
```

After multiplying by 10:

```
≈ 7.99999999999
```

`floor()` returns **7**.

### Using `ceil()`:

```php
echo ceil((0.1 + 0.2) * 10); // Expected: 3, Actual: 4
```

Reason:

```
0.1 + 0.2 ≈ 0.3000000000004
```

Multiply by 10:

```
≈ 3.000000000004
```

`ceil()` rounds up to **4**.

**Key rule:** Never trust floats to the last digit.

---

## 5. Avoid Direct Equality Comparisons

Never compare floating point numbers directly using `==`.

### Example:

```php
$x = 0.23;
$y = 1 - 0.77;

var_dump($x, $y); // Both appear as 0.23

if ($x == $y) {
    echo "Yes";
} else {
    echo "No"; // Actual output
}
```

Although both values print as `0.23`, tiny internal differences cause comparison failure.

---

## 6. Special Float Values: NaN and Infinity

### NaN (Not a Number)

NaN occurs when an operation produces an undefined value.

```php
echo NAN;                 // NAN
$x = log(-1);             // NAN
var_dump(is_nan($x));     // true
```

### Infinity

Occurs when a float exceeds representable limits.

```php
$x = PHP_FLOAT_MAX * 2;   // INF
var_dump(is_infinite($x)); // true
var_dump(is_finite($x));   // false
```

### Important:

Do **not** compare directly with `NAN` or `INF`.
Use:

* `is_nan($value)`
* `is_infinite($value)`
* `is_finite($value)`

---

## 7. Type Casting to Float

To convert values to floats, use:

```php
(float) $x
```

or the function:

```php
floatval($x)
```

Both produce the same result, but casting is simpler and avoids unnecessary function calls.

### Examples:

```php
$x = 5;
var_dump((float)$x); // float(5)

$x = "15.5";
var_dump((float)$x); // float(15.5)

$x = "abc";
var_dump((float)$x); // float(0)
```

Rules:

* Numeric strings convert correctly to float.
* Non-numeric strings convert to `0.0`.

---

## 8. Summary of Key Principles

* Floats represent decimal values and support exponential notation.
* Readability improvements: underscores inside numbers.
* Floats have limited precision; small rounding errors are expected.
* Avoid direct equality comparisons.
* Use `is_nan()`, `is_infinite()`, and `is_finite()` for checking special float states.
* Casting vs. `floatval()`: both valid; casting is generally preferred.
* Non-numeric string → float(0.0).

---