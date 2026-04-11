# Building API Routes in Laravel (RESTful Approach)

This guide explains how to define and structure API routes in Laravel using REST principles. It covers:

* The `routes` directory structure
* Differences between `web.php` and `api.php`
* RESTful route conventions
* Defining routes with the `Route` facade
* Route parameters
* Dependency injection (`Request`)
* Implicit and explicit route model binding
* Testing API endpoints

---

## 1. Understanding Laravel’s Routes Directory

Inside the `routes/` folder, Laravel provides four primary files:

| File           | Purpose                                |
| -------------- | -------------------------------------- |
| `web.php`      | Routes returning HTML views            |
| `api.php`      | Routes returning JSON responses (APIs) |
| `channels.php` | WebSocket channel definitions          |
| `console.php`  | Artisan console command routes         |

---

## 2. Web Routes vs API Routes

### Web Routes (`routes/web.php`)

Used for routes that return HTML views.

Example:

```php
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});
```

* The `view()` helper loads Blade templates from `resources/views`.
* Blade is Laravel’s templating engine.

---

### API Routes (`routes/api.php`)

Used for routes that return JSON responses.

Important:

* All routes defined in `api.php` are automatically prefixed with `/api`.
* They use the `api` middleware group.

Example route URL:

```
http://localhost:8000/api/users
```

---

## 3. Middleware Groups for Web and API

Open:

```
app/Http/Kernel.php
```

Inside `$middlewareGroups`:

```php
protected $middlewareGroups = [
    'web' => [
        // Web middleware
    ],

    'api' => [
        \Illuminate\Routing\Middleware\SubstituteBindings::class,
    ],
];
```

Key Point:

* The `api` group includes `SubstituteBindings` middleware.
* This enables automatic route model binding.

---

# 4. REST Architecture Overview

When designing APIs, REST is the most common architecture.

### CRUD Operations

| HTTP Method | Action | Purpose        |
| ----------- | ------ | -------------- |
| GET         | Read   | Retrieve data  |
| POST        | Create | Store new data |
| PATCH/PUT   | Update | Modify data    |
| DELETE      | Delete | Remove data    |

---

## RESTful Route Convention (Example: User)

| Action          | Method | URI           |
| --------------- | ------ | ------------- |
| Get all users   | GET    | `/users`      |
| Get single user | GET    | `/users/{id}` |
| Create user     | POST   | `/users`      |
| Update user     | PATCH  | `/users/{id}` |
| Delete user     | DELETE | `/users/{id}` |

This pattern keeps APIs consistent and predictable.

---

# 5. Defining Basic API Routes

Open:

```
routes/api.php
```

---

## 5.1 GET All Users

```php
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return response()->json([
        'message' => 'List of users'
    ]);
});
```

Test:

```
php artisan serve
```

Visit:

```
http://localhost:8000/api/users
```

---

## 5.2 Injecting the Request Object

Laravel supports dependency injection.

```php
use Illuminate\Http\Request;

Route::get('/users', function (Request $request) {
    return response()->json([
        'method' => $request->method(),
        'headers' => $request->headers->all(),
        'query' => $request->query(),
    ]);
});
```

Laravel resolves `Request` automatically from the service container.

---

# 6. Route Parameters

To define a dynamic parameter:

```php
Route::get('/users/{id}', function ($id) {
    return response()->json([
        'id' => $id
    ]);
});
```

Example:

```
/api/users/5
```

Output:

```json
{
  "id": 5
}
```

---

### Important Rule

The parameter name must match:

```php
Route::get('/users/{id}', function ($id) {
```

If you change `{id}` to `{userId}`, you must change the function argument accordingly:

```php
Route::get('/users/{userId}', function ($userId) {
```

Otherwise, Laravel cannot bind it.

---

# 7. Implicit Route Model Binding

Laravel can automatically resolve models.

Instead of:

```php
Route::get('/users/{id}', function ($id) {
```

Use:

