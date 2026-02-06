# Doctrine DBAL in PHP —

## 1. Overview: What Is Doctrine DBAL?

**Doctrine** is a collection of well-maintained PHP libraries focused on database interaction and object mapping.

In this guide, we focus exclusively on **Doctrine DBAL (Database Abstraction Layer)**.

### Why DBAL?

* Abstracts database-specific details (MySQL, SQLite, PostgreSQL, etc.)
* Provides a **query builder**
* Handles **type conversions**
* Simplifies **transactions**
* Improves maintainability compared to raw SQL or PDO alone

> **Important:** DBAL is **not** an ORM. It sits between raw SQL and full ORM solutions.

---

## 2. DBAL vs PDO

| Feature                | PDO | Doctrine DBAL |
| ---------------------- | --- | ------------- |
| Multiple DB support    | ✅   | ✅             |
| Query Builder          | ❌   | ✅             |
| SQL rewriting          | ❌   | ✅             |
| Advanced type handling | ❌   | ✅             |
| Schema inspection      | ❌   | ✅             |

PDO is a **data access layer**, while DBAL is a **database abstraction layer**.

---

## 3. Installing Doctrine DBAL

Install DBAL using Composer:

```bash
composer require doctrine/dbal
```

---

## 4. Creating a Database Connection

### Environment Variables (`.env`)

```env
DB_DRIVER=pdo_mysql
DB_HOST=127.0.0.1
DB_NAME=app_db
DB_USER=root
DB_PASS=secret
```

### PHP Connection Setup

```php
<?php

require __DIR__ . '/vendor/autoload.php';

use Doctrine\DBAL\DriverManager;

$params = [
    'driver'   => $_ENV['DB_DRIVER'] ?? 'pdo_mysql',
    'host'     => $_ENV['DB_HOST'],
    'dbname'   => $_ENV['DB_NAME'],
    'user'     => $_ENV['DB_USER'],
    'password' => $_ENV['DB_PASS'],
];

$connection = DriverManager::getConnection($params);
```

* `DriverManager::getConnection()` returns a **Doctrine\DBAL\Connection**
* Internally, it wraps a PDO connection

---

## 5. Executing Queries

### 5.1 Prepared Queries

```php
$stmt = $connection->prepare('SELECT * FROM invoices');
$result = $stmt->executeQuery();

$rows = $result->fetchAllAssociative();
```

Available fetch methods:

* `fetchAllAssociative()`
* `fetchAssociative()`
* `fetchNumeric()`
* `fetchOne()`

---

### 5.2 Direct Execution (Without Prepare)

```php
$result = $connection->executeQuery('SELECT * FROM invoices');
$rows = $result->fetchAllAssociative();
```

Use this when parameters are not required.

---

## 6. Binding Parameters

### 6.1 Positional Placeholders

```php
$stmt = $connection->prepare(
    'SELECT * FROM invoices WHERE id = ?'
);

$result = $stmt->executeQuery([100]);
$invoice = $result->fetchAssociative();
```

---

### 6.2 Named Placeholders

```php
$stmt = $connection->prepare(
    'SELECT * FROM invoices WHERE id = :id'
);

$stmt->bindValue('id', 100);
$result = $stmt->executeQuery();

$invoice = $result->fetchAssociative();
```

---

### 6.3 Insert / Update / Delete Queries

Use `executeStatement()` instead of `executeQuery()`:

```php
$connection->executeStatement(
    'DELETE FROM invoices WHERE id = ?',
    [100]
);
```

---

## 7. Advanced Type Handling

### 7.1 DateTime Conversion

Doctrine DBAL can automatically convert PHP objects into database-friendly formats.

```php
use Doctrine\DBAL\Types\Types;

$stmt = $connection->prepare(
    'SELECT id, created_at
     FROM invoices
     WHERE created_at BETWEEN :from AND :to'
);

$stmt->bindValue('from', new DateTime('2022-01-01'), Types::DATETIME_MUTABLE);
$stmt->bindValue('to', new DateTime('2022-01-31'), Types::DATETIME_MUTABLE);

$result = $stmt->executeQuery();
$rows = $result->fetchAllAssociative();
```

