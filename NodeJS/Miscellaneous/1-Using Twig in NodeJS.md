## 1. What is Twig in the Node.js Ecosystem?

Twig is a **logic-less, secure, and readable templating engine** originally created for PHP (Symfony), but it is also available for Node.js via the **`twig` npm package**.

Key characteristics:

* Clean and expressive syntax
* Automatic HTML escaping
* Template inheritance (`extends`, `block`)
* Filters, functions, macros
* Very similar to Laravel Blade / Jinja2

---

## 2. When Should You Use Twig in Node.js?

Twig is a good choice if:

* You come from **PHP / Symfony / Laravel**
* You prefer **server-side rendering (SSR)**
* You want **strong template inheritance**
* You don’t need JSX or React-based rendering

If you need component-driven UI, React/Next.js may be better.

---

## 3. Project Setup

### 3.1 Initialize Node.js Project

```bash
mkdir twig-node-app
cd twig-node-app
npm init -y
```

### 3.2 Install Dependencies

```bash
npm install express twig
```

---

## 4. Basic Express + Twig Configuration

### 4.1 Project Structure

```
twig-node-app/
│
├── app.js
├── package.json
└── views/
    ├── layout.twig
    └── home.twig
```

---

### 4.2 Configure Express to Use Twig

**app.js**

```js
const express = require('express');
const path = require('path');
const twig = require('twig');

const app = express();

// Register Twig as view engine
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));

// Optional: Disable Twig cache in development
twig.cache(false);

// Route
app.get('/', (req, res) => {
  res.render('home', {
    title: 'Twig with Node.js',
    user: 'Peter Parker'
  });
});

// Server
app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

---

## 5. Creating Twig Templates

### 5.1 Base Layout (Template Inheritance)

**views/layout.twig**

```twig
<!DOCTYPE html>
<html>
<head>
    <title>{{ title }}</title>
</head>
<body>

<header>
    <h1>My Node.js App</h1>
</header>

<main>
    {% block content %}{% endblock %}
</main>

<footer>
    <p>© 2026</p>
</footer>

</body>
</html>
```

---

### 5.2 Child Template

**views/home.twig**

```twig
{% extends "layout.twig" %}

{% block content %}
    <h2>Welcome {{ user }}</h2>
    <p>This page is rendered using Twig in Node.js.</p>
{% endblock %}
```

---

## 6. Passing Data to Twig

In Express:

```js
res.render('home', {
  title: 'Dashboard',
  user: 'Admin',
  isLoggedIn: true,
  items: ['Apple', 'Banana', 'Orange']
});
```

In Twig:

```twig
{% if isLoggedIn %}
    <p>User is logged in</p>
{% endif %}

<ul>
{% for item in items %}
    <li>{{ item }}</li>
{% endfor %}
</ul>
```

---

## 7. Common Twig Syntax Cheatsheet

### Variables

```twig
{{ name }}
```

### Conditions

```twig
{% if age >= 18 %}
  Adult
{% else %}
  Minor
{% endif %}
```

### Loops

```twig
{% for user in users %}
  {{ user.name }}
{% endfor %}
```

### Filters

```twig
{{ username|upper }}
{{ description|length }}
```

### Include Partial Templates

```twig
{% include "partials/header.twig" %}
```

---

## 8. Using Static Assets (CSS, JS)

### Express Configuration

```js
app.use(express.static(path.join(__dirname, 'public')));
```

### Folder Structure

```
public/
 ├── css/style.css
 └── js/app.js
```

### Use in Twig

```twig
<link rel="stylesheet" href="/css/style.css">
<script src="/js/app.js"></script>
```

---

## 9. Registering Custom Twig Functions / Filters

### Custom Filter Example

```js
twig.extendFilter('currency', function (value) {
  return '₹' + value;
});
```

Usage:

```twig
{{ price|currency }}
```

---

## 10. Enable Production Cache (Important)

```js
twig.cache(true);
```

Do **not** disable cache in production.

---

## 11. Advantages vs Alternatives

| Engine     | Pros                              | Cons                   |
| ---------- | --------------------------------- | ---------------------- |
| Twig       | Clean syntax, inheritance, secure | Smaller Node ecosystem |
| EJS        | Simple JS syntax                  | No layout system       |
| Pug        | Compact                           | Hard to read           |
| Handlebars | Logic-less                        | Limited flexibility    |

---

## 12. Summary

* Twig works well with **Express.js**
* Ideal for **SSR-based Node apps**
* Strong layout and inheritance support
* Excellent choice if you have **PHP/Laravel/Symfony background**

---