# Doctrine ORM in PHP —

## 1. Introduction to ORM and Doctrine ORM

### What Is ORM?

**ORM (Object Relational Mapping)** is a programming technique that maps relational database tables to object-oriented classes. It acts as a layer between your application’s domain logic and the persistence layer (database).

In practical terms, ORM allows you to:

* Treat database rows as PHP objects
* Work with relationships using object references instead of SQL joins
* Abstract away most manual SQL for CRUD operations

### Doctrine ORM

**Doctrine ORM** is a popular ORM library in the PHP ecosystem, heavily used by the Symfony framework but fully usable in standalone PHP applications.

Doctrine ORM is built **on top of Doctrine DBAL**, which means:

* DBAL handles low-level database abstraction
* ORM handles object mapping, relationships, and entity lifecycle

---

## 2. ORM Design Patterns

### Active Record vs Data Mapper

There are two commonly used ORM patterns:

#### Active Record

* Entities contain both data and persistence logic
* Example: Laravel Eloquent
* Entities save themselves

#### Data Mapper (Doctrine ORM)

* Entities are plain PHP objects
* Persistence logic is handled by a separate layer
* Domain logic is decoupled from storage

Doctrine ORM uses the **Data Mapper pattern**, which promotes clean architecture and separation of concerns.

---

## 3. Installing Doctrine ORM

Doctrine ORM is a separate package but depends on DBAL.

```bash
composer require doctrine/orm symfony/cache
```

> DBAL should still be required explicitly to maintain version control and flexibility.

---

## 4. Core Concepts

### Entities

An **Entity** is a PHP object that:

* Represents a database table
* Has a unique identity (primary key)
* Is managed by Doctrine

**Entity rules:**

* Must not be `final`
* Must not contain `final` methods
* Must have an identifier

---

## 5. Creating the Invoice Entity

### Database Structure (Invoices Table)

| Column         | Type     |
| -------------- | -------- |
| id             | INT (PK) |
| amount         | DECIMAL  |
| invoice_number | VARCHAR  |
| status         | ENUM     |
| created_at     | DATETIME |

### Entity Class

```php
<?php

declare(strict_types=1);

namespace App\Entity;

use App\Entity\InvoiceItem;
use App\Enums\InvoiceStatus;
use Doctrine\ORM\Mapping\Id;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\OneToMany;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\Common\Collections\Collection;
use Doctrine\Common\Collections\ArrayCollection;

#[Entity]
#[Table('invoices')]
class Invoice
{
    #[Id]
    #[Column, GeneratedValue]
    private int $id;

    #[Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private float $amount;

    #[Column(name: 'invoice_number')]
    private string $invoiceNumber;

    #[Column]
    private InvoiceStatus $status;

    #[Column(name: 'created_at')]
    private \DateTime $createdAt;

    // #[OneToMany(targetEntity: InvoiceItem::class)]
    #[OneToMany(targetEntity: InvoiceItem::class, mappedBy: 'invoice', cascade: ['persist', 'remove'])]
    private Collection $items;

    public function __construct()
    {
      $this->items = new ArrayCollection();
    }

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function setAmount(float $amount): self
    {
        $this->amount = $amount;
        return $this;
    }

    public function getInvoiceNumber(): string
    {
        return $this->invoiceNumber;
    }

    public function setInvoiceNumber(string $invoiceNumber): self
    {
        $this->invoiceNumber = $invoiceNumber;
        return $this;
    }

    public function getStatus(): InvoiceStatus
    {
        return $this->status;
    }

    public function setStatus(InvoiceStatus $status): self
    {
        $this->status = $status;
        return $this;
    }

    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTime $createdAt): self
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    /**
     * Method getItems
     *
     * @return Collection<InvoiceItem>
     */
    public function getItems(): Collection
    {
        return $this->items;
    }

    public function addItem(InvoiceItem $item)
    {
        $item->setInvoice($this);

        $this->items->add($item);

        return $this;
    }
}
```

> **Note on Money:**
> Floats are not ideal for monetary values due to precision issues. Prefer integers (cents) or strings for real-world finance systems.

---

## 6. One-to-Many Relationship: Invoice → Invoice Items

### Invoice Items Table

| Column      | Type     |
| ----------- | -------- |
| id          | INT (PK) |
| invoice_id  | INT (FK) |
| description | VARCHAR  |
| quantity    | INT      |
| unit_price  | DECIMAL  |

---

## 7. Creating the InvoiceItem Entity

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping\Id;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping\Table;
use Doctrine\ORM\Mapping\Column;
use Doctrine\ORM\Mapping\Entity;
use Doctrine\ORM\Mapping\GeneratedValue;
use Doctrine\ORM\Mapping\ManyToOne;

#[Entity()]
#[Table(name: 'invoice_items')]
class InvoiceItem
{
    #[Id]
    #[Column, GeneratedValue]
    private int $id;

    #[Column(name: 'invoice_id')]
    private int $invoiceId;

