# MVC Architecture in Web Development –

## 1. Introduction to MVC

**MVC (Model–View–Controller)** is a software architectural pattern used to organize application code into structured, logical components. It promotes separation of concerns, improves maintainability, and enables scalable application development.

Modern frameworks such as:

* Laravel
* Express.js
* Ruby on Rails

are based on the MVC pattern.

Without architecture, applications quickly become difficult to maintain. MVC ensures:

* Logical separation of responsibilities
* Predictable project structure
* Easier debugging
* Better team collaboration

---

# 2. Core Components of MVC

MVC consists of three primary components:

1. **Model**
2. **View**
3. **Controller**

Each component has a specific responsibility.

---

# 3. Model

## 3.1 What is a Model?

A **Model** represents data and business entities in the application.

Examples in an e-commerce system:

* `User`
* `Product`
* `Order`
* `Transaction`

Each model typically corresponds to a **database table**.

---

## 3.2 Model Responsibilities

* Define data structure
* Interact with the database
* Enforce data rules
* Represent business entities

---

## 3.3 ORM (Object-Relational Mapping)

Most MVC frameworks use an ORM to interact with databases.

ORM maps:

```
Database Table  →  Programming Object
```

Instead of writing raw SQL:

```sql
SELECT * FROM users WHERE email = 'john@example.com';
```

We use ORM methods:

```php
$user = User::where('email', 'john@example.com')->first();
```

---

## 3.4 Example: Model in Laravel

```php
// app/Models/User.php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class User extends Model
{
    protected $fillable = [
        'name',
        'email',
        'password'
    ];
}
```

This model maps to the `users` table.

---

## 3.5 Example: Model in Express (Using Sequelize ORM)

```javascript
// models/User.js

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  name: DataTypes.STRING,
  email: DataTypes.STRING,
  password: DataTypes.STRING
});

module.exports = User;
```

---

# 4. View

## 4.1 What is a View?

A **View** is responsible for presenting data to the user.

In web applications, views are typically:

* HTML pages
* Templates rendered with dynamic data

---

## 4.2 Templating Engines

Views are usually handled using templating engines:

* Blade (Laravel)
* EJS (Express)
* ERB (Rails)

They allow dynamic data rendering:

```html
<h1>Welcome, {{ $user->name }}</h1>
```

---

## 4.3 Example: Blade View (Laravel)

```php
<!-- resources/views/profile.blade.php -->

<!DOCTYPE html>
<html>
<head>
    <title>User Profile</title>
</head>
<body>
    <h1>Welcome, {{ $user->name }}</h1>
    <p>Email: {{ $user->email }}</p>
</body>
</html>
```

---

## 4.4 Example: EJS View (Express)

```html
<!-- views/profile.ejs -->

<h1>Welcome, <%= user.name %></h1>
<p>Email: <%= user.email %></p>
```

---

# 5. Controller

## 5.1 What is a Controller?

The **Controller** acts as the intermediary between Model and View.

It:

* Receives HTTP requests
* Processes input
* Interacts with models
* Returns HTTP responses

---

## 5.2 Controller Responsibilities

* Handle business logic
* Validate requests
* Fetch or update models
* Load appropriate views
* Return JSON or HTML responses

---

## 5.3 Example: Laravel Controller

```php
// app/Http/Controllers/UserController.php

namespace App\Http\Controllers;

use App\Models\User;

class UserController extends Controller
{
    public function show($id)
    {
        $user = User::findOrFail($id);

        return view('profile', compact('user'));
    }
}
```

---

## 5.4 Example: Express Controller

```javascript
// controllers/userController.js

const User = require('../models/User');

exports.show = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  res.render('profile', { user });
};
```

---

# 6. Router

## 6.1 What is a Router?

The **Router** maps incoming HTTP requests to specific controllers.

Example routes:

```
GET /login
GET /profile/1
POST /register
```

---

## 6.2 Laravel Routing Example

```php
// routes/web.php

use App\Http\Controllers\UserController;

Route::get('/profile/{id}', [UserController::class, 'show']);
```

---

