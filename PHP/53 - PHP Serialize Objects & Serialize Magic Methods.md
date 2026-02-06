# PHP Serialization and Related Magic Methods —

## 1. Introduction to Serialization in PHP

**Serialization** is the process of converting a PHP value into a string representation.
You can serialize most PHP data types, including objects.
**Exceptions:** resources, closures, and certain built-in PHP objects cannot be serialized.

### 1.1 Basic Serialization Examples

```php
echo serialize(true);
echo serialize(123);
echo serialize(10.5);
echo serialize("Hello");
echo serialize([1, 2, 3]);
echo serialize(["a" => 1, "b" => 2]);
```

Running this will output string versions of each value.

### 1.2 Unserialization

Use `unserialize()` to convert the serialized string back into its original PHP data type.

```php
$serialized = serialize([1, 2, 3]);
var_dump(unserialize($serialized));
```

---

## 2. Serializing Objects

When serializing objects, PHP stores:

* The **class name**
* All **properties and their values**
* **Not** the methods (methods must exist in the class definition at the time of unserialization)

### Example

```php
class Invoice {
    private int $id = 1;
}

$invoice = new Invoice();
echo serialize($invoice);
```

### Visibility Effects on Serialized Output

Property name prefixes differ depending on visibility:

| Visibility | Prefix in serialized output |
| ---------- | --------------------------- |
| private    | `"\0ClassName\0property"`   |
| protected  | `"\0*\0property"`           |
| public     | `"property"`                |

Changing property visibility will change the serialized output accordingly.

---

## 3. Unserialization Creates a New Object

Unserializing an object produces **a new instance in memory**.

```php
$invoice2 = unserialize(serialize($invoice));

var_dump($invoice === $invoice2); // false (identity)
var_dump($invoice == $invoice2);  // true (value comparison)
```

* `===` compares identity (different objects).
* `==` compares property values (same values → true).

This mechanism can be used for **deep cloning**, unlike `clone`, which performs a **shallow copy**.

---

## 4. Unserialize Security Warning

**Never pass untrusted data to `unserialize()`**.
Malicious payloads can trigger execution of unintended logic during reconstruction.

### Unserialization Failure Behavior

If unserialization fails:

* The function returns **false**
* A **notice** is raised

```php
var_dump(unserialize('invalid_string')); // false + notice
```

### Boolean false Ambiguity

If you serialize boolean `false`:

```php
$serialized = serialize(false); // "b:0;"
var_dump(unserialize($serialized)); // false
```

This is **indistinguishable** from failed unserialization unless you check the original serialized string.

**Ways to handle ambiguity:**

* Compare against `serialize(false)`
* Use error handling to detect notice-level unserialization errors

---

## 5. Serialization-Related Magic Methods

There are **four** magic methods related to serialization:

### Legacy Methods (older PHP versions)

* `__sleep()`
* `__wakeup()`

### Modern Methods (PHP 7.4+)

* `__serialize()`
* `__unserialize(array $data)`

`__serialize()` and `__unserialize()` **take precedence** over the older methods when both exist.

---

## 6. Using `__sleep()` and `__wakeup()`

### `__sleep()`

Called **before** serialization.
Must return an array of **property names to serialize**.

Example:

```php
public function __sleep()
{
    return ['id', 'amount'];
}
```

### `__wakeup()`

Called **after** unserialization.
Used to restore resources such as database connections or reinitialize dependencies.

---

## 7. Using `__serialize()` and `__unserialize()`

These methods replace the `Serializable` interface (deprecated in PHP 8.1, removed in PHP 9).

### 7.1 `__serialize()` Example (Custom Serialization Logic)

```php
public function __serialize(): array
{
    return [
        'id' => $this->id,
        'amount' => $this->amount,
        'description' => $this->description,
        'credit_card' => base64_encode($this->creditCard),
        'foo' => 'bar' // additional custom data
    ];
}
```

This method:

* Has full control over data structure
* Allows you to include or exclude properties
* Enables transforming data (e.g., encrypting sensitive fields)

### 7.2 `__unserialize()` Example (Reconstruct Object State)

```php
public function __unserialize(array $data): void
{
    $this->id = $data['id'];
    $this->amount = $data['amount'];
    $this->description = $data['description'];
    $this->creditCard = base64_decode($data['credit_card']);
    // Process additional elements as needed
}
```

### 7.3 Usage

```php
$serialized = serialize($invoice);
$invoice2 = unserialize($serialized);
```

The object is reconstructed with all custom processing applied.

---

## 8. Summary of Serialization Approaches

| Method                              | Use Case         | Notes                                        |
| ----------------------------------- | ---------------- | -------------------------------------------- |
| `serialize()` / `unserialize()`     | Basic conversion | Built-in behavior                            |
| `__sleep()` / `__wakeup()`          | Legacy hooks     | Limited control; return only property names  |
| `__serialize()` / `__unserialize()` | Modern approach  | Full control of structure and reconstruction |
| `clone`                             | Shallow copy     | Does not duplicate nested objects            |
| serialize → unserialize             | Deep copy        | Rare but functional                          |

---

# End of Tutorial