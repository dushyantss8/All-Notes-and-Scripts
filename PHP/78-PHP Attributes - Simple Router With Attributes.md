# PHP Attributes (PHP 8+) – Complete Technical Guide with Practical Routing Example

---

## 1. What Are Attributes in PHP?

**Attributes** were introduced in **PHP 8.0** as a **first-class language feature**.

### Definition

Attributes allow you to attach **structured, machine-readable metadata** to code declarations such as:

* Classes
* Methods
* Functions
* Properties
* Parameters
* Class constants

This metadata can later be **read at runtime** using the **Reflection API**.

Attributes act as a **configuration language embedded directly in PHP code**.

---

## 2. Attributes vs Annotations (DocBlock Comments)

### Problems with Annotations

Annotations (used in frameworks like Doctrine or Symfony) rely on **DocBlock comments** and have drawbacks:

* Mix **documentation** and **behavior**
* Require **custom parsers**
* No native validation
* No IDE-level enforcement

### Advantages of Attributes

* Native PHP syntax
* Strict validation
* Typed constructor arguments
* IDE support
* No parsing required

---

## 3. Attribute Syntax Basics

### Example Attribute Usage

```php
#[Route('/')]
public function index()
{
}
```

### Syntax Rules

* Begins with `#[]`
* Inside brackets: **attribute class name**
* Optional constructor arguments

---

## 4. Goal: Attribute-Based Routing System

Instead of manually registering routes:

```php
$router->get('/', [HomeController::class, 'index']);
```

We will embed route metadata **directly inside controller methods** using attributes.

---

## 5. Creating a Custom Route Attribute

### Route Attribute Class

```php
<?php

namespace App\Attributes;

use Attribute;

#[Attribute(Attribute::TARGET_METHOD)]
class Route
{
    public string $path;
    public string $method;

    public function __construct(string $path, string $method = 'GET')
    {
        $this->path = $path;
        $this->method = strtoupper($method);
    }
}
```

### Key Points

* `#[Attribute]` makes this class an attribute
* `TARGET_METHOD` restricts usage to methods
* Constructor arguments hold metadata

---

## 6. Using the Route Attribute in Controllers

```php
<?php

namespace App\Controllers;

use App\Attributes\Route;

class HomeController
{
    #[Route('/')]
    public function index()
    {
        echo 'Home';
    }
}
```

---

## 7. Reading Attributes with Reflection

Attributes are **metadata only** — they do nothing unless explicitly processed.

### Reflection APIs Used

* `ReflectionClass`
* `ReflectionMethod`
* `ReflectionAttribute`

---

## 8. Router Method: Register Routes from Attributes

### Router Class Method

```php
<?php

namespace App\Routing;

use ReflectionClass;
use App\Attributes\Route;
use ReflectionAttribute;

class Router
{
    protected array $routes = [];

    public function registerRoutesFromControllerAttributes(array $controllers): void
    {
        foreach ($controllers as $controller) {
            $reflectionClass = new ReflectionClass($controller);

            foreach ($reflectionClass->getMethods() as $method) {
                $attributes = $method->getAttributes(
                    Route::class,
                    ReflectionAttribute::IS_INSTANCEOF
                );

                foreach ($attributes as $attribute) {
                    /** @var Route $route */
                    $route = $attribute->newInstance();

                    $this->routes[$route->method][$route->path] = [
                        $controller,
                        $method->getName()
                    ];
                }
            }
        }
    }

    public function getRoutes(): array
    {
        return $this->routes;
    }
}
```

---

## 9. Bootstrapping in `index.php`

```php
<?php

use App\Routing\Router;
use App\Controllers\HomeController;

$router = new Router();

$router->registerRoutesFromControllerAttributes([
    HomeController::class,
]);

echo '<pre>';
print_r($router->getRoutes());
echo '</pre>';
```

---

## 10. Supporting Multiple HTTP Methods via Inheritance

### Base Route Attribute

```php
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class Route
{
    public function __construct(
        public string $path,
        public string $method
    ) {}
}
```

---

### GET Attribute

```php
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class Get extends Route
{
    public function __construct(string $path)
    {
        parent::__construct($path, 'GET');
    }
}
```

### POST Attribute

```php
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class Post extends Route
{
    public function __construct(string $path)
    {
        parent::__construct($path, 'POST');
    }
}
```

### PUT Attribute

```php
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
class Put extends Route
{
    public function __construct(string $path)
    {
        parent::__construct($path, 'PUT');
    }
}
```

---

## 11. Using HTTP Method Attributes in Controllers

```php
use App\Attributes\Get;
use App\Attributes\Post;
use App\Attributes\Put;

class HomeController
{
    #[Get('/')]
    #[Get('/home')]
    public function index()
    {
        echo 'Home';
    }

    #[Post('/store')]
    public function store()
    {
        echo 'Store';
    }

    #[Put('/update')]
    public function update()
    {
        echo 'Update';
    }
}
```

---

## 12. Filtering Attributes by Inheritance

Without this flag, child attributes (`Get`, `Post`) will NOT be detected.

```php
$method->getAttributes(
    Route::class,
    ReflectionAttribute::IS_INSTANCEOF
);
```

---

## 13. Attribute Validation Timing

⚠️ **Important Rule**
Validation occurs **only when `newInstance()` is called**, not when attributes are declared.

### Example Invalid Usage

```php
#[Get('/test')]
public string $property;
```

❌ No error until:

```php
$attribute->newInstance();
```

---

## 14. Restricting Attribute Targets

```php
#[Attribute(Attribute::TARGET_METHOD)]
class Get extends Route
```

### Allowed Targets

* `TARGET_CLASS`
* `TARGET_METHOD`
* `TARGET_PROPERTY`
* `TARGET_FUNCTION`
* `TARGET_PARAMETER`
* `TARGET_CLASS_CONSTANT`

Targets are **bitmasks**, so combinations are allowed:

```php
Attribute::TARGET_CLASS | Attribute::TARGET_METHOD
```

---

## 15. Making Attributes Repeatable

By default, attributes can be used **only once per declaration**.

```php
#[Attribute(Attribute::TARGET_METHOD | Attribute::IS_REPEATABLE)]
```

Allows:

```php
#[Get('/')]
#[Get('/home')]
```

---

## 16. Positional vs Named Arguments

### Positional

```php
#[Route('/', 'GET')]
```

### Named (Recommended for clarity)

```php
#[Route(path: '/', method: 'GET')]
```

---

## 17. Multiple Different Attributes on One Method

Repeatable is **not required** when attributes are different:

```php
#[Get('/')]
#[Post('/')]
```

---

## 18. Built-in PHP Attributes

Some native attributes include:

* `#[Deprecated]`
* `#[JetBrains\PhpStorm\Pure]`

More built-in attributes may be added in future PHP versions.

---

## 19. Important Notes

* This router example is **educational**, not production-ready
* Missing features:

  * Route parameters
  * Middleware
  * Groups
  * Caching
* Use established routers (Symfony, Laravel) in production

---

## 20. Summary

✔ Attributes are a **modern, structured replacement for annotations**
✔ Fully validated and IDE-supported
✔ Reflection enables powerful runtime behavior
✔ Excellent for routing, ORM mapping, validation, and configuration

Attributes bring **clean, maintainable, and type-safe metadata** directly into PHP code.

---