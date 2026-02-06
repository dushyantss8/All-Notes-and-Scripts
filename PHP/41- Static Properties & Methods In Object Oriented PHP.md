# **PHP Static Properties and Methods –**

## **1. Introduction to Static Properties and Methods**

Static properties and methods in PHP belong to the class itself, not to instances (objects) of the class. They are defined using the `static` keyword and accessed using the *scope resolution operator* `::`.

### **Declaring Static Members**

```php
class Transaction {
    public static int $count = 0;
}
```

### **Correct Keyword Order**

Although both orders work:

* `public static $count`
* `static public $count`

The recommended standard is **access modifier first**, then `static`.

---

## **2. Accessing Static Properties**

Static members are accessed with the class name, not an instance:

```php
var_dump(Transaction::$count); // 0
```

Although you *can* access static members through an object, this is not recommended:

```php
$transaction = new Transaction();
var_dump($transaction::$count); // Valid, but discouraged
```

---

## **3. Static vs. Non-Static Properties**

* **Non-static properties** are created *per object* and exist independently.
* **Static properties** are created *once per class* and shared across all objects.

### **Example: Shared Counter**

```php
class Transaction {
    public static int $count = 0;

    public function __construct() {
        self::$count++;
    }
}
```

Creating five instances results in:

```php
echo Transaction::$count; // 5
```

---

## **4. Accessing Static Members Inside the Class**

Use `self::` or the class name:

```php
self::$count++;
Transaction::$count++;
```

`$this` **cannot** be used in static context.

---

## **5. Using Access Modifiers with Static Members**

If a static property is `private`, it cannot be accessed externally.

```php
private static int $count = 0;
```

To expose it safely, define a static accessor:

```php
public static function getCount() {
    return self::$count;
}
```

---

## **6. Restrictions in Static Context**

### **6.1 `$this` is Not Available**

Static methods have no access to `$this`:

```php
public static function test() {
    echo $this->amount; // Fatal error
}
```

### **6.2 Cannot Access Non-Static Members Statically**

```php
Transaction::$amount; // Error
Transaction::process(); // Error if process() is non-static
```

PHP 8 → Fatal error
PHP 7.x → Deprecated warning

---

## **7. Valid and Invalid Static Access**

### **Valid**

```php
Transaction::getCount();
$transaction->getCount(); // Valid but discouraged
```

### **Invalid**

```php
Transaction::$amount; // Non-static property
Transaction::process(); // Non-static method
```

---

## **8. Use Cases for Static Properties and Methods**

### **8.1 Counters and Caching**

Static properties help maintain shared state:

* Counting instances
* Memoization/cache storage

### **8.2 Singleton Pattern (Basic Example)**

A class that ensures only **one instance** exists.

```php
class DB {
    private static ?DB $instance = null;
    private function __construct(array $config) {}

    public static function getInstance(array $config): DB {
        if (self::$instance === null) {
            self::$instance = new DB($config);
        }
        return self::$instance;
    }
}
```

Usage:

```php
$db = DB::getInstance(['host' => 'localhost']);
```

Calling repeatedly returns the *same* instance.

---

### **8.3 Utility Classes**

Static methods are useful when functionality does **not depend on object state**:

```php
class Formatter {
    public static function formatAmount(float $amount): string {
        return number_format($amount, 2);
    }
}
```

### **8.4 Factory Pattern (Simple Version)**

A static method responsible for object creation:

```php
class TransactionFactory {
    public static function make($amount, $description) {
        return new Transaction($amount, $description);
    }
}
```

Later in the course, this pattern is replaced with dependency injection.

---

## **9. Drawbacks of Using Static Members**

Static usage is generally discouraged because:

* It creates **global state**
* It makes code **harder to maintain**
* It makes testing **more difficult**
* It encourages tight coupling between components

Dependency Injection is typically the preferred alternative.

---

## **10. Static Methods and Closures**

### **10.1 Static Closures Cannot Access `$this`**

```php
array_map(static function() {
    var_dump($this->amount); // Error
}, [1]);
```

This is useful when you want to guarantee no accidental access to object state.

### **10.2 Preventing Side Effects**

Non-static closures *can* mutate object state:

```php
array_map(function() {
    $this->amount = 35; // Allowed
}, [1]);
```

To prevent this:

```php
array_map(static function() {
    // Cannot access $this, prevents side-effects
}, [1]);
```

This is both a safety feature and a micro-optimization.

---

## **11. Summary**

Static properties and methods:

### **Pros**

* Useful for global counters, caches, or simple utilities.
* Helpful in certain design patterns (Singleton, simple Factory).
* Enable static closures to protect against modification of object state.

### **Cons**

* Represent shared/global state.
* Make code harder to test and maintain.
* Encourage design anti-patterns.
* Should usually be replaced by Dependency Injection.

Static functionality has niche use cases and should be implemented thoughtfully.

---

# End of Tutorial