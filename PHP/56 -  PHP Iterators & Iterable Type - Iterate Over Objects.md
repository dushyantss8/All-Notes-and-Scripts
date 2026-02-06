# PHP Iteration Over Objects, Custom Iterators, and Iterable Types

## 1. Iterating Over Arrays and Objects in PHP

### Iterating Over Arrays

PHP allows straightforward iteration over arrays using the `foreach` loop:

```php
$items = ['a' => 1, 'b' => 2];

foreach ($items as $key => $value) {
    echo "$key: $value";
}
```

### Iterating Over Objects

You can also iterate over objects with `foreach`. By default, PHP iterates over **public** properties only.

Given:

```php
class Invoice {
    public function __construct(
        public int $amount,
        public string $id = uniqid()
    ) {}
}
```

Iterating:

```php
$invoice = new Invoice(100);

foreach ($invoice as $key => $value) {
    echo "$key: $value";
}
```

If properties are `protected` or `private`, they will not be iterated by default.

---

## 2. Limitation of Default Object Iteration

When iterating over an object:

* Only visible (public) properties are exposed.
* Iteration does not follow custom logic.
* Not suitable for representing collections.

For example, if an `InvoiceCollection` holds a property `public array $invoices`, a raw `foreach` will iterate only that property, not the individual invoice objects.

---

# 3. Making Objects Iterable with Traversable, Iterator, and IteratorAggregate

PHP provides a foundational interface:

### `Traversable`

* The base internal interface for traversable types.
* Contains no methods.
* Cannot be implemented directly.
* Implemented through `Iterator` or `IteratorAggregate`.

---

# 4. Implementing a Custom Iterator with the `Iterator` Interface

### The `Iterator` Interface Requires Five Methods:

1. `current()`
2. `next()`
3. `key()`
4. `valid()`
5. `rewind()`

### Example: Building `InvoiceCollection` Using `Iterator`

```php
class InvoiceCollection implements Iterator
{
    public function __construct(public array $invoices) {}

    public function current(): mixed {
        return current($this->invoices);
    }

    public function next(): void {
        next($this->invoices);
    }

    public function key(): mixed {
        return key($this->invoices);
    }

    public function valid(): bool {
        return current($this->invoices) !== false;
    }

    public function rewind(): void {
        reset($this->invoices);
    }
}
```

### Usage

```php
$collection = new InvoiceCollection([
    new Invoice(15),
    new Invoice(25),
    new Invoice(50),
]);

foreach ($collection as $invoice) {
    echo $invoice->id . " - " . $invoice->amount;
}
```

### Execution Flow of `foreach` with an Iterator

For each iteration PHP calls:

1. `rewind()`
2. `valid()`
3. `current()`
4. `key()`
5. `next()`

Repeats until `valid()` returns `false`.

---

# 5. Using a Manual Pointer Instead of PHP Array Functions

Instead of `current()`, `next()`, etc., you can maintain your own position index:

```php
private int $key = 0;

public function current(): mixed {
    return $this->invoices[$this->key];
}

public function next(): void {
    $this->key++;
}

public function key(): mixed {
    return $this->key;
}

public function valid(): bool {
    return isset($this->invoices[$this->key]);
}

public function rewind(): void {
    $this->key = 0;
}
```

This provides more control and avoids PHP’s pointer functions.

---

# 6. Using SPL Iterators with `IteratorAggregate`

Often, implementing all five iterator methods is unnecessary. PHP provides many built-in iterators via SPL (Standard PHP Library):

* `ArrayIterator`
* `DirectoryIterator`
* `FilesystemIterator`
* Many others

### `IteratorAggregate` Has One Required Method:

* `getIterator()`

### Example: Using `ArrayIterator`

```php
class InvoiceCollection implements IteratorAggregate
{
    public function __construct(public array $invoices) {}

    public function getIterator(): Traversable {
        return new ArrayIterator($this->invoices);
    }
}
```

### Usage

```php
foreach ($collection as $invoice) {
    echo $invoice->amount;
}
```

Simpler, cleaner, and uses PHP’s optimized iterator internals.

---

# 7. Extracting Common Collection Behavior into a Base Class

If multiple collection classes are needed (e.g., `InvoiceCollection`, `CustomerCollection`), you can centralize iteration logic:

### Base Collection Class

```php
class Collection implements IteratorAggregate
{
    public function __construct(private array $items) {}

    public function getIterator(): Traversable {
        return new ArrayIterator($this->items);
    }
}
```

### Example Extension

```php
class InvoiceCollection extends Collection {}
```

This avoids duplicating iteration logic across multiple collections.

---

# 8. Type Hinting Iterable Data (Arrays, Collections, Iterators)

### The Problem

A function expecting something iterable should not force:

* only arrays
* only custom collections
* only custom iterators

### The Solution: `iterable` Pseudo-Type (introduced in PHP 7.1)

```php
function process(iterable $data): void {
    foreach ($data as $key => $value) {
        echo $key;
    }
}
```

Now supports:

* arrays
* `Iterator` instances
* `IteratorAggregate` instances
* Generators

### Example

```php
process($collection);
process([1, 2, 3]);
```

Passing non-iterables results in a type error.

---

# 9. Advantages of Iterators (Preview for Generators)

Iterators enable:

* Lazy loading
* Reduced memory consumption
* Efficient traversal over large or dynamic data sources

These concepts become more powerful when combined with **generators** (`yield`), which will be discussed later in the course.

---

# Summary of Key Concepts

* Objects can be iterated, but only public properties by default.
* Implement `Iterator` to control iteration manually.
* Implement `IteratorAggregate` to return any traversable iterator, usually an SPL iterator.
* SPL Iterators (e.g., `ArrayIterator`) simplify iteration logic.
* `iterable` type hint allows any iterable structure.
* Base collection classes help eliminate repetitive boilerplate code.
* Iterators support efficient and lazy data processing.

---

# End of Tutorial