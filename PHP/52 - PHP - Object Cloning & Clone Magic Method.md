# PHP Object Creation and Cloning

## 1. Creating Objects in PHP

PHP provides several mechanisms for instantiating objects from classes.

### 1.1 Instantiating with the `new` Keyword

The standard way to create a new object is:

```php
$invoice = new Invoice();
```

### 1.2 Using `self` or `static` for Instantiation

If a class contains methods that instantiate new objects internally, they can return new instances using:

```php
return new self();    // Always returns Invoice
return new static();  // Late static binding for inheritance scenarios
```

### 1.3 Creating Objects from Existing Objects

PHP allows instantiation by passing an existing object reference after `new`:

```php
$invoice2 = new $invoice; // Creates a new instance of the same class as $invoice
```

This is effectively equivalent to:

```php
$invoice2 = new Invoice();
```

---

## 2. Understanding Object Identity and Assignment

### 2.1 Assignment Does Not Clone

Assigning one object variable to another does **not** create a copy:

```php
$invoice2 = $invoice;
```

Both `$invoice` and `$invoice2` become references (symbols pointing) to the **same object** in memory.

### 2.2 Demonstrating Shared Identity

You can verify this using the identity operator (`===`):

```php
var_dump($invoice === $invoice2); // true
```

If you modify a property on one variable, the change appears on the other because they reference the same object.

---

## 3. Cloning Objects with the `clone` Keyword

To create an actual duplicate (a new object in memory), PHP provides the `clone` keyword:

```php
$invoice2 = clone $invoice;
```

### 3.1 How Cloning Works

Cloning performs a **shallow copy** of all properties:

* All property values are copied.
* A new object is created in memory.
* The identity operator returns false:

```php
var_dump($invoice === $invoice2); // false
```

### 3.2 Why Property Values Match

Because cloning performs a shallow copy, both instances initially have identical property values. For example, if an `id` was assigned in the constructor, both objects will have the same `id` unless modified afterward.

---

## 4. The `__clone()` Magic Method

### 4.1 Purpose of `__clone()`

PHP offers a special magic method:

```php
public function __clone()
{
    // Custom actions when object is cloned
}
```

This method is automatically invoked **after** the object has been cloned.

### 4.2 Common Use Cases

You can use `__clone()` to:

* Reset or regenerate properties (e.g., IDs)
* Remove sensitive or non-clonable data
* Initialize deep-copied subobjects
* Perform cleanup for clone-specific logic

### 4.3 Example: Regenerating an ID

```php
class Invoice
{
    public function __construct()
    {
        $this->id = uniqid("invoice_");
    }

    public function __clone()
    {
        $this->id = uniqid("invoice_"); // Assign new ID for clone
    }
}
```

Now:

```php
$invoice2 = clone $invoice;
```

Produces:

* A distinct object.
* A different `id` value (because `__clone()` overrides it).

### 4.4 Constructor vs. `__clone()`

Important distinction:

* The **constructor is not executed** when an object is cloned.
* Instead, `__clone()` runs.

This can be verified by adding diagnostic output:

```php
public function __construct()
{
    var_dump("construct called");
}

public function __clone()
{
    var_dump("clone called");
}
```

Execution will show:

* Constructor called only once (during `new`)
* Clone called once (during `clone`)

---

## 5. Key Takeaways

1. **Assignment (`=`) does not clone**; it creates a reference to the same object.
2. Use **`clone`** to create a new object with values copied from the original.
3. Cloning is **shallow**, not deep, unless explicitly handled.
4. The **`__clone()` magic method** allows custom logic during cloning.
5. **Constructors do not run** during cloning; `__clone()` does.

---

# End of Tutorial