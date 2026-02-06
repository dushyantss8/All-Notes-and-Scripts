# PHP Enums (PHP 8.1+) — A Complete Practical Guide

## 1. The Problem With Constants-Based Status Handling

Before PHP 8.1, developers commonly represented fixed values using class constants.

### Example: Invoice Status Using Constants

```php
final class InvoiceStatus
{
    public const PENDING = 0;
    public const PAID    = 1;
    public const VOID    = 2;
    public const FAILED  = 3;

    public static function all(): array
    {
        return [
            self::PENDING,
            self::PAID,
            self::VOID,
            self::FAILED,
        ];
    }
}
```

These constants are then stored in the database and reused throughout the application.

### Typical Usage in a Model

```php
class Invoice
{
    public static function allByStatus(int $status): array
    {
        if (!in_array($status, InvoiceStatus::all(), true)) {
            throw new RuntimeException('Invalid status');
        }

        // Example query
        return DB::select(
            'SELECT * FROM invoices WHERE status = ?',
            [$status]
        );
    }
}
```

### Controller Usage

```php
$invoices = Invoice::allByStatus(InvoiceStatus::PAID);
```

---

## 2. Limitations of Constants

Even with validation, constants suffer from key problems:

* Only **scalar type-hinting** is possible (`int` or `string`)
* Any integer (e.g. `99`) can be passed accidentally
* Validation logic must be repeated
* No strict guarantee that the value is a valid status

---

## 3. Introducing Enums in PHP 8.1

Enums provide a **fixed, closed set of values** known as **cases**, with strong typing and better safety.

---

## 4. Defining a Pure Enum

A **pure enum** has no scalar backing values.

```php
enum InvoiceStatus
{
    case Pending;
    case Paid;
    case Void;
    case Failed;
}
```

### Enum Cases Are Objects

```php
var_dump(InvoiceStatus::Paid);
```

Output:

```text
enum(InvoiceStatus::Paid)
```

```php
var_dump(is_object(InvoiceStatus::Paid)); // true
```

### Enum Cases Are Singletons

```php
$status1 = InvoiceStatus::Paid;
$status2 = InvoiceStatus::Paid;

var_dump($status1 === $status2); // true
```

---

## 5. Type-Safe Method Signatures With Enums

### Model Refactor

```php
class Invoice
{
    public static function allByStatus(InvoiceStatus $status): array
    {
        return DB::select(
            'SELECT * FROM invoices WHERE status = ?',
            [$status] // ❌ error: object cannot be converted to string
        );
    }
}
```

Enums eliminate the need for validation—but we must handle database values properly.

---

## 6. Backed Enums (Mapping to Database Values)

To store enum values in the database, use a **backed enum**.

```php
enum InvoiceStatus: int
{
    case Pending = 0;
    case Paid    = 1;
    case Void    = 2;
    case Failed  = 3;
}
```

### Rules for Backed Enums

* Must be backed by **int OR string**
* No union types
* All cases must be backed
* Case names and values must be unique

---

## 7. Accessing Enum Data

### Built-in Properties

```php
$status = InvoiceStatus::Failed;

$status->name;  // "Failed"
$status->value; // 3
```

### Fixing the Database Query

```php
class Invoice
{
    public static function allByStatus(InvoiceStatus $status): array
    {
        return DB::select(
            'SELECT * FROM invoices WHERE status = ?',
            [$status->value]
        );
    }
}
```

---

## 8. Converting Database Values Back to Enums

Backed enums implement `BackedEnum` internally.

### Methods Available

* `from(value)` → throws exception if invalid
* `tryFrom(value)` → returns `null` if invalid

```php
$status = InvoiceStatus::tryFrom($row['status']);
```

---

## 9. Adding Behavior to Enums

Enums can contain methods.

### User-Friendly Status Label

```php
enum InvoiceStatus: int
{
    case Pending = 0;
    case Paid    = 1;
    case Void    = 2;
    case Failed  = 3;

    public function label(): string
    {
        return match ($this) {
            self::Paid   => 'Paid',
            self::Failed => 'Declined',
            self::Void   => 'Void',
            default      => 'Pending',
        };
    }
}
```

