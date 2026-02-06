# Course Recap and Final Exercise (Sections 1 & 2)

## Overview

This lesson concludes **Section 2** of the PHP course and introduces a **capstone-style exercise** that consolidates everything learned across **procedural PHP (Section 1)** and **object-oriented PHP with databases (Section 2)**.

The exercise is a **refactor and upgrade** of an earlier procedural project into a **fully object-oriented, MVC-based PHP application with database persistence and file uploads**.

---

## What Was Covered So Far

### Section 1 – PHP Fundamentals (Procedural)

Key topics:

* PHP syntax and variables
* Control structures (if, loops)
* Arrays and string handling
* Functions
* File handling
* Superglobals (`$_GET`, `$_POST`, `$_FILES`)
* Basic form handling
* Procedural project implementation

---

### Section 2 – Advanced PHP & OOP

Key topics:

* Installing PHP with Docker
* Object-Oriented Programming (OOP)

  * Classes and objects
  * Encapsulation
  * Inheritance
  * Polymorphism
* Magic methods
* Traits
* Static methods and properties
* Late static binding
* Composer & PSR autoloading
* MVC architecture
* Superglobals in OOP context
* MySQL with PDO
* Database abstraction
* Transactions

---

## Final Exercise – CSV Transaction Import (OOP + MVC)

### Objective

Build an application that:

1. Allows a user to **upload a CSV file**
2. Parses transaction records from the CSV
3. Stores transactions in a **MySQL database**
4. Displays transactions in a **formatted table**
5. Uses **Object-Oriented PHP**
6. Follows **MVC architecture**
7. Uses **PDO** for database access

This is the **same exercise from Section 1**, but now implemented correctly using **OOP + MVC + Database**.

---

## Application Requirements

### CSV File Structure (Example)

```csv
date,description,amount
2024-01-01,Salary,5000
2024-01-05,Rent,-1500
2024-01-10,Groceries,-350
```

---

## Database Schema

### transactions Table

```sql
CREATE TABLE transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    transaction_date DATE NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## MVC Structure

```text
app/
 ├── Controllers/
 │    └── TransactionController.php
 ├── Models/
 │    └── Transaction.php
 ├── Views/
 │    └── transactions.php
 ├── Core/
 │    ├── Database.php
 │    └── Controller.php
public/
 ├── index.php
 └── uploads/
```

---

## Core Components Implementation

---

## Database Connection (PDO)

### `app/Core/Database.php`

```php
<?php

class Database
{
    private static ?PDO $instance = null;

    public static function getConnection(): PDO
    {
        if (self::$instance === null) {
            self::$instance = new PDO(
                'mysql:host=localhost;dbname=app_db;charset=utf8mb4',
                'root',
                '',
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                ]
            );
        }

        return self::$instance;
    }
}
```

---

## Model – Transaction

### `app/Models/Transaction.php`

```php
<?php

require_once __DIR__ . '/../Core/Database.php';

class Transaction
{
    private PDO $db;

    public function __construct()
    {
        $this->db = Database::getConnection();
    }

    public function insert(array $data): void
    {
        $stmt = $this->db->prepare(
            'INSERT INTO transactions (transaction_date, description, amount)
             VALUES (:date, :description, :amount)'
        );

        $stmt->execute([
            'date' => $data['date'],
            'description' => $data['description'],
            'amount' => $data['amount'],
        ]);
    }

    public function getAll(): array
    {
        return $this->db->query(
            'SELECT * FROM transactions ORDER BY transaction_date DESC'
        )->fetchAll();
    }
}
```

---

## Controller – Handling Upload and Import

### `app/Controllers/TransactionController.php`

```php
<?php

require_once __DIR__ . '/../Models/Transaction.php';

class TransactionController
{
    public function index(): void
    {
        $transaction = new Transaction();
        $transactions = $transaction->getAll();

        require __DIR__ . '/../Views/transactions.php';
    }

    public function upload(): void
    {
        if (!isset($_FILES['csv']) || $_FILES['csv']['error'] !== UPLOAD_ERR_OK) {
            throw new RuntimeException('File upload failed');
        }

        $filePath = $_FILES['csv']['tmp_name'];
        $handle = fopen($filePath, 'r');

        if ($handle === false) {
            throw new RuntimeException('Cannot open CSV file');
        }

        $transaction = new Transaction();

        // Skip header row
        fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            [$date, $description, $amount] = $row;

            $transaction->insert([
                'date' => $date,
                'description' => $description,
                'amount' => $amount,
            ]);
        }

        fclose($handle);

        header('Location: /');
        exit;
    }
}
```

---

## View – Display Transactions

### `app/Views/transactions.php`

```php
<!DOCTYPE html>
<html>
<head>
    <title>Transactions</title>
    <style>
        table { border-collapse: collapse; width: 60%; }
        th, td { border: 1px solid #ccc; padding: 8px; }
        th { background: #f4f4f4; }
        .positive { color: green; }
        .negative { color: red; }
    </style>
</head>
<body>

<h2>Upload Transactions CSV</h2>

<form method="POST" enctype="multipart/form-data" action="/upload">
    <input type="file" name="csv" accept=".csv" required>
    <button type="submit">Upload</button>
</form>

<h2>Transaction List</h2>

<table>
    <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Amount</th>
    </tr>

    <?php foreach ($transactions as $tx): ?>
        <tr>
            <td><?= htmlspecialchars($tx['transaction_date']) ?></td>
            <td><?= htmlspecialchars($tx['description']) ?></td>
            <td class="<?= $tx['amount'] >= 0 ? 'positive' : 'negative' ?>">
                <?= number_format($tx['amount'], 2) ?>
            </td>
        </tr>
    <?php endforeach; ?>
</table>

</body>
</html>
```

---

## Front Controller (Routing Entry Point)

### `public/index.php`

```php
<?php

require_once __DIR__ . '/../app/Controllers/TransactionController.php';

$controller = new TransactionController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->upload();
} else {
    $controller->index();
}
```

---

## Key Concepts Reinforced by This Exercise

* Procedural → Object-Oriented refactoring
* MVC separation of concerns
* Secure file uploads
* CSV parsing
* PDO prepared statements
* Database persistence
* Controller-driven request handling
* Reusable models
* Clean project structure

---

## Expected Outcome

After completing this exercise, you should be comfortable:

* Designing a PHP application using MVC
* Working with PDO and MySQL
* Handling file uploads securely
* Parsing CSV files
* Writing clean, testable OOP PHP code
* Transitioning from procedural to professional-grade PHP

---
