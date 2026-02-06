# 1. Conceptual Overview

## What is an Abstract Class?

An **abstract class** is a class that cannot be instantiated directly.
It is meant to act as a **base blueprint** for other classes.

Abstract classes can contain:

* **Concrete methods** (fully implemented)
* **Abstract methods** (declared but NOT implemented)
* **Properties**
* **Constants**

Child classes **must** implement all abstract methods.

Use abstract classes when:

* You want to enforce a structure.
* You want shared functionality for all subclasses.
* You want to prevent creating objects of the base class.

---

## What is an Abstract Method?

An **abstract method**:

* Has only a **signature**, no body.
* Must be implemented in all child classes.
* Enforces that every subclass provides its own version of the method.

---

# 2. Applying to the Field Hierarchy (Image)

The hierarchy is:

```
            Field (abstract)
           /               \
      Text                Boolean
                         /      \
                  Checkbox      Radio
```

The idea:

* Every field has **name, label, value**, and must be able to **render itself**.
* But each type renders differently.
* So the base class defines the contract (abstract methods).
* Children implement the concrete render logic.

---

# 3. Step-by-Step PHP Implementation

---

## Step 1: Create the Abstract Base Class `Field`

```php
<?php

declare(strict_types=1);

abstract class Field
{
    protected string $name;
    protected string $label;
    protected mixed $value;

    public function __construct(string $name, string $label, mixed $value = null)
    {
        $this->name  = $name;
        $this->label = $label;
        $this->value = $value;
    }

    // Enforce every subclass to implement this
    abstract public function render(): string;

    // Optional shared methods
    public function getName(): string
    {
        return $this->name;
    }

    public function getLabel(): string
    {
        return $this->label;
    }

    public function getValue(): mixed
    {
        return $this->value;
    }
}
```

### Key Points:

* Class is marked `abstract`.
* `render()` is abstract, forcing all children to implement it.
* Shared properties and helpers are included.

---

## Step 2: Create `Text` Field (child)

```php
<?php

class Text extends Field
{
    public function render(): string
    {
        return "
            <label>{$this->label}</label>
            <input type='text' name='{$this->name}' value='{$this->value}' />
        ";
    }
}
```

---

## Step 3: Create Intermediate Abstract Class `Boolean`

This class represents boolean fields but still shouldn't be instantiated directly because Boolean fields have specific types like Checkbox and Radio.

```php
<?php

abstract class Boolean extends Field
{
    // Optional: Boolean-specific logic
}
```

No `render()` method here because individual boolean types render differently.

---

## Step 4: Implement `Checkbox` and `Radio` Fields

### Checkbox

```php
<?php

class Checkbox extends Boolean
{
    public function render(): string
    {
        $checked = $this->value ? "checked" : "";

        return "
            <label>
                <input type='checkbox' name='{$this->name}' {$checked} />
                {$this->label}
            </label>
        ";
    }
}
```

### Radio

```php
<?php

class Radio extends Boolean
{
    public function render(): string
    {
        $checked = $this->value ? "checked" : "";

        return "
            <label>
                <input type='radio' name='{$this->name}' {$checked} />
                {$this->label}
            </label>
        ";
    }
}
```

---

# 4. Testing the Hierarchy

```php
$fields = [
    new Text("username", "Username", "JohnDoe"),
    new Checkbox("terms", "Accept Terms", true),
    new Radio("gender_male", "Male", false),
];

foreach ($fields as $field) {
    echo $field->render();
}
```

---

# 5. Why Abstract Classes Work Well Here

### Because:

* You cannot instantiate `Field` (no generic field exists).
* `render()` must be implemented differently by each child class.
* All fields share common data (name, label, value).
* Boolean fields have a shared parent but still require specific rendering.

### Enforcement:

If a subclass forgets to implement `render()`, PHP throws an error:

```
Class Text contains 1 abstract method and must therefore be declared abstract or implement the remaining methods.
```

This ensures structural integrity.

---

# 6. Benefits of This Architecture

| Benefit            | Explanation                                           |
| ------------------ | ----------------------------------------------------- |
| Enforced Design    | All fields must implement `render()`.                 |
| Code Reuse         | Shared logic and properties reside in the base class. |
| Extensibility      | Add new fields (Textarea, Select, Slider) easily.     |
| Clean Organization | Distinct responsibilities, no duplication.            |

---

# 7. Optional: Add Another Field Easily

Example: `Select`

```php
class Select extends Field
{
    private array $options;

    public function __construct(string $name, string $label, array $options, mixed $value = null)
    {
        parent::__construct($name, $label, $value);
        $this->options = $options;
    }

    public function render(): string
    {
        $html = "<label>{$this->label}</label><select name='{$this->name}'>";

        foreach ($this->options as $opt) {
            $selected = ($opt == $this->value) ? "selected" : "";
            $html .= "<option {$selected}>{$opt}</option>";
        }

        return $html . "</select>";
    }
}
```

Notice we clearly extend functionality without modifying the base.

---

# Final Summary

Using abstract classes for the Field hierarchy allows you to:

1. Define a **common template** for all fields.
2. Enforce that subclasses implement required behavior (rendering).
3. Prevent instantiation of incomplete or conceptual types.
4. Provide a clean inheritance structure that mirrors the field types in your image.

---

# End of Tutorial