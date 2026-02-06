# PHPUnit Basics: Writing Unit Tests in PHP

This tutorial explains how to install, configure, and use **PHPUnit** to write unit tests in PHP. It walks through setting up PHPUnit, organizing tests, configuring test suites, and writing real unit tests for a simple Router class.

---

## 1. Installing PHPUnit with Composer

PHPUnit is installed as a **development dependency**.

```bash
composer require --dev phpunit/phpunit
```

### Verify Installation

Check `composer.json`:

```json
{
    "require-dev": {
        "phpunit/phpunit": "^10.0"
    }
}
```

---

## 2. Running PHPUnit

The PHPUnit executable is located in:

```bash
vendor/bin/phpunit
```

Run PHPUnit directly:

```bash
vendor/bin/phpunit
```

You can also run:

* A specific file
* A directory
* Filtered tests

Example:

```bash
vendor/bin/phpunit --filter test_it_registers_a_route
```

---

## 3. Organizing Test Files

A common directory structure:

```
/tests
  /Unit
    RouterTest.php
```

This keeps **unit tests isolated** and allows future expansion (integration, feature tests).

---

## 4. Creating PHPUnit Configuration (`phpunit.xml`)

Create `phpunit.xml` in the project root.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit
    colors="true"
    bootstrap="vendor/autoload.php"
>
    <testsuites>
        <testsuite name="Unit Tests">
            <directory>tests/Unit</directory>
        </testsuite>
    </testsuites>
</phpunit>
```

### Key Options

* **colors="true"** → colored output
* **bootstrap** → loads autoloader before tests
* **testsuites** → defines test directories

Run PHPUnit without arguments to execute all configured suites.

---

## 5. Router Class (Code Under Test)

Example Router class:

```php
class Router
{
    protected array $routes = [];

    public function get(string $uri, callable|array $action): void
    {
        $this->register('GET', $uri, $action);
    }

    public function post(string $uri, callable|array $action): void
    {
        $this->register('POST', $uri, $action);
    }

    protected function register(string $method, string $uri, callable|array $action): void
    {
        $this->routes[$method][$uri] = $action;
    }

    public function routes(): array
    {
        return $this->routes;
    }

    public function resolve(string $uri, string $method)
    {
        $action = $this->routes[$method][$uri] ?? null;

        if (!$action) {
            throw new RouteNotFoundException();
        }

        if (is_callable($action)) {
            return call_user_func($action);
        }

        [$class, $method] = $action;

        if (!class_exists($class) || !method_exists($class, $method)) {
            throw new RouteNotFoundException();
        }

        return (new $class())->$method();
    }
}
```

---

## 6. Creating a Test Class

```php
use PHPUnit\Framework\TestCase;

class RouterTest extends TestCase
{
}
```

Test classes **extend `TestCase`**.

---

## 7. Writing Your First Test

### Test: Route Registration

```php
/** @test */
public function it_registers_a_route()
{
    $router = new Router();

    $router->get('users', ['UsersController', 'index']);

    $expected = [
        'GET' => [
            'users' => ['UsersController', 'index']
        ]
    ];

    $this->assertSame($expected, $router->routes());
}
```

### Key Notes

* Test methods can use:

  * `@test` annotation **or**
  * `test` prefix
* Descriptive test names are encouraged

---

## 8. Testing GET and POST Routes Separately

### GET Route Test

```php
/** @test */
public function it_registers_a_get_route()
{
    $router = new Router();

    $router->get('users', ['UsersController', 'index']);

    $this->assertSame(
        ['GET' => ['users' => ['UsersController', 'index']]],
        $router->routes()
    );
}
```

### POST Route Test

```php
/** @test */
public function it_registers_a_post_route()
{
    $router = new Router();

    $router->post('users', ['UsersController', 'store']);

    $this->assertSame(
        ['POST' => ['users' => ['UsersController', 'store']]],
        $router->routes()
    );
}
```

---

## 9. Testing Initial State

```php
/** @test */
public function there_are_no_routes_when_router_is_created()
{
    $router = new Router();

    $this->assertEmpty($router->routes());
}
```

### Bug Found via Testing

If `$routes` is not initialized, this test fails—highlighting a real defect.

Fix:

```php
protected array $routes = [];
```

---

## 10. Using `setUp()` for Shared Initialization

```php
protected Router $router;

protected function setUp(): void
{
    $this->router = new Router();
}
```

Now reuse:

```php
$this->router->get(...);
```

Avoids repetitive setup code.

---

## 11. Testing Exceptions with Data Providers

### Test: Route Not Found Exception

```php
/**
 * @test
 * @dataProvider route_not_found_cases
 */
public function it_throws_route_not_found_exception(string $uri, string $method)
{
    $this->router->get('users', ['Users', 'index']);
    $this->router->post('users', ['Users', 'store']);

    $this->expectException(RouteNotFoundException::class);

    $this->router->resolve($uri, $method);
}
```

### Data Provider

```php
public function route_not_found_cases(): array
{
    return [
        ['users', 'PUT'],
        ['invoices', 'POST'],
        ['users', 'GET'],   // class does not exist
        ['users', 'POST'],  // method does not exist
    ];
}
```

Each dataset is treated as a **separate test**.

---

## 12. Anonymous Classes for Isolated Testing

```php
$users = new class {
    public function delete()
    {
        return true;
    }
};

$this->router->post('users', [$users::class, 'store']);
```

This avoids dependency on real controllers.

---

## 13. External Data Providers

Create:

```
tests/DataProviders/RouterDataProvider.php
```

```php
namespace Tests\DataProviders;

class RouterDataProvider
{
    public static function routeNotFoundCases(): array
    {
        return [
            ['users', 'PUT'],
            ['invoices', 'POST'],
        ];
    }
}
```

Use it:

```php
/**
 * @dataProvider Tests\DataProviders\RouterDataProvider::routeNotFoundCases
 */
```

### Enable Autoloading

Update `composer.json`:

```json
"autoload-dev": {
    "psr-4": {
        "Tests\\": "tests/"
    }
}
```

Run:

```bash
composer dump-autoload
```

---

## 14. Testing Successful Route Resolution

### Resolving a Closure

```php
/** @test */
public function it_resolves_route_from_closure()
{
    $this->router->get('users', fn () => [1, 2, 3]);

    $this->assertSame(
        [1, 2, 3],
        $this->router->resolve('users', 'GET')
    );
}
```

---

### Resolving a Class Method

```php
/** @test */
public function it_resolves_route_from_class_method()
{
    $users = new class {
        public function index()
        {
            return [1, 2, 3];
        }
    };

    $this->router->get('users', [$users::class, 'index']);

    $this->assertSame(
        [1, 2, 3],
        $this->router->resolve('users', 'GET')
    );
}
```

---

## 15. `assertEquals` vs `assertSame`

### `assertEquals`

* Uses **loose comparison**
* Can produce **false positives**

```php
$this->assertEquals(0, false); // PASS ❌
```

### `assertSame` (Recommended)

* Uses **strict comparison**
* Checks **value + type**

```php
$this->assertSame(0, false); // FAIL ✅
```

**Best Practice:**
Use `assertSame()` unless you explicitly want loose comparison.

---

## 16. Final Test Result

```bash
vendor/bin/phpunit
```

Output:

```
OK (10 tests, 10 assertions)
```

---

## Summary

This lesson covered:

* Installing PHPUnit
* Configuring test suites
* Writing unit tests
* Using setup/teardown
* Testing exceptions
* Data providers
* Anonymous classes
* Strict assertions (`assertSame`)
* Real-world test-driven refactoring

---