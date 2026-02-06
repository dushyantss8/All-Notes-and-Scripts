# PHP Array Functions –

PHP provides a large set of built-in functions for working with arrays. This lesson walks through several important ones, illustrating how they operate, when to use them, and any constraints or behaviors to consider.

---

## 1. Splitting Arrays with `array_chunk`

### Purpose

Break an array into multiple smaller arrays (chunks) of equal size.

### Syntax

```php
array_chunk(array $array, int $length, bool $preserve_keys = false): array
```

### Example

```php
$items = ['a', 'b', 'c', 'd', 'e'];
print_r(array_chunk($items, 2));
```

Output (keys not preserved):

```
[
  [0 => 'a', 1 => 'b'],
  [0 => 'c', 1 => 'd'],
  [0 => 'e']
]
```

#### Preserve Keys

```php
array_chunk($items, 2, true);
```

Output:
Keys such as `a`, `b`, etc., remain intact.

---

## 2. Combining Keys and Values with `array_combine`

### Purpose

Create a new array by using the first array as keys and the second as values.

### Syntax

```php
array_combine(array $keys, array $values): array
```

### Notes

* The number of keys **must match** the number of values.
* PHP 8 throws an **Error** (previously a warning).

### Example

```php
$keys = ['a', 'b', 'c'];
$values = [5, 10, 15];
print_r(array_combine($keys, $values));
```

---

## 3. Filtering Arrays with `array_filter`

### Purpose

Iterate over array values and return only those that satisfy a callback.

### Syntax

```php
array_filter(array $array, ?callable $callback = null, int $mode = 0): array
```

### Example: Keep Even Numbers

```php
$numbers = [1,2,3,4,5,6];
$even = array_filter($numbers, fn($n) => $n % 2 === 0);
```

### Mode Options

* `ARRAY_FILTER_USE_KEY` – callback receives key
* `ARRAY_FILTER_USE_BOTH` – callback receives value and key

### Reindex the Result

Filtered arrays may have **gaps**. Use:

```php
array_values($even);
```

### Without Callback

`array_filter()` removes all "falsy" values:
`0`, `false`, `''`, `[]`, `null`, `0.0`

---

## 4. Getting Keys with `array_keys`

### Purpose

Retrieve keys of an array, optionally filtered by value.

### Syntax

```php
array_keys(array $array, mixed $filter_value = null, bool $strict = false): array
```

### Example

```php
$array = ['a' => 10, 'b' => 20, 'c' => 10];
array_keys($array, 10); // returns ['a', 'c']
```

Use strict comparison:

```php
array_keys($array, "10", true);
```

---

## 5. Transforming Arrays with `array_map`

### Purpose

Apply a callback to each element and return a new array.

### Syntax

```php
array_map(?callable $callback, array ...$arrays): array
```

### Example: Multiply by 3

```php
$numbers = [1,2,3];
array_map(fn($n) => $n * 3, $numbers);
```

### Multiple Arrays

```php
$a = [1 => 1, 2 => 2, 3 => 3];
$b = [1 => 4, 2 => 5, 3 => 6];

array_map(fn($x, $y) => $x * $y, $a, $b);
```

### Important Behavior

* Keys are preserved only if **one array** is passed.
* With multiple arrays, the result is **reindexed numerically**.
* Arrays of different lengths cause missing values to be treated as `null`.

### Using `null` as callback

```php
array_map(null, $a, $b);
```

Produces a merged array of combined values.

---

## 6. Merging Arrays with `array_merge`

### Purpose

Merge multiple arrays together.

### Behavior Rules

* **Numeric keys**: values are appended and reindexed.
* **String keys**: later values **overwrite** earlier ones.

### Example

```php
array_merge(['a' => 5], ['a' => 10]); // 'a' becomes 10
array_merge([0 => 'x'], [0 => 'y']); // ['x', 'y']
```

---

## 7. Reducing Arrays with `array_reduce`

### Purpose

Iteratively reduce an array to a single value.

### Syntax

```php
array_reduce(array $array, callable $callback, mixed $initial = null): mixed
```

### Example: Invoice Total

```php
$items = [
  ['price' => 10, 'quantity' => 2],
  ['price' => 20, 'quantity' => 3]
];

$total = array_reduce(
  $items,
  fn($sum, $item) => $sum + $item['price'] * $item['quantity'],
  0
);
```

---

## 8. Searching Arrays: `array_search` and `in_array`

### `array_search`

Returns the key of the first matching value.

```php
$key = array_search('b', $array, true);
```

### Key Considerations

* Use strict comparison (`true`) to avoid false positives.
* Returns `false` if not found, but `0` can be a **valid key**, so always use `===`.

### `in_array`

Returns boolean `true` or `false`.

```php
if (in_array('a', $array)) { ... }
```

---

## 9. Finding Differences: `array_diff`, `array_diff_assoc`, `array_diff_key`

### `array_diff`

Compare array values.

### `array_diff_assoc`

Compare both **keys and values**.

### `array_diff_key`

Compare only **keys**.

### Example

```php
array_diff([1,2,3], [2,3]); // [1]
array_diff_assoc(['a'=>1], ['a'=>2]); // ['a'=>1]
array_diff_key(['a'=>1, 'b'=>2], ['b'=>3]); // ['a'=>1]
```

---

## 10. Sorting Arrays

### 10.1 `asort` – Sort by value (preserves keys)

```php
asort($array);
```

### 10.2 `ksort` – Sort by key

```php
ksort($array);
```

### Note

These functions modify the original array and return boolean.

---

### 10.3 `usort` – Custom sorting with callback

Callback rules:

* Return `0` if values are equal
* Return `< 0` if first is smaller
* Return `> 0` if first is larger

Example using the spaceship operator:

```php
usort($array, fn($a, $b) => $a <=> $b);
```

Reverse order:

```php
usort($array, fn($a, $b) => $b <=> $a);
```

Note: Keys are removed and replaced with numeric values.

---

## 11. Array Destructuring (`list()` / `[]`)

### Purpose

Assign multiple array elements to variables in one statement.

### Basic Example

```php
[$a, $b, $c] = [1, 2, 3];
```

### Skipping Items

```php
[$a, , $c] = [1, 2, 3];
```

### Nested Arrays

```php
[$a, $b, [$c, $d]] = [1, 2, [3,4]];
```

### Associative Keys

```php
['a' => $x, 'b' => $y] = ['b' => 20, 'a' => 10];
```

---

# End of Tutorial