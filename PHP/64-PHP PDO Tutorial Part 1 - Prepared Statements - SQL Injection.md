# Using MySQL with PHP via PDO

This tutorial explains how to connect PHP to MySQL using **PDO**, execute queries safely, and protect your application against **SQL Injection** using **prepared statements**.

---

## 1. Why Use PDO Instead of MySQLi?

PHP provides multiple ways to interact with MySQL:

| Approach | Description                            |
| -------- | -------------------------------------- |
| MySQLi   | Procedural + OOP, MySQL only           |
| PDO      | Fully OOP, supports multiple databases |

### Advantages of PDO

* Supports multiple database drivers (MySQL, PostgreSQL, SQLite, etc.)
* Supports **named parameters**
* Encourages **prepared statements**
* Cleaner, consistent API

> PDO is a **data access layer**, not a full ORM or database abstraction.

---

## 2. Enabling PDO MySQL Driver

### Check Enabled Drivers

Create a temporary file:

```php
<?php phpinfo();
```

Search for **PDO drivers**:

* If you only see `sqlite`, MySQL is not enabled.

---

### Enabling PDO MySQL

#### XAMPP / Local PHP

1. Open `php.ini`
2. Uncomment:

```ini
extension=pdo_mysql
```

3. Restart Apache

---

#### Docker (PHP Official Image)

In your `Dockerfile`:

```dockerfile
RUN docker-php-ext-install pdo pdo_mysql
```

Rebuild containers:

```bash
docker compose up -d --build
```

Verify again using `phpinfo()`.

---

## 3. Connecting PHP to MySQL Using PDO

### Basic Connection Example

```php
<?php

use PDO;
use PDOException;

try {
    $db = new PDO(
        'mysql:host=db;dbname=mydb',
        'root',
        'root',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );
} catch (PDOException $e) {
    throw new PDOException($e->getMessage(), (int)$e->getCode());
}
```

### Important Notes

* **Docker users** must use the **container name (`db`)**, not `localhost`
* PDO throws `PDOException` on connection failure
* Always wrap connections in `try/catch`

---

## 4. Running Simple SELECT Queries

### Using `query()`

```php
$stmt = $db->query("SELECT * FROM users");
$users = $stmt->fetchAll();

var_dump($users);
```

### Iterating Results

```php
foreach ($db->query("SELECT * FROM users") as $user) {
    echo '<pre>';
    var_dump($user);
    echo '</pre>';
}
```

---

## 5. Fetch Modes in PDO

### Default Fetch Mode

* `PDO::FETCH_BOTH` (numeric + associative)

### Common Fetch Modes

```php
$stmt->fetchAll(PDO::FETCH_ASSOC);   // Associative array
$stmt->fetchAll(PDO::FETCH_OBJ);     // stdClass objects
```

### Setting Default Fetch Mode

```php
$options = [
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_OBJ
];

$db = new PDO($dsn, $user, $pass, $options);
```

---

## 6. SQL Injection Vulnerability (What NOT To Do)

### ❌ Vulnerable Code

```php
$email = $_GET['email'];

$query = "SELECT * FROM users WHERE email = \"$email\"";
$stmt = $db->query($query);
```

### Example Injection

```
?email=test@example.com" OR 1=1 --
```

Result:

```sql
SELECT * FROM users WHERE email="test@example.com" OR 1=1 --
```

➡️ Returns **all users**.

---

## 7. Prepared Statements (Correct Way)

Prepared statements:

* Separate SQL structure from data
* Prevent SQL injection
* Improve performance in loops

---

### Using Positional Placeholders (`?`)

```php
$stmt = $db->prepare(
    "SELECT * FROM users WHERE email = ?"
);

$stmt->execute([$email]);
$user = $stmt->fetch();
```

---

## 8. INSERT Query with Prepared Statements

### Positional Placeholders

```php
$stmt = $db->prepare(
    "INSERT INTO users (email, full_name, is_active, created_at)
     VALUES (?, ?, ?, ?)"
);

$stmt->execute([
    $email,
    $name,
    $isActive,
    $createdAt
]);
```

### Fetch Inserted Record

```php
$id = (int) $db->lastInsertId();

$stmt = $db->prepare("SELECT * FROM users WHERE id = ?");
$stmt->execute([$id]);

$user = $stmt->fetch();
```

---

## 9. Named Parameters (Recommended)

### SQL with Named Parameters

```php
$stmt = $db->prepare(
    "INSERT INTO users (email, full_name, is_active, created_at)
     VALUES (:email, :name, :active, :date)"
);
```

### Execute with Associative Array

```php
$stmt->execute([
    'email'  => $email,
    'name'   => $name,
    'active' => $isActive,
    'date'   => $createdAt
]);
```

### Why Named Parameters?

* Order does **not** matter
* Easier to read
* Safer for maintenance

---

## 10. `bindValue()` vs `bindParam()`

### `bindValue()` (By Value)

```php
$stmt->bindValue(':name', $name);
$stmt->bindValue(':active', 1, PDO::PARAM_INT);
```

* Value is copied immediately
* Can bind literals

---

### `bindParam()` (By Reference)

```php
$stmt->bindParam(':active', $isActive, PDO::PARAM_INT);
```

* Uses variable reference
* Value is read **at execution time**
* Cannot bind literals

---

## 11. Using Placeholders with `bindValue()`

```php
$stmt = $db->prepare(
    "INSERT INTO users VALUES (?, ?, ?, ?)"
);

$stmt->bindValue(1, $email);
$stmt->bindValue(2, $name);
$stmt->bindValue(3, $isActive, PDO::PARAM_INT);
$stmt->bindValue(4, $createdAt);

$stmt->execute();
```

> Placeholder indexes start from **1**, not 0.

---

## 12. Emulated vs Native Prepared Statements

### Default Behavior

* PDO MySQL uses **emulated prepares** by default

### Disable Emulated Prepares

```php
$options = [
    PDO::ATTR_EMULATE_PREPARES => false
];
```

---

### Differences

| Feature              | Emulated | Native        |
| -------------------- | -------- | ------------- |
| Data types           | Strings  | Correct types |
| Reusing named params | Allowed  | ❌ Not allowed |
| LIMIT placeholders   | ❌        | ✅             |
| Performance          | Lower    | Better        |

---

### Example Issue with Native Prepares

❌ Invalid:

```sql
VALUES (:date, :date)
```

✅ Correct:

```sql
VALUES (:created_at, :updated_at)
```

---

## 13. Key Takeaways

* Always use **prepared statements**
* Never inject user input directly into SQL
* Prefer **named parameters**
* Disable emulated prepares for:

  * Correct data types
  * Better SQL support
* Wrap all DB logic in `try/catch`
* Controllers should **not** contain database logic (move to models)

---