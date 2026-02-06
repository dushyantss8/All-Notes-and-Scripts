# **PHP Autoloading, PSR Standards, and Composer: A Complete Tutorial**

## **1. Introduction to Autoloading**

Traditionally, PHP projects use `require` or `include` statements to load class files. As applications grow, this becomes unwieldy. Autoloading solves this by automatically loading classes when they are referenced.

Two approaches are demonstrated:

1. Building a custom autoloader using **`spl_autoload_register()`**.
2. Using **Composer**, which implements autoloading based on industry standards (PSR-4).

---

# **2. Project Structure Update**

The codebase now places application classes in:

```
app/
    PaymentGateway/
    SomeOtherNamespace/
```

All namespaces are prefixed with:

```php
namespace App;
```

This ensures consistent top-level namespacing.

---

# **3. Building a Custom Autoloader**

## **3.1 Registering Autoloaders**

PHP provides `spl_autoload_register()`:

```php
spl_autoload_register(function ($class) {
    var_dump($class);
});
```

This callback receives the **fully qualified class name (FQCN)** whenever PHP attempts to load an undefined class.

### When does it run?

* **Only when the class is not already included**
* **Does not run if the class was previously loaded via require/include**

To observe autoloader behavior, remove all `require` statements.

---

## **3.2 Autoloader Execution Order**

You may register multiple autoloaders:

```php
spl_autoload_register(function () {
    var_dump("Autoloader 1");
});
spl_autoload_register(function () {
    var_dump("Autoloader 2");
});
```

Execution order:

* Registered first ⇒ Runs first.
* Use `prepend: true` to place an autoloader at the beginning:

```php
spl_autoload_register(function () {
    var_dump("Autoloader 2");
}, prepend: true);
```

---

## **3.3 Converting a Class Name to a File Path**

To autoload files, transform the FQCN into a valid file path.

### Steps:

1. Replace namespace separators (`\`) with directory separators (`/`)
2. Lowercase the first character (based on the folder naming convention)
3. Append `.php`
4. Prefix with the correct base directory using `__DIR__`

Example:

```php
spl_autoload_register(function ($class) {
    $path = __DIR__ . '/../' . lcfirst(str_replace('\\', '/', $class)) . '.php';

    if (file_exists($path)) {
        require $path;
    }
});
```

Now any class inside `app/` is automatically loaded.

---

# **4. PHP Standards and PSR Overview**

## **4.1 Purpose of PSRs**

PHP Standard Recommendations (PSRs) provide consistent conventions for:

* Coding style
* Autoloading
* Logging
* Caching
* HTTP request/response interfaces

Maintained by **PHP-FIG** (Framework Interoperability Group).

---

## **4.2 Key Standards**

### **PSR-1 — Basic Coding Standard**

Examples:

* Classes: StudlyCaps
* Methods: camelCase
* Constants: UPPER_CASE
* Standard PHP tags only

---

### **PSR-12 — Extended Coding Standard**

Includes:

* Formatting rules
* Control structure guidelines
* Namespace and use-statement organization
* Class and property formatting

Modern IDEs (e.g., PhpStorm) can auto-format using PSR-12.

---

### **PSR-4 — Autoloading Standard**

Formalizes:

* Namespace-to-directory mapping
* Autoloader implementation behavior

Example mapping:

```
Namespace:  "App\"
Directory:  "app/"
```

Autoloader must:

* Not throw exceptions
* Not emit warnings
* Not return values
  Thus, you should check `file_exists()` before `require`.

---

# **5. Introducing Composer**

Composer is PHP’s de facto dependency management tool. It handles:

* Installing libraries
* Version resolution
* Autoloading configuration
* Classmap generation (optimized loading)

---

## **5.1 Composer Installation (Docker Example)**

Inside a Dockerfile:

```dockerfile
RUN curl -sS https://getcomposer.org/installer | php \
    && mv composer.phar /usr/local/bin/composer
```

Then rebuild the container:

```bash
docker compose up --build
```

To access Composer:

```bash
docker exec -it <container> bash
composer
```

---

# **6. Installing Packages with Composer**

Example: Install UUID generator:

```bash
composer require ramsey/uuid
```

Composer generates:

### **1. `composer.json`**

Project manifest + dependencies:

```json
{
  "require": {
    "ramsey/uuid": "^4.0"
  }
}
```

### **2. `composer.lock`**

Exact versions locked for reproducibility.

### **3. `vendor/`**

All installed libraries.

### **4. `vendor/autoload.php`**

Composer’s autoload implementation.

---

## **6.1 Using Composer Packages**

```php
require __DIR__ . '/../vendor/autoload.php';

use Ramsey\Uuid\UuidFactory;

$id = (new UuidFactory())->uuid4();
echo $id;
```

Composer automatically loads all vendor classes.

---

# **7. Autoloading Your Own Classes Using Composer**

Add the PSR-4 mapping to `composer.json`:

```json
"autoload": {
    "psr-4": {
        "App\\": "app/"
    }
}
```

Regenerate autoload files:

```bash
composer dump-autoload
```

This produces files in `vendor/composer/` including:

* `autoload_psr4.php`
* `autoload_classmap.php`

Your namespace now loads automatically.

---

# **8. Optimized Autoloading (Production)**

Composer supports classmap generation for faster loading:

```bash
composer dump-autoload -o
```

This populates `autoload_classmap.php` with every class path.
Best for **production**; not ideal during development.

Behavior:

* If class is in classmap ⇒ Load instantly
* Otherwise fallback to PSR-4 autoloading

---

# **9. Important Best Practices**

* Do not commit the `vendor/` directory
  Add this to `.gitignore`.
* Commit `composer.lock` to ensure consistent dependency versions.
* Use PSR-4 + Composer for modern PHP project structure.
* Use optimized autoloading in production environments.

---

# **End of Tutorial Summary**

This tutorial captures the core technical instruction for:

* Building a custom PHP autoloader
* Understanding PSR standards
* Installing and using Composer
* Configuring project autoloading
* Leveraging production optimizations

---

# End of Tutorial