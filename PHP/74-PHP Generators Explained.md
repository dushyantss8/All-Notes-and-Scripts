# PHP Generators: Memory-Efficient Iteration

## 1. Problem Statement: Iterating Large Data Sets

In PHP, many operations require iterating over large datasets:

* Large numeric ranges
* Database records (thousands of rows)
* Files or streams
* Hydrated objects or entities

Using arrays for such tasks can **exhaust memory**, because arrays are fully built in memory before iteration begins.

---

## 2. Why Arrays Cause Memory Issues

### Example: `range()` Builds the Entire Array in Memory

```php
$numbers = range(1, 3_000_000);
print_r($numbers);
```

**What happens:**

* `range()` allocates memory for *all* elements at once
* Large ranges → `Fatal error: Allowed memory size exhausted`

Even smaller datasets can fail in real applications when:

* Records contain multiple columns
* Objects are fully hydrated
* ORM entities are used

---

## 3. Traditional Workarounds (Not Always Enough)

Common approaches include:

* Pagination (`LIMIT`, `OFFSET`)
* Filtering (`WHERE` clauses)
* Selecting fewer columns
* Chunking queries

These are good practices—but **sometimes you must iterate everything** (e.g., exports, migrations, batch jobs).

This is where **generators** are useful.

---

## 4. What Is a Generator?

> A generator allows you to iterate over data **without building the entire dataset in memory**.

Key characteristics:

* Uses the `yield` keyword instead of `return`
* Produces values **one at a time**
* Execution pauses and resumes between yields
* Returns a `Generator` object (not an array)

---

## 5. Creating a Simple Generator

### ❌ Naive (Memory-Heavy) Approach

```php
function lazyRange(int $start, int $end): array
{
    $numbers = [];

    for ($i = $start; $i <= $end; $i++) {
        $numbers[] = $i;
    }

    return $numbers;
}
```

This defeats the purpose—it still builds an array.

---

### ✅ Correct Generator Implementation

```php
function lazyRange(int $start, int $end): Generator
{
    for ($i = $start; $i <= $end; $i++) {
        yield $i;
    }
}
```

**Why this works:**

* No array is created
* Only one value exists in memory at a time

---

## 6. Understanding `yield` vs `return`

| `return`        | `yield`                   |
| --------------- | ------------------------- |
| Stops execution | Pauses execution          |
| Returns once    | Can return multiple times |
| Ends function   | Resumes later             |

---

## 7. Generator Execution Is Lazy

### Important Behavior

```php
$generator = lazyRange(1, 10);
```

👉 **No code runs yet**

Execution starts only when:

* `current()`
* `next()`
* `foreach`

is called.

---

## 8. Using Generator Methods Manually

```php
$numbers = lazyRange(1, 10);

echo $numbers->current(); // 1
$numbers->next();

echo $numbers->current(); // 2
$numbers->next();

echo $numbers->current(); // 3
```

Each `next()` resumes execution until the next `yield`.

---

## 9. Visualizing Execution Flow

```php
function demo(): Generator
{
    echo "Hello\n";
    yield 1;

    echo "World\n";
    yield 2;

    return "Done";
}
```

### Output Order

1. `Hello`
2. `1`
3. `World`
4. `2`
5. `Done`

---

## 10. Accessing a Generator’s Return Value

Generators may have a `return` value.

```php
$gen = demo();

foreach ($gen as $value) {
    echo $value;
}

echo $gen->getReturn(); // "Done"
```

### ⚠️ Rule

Calling `getReturn()` **before the generator finishes** causes a fatal error.

---

## 11. Yielding Key–Value Pairs

```php
function keyedRange(int $start, int $end): Generator
{
    for ($i = $start; $i <= $end; $i++) {
        yield $i * 5 => $i;
    }
}
```

```php
foreach (keyedRange(1, 5) as $key => $value) {
    echo "$key: $value\n";
}
```

Generators can behave like associative arrays.

---

## 12. Real-World Example: Database Records

### ❌ Problem: `fetchAll()` Loads Everything

```php
public function all(): array
{
    return $this->db->query("SELECT * FROM tickets")->fetchAll();
}
```

Even 20,000 records can exhaust memory.

---

## 13. Using PDO Statements Lazily

PDO statements are iterable.

### ✅ Generator-Based Model Method

```php
public function all(): Generator
{
    $stmt = $this->db->query(
        "SELECT id, content FROM tickets"
    );

    foreach ($stmt as $ticket) {
        yield $ticket;
    }
}
```

---

## 14. Consuming the Generator in a Controller

```php
foreach ($this->ticketModel->all() as $ticket) {
    echo $ticket['id'] . ': ';
    echo substr($ticket['content'], 0, 15);
    echo "<br>";
}
```

✔ No memory issues
✔ Records fetched one at a time

---

## 15. Making It Reusable (Base Model)

### Base Model Helper

```php
protected function fetchLazy(PDOStatement $stmt): Generator
{
    foreach ($stmt as $record) {
        yield $record;
    }
}
```

### Ticket Model

```php
public function all(): Generator
{
    $stmt = $this->db->query(
        "SELECT id, content FROM tickets"
    );

    return $this->fetchLazy($stmt);
}
```

---

## 16. Generator Limitations (Important!)

### ❌ Cannot Iterate Twice

```php
$tickets = $this->ticketModel->all();

foreach ($tickets as $t) {}
foreach ($tickets as $t) {} // Fatal error
```

**Reason:** Generators are single-use.

---

### ❌ Cannot Rewind After Start

```php
$gen = lazyRange(1, 10);
$gen->current();
$gen->rewind(); // Fatal error
```

Once started, a generator **cannot be rewound**.

---

## 17. When to Use Generators

### Ideal Use Cases

* Large database exports
* Batch processing
* File parsing
* Streams
* Cursor-based queries
* Lazy hydration of models

Laravel examples:

* `cursor()`
* Lazy Collections

---

## 18. When NOT to Use Generators

* When data must be reused
* When random access is needed
* When small datasets fit comfortably in memory

---

## 19. Key Takeaways

* Generators solve **memory exhaustion**, not query inefficiency
* They execute lazily using `yield`
* They are **single-pass, non-rewindable**
* Best suited for large, sequential data processing

---