    #[Column]
    private string $description;

    #[Column]
    private int $quantity;

    #[Column(name: 'unit_price', type: Types::DECIMAL, precision: 10, scale: 2)]
    private float $unitPrice;

    #[ManyToOne(inversedBy: 'items')]
    private Invoice $invoice;

    public function getId(): int
    {
        return $this->id;
    }

    public function setId(int $id): self
    {
        $this->id = $id;
        return $this;
    }

    public function getInvoiceId(): int
    {
        return $this->invoiceId;
    }

    public function setInvoiceId(int $invoiceId): self
    {
        $this->invoiceId = $invoiceId;
        return $this;
    }

    public function getDescription(): string
    {
        return $this->description;
    }

    public function setDescription(string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getQuantity(): int
    {
        return $this->quantity;
    }

    public function setQuantity(int $quantity): self
    {
        $this->quantity = $quantity;
        return $this;
    }

    public function getUnitPrice(): float
    {
        return $this->unitPrice;
    }

    public function setUnitPrice(float $unitPrice): self
    {
        $this->unitPrice = $unitPrice;
        return $this;
    }

    public function getInvoice(): Invoice
    {
        return $this->invoice;
    }

    public function setInvoice(Invoice $invoice): self
    {
        $this->invoice = $invoice;
        return $this;
    }
}
```

---

## 8. Defining Entity Relationships

### Relationship Logic

* **Invoice → InvoiceItems** → One-to-Many
* **InvoiceItem → Invoice** → Many-to-One
* Foreign key exists on `invoice_items.invoice_id`

---

### Invoice Entity (Inverse Side)

```php
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\OneToMany(
    targetEntity: InvoiceItem::class,
    mappedBy: 'invoice',
    cascade: ['persist', 'remove']
)]
private Collection $items;

public function __construct()
{
    $this->items = new ArrayCollection();
}

public function addItem(InvoiceItem $item): self
{
    $this->items->add($item);
    $item->setInvoice($this);
    return $this;
}
```

---

### InvoiceItem Entity (Owning Side)

```php
#[ORM\ManyToOne(inversedBy: 'items')]
private Invoice $invoice;

public function setInvoice(Invoice $invoice): self
{
    $this->invoice = $invoice;
    return $this;
}
```

---

## 9. Setting Up the EntityManager

```php
use Doctrine\ORM\ORMSetup;
use Doctrine\ORM\EntityManager;
use Doctrine\DBAL\DriverManager;

$config = ORMSetup::createAttributeMetadataConfiguration(
  paths: [__DIR__ . '/../src/Entity'],
  isDevMode: true,
);

$connection = DriverManager::getConnection([
  'host'     => $_ENV['DB_HOST'],
  'user'     => $_ENV['DB_USER'],
  'password' => $_ENV['DB_PASSWORD'],
  'dbname'   => $_ENV['DB_DATABASE'],
  'driver'   => $_ENV['DB_DRIVER'] ?? 'pdo_mysql',
]);

$entityManager = new EntityManager($connection, $config);
```

---

## 10. Persisting Entities

```php
$invoice = (new Invoice())
    ->setAmount(45)
    ->setInvoiceNumber('INV-001')
    ->setStatus(InvoiceStatus::Pending)
    ->setCreatedAt(new DateTime());

foreach ($items as [$desc, $qty, $price]) {
    $item = (new InvoiceItem())
        ->setDescription($desc)
        ->setQuantity($qty)
        ->setUnitPrice($price);

    $invoice->addItem($item);
}

$entityManager->persist($invoice);
$entityManager->flush();
```

---

## 11. Unit of Work and Entity States

Doctrine tracks entities using the **Unit of Work** pattern.

### Entity States

* **New**
* **Managed**
* **Detached**
* **Removed**

```php
$uowSize = $entityManager->getUnitOfWork()->size();
```

---

## 12. Updating Existing Entities

```php
$invoice = $entityManager->find(Invoice::class, 15);
$invoice->setStatus(InvoiceStatus::Paid);

$entityManager->flush();
```

Updating related entities:

```php
$item = $invoice->getItems()->first();
$item->setDescription('FUBAR');

$entityManager->flush();
```

---

## 13. Removing Entities

```php
$entityManager->remove($invoice);
$entityManager->flush();
```

Cascade removal deletes related invoice items automatically.

---

## 14. Key Notes, Best Practices & Important Considerations

### Best Practices

* Prefer **Data Mapper** for complex domains
* Use **cascade persist/remove** carefully
* Avoid floats for monetary values
* Keep entities persistence-agnostic
* Always flush explicitly

### Important Notes

* `persist()` does NOT execute SQL
* `flush()` syncs all changes at once
* Managed entities auto-detect changes
* Many-to-One is always the owning side
* One-to-Many is always inverse

### Performance Considerations

* Large Unit of Work = heavier execution
* Flush strategically in batch operations
* Use repositories and query builders for reads

---