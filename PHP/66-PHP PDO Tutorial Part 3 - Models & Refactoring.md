# Refactoring a PHP MVC Application: App Bootstrap, Config, Database, and Models

## Goal of the Refactor

The existing codebase has several architectural issues:

* Controllers are doing **too much work**:

  * Creating database connections
  * Running SQL queries
  * Managing transactions
* Database connections are **duplicated**
* Heavy reliance on **superglobals** (`$_SERVER`, `$_ENV`)
* No clear separation of concerns

### Objectives

* Introduce an **App bootstrap class**
* Centralize **configuration handling**
* Create a **single shared database connection**
* Extract database logic into **models**
* Improve **testability and maintainability**

---

## 1. Creating the Application Bootstrap (`App`)

### Problem

`index.php` contains:

* Route resolution
* Exception handling
* Direct access to superglobals

### Solution

Move bootstrapping logic into an `App` class.

---

### `index.php` (Entry Point)

```php
<?php
declare(strict_types=1);

use App\App;
use App\Config;
use App\Router;

require_once __DIR__ . '/../vendor/autoload.php';

$config = new Config($_ENV);

$router = new Router();
$router->get('/', [HomeController::class, 'index']);

$app = new App(
    router: $router,
    request: [
        'uri' => $_SERVER['REQUEST_URI'],
        'method' => $_SERVER['REQUEST_METHOD'],
    ],
    config: $config
);

$app->run();
```

---

### `App.php`

```php
<?php
declare(strict_types=1);

namespace App;

use App\Exceptions\RouteNotFoundException;

class App
{
    protected Router $router;
    protected array $request;
    protected Config $config;

    private static ?DB $db = null;

    public function __construct(
        Router $router,
        array $request,
        Config $config
    ) {
        $this->router = $router;
        $this->request = $request;
        $this->config  = $config;

        if (self::$db === null) {
            self::$db = new DB($this->config->db ?? []);
        }
    }

    public function run(): void
    {
        try {
            echo $this->router->resolve(
                $this->request['uri'],
                $this->request['method']
            );
        } catch (RouteNotFoundException $e) {
            http_response_code(404);
            echo $e->getMessage();
        }
    }

    public static function db(): DB
    {
        return self::$db;
    }
}
```

---

## 2. Centralized Configuration (`Config`)

### Problem

* Direct access to `$_ENV`
* No validation
* Hard to extend

### Solution

Create a `Config` class responsible for reading environment data.

---

### `Config.php`

```php
<?php
declare(strict_types=1);

namespace App;

/**
 * @property-read array $db
 */
class Config
{
    protected array $config = [];

    public function __construct(array $env)
    {
        $this->config['db'] = [
            'driver'   => $env['DB_DRIVER'] ?? 'mysql',
            'host'     => $env['DB_HOST'] ?? '',
            'database' => $env['DB_NAME'] ?? '',
            'user'     => $env['DB_USER'] ?? '',
            'password' => $env['DB_PASSWORD'] ?? '',
        ];
    }

    public function __get(string $key)
    {
        return $this->config[$key] ?? null;
    }
}
```

---

## 3. Database Abstraction (`DB`)

### Requirements

* Single database connection
* PDO internally
* Clean API for models
* Avoid inheritance from PDO

---

### `DB.php`

```php
<?php
declare(strict_types=1);

namespace App;

use PDO;

class DB
{
    protected PDO $pdo;

    public function __construct(array $config, array $options = [])
    {
        $defaults = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];

        $options = $options + $defaults;

        $dsn = sprintf(
            '%s:host=%s;dbname=%s;charset=utf8mb4',
            $config['driver'],
            $config['host'],
            $config['database']
        );

        $this->pdo = new PDO(
            $dsn,
            $config['user'],
            $config['password'],
            $options
        );
    }

    public function __call(string $method, array $args)
    {
        return $this->pdo->$method(...$args);
    }
}
```

🔹 **Magic `__call()` proxies all PDO calls to the internal PDO instance**
🔹 IDE support can be restored with `@mixin PDO`

---

## 4. Base Model Class

### Purpose