## 6.3 Express Routing Example

```javascript
// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/profile/:id', userController.show);

module.exports = router;
```

---

# 7. Middleware

## 7.1 What is Middleware?

Middleware is a function that runs **before the request reaches the controller**.

It is commonly used for:

* Authentication
* Authorization
* Logging
* Rate limiting
* Security checks

---

## 7.2 Authentication Middleware Example (Laravel)

```php
Route::get('/dashboard', function () {
    return view('dashboard');
})->middleware('auth');
```

---

## 7.3 Authentication Middleware Example (Express)

```javascript
// middleware/auth.js

module.exports = function(req, res, next) {
  if (!req.session.user) {
    return res.redirect('/login');
  }
  next();
};
```

Usage:

```javascript
router.get('/dashboard', authMiddleware, dashboardController);
```

---

## 7.4 Rate Limiting Example

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 60
});

app.use(limiter);
```

This limits requests to 60 per minute per IP.

---

# 8. Services

## 8.1 What are Services?

Services contain reusable business logic that does not belong directly inside controllers.

Examples:

* Email service
* SMS service
* Payment gateway integration
* Logging service

---

## 8.2 Example: Email Service (Laravel)

```php
// app/Services/MailService.php

namespace App\Services;

use Illuminate\Support\Facades\Mail;

class MailService
{
    public function sendLoginNotification($user)
    {
        Mail::to($user->email)->send(new LoginNotification($user));
    }
}
```

Controller usage:

```php
$mailService->sendLoginNotification($user);
```

---

## 8.3 Example: Email Service (Express)

```javascript
// services/mailService.js

const nodemailer = require('nodemailer');

exports.sendLoginNotification = async (user) => {
  // mail configuration logic
};
```

---

# 9. Complete MVC Request Flow

Below is the full lifecycle of a request in an MVC application:

## Step 1: Browser Sends HTTP Request

```
GET /login
```

## Step 2: Middleware Executes

* Check authentication
* Check rate limit
* Validate request headers

## Step 3: Router Matches Route

```
/login → LoginController
```

## Step 4: Controller Executes

* Validate input
* Query database via Model
* Call services (if needed)
* Prepare response

## Step 5: View is Rendered

HTML page generated using template engine.

## Step 6: HTTP Response Returned to Browser

---

# 10. Practical Example: Login Flow

### Controller (Laravel)

```php
public function login(Request $request)
{
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
        return redirect()->route('dashboard');
    }

    return back()->withErrors(['Invalid credentials']);
}
```

---

# 11. Key Notes & Best Practices

## Architecture Principles

* Enforce strict separation of concerns.
* Keep controllers thin.
* Move reusable logic to services.
* Avoid database queries inside views.

---

## Model Best Practices

* Use ORM for abstraction.
* Define fillable/guarded properties properly.
* Avoid business logic inside models unless necessary.

---

## Controller Best Practices

* Validate all user input.
* Avoid heavy logic in controllers.
* Delegate complex logic to services.

---

## Middleware Best Practices

* Use middleware for cross-cutting concerns.
* Do not duplicate logic in controllers.
* Apply middleware selectively.

---

## Security Considerations

* Always validate and sanitize input.
* Use authentication middleware.
* Implement rate limiting.
* Protect against SQL injection (ORM helps).
* Hash passwords properly.

---

## Performance Considerations

* Use eager loading in ORM.
* Cache heavy queries.
* Avoid N+1 query problems.

---

## Team Development Advantages

* Clear file structure
* Predictable debugging paths
* Easier onboarding of new developers
* Better maintainability at scale

---

# Conclusion

MVC is a foundational architectural pattern in modern web development. It structures applications into:

* **Model** → Data & database interaction
* **View** → Presentation layer
* **Controller** → Application logic
* **Router** → Request mapping
* **Middleware** → Pre-processing logic
* **Services** → Reusable business functionality

When implemented correctly, MVC leads to:

* Cleaner codebase
* Higher maintainability
* Improved scalability
* Better team collaboration

This architecture remains a standard in professional backend and full-stack development environments.