### View Usage

```php
$status = InvoiceStatus::tryFrom($invoice->status);

echo $status?->label();
```

---

## 10. Using Enums for UI Styling (Colors)

### Color Enum

```php
enum StatusColor: string
{
    case Green  = 'green';
    case Red    = 'red';
    case Gray   = 'gray';
    case Orange = 'orange';

    public function cssClass(): string
    {
        return 'color-' . $this->value;
    }
}
```

### Linking Status to Color

```php
enum InvoiceStatus: int
{
    case Pending = 0;
    case Paid    = 1;
    case Void    = 2;
    case Failed  = 3;

    public function color(): StatusColor
    {
        return match ($this) {
            self::Paid   => StatusColor::Green,
            self::Failed => StatusColor::Red,
            self::Void   => StatusColor::Gray,
            default      => StatusColor::Orange,
        };
    }
}
```

### View Example

```php
$status = InvoiceStatus::tryFrom($invoice->status);

echo '<span class="' . $status->color()->cssClass() . '">';
echo $status->label();
echo '</span>';
```

---

## 11. Static Methods in Enums

```php
enum InvoiceStatus: int
{
    // cases...

    public static function fromColor(StatusColor $color): self
    {
        return match ($color) {
            StatusColor::Green  => self::Paid,
            StatusColor::Red    => self::Failed,
            StatusColor::Gray   => self::Void,
            default             => self::Pending,
        };
    }
}
```

---

## 12. Enums in Attribute-Based Routing (HTTP Methods)

### HTTP Method Enum

```php
enum HttpMethod: string
{
    case GET  = 'GET';
    case POST = 'POST';
    case PUT  = 'PUT';
    case HEAD = 'HEAD';
}
```

### Attribute Example

```php
#[Route(HttpMethod::POST)]
class StoreInvoiceController {}
```

### Router Adjustment

```php
$method = $attribute->method->value;
```

---

## 13. Interfaces and Traits in Enums

### Interfaces ✅

```php
interface HasLabel
{
    public function label(): string;
}

enum InvoiceStatus: int implements HasLabel
{
    // cases and methods
}
```

### Traits ✅ (Without Properties)

```php
trait StatusHelpers
{
    public function isFinal(): bool
    {
        return in_array($this, [self::Paid, self::Failed], true);
    }
}
```

❌ Traits **cannot** contain properties.

---

## 14. Enum Restrictions and Capabilities

### Enums Cannot:

* Have properties
* Have constructors or destructors
* Be instantiated manually
* Be cloned
* Use inheritance
* Use most magic methods

### Enums Can:

* Have methods (any visibility)
* Have static methods
* Implement interfaces
* Use traits (no properties)
* Have attributes on enum or cases

---

## 15. Accessing All Enum Cases

```php
InvoiceStatus::cases();
```

Returns:

```php
[
    InvoiceStatus::Pending,
    InvoiceStatus::Paid,
    InvoiceStatus::Void,
    InvoiceStatus::Failed,
]
```

Provided by the `UnitEnum` interface.

---

## 16. Enum Utility Functions

### Check if Enum Exists

```php
enum_exists(InvoiceStatus::class); // true
enum_exists(Invoice::class);       // false
```

---

## 17. Reflection Support for Enums

New reflection classes:

* `ReflectionEnum`
* `ReflectionEnumUnitCase`
* `ReflectionEnumBackedCase`

Used for advanced tooling and meta-programming.

---

## 18. Key Notes, Best Practices & Considerations

### Best Practices

* Use enums instead of constants for fixed domain values
* Prefer backed enums when persisting data
* Move domain logic into enum methods
* Use `tryFrom()` for untrusted input
* Avoid leaking raw enum values into views

### Design Guidelines

* One enum = one domain concept
* Keep enums small and expressive
* Use enums for:

  * Statuses
  * Types
  * Roles
  * HTTP methods
  * Configuration switches

### Final Recommendation

**Enums are not just constants—they are first-class domain objects.**
Use them to make your PHP applications safer, clearer, and more maintainable.

---