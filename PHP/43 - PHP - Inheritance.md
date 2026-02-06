# **Tutorial Summary: PHP Inheritance (OOP)**

## **1. Introduction to Inheritance**

Inheritance allows one class (child) to derive from another class (parent).
A child class automatically gains the parent’s public and protected:

* Properties
* Methods
* Constants

The child class can:

* Override these members
* Add its own additional members

Relationship rule: use inheritance when the child “**is a**” type of the parent.

---

# **2. Base Example: Toaster Class**

### **Toaster Class Definition**

```php
class Toaster
{
    public array $slices = [];
    public int $size = 2;

    public function addSlice(string $slice): void
    {
        if (count($this->slices) < $this->size) {
            $this->slices[] = $slice;
        }
    }

    public function toast(): void
    {
        foreach ($this->slices as $s) {
            echo "Toasting $s\n";
        }
    }
}
```

### **Behavior**

* Can toast two slices at a time.
* Additional slices beyond the size limit are ignored.

---

# **3. Extending the Class: ToasterPro**

### **Problem**

ToasterPro is an advanced toaster with:

* Capacity for 4 slices
* Additional method: toast as bagel
* Same basic behavior as Toaster

### **Inefficient Approach**

Duplicating Toaster code leads to redundancy.

### **Proper Approach: Inheritance**

```php
class ToasterPro extends Toaster
{
    protected int $size = 4;

    public function toastBagel(): void
    {
        foreach ($this->slices as $s) {
            echo "Toasting $s with bagels option\n";
        }
    }
}
```

### **Key Points**

* `extends Toaster` grants child class access to parent members.
* You can override parent properties:

  * Here, `$size` is overridden (2 → 4).
* You only define additional functionality.

---

# **4. `$this` Refers to Calling Object**

When calling parent methods from a child instance, `$this` refers to the **child object**, not the parent.

Example: calling a parent method from `ToasterPro` means `$this` is of type `ToasterPro`.

---

# **5. Visibility Rules in Inheritance**

### **1. Private Members**

* **Cannot** be accessed or overridden by child.
* Belong only to the class in which they are declared.

### **2. Visibility Cannot Be Reduced**

If parent declares:

```php
public $size;
```

Child cannot declare:

```php
protected $size; // INVALID
private $size;   // INVALID
```

Increasing visibility is allowed:

* parent: `protected`
* child: `public` → valid

### **3. Protected Recommended for Inheritance**

Prevents external access but available to children.

---

# **6. Overriding Methods**

### **Overriding Constructors**

When overriding `__construct` in the child:

* Parent constructor is **not** called automatically.
* You must explicitly call it.

Example:

```php
class Toaster
{
    protected int $size;
    protected array $slices;

    public function __construct()
    {
        $this->size = 2;
        $this->slices = [];
    }
}

class ToasterPro extends Toaster
{
    public function __construct()
    {
        parent::__construct();  // Must be FIRST (generally)
        $this->size = 4;
    }
}
```

### **Correct Ordering**

If parent sets `$size = 2`, calling parent constructor after overriding will overwrite child changes.

### **If Parent Has No Constructor**

Child may still define its own.

---

# **7. Overriding Non-Constructor Methods**

Example:

```php
class ToasterPro extends Toaster
{
    public function addSlice(string $slice): void
    {
        // Custom logic
        parent::addSlice($slice); // explicit call required
    }
}
```

### **Signature Compatibility Rules**

Child method must match:

* Parameter types
* Parameter order
* Return type

Example violating compatibility:

```php
public function addSlice(int $slice) {} // ERROR
```

### **Exceptions**

Compatibility rules DO NOT apply to constructors.

### **Named Arguments Caveat**

Parameter names must match if named arguments are used.

---

# **8. Final Classes and Methods**

### **Final Class**

```php
final class Toaster {}
```

Cannot be extended.

### **Final Method**

```php
final public function addSlice() {}
```

Child class cannot override the method.

---

# **9. PHP Inheritance Model Limitations**

### **No Multiple Inheritance**

A class cannot extend more than one parent.

### **Supports Multi-Level Inheritance**

A → B → C

Example hierarchy:

```
BaseField
   → TextField
        → EmailField
   → BooleanField
```

Child inherits from all ancestors.

---

# **10. Real-World Examples of Inheritance**

### **a. Transactions**

* `Transaction`
* `RefundTransaction` extends `Transaction`

### **b. Banking Accounts**

* `PaymentAccount`

  * `CheckingAccount`
  * `SavingsAccount`

### **c. Form Fields**

Hierarchical inheritance used to classify field types.

---

# **11. When Inheritance Becomes a Bad Idea**

### **Signs of Misuse**

1. Child inherits methods it should not have.
2. Child must override parent methods and throw exceptions.
3. Child has access to parent’s internal state and can break encapsulation.
4. “Is-A” relationship does not apply.

Example of bad design:

```php
public function foo() {
    throw new Exception('Not allowed');
}
```

Use **composition** instead.

---

# **12. Composition vs. Inheritance**

### **Problem Example**

Create a `FancyOven` that can toast bread.

Bad solution:

```
class FancyOven extends ToasterPro { ... }
```

But an oven **is not** a toaster.

### **Correct Solution: Composition**

FancyOven **has a** toaster.

```php
class FancyOven
{
    public function __construct(
        private ToasterPro $toaster
    ) {}

    public function toast(): void
    {
        $this->toaster->toast();
    }

    public function toastBagel(): void
    {
        $this->toaster->toastBagel();
    }
}
```

Use composition when:

* You need to reuse functionality
* “Is-A” relationship does not exist

---

# **13. Type Hinting with Inheritance**

### **Example**

```php
function process(Toaster $t) {
    $t->toast();
}
```

Valid:

```php
process(new Toaster());
process(new ToasterPro()); // ToasterPro is a Toaster
```

Invalid:

```php
function process(ToasterPro $tp) {}
process(new Toaster()); // ERROR
```

---

# **14. Summary of Key Rules**

### **Inheritance is appropriate when:**

* Child “is a” parent type
* Parent behavior naturally applies to child

### **Avoid inheritance when:**

* You inherit unused or unwanted functionality
* You feel forced to override methods just to disable them
* “Is-A” relationship does not hold
  (e.g., Oven is not a Toaster)

### **Use composition when:**

* Object “has a” another object
* You want controlled access to contained functionality

---

# End of Tutorial