---

## 8. Handling IN() Queries with Arrays

### Problem (Traditional SQL)

You cannot safely bind arrays directly in SQL `IN (...)` clauses.

### Solution (Doctrine DBAL)

```php
use Doctrine\DBAL\Connection;

$sql = 'SELECT * FROM invoices WHERE id IN (?)';

$result = $connection->executeQuery(
    $sql,
    [[1, 2, 3]],
    [Connection::PARAM_INT_ARRAY]
);

$rows = $result->fetchAllAssociative();
```

Doctrine automatically expands the placeholder.

---

## 9. Convenience Fetch Methods

Instead of manually preparing:

```php
$rows = $connection->fetchAllAssociative(
    'SELECT * FROM invoices'
);
```

This internally executes the query and fetches results.

---

## 10. Transactions

### Manual Transactions

```php
$connection->beginTransaction();

try {
    $connection->executeStatement(...);
    $connection->executeStatement(...);

    $connection->commit();
} catch (Throwable $e) {
    $connection->rollBack();
    throw $e;
}
```

---

### Automatic Transactions with Closures

```php
$connection->transactional(function ($conn) {
    $conn->executeStatement(...);
    $conn->executeStatement(...);
});
```

* Automatically commits on success
* Automatically rolls back on failure

---

## 11. Using the Query Builder

### Example: Select with Condition

```php
$qb = $connection->createQueryBuilder();

$invoices = $qb
    ->select('id', 'amount')
    ->from('invoices')
    ->where('amount > ?')
    ->setParameter(0, 6000)
    ->fetchAllAssociative();
```

---

### Inspect Generated SQL

```php
$sql = $qb->getSQL();
```

---

### SQL Injection Warning

❌ **Never interpolate values directly**

```php
->where("amount > $amount"); // Dangerous
```

✅ **Always use placeholders**

---

## 12. Schema Manager (Database Inspection)

### 12.1 List Tables

```php
$schema = $connection->createSchemaManager();
$tables = $schema->listTableNames();
```

---

### 12.2 List Columns

```php
$columns = $schema->listTableColumns('invoices');

$columnNames = array_keys($columns);
```

---

## 13. Refactoring an Existing PDO-Based DB Class

### Before (PDO)

```php
$this->pdo = new PDO(...);
```

### After (Doctrine DBAL)

```php
$this->connection = DriverManager::getConnection($config);
```

Replace:

* `$this->pdo->prepare()` → `$this->connection->prepare()`
* `$stmt->execute()` → `$stmt->executeQuery()`

---

## 14. Refactoring Models to Use Query Builder

### Invoice Model Example

```php
public function getByStatus(string $status): array
{
    return $this->connection
        ->createQueryBuilder()
        ->select('id', 'invoice_number', 'amount', 'status')
        ->from('invoices')
        ->where('status = ?')
        ->setParameter(0, $status)
        ->fetchAllAssociative();
}
```

---

## 15. Updating Views

Because DBAL returns **associative arrays**, update views accordingly:

```php
<?= $invoice['invoice_number']; ?>
```

Instead of object access.

---

# Final Notes, Best Practices & Key Takeaways

### ✔ Key Concepts

* DBAL abstracts SQL and database drivers
* It complements PDO rather than replacing SQL entirely
* Query Builder improves safety and readability

### ✔ Best Practices

* Always use **placeholders**
* Prefer **Query Builder** over raw SQL in models
* Use **PARAM_*_ARRAY** for `IN()` queries
* Use **transactional()** for atomic operations
* Rely on **type conversions** instead of manual formatting

### ✔ When to Use DBAL

* Lightweight projects needing clean SQL abstraction
* Applications not requiring full ORM complexity
* Transitional step before frameworks like Laravel or Symfony

---