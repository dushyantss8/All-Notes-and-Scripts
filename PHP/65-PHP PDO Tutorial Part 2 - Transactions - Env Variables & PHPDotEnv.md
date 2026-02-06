# Advanced PDO Usage in PHP

## Transactions, Error Handling, and Environment Configuration

This lesson builds on earlier PDO and MySQL basics and introduces:

* Proper **PDO exception scope**
* **Database transactions** for data consistency
* Correct usage of `lastInsertId()`
* Secure handling of database credentials using **environment variables**
* Loading `.env` files using a third-party library

---

## 1. Best Practices Recap from Previous PDO Lesson

### 1.1 Prepared Statements vs Direct Queries

* **Prepared statements should always be used** when inserting dynamic data into SQL.
* Direct variable interpolation is unsafe unless:

  * Placeholders are not supported (e.g., identifiers like column names)
  * You apply **strict whitelisting**

Example (❌ avoid):

```php
$id = (int) $id;
$sql = "SELECT * FROM users WHERE id = $id";
$pdo->query($sql);
```

Example (✅ recommended):

```php
$stmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
$stmt->execute(['id' => $id]);
```

---

### 1.2 PDO Try–Catch Scope

**Only the PDO connection should be inside `try/catch`.**

❌ Bad practice:

```php
try {
    $pdo = new PDO(...);
    $pdo->query(...);
    $pdo->query(...);
} catch (PDOException $e) {
    throw $e;
}
```

✅ Correct approach:

```php
try {
    $pdo = new PDO($dsn, $user, $password, $options);
} catch (PDOException $e) {
    throw $e;
}

// Queries go here (outside try-catch)
```

---

## 2. Database Transactions (Core Concept)

### 2.1 What Is a Transaction?

A **transaction** is a sequence of SQL operations treated as a single unit:

* Either **all queries succeed**
* Or **all changes are rolled back**

This prevents **partial or inconsistent data writes**.

---

### 2.2 Why Transactions Matter

Without transactions:

* One query may succeed
* Another may fail
* Database ends up in an invalid state

Transactions ensure **atomicity**.

---

## 3. Transaction Example: User Registration + Invoice Creation

### Scenario

When a user signs up:

1. Insert user into `users`
2. Create invoice in `invoices`
3. Both must succeed together

---

## 4. Implementing Transactions with PDO

### 4.1 PDO Setup

```php
$dsn = "mysql:host=localhost;dbname=mydb;charset=utf8mb4";
$user = "root";
$password = "root";

$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
];

$pdo = new PDO($dsn, $user, $password, $options);
```

---

### 4.2 Transactional Code

```php
try {
    $pdo->beginTransaction();

    // Insert user
    $userStmt = $pdo->prepare(
        "INSERT INTO users (email, full_name)
         VALUES (:email, :name)"
    );

    $userStmt->execute([
        'email' => 'john@example.com',
        'name'  => 'John Doe',
    ]);

    // IMPORTANT: call before commit
    $userId = $pdo->lastInsertId();

    // Insert invoice
    $invoiceStmt = $pdo->prepare(
        "INSERT INTO invoices (user_id, amount)
         VALUES (:user_id, :amount)"
    );

    $invoiceStmt->execute([
        'user_id' => $userId,
        'amount'  => 99.99,
    ]);

    $pdo->commit();

} catch (Throwable $e) {

    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }

    // In real apps, rethrow this
    echo "Transaction failed";
}
```

---

### 4.3 Key Rules for Transactions

✅ Always call `lastInsertId()` **before** `commit()`
❌ Calling it after commit returns `0`

---

## 5. Verifying Transaction Results

```php
$stmt = $pdo->query("
    SELECT users.full_name, invoices.amount
    FROM users
    JOIN invoices ON invoices.user_id = users.id
");

$result = $stmt->fetchAll(PDO::FETCH_ASSOC);
var_dump($result);
```

---

## 6. MySQL Engine Requirement

Transactions require **InnoDB**.

* Default since MySQL 5.5
* Supports:

  * Transactions
  * Foreign keys
  * Row-level locking

❌ `MyISAM` does **not** support transactions.

---

## 7. Removing Hard-Coded Credentials

Hard-coding credentials is **unsafe** and should never be committed.

### Solution: Environment Variables

---

## 8. Creating `.env` Files

### 8.1 `.env` (NOT committed)

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=mydb
```

---

### 8.2 `.env.example` (Committed)

```env
DB_HOST=
DB_USER=
DB_PASS=
DB_NAME=
```

Add `.env` to `.gitignore`.

---

## 9. Loading Environment Variables in PHP

### 9.1 Install Dotenv

```bash
composer require vlucas/phpdotenv
```

---

### 9.2 Load `.env` in `public/index.php`

```php
use Dotenv\Dotenv;

require_once __DIR__ . '/../vendor/autoload.php';

$dotenv = Dotenv::createImmutable(dirname(__DIR__));
$dotenv->load();
```

---

## 10. Accessing Environment Variables

```php
$dsn = sprintf(
    "mysql:host=%s;dbname=%s;charset=utf8mb4",
    $_ENV['DB_HOST'],
    $_ENV['DB_NAME']
);

$pdo = new PDO(
    $dsn,
    $_ENV['DB_USER'],
    $_ENV['DB_PASS'],
    [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    ]
);
```

---

## 11. Benefits of Environment Variables

* Credentials never committed
* Easy per-environment configuration
* Works for:

  * Databases
  * API keys
  * Feature flags
  * App settings

You can later abstract this into a **Config class** instead of using `$_ENV` directly.

---

## 12. Summary

* Proper PDO error handling
* How and why to use transactions
* Correct rollback logic
* Importance of `lastInsertId()` order
* Secure configuration using `.env`
* Loading environment variables in PHP

---