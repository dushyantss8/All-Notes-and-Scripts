# WeakMap in PHP: Object References, Garbage Collection, and Memory-Safe Object Maps

## 1. How PHP Stores Objects in Memory (Refresher)

When you assign an object to a variable in PHP, the variable **does not store the object itself**. Instead:

* Each variable name is stored in the **symbol table**
* The variable points to a **zval container**
* For objects, the zval container holds an **object identifier**
* That identifier points to the actual object stored elsewhere in memory

### Example: Multiple Variables Referencing the Same Object

```php
<?php

class Invoice
{
    public function __destruct()
    {
        echo "Invoice object destroyed\n";
    }
}

$invoice1 = new Invoice();
$invoice2 = $invoice1;
```

**What happens internally:**

* `$invoice1` and `$invoice2` are different variables
* Both reference the **same object in memory**
* The object is destroyed **only when all references are removed**

---

## 2. Unsetting Variables and Garbage Collection

### Case 1: Multiple References Exist

```php
<?php

$invoice1 = new Invoice();
$invoice2 = $invoice1;

unset($invoice1);

var_dump($invoice2);
```

**Result:**

* The object is **not destroyed**
* `$invoice2` still references the object
* Destructor runs only at script termination

### Case 2: No Remaining References

```php
<?php

$invoice1 = new Invoice();

echo "Before unset\n";
unset($invoice1);
echo "After unset\n";
```

**Output order:**

```
Before unset
Invoice object destroyed
After unset
```

**Explanation:**

* No references remain
* PHP garbage-collects the object immediately

---

## 3. The Problem with Object Maps and Memory Leaks

Sometimes you want to associate extra data with an object (e.g., caching or metadata). PHP provides:

* `SplObjectStorage` — **hard references**
* `WeakMap` — **weak references**

### Why Hard References Are Dangerous

`SplObjectStorage` keeps a **strong reference** to the object:

* Even if the object is unset
* It cannot be garbage-collected
* This can lead to **memory leaks**, especially in long-running scripts

---

## 4. Weak References in PHP (PHP 7.4+)

PHP 7.4 introduced:

* `WeakReference`
* `WeakMap`

These allow objects to be referenced **without preventing garbage collection**.

---

## 5. What Is a WeakMap?

A **WeakMap** is a key–value map where:

* **Keys must be objects**
* Keys do **not increase reference count**
* When an object is garbage-collected:

  * Its entry is automatically removed from the map

### Official Definition (Simplified)

> If the only remaining reference to an object is as a key in a WeakMap, the object will be garbage collected and removed from the map.

---

## 6. Creating and Using a WeakMap

### Basic Example

```php
<?php

$invoice = new Invoice();

$map = new WeakMap();
$map[$invoice] = [
    'a' => 1,
    'b' => 2,
];

var_dump($map);
echo count($map) . PHP_EOL;
```

**Behavior:**

* `$invoice` is used as the key
* Any value can be associated
* Works like an array, but with object keys

### Accessing Values

```php
var_dump($map[$invoice]);
```

---

## 7. Garbage Collection with WeakMap

### Demonstrating Automatic Cleanup

```php
<?php

$invoice = new Invoice();

$map = new WeakMap();
$map[$invoice] = ['a' => 1, 'b' => 2];

var_dump(count($map)); // 1

unset($invoice); // object has no strong references

var_dump(count($map)); // 0
var_dump($map);
```

**What happens:**

1. `$invoice` is unset
2. No strong references remain
3. Object is garbage-collected
4. WeakMap entry is removed automatically

This **does not happen** with `SplObjectStorage`.

---

## 8. WeakMap vs SplObjectStorage

| Feature              | WeakMap | SplObjectStorage |
| -------------------- | ------- | ---------------- |
| Object as key        | Yes     | Yes              |
| Prevents GC          | ❌ No    | ✅ Yes            |
| Risk of memory leaks | ❌ Low   | ✅ High           |
| Auto cleanup         | ✅ Yes   | ❌ No             |

---

## 9. Common Use Cases for WeakMap

You may not use `WeakMap` directly, but frameworks and libraries often do.

Typical use cases include:

* Object-based caching
* Memoization
* Associating metadata with objects
* Avoiding memory leaks in long-running processes
* Attaching data without modifying the object itself

---

## 10. WeakMap Rules and Constraints

### 1. Only Objects Can Be Keys

```php
$map['hello'] = 'world'; // ❌ Exception
```

### 2. You Cannot Append Without a Key

```php
$map[] = 'value'; // ❌ Exception
```

### 3. Accessing a Missing Key Throws an Exception

```php
$invoice2 = new Invoice();

echo $map[$invoice2]; // ❌ Exception
```

---

## 11. Summary

* PHP objects are reference-counted
* WeakMap allows associating data with objects **without preventing GC**
* Entries are removed automatically when objects are destroyed
* WeakMap is ideal for memory-safe caches and metadata storage
* Prefer WeakMap over `SplObjectStorage` when object lifetime matters

---