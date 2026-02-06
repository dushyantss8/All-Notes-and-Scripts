# PHP Object Comparison: A Detailed Tutorial -

## 1. Introduction to Object Comparison

PHP provides two primary operators for comparing objects:

1. **Equality operator (`==`)**
   Determines whether:

   * Both operands are instances of the **same class**, and
   * They have **identical properties with equal values** (using *loose comparison*).

2. **Identity operator (`===`)**
   Determines whether:

   * Both operands refer to the **exact same object instance** in memory.

---

## 2. Basic Example Setup

### Class Definition

```php
class Invoice {
    public function __construct(
        public float $amount,
        public string $description
    ) {}
}
```

### Object Instances

```php
$invoice1 = new Invoice(25, "Invoice 1");
$invoice2 = new Invoice(100, "Invoice 2");
```

### Comparisons

```php
var_dump($invoice1 == $invoice2);  // loose comparison
var_dump($invoice1 === $invoice2); // identity comparison
```

Both comparisons return **false** because:

* Property values differ.
* They are different objects in memory.

---

## 3. Loose Comparison Behavior (`==`)

The equality operator uses PHP’s **loose type juggling** during property comparison.

Example:

```php
$invoice1 = new Invoice(1, "Test");
$invoice2 = new Invoice(true, "Test");
```

Since `1 == true` evaluates to `true`, `==` would consider `amount` equal.

If all properties match in value (after loose comparison), `==` returns **true** even though objects are separate.

However, `===` still returns **false**, because they are distinct instances.

---

## 4. Identity Comparison (`===`) Demonstrated

### Assigning Same Object to Another Variable

```php
$invoice3 = $invoice1;
```

Now:

```php
var_dump($invoice1 == $invoice3);   // true
var_dump($invoice1 === $invoice3);  // true
```

Because:

* Both variables point to the **same zval container** and the **same object identifier**.

### Mutating One Affects the Other

```php
$invoice3->amount = 250;
echo $invoice1->amount; // 250
```

Both variables reference the same object in memory.

---

## 5. How PHP Stores Variables and Objects (Simplified Overview)

### 5.1 Symbol Table

Each variable name exists in a **symbol table** as a symbol.

### 5.2 zval Container

Each symbol points to a **zval** container (Zend value), which stores:

* Type information
* Value

### 5.3 Object Storage

For objects:

* The zval stores an **object identifier**, not the full object.
* The identifier points to the **actual object** in a separate object store.

When assigning:

```php
$invoice3 = $invoice1;
```

PHP copies the zval **pointer**, not the object itself.
Both variables reference the same object identifier.

---

## 6. Comparing Objects of Different Classes

### Example

```php
class CustomInvoice extends Invoice {}

$invoice1 = new Invoice(25, "A");
$invoice2 = new CustomInvoice(25, "A");
```

Comparison:

```php
var_dump($invoice1 == $invoice2);  // false
var_dump($invoice1 === $invoice2); // false
```

**Reason**:

* Even with identical properties, equality (`==`) requires the **same class**.
* Identity (`===`) requires the **same instance**.

---

## 7. Recursive Comparison of Nested Objects

If an object contains another object as a property:

### Example

```php
class Customer {
    public function __construct(public string $name) {}
}

class Invoice {
    public function __construct(
        public float $amount,
        public Customer $customer
    ) {}
}
```

Comparing:

```php
$invoice1 = new Invoice(25, new Customer("John"));
$invoice2 = new Invoice(25, new Customer("John"));
```

Result:

```php
var_dump($invoice1 == $invoice2);  // true (recursive comparison)
var_dump($invoice1 === $invoice2); // false
```

If nested values differ:

```php
$invoice2 = new Invoice(25, new Customer("Mike"));
```

Loose comparison fails because inner property mismatch → returns **false**.

---

## 8. Circular References and Fatal Errors

Recursive comparison can cause infinite loops.

### Example: Circular Relation

```php
$invoice1->linkedInvoice = $invoice2;
$invoice2->linkedInvoice = $invoice1;
```

Comparing:

```php
$invoice1 == $invoice2;
```

This triggers a **fatal error** because PHP enters an infinite recursive comparison cycle.

---

## 9. Less-Than and Greater-Than Operators with Objects

PHP also allows:

```php
$invoice1 < $invoice2;
$invoice1 > $invoice2;
```

The comparison:

* Evaluates object properties in order.
* Stops and returns **false** at the first mismatched property.

---

# Summary of Key Rules

| Operator | Meaning               | Conditions for True                                    |
| -------- | --------------------- | ------------------------------------------------------ |
| `==`     | Loose Equality        | Same class + all properties equal (loose comparison).  |
| `===`    | Identity              | Both variables reference the **same object instance**. |
| `<`, `>` | Relational Comparison | Property-by-property comparison until mismatch.        |

---

# End of Tutorial