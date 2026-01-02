# 📘 Laravel Project Structure Explained

Laravel follows a clean and organized folder structure that makes development easy to manage. Below is an overview of all the main folders and files found in a typical Laravel project, along with their purposes.

---

## 🏗️ 1. The `app` Folder — Core of the MVC Pattern

The **`app`** folder is where most of the application logic resides — roughly **90% of the project code**.
Here you implement the **MVC (Model-View-Controller)** architecture pattern.

### Contents:

* **Models** → Represent and interact with the database.
  Example:

  ```php
  class User extends Model {
      protected $fillable = ['name', 'email', 'password'];
  }
  ```

* **Views** → Contain the HTML or Blade templates shown to the users.
  Example:

  ```blade
  <!-- resources/views/users/index.blade.php -->
  <h1>{{ $user->name }}</h1>
  ```

* **Controllers** → Handle requests, communicate with models, and return responses.
  Example:

  ```php
  class UserController extends Controller {
      public function index() {
          $users = User::all();
          return view('users.index', compact('users'));
      }
  }
  ```

---

## ⚙️ 2. The `bootstrap` Folder — Starting the Application

The **`bootstrap`** folder contains files that **initialize (bootstrap)** the Laravel framework and start the application.
It also stores the **cache** for optimized performance.

---

## ⚙️ 3. The `config` Folder — Configuration Files

All project-related configuration files live in the **`config`** directory.

### Examples:

* `config/database.php` → Manages database connection details.
* `config/app.php` → Contains app name, timezone, locale, etc.
* `config/mail.php` → Defines email settings.

---

## 🗄️ 4. The `database` Folder — Database Management

This folder stores everything related to database operations.

### Contents:

* **Migrations** → Define and modify table structures.
  Example:

  ```php
  Schema::create('users', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->timestamps();
  });
  ```
* **Seeders** → Populate the database with test or default data.
* **Factories** → Generate fake data for testing.

---

## 🌐 5. The `public` Folder — Publicly Accessible Files

The **`public`** folder contains static files and serves as the **web root**.

### Examples:

* CSS, JavaScript, images, fonts, etc.
* The **`index.php`** file (entry point for all HTTP requests).

---

## 💅 6. The `resources` Folder — Frontend Resources

This folder stores **frontend assets** and **view templates**.

### Structure:

* **`views/`** → Contains Blade templates.
* **`js/` and `css/`** → Source JavaScript and CSS files.
* **`lang/`** → Stores translation mappings for localization.

---

## 🛣️ 7. The `routes` Folder — Application Routing

This folder contains all route definitions.

### Files:

* `web.php` → Web routes (browser-based).
* `api.php` → API routes.
* `channels.php` → WebSocket broadcasting channels.
* `console.php` → Artisan CLI commands.

Example:

```php
Route::get('/users', [UserController::class, 'index']);
```

---

## 🧰 8. The `storage` Folder — File Storage

This directory stores generated or temporary files, including:

* Cache and session data
* Log files
* Uploaded files and images

---

## 🧪 9. The `tests` Folder — Automated Testing

Contains both **unit** and **feature tests**.

Example:

```php
public function test_home_page_is_accessible()
{
    $response = $this->get('/');
    $response->assertStatus(200);
}
```

---

## 📦 10. The `vendor` Folder — Composer Dependencies

Managed by **Composer**, this folder holds all third-party packages and the **Laravel framework core**.

---

# ⚙️ Important Root Files

### 🧾 `styleci.yml`

Configuration file for **StyleCI**, a tool that auto-formats and enforces coding style.

### 🧰 `artisan`

Laravel’s **Command Line Interface (CLI)** used for various tasks:

```bash
php artisan make:controller UserController
php artisan serve
```

### 📜 `composer.json`

Lists all **project dependencies** and scripts.
Example:

```json
"require": {
    "laravel/framework": "^11.0",
    "guzzlehttp/guzzle": "^7.0"
}
```

### 🧪 `phpunit.xml`

Configuration file for **PHPUnit** testing framework.

### 🌍 `server.php`

Used by Laravel to create a **local development server**.

### 🧩 `webpack.mix.js`

Acts as a **wrapper around Webpack** for compiling and bundling frontend assets (CSS, JS).

---

# 🚀 How Laravel Handles Incoming Requests

Let’s break down what happens when a user visits a Laravel application.

---

## 1️⃣ Step 1: Request Entry — `index.php`

All incoming HTTP requests go through the **`public/index.php`** file — the single entry point of the application.

---

## 2️⃣ Step 2: Maintenance Mode Check

Laravel first checks if the application is in **maintenance mode** (for upgrades or debugging).

If so, it shows a maintenance message; otherwise, it proceeds.

---

## 3️⃣ Step 3: Autoloading Classes

Next, Laravel **loads all necessary PHP classes** through Composer’s autoloader.

---

## 4️⃣ Step 4: Create the Application Instance

Laravel requires the **application instance** from the `bootstrap` folder.
Think of this instance as a **giant object** holding all core parts of the app.

---

## 5️⃣ Step 5: Services and the Service Container

### What are Services?

Services are components that handle specific tasks — e.g., Authentication, Routing, Storage.

### Service Container

Laravel connects these services using the **Service Container** — a big box attached to the app instance where all services are registered (or “bound”).

Example:

```php
$app->bind('UserService', function() {
    return new App\Services\UserService();
});
```

---

## 6️⃣ Step 6: Service Binding

There are two main ways to bind services:

### A) Using `bind()` method

Creates a **new instance** every time.

```php
$app->bind('PaymentService', function () {
    return new PaymentService();
});
```

### B) Using `singleton()` method

Creates **only one instance** for the entire app lifecycle.

```php
$app->singleton('AuthService', function () {
    return new AuthService();
});
```

### C) Using a **Service Provider**

A **Service Provider** is a class that tells Laravel *how* to bind a service inside the container.
It’s more powerful and organized than direct binding.

---

## 7️⃣ Step 7: The Kernel — Laravel’s Core Engine

The **Kernel** acts as the **core of the framework**, connecting all the components together.

It:

* Accepts the incoming HTTP request
* Passes it through middlewares and routes
* Generates and sends the response back to the client

Finally, Laravel calls:

```php
$kernel->terminate($request, $response);
```

This **terminates** the app gracefully after sending the response.

---

# ✅ Summary

| Component      | Purpose                         |
| -------------- | ------------------------------- |
| **app/**       | Core MVC logic                  |
| **bootstrap/** | Starts the application          |
| **config/**    | Configuration files             |
| **database/**  | Migrations, seeders, factories  |
| **public/**    | Public static files             |
| **resources/** | Frontend files and translations |
| **routes/**    | Route definitions               |
| **storage/**   | Logs, cache, uploaded files     |
| **tests/**     | Unit and feature tests          |
| **vendor/**    | Composer dependencies           |
