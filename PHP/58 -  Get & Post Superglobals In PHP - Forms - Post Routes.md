# PHP Request Handling and Routing: -

## 1. Understanding HTTP Request Types (GET vs. POST)

### 1.1 GET Requests

* A GET request is used for retrieving or viewing data.
* Any data sent with a GET request appears in the URL as a **query string**.
* Example:

  ```
  http://example.com?page=home&foo=bar&amount=10
  ```
* Browsers and tools append query parameters when performing searches or applying filters.
* GET is appropriate when:

  * Performing searches or filtering.
  * Fetching user profiles via user IDs.
  * Displaying invoices via invoice IDs.
  * URLs should be bookmarkable.

### 1.2 POST Requests

* A POST request is used for creating or modifying data.
* POST data is sent in the **request body**, not visible in the URL.
* Appropriate for:

  * User login forms.
  * Payment/checkout forms.
  * Creating or updating resources.

---

## 2. Accessing Request Data in PHP

### 2.1 Superglobals

PHP provides several superglobals for interacting with request data:

| Superglobal | Description                                      |
| ----------- | ------------------------------------------------ |
| `$_GET`     | Contains query string parameters.                |
| `$_POST`    | Contains body parameters from POST requests.     |
| `$_REQUEST` | Contains merged data from GET, POST, and COOKIE. |

### 2.2 Basic Inspection Example

```php
echo '<pre>';
var_dump($_GET);
var_dump($_POST);
echo '</pre>';
```

* When a GET request is made, `$_POST` is empty.
* GET parameters appear in `$_GET` as an associative array.

---

## 3. Creating a Simple POST Form

### 3.1 Creating an HTML Form

To submit POST data, create a form with `method="POST"`:

```php
return '
    <form action="/home" method="POST">
        <label for="amount">Amount</label>
        <input type="text" name="amount">
    </form>
';
```

### 3.2 Behavior

* Submitting the form populates `$_POST['amount']`.
* Query string parameters can still be added manually to the URL.
* When both GET and POST have the same key:

  * `$_POST` takes precedence inside `$_REQUEST`.

### 3.3 Caution Using `$_REQUEST`

* `$_REQUEST` merges GET, POST, and COOKIE based on PHP configuration:

  * `request_order`
  * `variables_order`
* Using `$_REQUEST` may lead to unexpected behavior when identical keys exist.
* Recommended: Prefer `$_GET` and `$_POST` directly.

---

## 4. Enhancing the Router to Support POST Requests

The existing router supports only GET. The tutorial adds POST routing and method-specific logic.

### 4.1 Adding Separate GET and POST Route Registration

#### New method signatures:

```php
public function get($route, $action) { ... }
public function post($route, $action) { ... }
```

Both internally call a modified `register()` that now accepts `requestMethod`:

```php
public function register($requestMethod, $route, $action)
{
    $this->routes[$requestMethod][$route] = $action;
}
```

### 4.2 Updating Route Lookup

Originally routes were stored as:

```
routes['/invoices/create'] = [...]
```

Now they must be retrieved by HTTP method:

```
routes['get']['/invoices/create']
routes['post']['/invoices/create']
```

Update route resolution:

```php
$method = strtolower($_SERVER['REQUEST_METHOD']);
$action = $router->routes()[$method][$route] ?? null;
```

### 4.3 Implementing the POST Handler in the Invoice Controller

#### GET → Render form

```php
public function create()
{
    return '
        <form action="/invoices/create" method="POST">
            <label>Amount</label>
            <input name="amount" />
        </form>
    ';
}
```

#### POST → Process submission

```php
public function store()
{
    var_dump($_POST['amount']);
}
```

### 4.4 Updated Routing Registration

```php
$router->get('/invoices/create', [Invoice::class, 'create']);
$router->post('/invoices/create', [Invoice::class, 'store']);
```

### 4.5 Result

* Visiting `/invoices/create` loads the form (GET).
* Submitting the form triggers the `store()` method (POST).

---

## 5. Extending Routing to Additional HTTP Methods

The same pattern can support:

* PUT
* DELETE
* PATCH

You simply add corresponding wrapper methods and register them through the router.

---

## 6. Notes for Production-Level Architecture

* Directly returning HTML from classes is not recommended.
* In an MVC architecture:

  * Controllers call views.
  * HTML templates are rendered separately.

---

# End of Tutorial