```php
use App\Models\User;

Route::get('/users/{user}', function (User $user) {
    return response()->json($user);
});
```

### How It Works

* `{user}` matches `User $user`
* Laravel automatically fetches:

```php
User::findOrFail($id)
```

This is powered by:

```
SubstituteBindings middleware
```

If no record exists, Laravel automatically returns a `404`.

---

## Binding Rule

The placeholder name must match the variable name:

```php
/users/{user}
```

```php
function (User $user)
```

Mismatch example (will fail):

```php
/users/{id}
function (User $user)
```

---

# 8. Explicit Route Binding

Explicit binding allows custom resolution logic.

---

## Step 1: Open RouteServiceProvider

```
app/Providers/RouteServiceProvider.php
```

Inside `boot()`:

```php
use Illuminate\Support\Facades\Route;
use App\Models\User;

public function boot()
{
    Route::bind('user', function ($value) {
        return User::where('id', $value)->firstOrFail();
    });
}
```

Now `{user}` will use your custom logic.

---

### Custom Example

```php
Route::bind('user', function ($value) {
    return [
        'custom_data' => '12345'
    ];
});
```

This replaces normal model resolution.

---

### Implicit vs Explicit Binding

| Type     | Setup Required | Flexibility        |
| -------- | -------------- | ------------------ |
| Implicit | None           | Standard lookup    |
| Explicit | Manual binding | Full customization |

Implicit binding is preferred in most APIs.

---

# 9. Defining POST, PATCH, DELETE Routes

Add remaining CRUD routes:

```php
Route::post('/users', function () {
    return response()->json([
        'message' => 'User created'
    ]);
});

Route::patch('/users/{id}', function ($id) {
    return response()->json([
        'message' => "User {$id} updated"
    ]);
});

Route::delete('/users/{id}', function ($id) {
    return response()->json([
        'message' => "User {$id} deleted"
    ]);
});
```

---

# 10. Testing API Routes

You can test using:

* Postman
* Insomnia
* cURL
* Browser (for GET)

Example POST request:

```
POST http://localhost:8000/api/users
```

Example PATCH:

```
PATCH http://localhost:8000/api/users/1
```

Example DELETE:

```
DELETE http://localhost:8000/api/users/1
```

---

# 11. Best Practice: Use Controllers Instead of Closures

Instead of defining logic inside routes:

```php
Route::get('/users', function () {});
```

Create a controller:

```bash
php artisan make:controller UserController
```

Then:

```php
use App\Http\Controllers\UserController;

Route::get('/users', [UserController::class, 'index']);
Route::get('/users/{user}', [UserController::class, 'show']);
Route::post('/users', [UserController::class, 'store']);
Route::patch('/users/{user}', [UserController::class, 'update']);
Route::delete('/users/{user}', [UserController::class, 'destroy']);
```

Even better:

```php
Route::apiResource('users', UserController::class);
```

This automatically generates all CRUD API routes.

---

# Final Key Notes & Best Practices

### 1. Route Organization

* Use `api.php` for JSON APIs.
* Use `web.php` for HTML responses.

### 2. Follow REST Conventions

* Use plural resource names.
* Keep URI structure consistent.

### 3. Prefer Controllers

* Avoid closures in production APIs.
* Keep routes clean and thin.

### 4. Use Route Model Binding

* Prefer implicit binding.
* Use explicit binding only when customization is required.

### 5. Validate Input

Always validate request data inside controllers using:

* `FormRequest`
* `$request->validate()`

### 6. Use Proper HTTP Status Codes

* 200 OK
* 201 Created
* 404 Not Found
* 422 Validation Error
* 204 No Content

### 7. Use `Route::apiResource`

This ensures consistency and reduces boilerplate.

### 8. Keep API Stateless

API routes use stateless middleware by default.

---

You now understand:

* How Laravel structures API routes
* How RESTful conventions map to Laravel routes
* How route parameters work
* How dependency injection works
* How implicit and explicit route model binding function

This forms the foundation for building scalable REST APIs in Laravel.
