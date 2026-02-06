# PHP Loops: -

PHP provides several looping constructs that allow repeated execution of statements. These include:

1. **while**
2. **do…while**
3. **for**
4. **foreach**

Each serves different use cases, and PHP also offers alternative syntaxes for HTML-embedded code.

---

## 1. The `while` Loop

### Purpose

Repeatedly executes a block of code **as long as the loop condition evaluates to true**.

### Syntax

```php
while (condition) {
    // statements
}
```

### Example

```php
$i = 0;
while ($i <= 15) {
    echo $i;
    $i++;
}
```

### Execution Rules

* The condition is evaluated **at the beginning** of each iteration.
* If the condition is false at the start, the loop does not run.

### Infinite Loops

Failing to update loop variables can produce infinite loops:

```php
$i = 0;
while ($i <= 15) {
    echo $i;
    // Missing $i++ produces an infinite loop
}
```

### Breaking Out of a Loop

The `break` statement terminates the loop.

```php
while (true) {
    if ($i >= 15) break;
    echo $i;
    $i++;
}
```

#### `break` with an argument

`break n` exits out of `n` nested loops.

### Skipping Iterations with `continue`

The `continue` statement skips the current iteration and moves to the next.

```php
$i = 0;
while ($i <= 15) {
    if ($i % 2 === 0) {
        $i++;    // ensure increment to avoid infinite loop
        continue;
    }
    echo $i;
    $i++;
}
```

### Alternative Syntax

Useful inside HTML:

```php
while ($i <= 15):
    echo $i;
    $i++;
endwhile;
```

---

## 2. The `do…while` Loop

### Purpose

Guarantees that the loop body executes **at least once**.

### Syntax

```php
do {
    // statements
} while (condition);
```

### Example

```php
$i = 0;
do {
    echo $i;
    $i++;
} while ($i <= 15);
```

Even if the condition is initially false, the loop runs once.

---

## 3. The `for` Loop

### Purpose

Most commonly used when the number of iterations is known.

### Syntax

```php
for (expression1; expression2; expression3) {
    // statements
}
```

### Expressions

1. **Initialization** – runs only once at the start.
2. **Condition** – checked at the beginning of each iteration.
3. **Increment/Update** – runs at the end of each iteration.

### Example

```php
for ($i = 0; $i < 15; $i++) {
    echo $i;
}
```

### Using Empty Expressions

All expressions are optional:

```php
for (;;) {
    // infinite loop
}
```

### Multiple Expressions

Comma-separated expressions are allowed:

```php
for ($i = 0, $j = 10; $i < 10; $i++, $j--) {
    echo $i . ' ' . $j;
}
```

### Function Calls in Conditions (Performance Consideration)

Avoid repeated expensive calls in the loop condition:

Non-optimal:

```php
for ($i = 0; $i < count($arr); $i++) {
    echo $arr[$i];
}
```

Optimal:

```php
$len = count($arr);
for ($i = 0; $i < $len; $i++) {
    echo $arr[$i];
}
```

### Iterating Over Strings

```php
$text = "hello world";
for ($i = 0; $i < strlen($text); $i++) {
    echo $text[$i] . "\n";
}
```

### Iterating Over Arrays

```php
$arr = ['a', 'b', 'c'];
$len = count($arr);
for ($i = 0; $i < $len; $i++) {
    echo $arr[$i];
}
```

### Alternative Syntax

```php
for ($i = 0; $i < 10; $i++):
    echo $i;
endfor;
```

---

## 4. The `foreach` Loop

### Purpose

Iterates over **arrays or objects** (not scalar values).

### Basic Syntax

```php
foreach ($array as $value) {
    // ...
}
```

### Accessing Keys and Values

```php
foreach ($array as $key => $value) {
    echo $key . ' = ' . $value;
}
```

### Example

```php
$languages = ['PHP', 'JavaScript', 'Python'];
foreach ($languages as $lang) {
    echo $lang . "\n";
}
```

### Using References

Assigning values by reference modifies the original array.

```php
foreach ($languages as &$lang) {
    $lang = 'PHP';
}
```

After execution, all elements become "PHP".

### Important Note on References

Referenced loop variables persist after the loop:

```php
foreach ($languages as &$lang) {}
echo $lang;  // still references last element
```

To prevent unintended side effects:

```php
unset($lang);
```

### Iterating Associative Arrays

Example:

```php
$user = [
    'name' => 'John',
    'email' => 'john@example.com',
    'skills' => ['PHP', 'JS', 'Python']
];

foreach ($user as $key => $value) {
    if (is_array($value)) {
        foreach ($value as $skill) {
            echo $skill . ' ';
        }
    } else {
        echo $value;
    }
}
```

Other handling approaches:

* Use `json_encode()` for arrays
* Use `implode()` (only when value is an array)

### Alternative Syntax

```php
foreach ($array as $item):
    echo $item;
endforeach;
```

---