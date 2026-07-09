# 2 – Laravel Routing

## Overview

In this lesson, the focus is on **Routing**, which is one of the most fundamental concepts in Laravel.

A **route** determines **what should happen when a user visits a particular URL**. It maps a URL (such as `/`, `/about`, or `/contact`) to a specific piece of code that generates a response.

---

# Laravel Project Structure

After creating a new Laravel project, you'll notice many folders.

```
app/
bootstrap/
config/
database/
public/
resources/
routes/
storage/
tests/
vendor/
```

At first glance, this may look overwhelming.

However, **you do not need to learn every folder immediately.**

The best approach is:

* Learn one part of Laravel at a time.
* Ignore the rest until you actually need them.
* Gradually build understanding as the course progresses.

---

# Running the Laravel Project

If using **Laravel Herd**, you can access the project directly:

```
http://example.tests
```

If you are not using Herd, Laravel provides a built-in development server.

Run:

```bash
php artisan serve
```

This command starts a local development server.

Example output:

```
Starting Laravel development server...
http://127.0.0.1:8000
```

You can then open the provided URL in your browser.

---

# The Routes Directory

The first place to look is:

```
routes/
    web.php
```

This file contains routes for the web application.

---

# Default Route

Laravel creates the following route by default:

```php
Route::get('/', function () {
    return view('welcome');
});
```

---

## Breaking It Down

### `Route::get()`

Registers a route that responds to an **HTTP GET request**.

A GET request occurs when a user simply visits a URL in their browser.

Example:

```
GET /
```

means:

```
Visit the homepage
```

---

### `'/'`

Represents the homepage.

Examples:

```
/
```

Homepage

```
/about
```

About page

```
/contact
```

Contact page

---

### Anonymous Function (Closure)

```php
function () {

}
```

This function executes whenever the route is accessed.

---

### Returning a View

```php
return view('welcome');
```

This tells Laravel:

> Load and display the **welcome** view.

---

# Where Is the Welcome View?

Laravel automatically searches inside:

```
resources/
    views/
```

Here you'll find:

```
welcome.blade.php
```

Notice the extensio:

```
.blade.php
```

instead of

```
.php
```

---

# What is Blade?

Blade is Laravel's **templating engine**.

It is essentially PHP with additional Laravel features that make writing templates easier.

For now, simply remember:

```
Blade = Laravel's template engine
```

---

# Modifying the Homepage

Inside:

```
resources/views/welcome.blade.php
```

Replace everything inside the `<body>` tag with:

```html
Hello World
```

Refresh the browser.

Output:

```
Hello World
```

This proves the route is successfully loading the view.

---

# What You Have Learned So Far

The request flow is:

```
Browser
      ↓
Route
      ↓
View
      ↓
HTML
      ↓
Browser
```

---

Or more visually:

```
example.test
       │
       ▼
routes/web.php
       │
       ▼
view('welcome')
       │
       ▼
resources/views/welcome.blade.php
       │
       ▼
Rendered HTML
```

---

# Creating a New Route

Suppose you want an About page.

Add another route.

```php
Route::get('/about', function () {
    return 'About Page';
});
```

Visit:

```
http://example.test/about
```

Output:

```
About Page
```

---

# Returning a String

A route does not have to return a view.

It can return a simple string.

Example:

```php
Route::get('/about', function () {
    return 'About Page';
});
```

Response:

```
About Page
```

This is useful for:

* Quick testing
* Debugging
* Temporary routes

---

# Returning an Array

Laravel can also return arrays.

Example:

```php
Route::get('/about', function () {
    return [
        'foo' => 'bar'
    ];
});
```

Browser output:

```json
{
    "foo": "bar"
}
```

---

## Why Does This Happen?

Laravel automatically converts arrays into **JSON** responses.

This behavior is commonly used when building:

* REST APIs
* AJAX endpoints
* Backend services

---

# Returning Another View

Instead of returning a string:

```php
return 'About Page';
```

Return a view:

```php
return view('about');
```

Now Laravel looks for:

```
resources/views/about.php
```

---

# Creating the About View

Create:

```
resources/views/about.php
```

Add simple HTML:

```html
<!DOCTYPE html>
<html>
<head>
    <title>About</title>
</head>
<body>

<h1>About Page</h1>

<p>Hello from the About Page.</p>

</body>
</html>
```

Refresh:

```
http://example.test/about
```

Output:

```
About Page

Hello from the About Page.
```

---

# Why Was `.php` Used Instead of `.blade.php`?

The instructor intentionally created:

```
about.php
```

instead of

```
about.blade.php
```

---

# Current Application Structure

At this point, the project contains two routes.

### Homepage

```php
Route::get('/', function () {
    return view('welcome');
});
```

Loads:

```
resources/views/welcome.blade.php
```

---

### About Page

```php
Route::get('/about', function () {
    return view('about');
});
```

Loads:

```
resources/views/about.php
```

---

# Request Flow Example

### User visits:

```
example.test/about
```

Flow:

```
Browser
      │
      ▼
GET /about
      │
      ▼
routes/web.php
      │
      ▼
Route::get('/about')
      │
      ▼
view('about')
      │
      ▼
resources/views/about.php
      │
      ▼
HTML Response
      │
      ▼
Browser
```

---

# Key Concepts Learned

## 1. Routes

Routes define what happens when a user visits a URL.

Example:

```php
Route::get('/about', function () {

});
```

---

## 2. GET Request

A GET request is generated when a user visits a page in the browser.

Example:

```
GET /
GET /about
GET /contact
```

---

## 3. Closures

Routes can execute anonymous functions (closures).

Example:

```php
function () {

}
```

---

## 4. Views

Views contain the HTML displayed to users.

Usually stored inside:

```
resources/views/
```

---

## 5. Blade

Laravel's templating engine.

Typical file:

```
welcome.blade.php
```

---

## 6. Route Responses

Laravel routes can return different response types:

### String

```php
return "Hello";
```

Output:

```
Hello
```

---

### Array

```php
return [
    'name' => 'Laravel'
];
```

Output:

```json
{
    "name": "Laravel"
}
```

---

### View

```php
return view('welcome');
```

Output:

Rendered HTML page.

---

# Homework

Create a **Contact** page.

### Step 1 – Add a Route

```php
Route::get('/contact', function () {
    return view('contact');
});
```

---

### Step 2 – Create the View

Create:

```
resources/views/contact.php
```

Example:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Contact</title>
</head>
<body>

<h1>Contact Page</h1>

<p>Hello from the Contact Page.</p>

</body>
</html>
```

---

### Step 3 – Visit

```
http://example.test/contact
```

Expected output:

```
Contact Page

Hello from the Contact Page.
```

---

# Summary

By the end of this lesson, you should understand:

* Laravel applications handle incoming URLs using **routes**.
* Routes for web pages are defined in `routes/web.php`.
* `Route::get()` responds to HTTP GET requests.
* A route can return:

  * A string
  * An array (automatically converted to JSON)
  * A view
* Views are stored in `resources/views/`.
* Blade (`.blade.php`) is Laravel's templating engine, though plain PHP views also work.
* The request lifecycle follows the pattern:

```
Browser Request
      ↓
Route (routes/web.php)
      ↓
Controller/Closure
      ↓
View
      ↓
HTML Response
      ↓
Browser
```