* Avoid duplicating `App::db()` calls
* Share DB access across all models

---

### `Model.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

use App\App;
use App\DB;

abstract class Model
{
    protected DB $db;

    public function __construct()
    {
        $this->db = App::db();
    }
}
```

---

## 5. User Model

### `User.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

class User extends Model
{
    public function create(
        string $email,
        string $name,
        bool $isActive = true
    ): int {
        $stmt = $this->db->prepare(
            'INSERT INTO users (email, full_name, is_active)
             VALUES (:email, :name, :active)'
        );

        $stmt->execute([
            'email'  => $email,
            'name'   => $name,
            'active' => $isActive,
        ]);

        return (int) $this->db->lastInsertId();
    }
}
```

---

## 6. Invoice Model

### `Invoice.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

class Invoice extends Model
{
    public function create(float $amount, int $userId): int
    {
        $stmt = $this->db->prepare(
            'INSERT INTO invoices (amount, user_id)
             VALUES (:amount, :user_id)'
        );

        $stmt->execute([
            'amount'  => $amount,
            'user_id' => $userId,
        ]);

        return (int) $this->db->lastInsertId();
    }

    public function find(int $id): array
    {
        $stmt = $this->db->prepare(
            'SELECT i.id, i.amount, u.full_name
             FROM invoices i
             LEFT JOIN users u ON u.id = i.user_id
             WHERE i.id = :id'
        );

        $stmt->execute(['id' => $id]);

        return $stmt->fetch() ?: [];
    }
}
```

---

## 7. Signup / Registration Model (Business Logic)

### Why?

* Controller should **not** coordinate multi-model logic
* Signup = user creation + invoice creation + transaction

---

### `Signup.php`

```php
<?php
declare(strict_types=1);

namespace App\Models;

class Signup extends Model
{
    protected User $user;
    protected Invoice $invoice;

    public function __construct(User $user, Invoice $invoice)
    {
        parent::__construct();

        $this->user    = $user;
        $this->invoice = $invoice;
    }

    public function register(
        array $userData,
        array $invoiceData
    ): int {
        $this->db->beginTransaction();

        try {
            $userId = $this->user->create(
                $userData['email'],
                $userData['name']
            );

            $invoiceId = $this->invoice->create(
                $invoiceData['amount'],
                $userId
            );

            $this->db->commit();

            return $invoiceId;
        } catch (\Throwable $e) {
            $this->db->rollBack();
            throw $e;
        }
    }
}
```

---

## 8. Slimmed-Down Controller

### `HomeController.php`

```php
<?php
declare(strict_types=1);

use App\Models\User;
use App\Models\Invoice;
use App\Models\Signup;

class HomeController
{
    public function index()
    {
        $signup = new Signup(
            new User(),
            new Invoice()
        );

        $invoiceId = $signup->register(
            ['email' => 'test@example.com', 'name' => 'John Doe'],
            ['amount' => 199.99]
        );

        $invoice = (new Invoice())->find($invoiceId);

        return view('index', compact('invoice'));
    }
}
```

---

## 9. View Rendering with Escaping (XSS Safety)

### `views/index.php`

```php
<?php if (!empty($invoice)): ?>
    <hr>
    Invoice ID: <?= htmlspecialchars($invoice['id']) ?><br>
    Amount: <?= htmlspecialchars($invoice['amount']) ?><br>
    User: <?= htmlspecialchars($invoice['full_name']) ?>
<?php endif; ?>
```

✔ Prevents XSS
✔ Output is safely escaped

---

## 10. Verifying Single Database Instance

```php
$db1 = App::db();
$db2 = App::db();
$db3 = App::db();

var_dump(
    $db1 === $db2,
    $db2 === $db3,
    $db1 === $db3
);
```

✅ All `true` → single shared DB connection

---

## Final Architecture Improvements

| Before                  | After                          |
| ----------------------- | ------------------------------ |
| Controllers handle DB   | Controllers delegate to models |
| Multiple PDO instances  | Single shared DB               |
| Superglobals everywhere | Explicit dependencies          |
| No config abstraction   | Centralized `Config`           |
| No domain models        | Clear business models          |

---