# PHP Magic Methods: -

PHP magic methods are special methods that begin with double underscores (`__`) and allow developers to override or hook into PHP’s internal behaviors when certain actions occur on objects. There are currently around 17 magic methods, and they are reserved by PHP. Developers should not create custom methods prefixed with `__` unless they intend to implement a PHP magic method.

This summary covers the major magic methods demonstrated in the transcript, including `__get`, `__set`, `__isset`, `__unset`, `__call`, `__callStatic`, `__toString`, `__invoke`, and `__debugInfo`.

---

# 1. Property Access Magic Methods

## 1.1 `__get($name)`

Triggered when attempting to access an undefined or inaccessible (private/protected) property.

### Behavior

If code attempts `$invoice->amount` where `amount` does not exist or is not public, PHP normally issues a warning. By defining `__get`, you can intercept this access.

### Basic Example

```php
public function __get($name)
{
    var_dump($name);
}
```

Output shows the property name instead of raising a warning.

---

## 1.2 `__set($name, $value)`

Triggered when assigning a value to an undefined or inaccessible property.

### Example

```php
public function __set($name, $value)
{
    var_dump($name, $value);
}
```

---

## 1.3 Read-only access pattern

A typical use case is providing controlled read-only access to private properties:

```php
public function __get($name)
{
    if (property_exists($this, $name)) {
        return $this->$name;
    }
    return null;
}
```

If you omit `__set`, the property becomes read-only from outside the class.

---

## 1.4 Backing-Store Pattern Using an Array

Instead of declaring multiple properties, you can store dynamic values in an internal array:

```php
protected array $data = [];

public function __get($name)
{
    return array_key_exists($name, $this->data)
        ? $this->data[$name]
        : null;
}

public function __set($name, $value)
{
    $this->data[$name] = $value;
}
```

---

# 2. Existence & Removal Magic Methods

## 2.1 `__isset($name)`

Invoked when `isset()` or `empty()` is used on an undefined or inaccessible property.

### Requirements

Must return a boolean.

### Example

```php
public function __isset($name)
{
    return array_key_exists($name, $this->data);
}
```

---

## 2.2 `__unset($name)`

Triggered when `unset()` is called on an undefined or inaccessible property.

### Example

```php
public function __unset($name)
{
    unset($this->data[$name]);
}
```

---

## Important Limitation

`__get`, `__set`, `__isset`, and `__unset` **do not work with static properties**. Accessing an undefined static property results in an error, not a magic method call.

---

# 3. Method Call Magic Methods

## 3.1 `__call($name, $arguments)`

Triggered when calling an inaccessible or undefined **instance** method.

### Example

```php
public function __call($name, $arguments)
{
    var_dump($name, $arguments);
}
```

If `$invoice->process(1, 2, 3)` is called and `process()` is missing or not public, `__call` receives:

* `$name = "process"`
* `$arguments = [1, 2, 3]`

---

## 3.2 Delegating Calls Using `call_user_func_array`

When forwarding method calls internally, you must pass arguments correctly:

```php
if (method_exists($this, $name)) {
    return call_user_func_array([$this, $name], $arguments);
}
```

This avoids passing the argument array as a single argument.

---

## 3.3 `__callStatic($name, $arguments)`

Same as `__call`, but for undefined or inaccessible **static** method calls.

### Example

```php
public static function __callStatic($name, $arguments)
{
    var_dump('static', $name, $arguments);
}
```

---

## Framework Use Case (e.g., Laravel)

Magic method delegation enables:

* Static façade calls forwarded to underlying non-static classes.
* Dynamic behaviors without explicitly defining methods.

---

# 4. String Conversion Magic Method

## `__toString()`

Executed when an object is treated as a string (e.g., via `echo`).

### Requirements

Must return a **string**. In strict mode, returning anything else causes an error.

### Example

```php
public function __toString(): string
{
    return "Invoice summary...";
}
```

### PHP 8+ Enhancement

Any class defining `__toString()` implicitly implements the `Stringable` interface.

---

# 5. Callable Object Magic Method

## `__invoke()`

Runs when an object is used like a function: `$object()`

### Example

```php
public function __invoke()
{
    var_dump('invoked');
}
```

### Use Case

Ideal for *single-action classes* (command pattern), where invoking the object directly performs the operation.

---

# 6. Debug Output Magic Method

## `__debugInfo()`

Controls how an object appears when passed to `var_dump()`.

### Example

```php
public function __debugInfo()
{
    return [
        'id' => $this->id,
        'accountNumber' => substr($this->accountNumber, -4),
    ];
}
```

### Purpose

Hide or transform sensitive private properties during debugging.

---

# 7. Magic Methods Not Covered Here

Additional magic methods such as:

* `__clone`
* `__sleep`
* `__wakeup`
* `__serialize`
* `__unserialize`

These relate to object cloning and serialization and require additional background, hence they are addressed separately.

---

# Summary

Magic methods enable powerful customization of PHP object behavior, including:

* Dynamic property access (`__get`, `__set`, `__isset`, `__unset`)
* Dynamic method calls (`__call`, `__callStatic`)
* String conversion (`__toString`)
* Callable objects (`__invoke`)
* Controlled debug output (`__debugInfo`)

While flexible, these methods should be used carefully to avoid reducing code clarity, breaking encapsulation, or creating unexpected implicit behaviors.

---

# End of Tutorial