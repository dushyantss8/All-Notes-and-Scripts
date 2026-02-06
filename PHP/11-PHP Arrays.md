# PHP Arrays:

## 1. Introduction to Arrays

When you find yourself creating multiple variables with repeated naming patterns (e.g., `programmingLanguage1`, `programmingLanguage2`, …), it indicates a need for a better data structure. **Arrays** provide a structured way to store multiple values under a single variable name.

### Definition

An array in PHP is a list of values of any data type (string, integer, float, boolean, or another array).

### Syntax Options

1. **Modern syntax (recommended):**

```php
$programmingLanguages = ['php', 'java', 'python'];
```

2. **Old syntax:**

```php
$programmingLanguages = array('php', 'java', 'python');
```

---

# 2. Accessing Array Elements

PHP arrays are **zero-indexed** by default.

```php
echo $programmingLanguages[0]; // php
echo $programmingLanguages[1]; // java
echo $programmingLanguages[2]; // python
```

### Unlike strings:

* Strings support negative indexes (e.g., `-1` for last character).
* Arrays do **not**. Accessing `$arr[-1]` produces:

  * A warning: *Undefined array key -1*
  * A returned value: `null`

---

# 3. Key Concepts: Keys, Indexes, and Undefined Access

Each array position has a **key** (default: numeric, starting from 0).

If you access an index that does not exist:

```php
echo $arr[99]; // Warning + null
```

---

# 4. Checking Key Existence

### `isset()`

Checks whether the key exists **and is not null**:

```php
var_dump(isset($arr[0])); // true
var_dump(isset($arr[3])); // false
```

### `array_key_exists()`

Checks whether the key exists **even if its value is null**:

```php
array_key_exists('b', $arr); // true even if $arr['b'] = null
```

---

# 5. Updating Array Elements

You can modify an element by assigning a new value to an index/key:

```php
$programmingLanguages[1] = 'C++';
```

---

# 6. Viewing Array Contents

### `var_dump()`

Shows detailed type and structure.

```php
var_dump($programmingLanguages);
```

### `print_r()`

Shows a cleaner output.

```php
print_r($programmingLanguages);
```

For readability, wrap with HTML `<pre>` tags:

```php
echo '<pre>';
print_r($programmingLanguages);
echo '</pre>';
```

---

# 7. Getting Array Length

Use `count()`:

```php
echo count($programmingLanguages); // number of elements
```

---

# 8. Adding Elements

### Method 1: Append using `[]`

```php
$programmingLanguages[] = 'C++';
```

### Method 2: `array_push()`

```php
array_push($programmingLanguages, 'C++', 'Go');
```

Both methods add items to the **end** of the array.

---

# 9. Associative Arrays

Keys can be **strings or integers**.

### Example

```php
$programmingLanguages = [
    'php' => '8.0',
    'python' => '3.9'
];
```

Accessing values:

```php
echo $programmingLanguages['php']; // 8.0
```

Adding new key-value pairs:

```php
$programmingLanguages['go'] = '1.15';
```

---

# 10. Dynamic Keys from Variables

```php
$newLanguage = 'go';
echo $programmingLanguages[$newLanguage];
```

---

# 11. Multi-Dimensional Arrays

Arrays can contain other arrays, enabling structured data.

### Example

```php
$programmingLanguages = [
  'php' => [
    'creator' => 'Rasmus Lerdorf',
    'versions' => [
      ['version' => '8.0', 'release_date' => '2020-11-26']
    ],
    'website' => 'https://www.php.net',
    'open_source' => true
  ]
];
```

### Accessing nested values:

```php
echo $programmingLanguages['php']['website'];

echo $programmingLanguages['php']['versions'][0]['release_date'];
```

If a key does not exist, PHP will throw warnings and return `null`.

---

# 12. Duplicate Keys and Type Casting of Keys

PHP casts keys to either integer or string depending on context.

### Examples of casting:

```php
$array = [
    true  => 'A', // cast to 1
    1     => 'B', // overrides A
    '1'   => 'C', // overrides B
    1.8   => 'D', // cast to 1, overrides C
];
```

Final array:

```php
[1 => 'D']
```

### `null` as a key becomes an empty string:

```php
$array = [null => 'E'];
// key becomes ""
```

Access:

```php
echo $array[''];   // E
echo $array[null]; // E
```

---

# 13. Mixed Keys and Automatic Key Assignment

PHP assigns numeric keys automatically when not specified.

Example:

```php
$arr = ['a', 'b', 50 => 'c', 'd', 'e'];
```

Results in keys: `0, 1, 50, 51, 52`.

---

# 14. Removing Elements

### `array_pop()`

Removes last element:

```php
array_pop($arr);
```

### `array_shift()`

Removes first element and reindexes numeric keys:

```php
array_shift($arr);
```

Note:

* Only **numeric** keys are reindexed.
* String keys remain unchanged.

### `unset()`

Used for removing specific elements or the entire array.

Remove element by key:

```php
unset($arr[50]);
```

Remove multiple elements:

```php
unset($arr[1], $arr[50]);
```

Destroy the whole variable:

```php
unset($arr);
```

Important: **`unset()` does not reindex arrays**.

---

# 15. How PHP Determines the Next Auto-Index

PHP keeps track of the **highest numeric key**, even for removed elements.

Example:

```php
$arr = [1, 2, 3];
unset($arr[0], $arr[1], $arr[2]);

$arr[] = 10; // assigned to index 3, not 0
```

---

# 16. Casting Values to Arrays

You can convert any value to an array:

```php
$arr = (array)5;       // [5]
$arr = (array)'text';  // ['text']
$arr = (array)null;    // []
```

---

# 17. Checking Keys: `isset()` vs `array_key_exists()`

Given:

```php
$arr = [
  'a' => 1,
  'b' => null
];
```

### `array_key_exists('b', $arr)`

Returns **true**.

### `isset($arr['b'])`

Returns **false** because the value is `null`.

**Summary:**

* Use `array_key_exists()` to check if a key exists.
* Use `isset()` to check if a key exists **and** its value is not `null`.

---

# End of Tutorial