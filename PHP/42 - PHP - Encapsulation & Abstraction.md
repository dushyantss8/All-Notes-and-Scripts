# Encapsulation and Abstraction in PHP

## 1. Introduction to OOP Principles

The video introduces the four core principles of object-oriented programming:

1. Encapsulation
2. Abstraction
3. Inheritance
4. Polymorphism

This tutorial focuses specifically on **encapsulation** and **abstraction**, with inheritance and polymorphism addressed separately.

---

# 2. Encapsulation

## 2.1 Concept

Encapsulation means:

* Bundling **data (properties)** and **behavior (methods)** inside a class.
* Preventing external code from modifying the internal state directly unless explicitly allowed.
* Enforcing integrity by controlling access to internal data.

In PHP, this is achieved using **visibility modifiers**:

* `public` – accessible from anywhere
* `private` – accessible only within the same class
* `protected` – accessible within the class and its subclasses

---

## 2.2 Why Public Properties Break Encapsulation

Example transaction class:

```php
class Transaction {
    public float $amount;

    public function __construct(float $amount) {
        $this->amount = $amount;
    }

    public function process() {
        echo "Processing {$this->amount} transaction";
    }
}
```

### Problem

Even after passing `25` into the constructor:

```php
$transaction = new Transaction(25);
$transaction->process();
```

External code can do:

```php
$transaction->amount = 125;
```

This mutates the internal state unexpectedly and may cause bugs, particularly in team-based or large applications.

---

## 2.3 Fix: Making Properties Private

```php
class Transaction {
    private float $amount;

    public function __construct(float $amount) {
        $this->amount = $amount;
    }
}
```

Now external code cannot modify the amount directly.

---

## 2.4 Getters and Setters (Accessors and Mutators)

To read or modify private properties, a class may expose methods:

```php
public function getAmount(): float {
    return $this->amount;
}

public function setAmount(float $amount): void {
    $this->amount = $amount;
}
```

### Important Considerations

* Getters/setters can **reintroduce mutation** and break encapsulation if overused.
* Simply creating getters and setters for every property is considered a poor practice.
* Instead, expose only what the class *must* expose, and avoid mutation of objects representing immutable concepts (e.g., transactions).

### Recommended Pattern

* Accept needed values via constructor or purpose-specific methods.
* Avoid mutating existing objects—create new ones instead.

---

## 2.5 Private Utility Methods

Internal steps inside larger operations should also be private or protected.

Example:

```php
public function process() {
    $this->generateReceipt();
    $this->sendEmail();
}

private function generateReceipt() {
    // internal logic
}

private function sendEmail() {
    // internal logic
}
```

If these were public:

* `sendEmail()` could be called before `process()`, causing incorrect application flow.
* Internal logic would leak outside the class.

---

# 3. Bypassing Encapsulation Using PHP Reflection

Even private properties can be accessed via PHP’s **Reflection API**.
This is not recommended in real applications, but PHP allows it.

### Accessing a private property

```php
$property = new ReflectionProperty(Transaction::class, 'amount');
$property->setAccessible(true);
echo $property->getValue($transaction);
```

### Modifying a private property

```php
$property->setValue($transaction, 125);
```

This demonstrates that visibility is a design-time construct meant for developers rather than a strict security mechanism.

---

# 4. Abstraction

## 4.1 Concept

Abstraction hides **how** something works, exposing only **what** it does.

While encapsulation hides *data*, abstraction hides *implementation details*.

Example:

```php
$transaction->process();
```

The caller should not care:

* What payment gateway is used
* How the receipt is generated
* Whether an email is sent
* How data is stored

The internal implementation can change freely without affecting external code.

---

## 4.2 How Public Properties Break Abstraction

If other parts of your system directly access `amount`, such as:

```php
$transaction->amount;
```

Then changing the property type (e.g., switching from dollars to cents) would break many parts of the application.

Abstraction encourages isolating such changes inside the class.

---

## 4.3 Guiding Question for Good OOP Design

When designing classes, ask:

**“Can I change this class’s internal implementation without breaking code that uses it?”**

If yes, the class is well-designed with proper encapsulation and abstraction.

---

# 5. Bonus: Objects of the Same Class Can Access Each Other’s Private Members

PHP allows objects of the same type to access each other's private/protected properties internally.

Example:

```php
public function copyFrom(Transaction $transaction) {
    var_dump($transaction->amount);     // allowed
    var_dump($transaction->sendEmail()); // allowed
}
```

Usage:

```php
$transaction->copyFrom(new Transaction(100));
```

This prints the private property and result of a private method from another instance of the same class.

---

# 6. Summary of Key Takeaways

### Encapsulation

* Keep internal state private.
* Limit direct access to properties.
* Avoid getters/setters unless necessary.
* Prefer immutability where appropriate.
* Use private/protected methods for internal workflows.

### Abstraction

* Hide implementation details from external code.
* Expose clear, minimal public APIs.
* Ensure internal changes do not break external usage.

### Additional Notes

* Reflection can bypass visibility, but should rarely be used.
* Objects of the same class can access each other's private members internally.

---

# End of Tutorial