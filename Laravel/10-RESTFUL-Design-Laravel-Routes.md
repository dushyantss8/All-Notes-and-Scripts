# Building API Routes in Laravel – 

## 1. Laravel Routes Folder Overview

Laravel organizes routes inside the `routes` directory, which contains four main files:

* **api.php** – For API routes that return JSON responses.
* **web.php** – For routes that return HTML views.
* **channels.php** – For WebSocket channels (real-time features like notifications and chat).
* **console.php** – For defining Artisan console commands.

### Key Difference:

* `web.php` → Routes for browser/web pages.
* `api.php` → Routes for API responses (JSON).

---

## 2. Web Routes Example (Returning Views)

In `web.php`, routes usually return HTML views:

```php
Route::get('/', function () {
    return view('welcome');
});
```

* `view('welcome')` loads `resources/views/welcome.blade.php`.
* Blade is Laravel’s templating engine that allows:

  * Embedding PHP in HTML
  * Conditional rendering
  * Loops and components

---

## 3. API Routes vs Web Routes (Middleware Difference)

Laravel applies different middleware groups:

* **Web routes** → `web` middleware group
* **API routes** → `api` middleware group

These are defined in:

```
app/Http/Kernel.php
```

Each group processes requests differently (sessions, CSRF, stateless design, etc).

---

## 4. RESTful Architecture Basics

Laravel API design typically follows **REST architecture**.

REST uses standard HTTP methods mapped to CRUD operations:

| HTTP Method | Operation | Purpose      |
| ----------- | --------- | ------------ |
| GET         | Read      | Fetch data   |
| POST        | Create    | Add new data |
| PATCH/PUT   | Update    | Modify data  |
| DELETE      | Delete    | Remove data  |

This is called **CRUD**:

* Create
* Read
* Update
* Delete

---

## 5. Standard REST Route Convention (User Example)

For a `User` model:

| Action          | Method | URL         |
| --------------- | ------ | ----------- |
| Get all users   | GET    | /users      |
| Get single user | GET    | /users/{id} |
| Create user     | POST   | /users      |
| Update user     | PATCH  | /users/{id} |
| Delete user     | DELETE | /users/{id} |

---

## 6. Defining API Routes in Laravel

### 6.1 Get All Users

```php
use Illuminate\Support\Facades\Route;

Route::get('/users', function () {
    return response()->json([
        'message' => 'List of users'
    ]);
});
```

Laravel automatically prefixes `/api`:

```
http://localhost:8000/api/users
```

---

### 6.2 Injecting Request Object

Laravel supports automatic dependency injection:

```php
use Illuminate\Http\Request;

Route::get('/users', function (Request $request) {
    return response()->json($request->all());
});
```

This gives access to:

* Headers
* Query params
* Method
* Cookies
* Body data

---

## 7. Dynamic Route Parameters

### Get Specific User

```php
Route::get('/users/{id}', function ($id) {
    return response()->json([
        'user_id' => $id
    ]);
});
```

* `{id}` is a dynamic parameter
* Must match variable name in function

✅ Works for:

* `/users/1`
* `/users/abc`

---

## 8. Implicit Route Model Binding

Laravel can automatically convert `{id}` into a `User` model.

```php
use App\Models\User;

Route::get('/users/{user}', function (User $user) {
    return response()->json($user);
});
```

Laravel automatically:

1. Takes `{user}` from URL
2. Finds matching record
3. Injects the model

### Important Rule:

Placeholder name must match argument name.

✅ Correct:

```php
/users/{user}
function (User $user)
```

❌ Incorrect:

```php
/users/{id}
function (User $user) // Will fail
```

This magic is powered by:

```
SubstituteBindings Middleware
```

Located in:

```
app/Http/Middleware/SubstituteBindings.php
```

---

## 9. Explicit Route Binding

Allows custom logic for resolving route parameters.

Defined in:

```
app/Providers/RouteServiceProvider.php
```

### Example:

```php
use Illuminate\Support\Facades\Route;

Route::bind('user', function ($value) {
    return "Custom Value: " . $value;
});
```

Route:

```php
Route::get('/users/{user}', function ($user) {
    return $user;
});
```

Visiting:

```
/users/1
```

Returns:

```
Custom Value: 1
```

✅ Gives full control over parameter resolution.

---

## 10. Defining Full CRUD API Routes

```php
Route::get('/users', function () {
    return response()->json(['message' => 'Get all users']);
});

Route::get('/users/{id}', function ($id) {
    return response()->json(['user' => $id]);
});

Route::post('/users', function () {
    return response()->json(['message' => 'User created']);
});

Route::patch('/users/{id}', function ($id) {
    return response()->json(['message' => "User $id updated"]);
});

Route::delete('/users/{id}', function ($id) {
    return response()->json(['message' => "User $id deleted"]);
});
```

---

## 11. Testing API Endpoints

You can test with:

* Postman
* Insomnia
* Curl

### Example Postman Test:

```
POST http://localhost:8000/api/users
```

Response:

```json
{
  "message": "User created"
}
```

---

## 12. Key Takeaways

✅ API routes return JSON
✅ Web routes return HTML
✅ Define:

* API routes → `routes/api.php`
* Web routes → `routes/web.php`

✅ Laravel makes routing powerful via:

* Implicit Route Binding
* Explicit Route Binding
* Automatic Dependency Injection
* REST conventions

✅ Middleware `SubstituteBindings` enables automatic model resolution.

---

## Final Concept Map

```
Client Request
      ↓
Middleware
      ↓
Router
      ↓
Controller/Closure
      ↓
JSON Response
```

---

## Conclusion

This lesson explains how Laravel simplifies API creation using:

* REST principles
* Route conventions
* Model binding
* Middleware automation

Laravel’s routing system allows you to create clean, predictable, and scalable APIs with minimal effort and high maintainability.