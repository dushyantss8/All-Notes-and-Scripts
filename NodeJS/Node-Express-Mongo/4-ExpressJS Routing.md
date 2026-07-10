# Express.js Routing (Comprehensive Study Notes)

## How to Use This Document

This guide is designed for:

- Beginners learning Express.js after installation
- Developers building REST APIs and web apps
- Interview candidates preparing for routing questions

**Recommended learning flow:**

1. Read Sections 1–4 for routing and HTTP fundamentals.
2. Practice Sections 5–9 with a running Express server.
3. Master Sections 10–11 (`req.params` vs `req.query`).
4. Review the interview Q&A and practice checklist at the end.

---

## 1. Introduction to Routing in Express.js

Routing is one of the core concepts in Express.js.
In simple terms, a **route represents a URL**. When a user visits a URL, Express.js decides **which code should run** based on that route.

### What is a Route?

* A route is the part of a URL that comes **after the domain name**.
* Example:

  ```
  https://example.com/about
  ```

  Here, `/about` is the **route**.

### Why Routing is Important

* Routes determine which page or data the server should send.
* Routes are used for:

  * Websites
  * APIs
  * Mobile applications
  * Frontend frameworks like React or Vue.js

### Detailed Explanation

In Express, a **route** is a combination of:

1. **HTTP method** (`GET`, `POST`, `PUT`, `DELETE`, etc.)
2. **Path** (`/`, `/about`, `/api/users`)
3. **Handler function** (the code that runs)

```text
Client Request  →  Method + Path  →  Matching Route Handler  →  Response
```

Example:

```js
app.get('/about', (req, res) => {
  res.send('About Page');
});
```

- Method: `GET`
- Path: `/about`
- Handler: the callback function

### Anatomy of a Full URL

```text
https://example.com:3000/about/user?id=12#section
|         |         |      |         |      |
protocol  domain   port   route    query  fragment
```

| Part | Example | Used in Express as |
| --- | --- | --- |
| Path / Route | `/about/user` | Route definition |
| Query string | `?id=12` | `req.query` |
| Route params | `/users/:id` | `req.params` |

### Real-World Scenario

**Scenario:** A React frontend calls your backend:

- `GET /api/products` → list products
- `GET /api/products/15` → product details
- `POST /api/orders` → create order

Routing is how Express maps each of these URLs to the correct business logic.

### Best Practices

- Keep route paths clear and resource-based (`/users`, `/products`).
- Separate page routes and API routes (`/about` vs `/api/about`).
- Use consistent naming (plural nouns for collections is common in APIs).

### Common Mistakes

- Defining the same path with conflicting handlers without understanding order.
- Mixing HTML page responses and JSON API responses in unclear ways.
- Forgetting that route matching depends on **both** method and path.

### Interview Insight

> A route in Express is not just a URL path — it is method + path + handler.

---

## 2. Traditional URLs vs Express.js Routes

### Traditional HTML-Based URLs

* URLs often expose:

  * File names
  * Folder structures
  * File extensions (`.html`, `.php`)
* Example:

  ```
  example.com/pages/about.html
  ```
* Disadvantages:

  * Security risk (exposes internal structure)
  * Tight coupling with file extensions

### Express.js Routes

* No file extensions in URLs
* Clean and secure URLs
* Example:

  ```
  example.com/about
  ```
* Backend logic can map `/about` to any internal file

### Detailed Comparison

| Aspect | Traditional URL | Express Route |
| --- | --- | --- |
| Looks like | `/pages/about.html` | `/about` |
| Exposes files? | Often yes | No |
| Easy to change internals? | Hard (URL tied to file) | Easy (URL mapped in code) |
| Good for APIs? | Poor | Excellent |
| SEO-friendly clean URLs | Harder | Natural |

### Real-World Scenario

**Scenario:** You move the About page content from `about.html` to a database-driven template. With Express, the public URL stays `/about`. Users and SEO links do not break.

### Practical Example

```js
// Public URL stays clean
app.get('/about', (req, res) => {
  // Internally, you can render a template, send HTML, or return JSON
  res.send('<h1>About Page</h1>');
});
```

### Best Practices

- Prefer clean paths without `.html` or `.php`.
- Hide internal folder structure from public URLs.
- Version APIs when needed (`/api/v1/users`).

### Common Mistakes

- Creating routes that still look like file paths (`/public/pages/about.html`).
- Changing public URLs frequently and breaking frontend clients.

### Important Note

Clean URLs improve security by obscurity only slightly. Real security still requires authentication, validation, and proper access control.

---

## 3. Types of Routes in Express.js

### 3.1 Basic Routes

* `/` → Home page
* `/about` → About page
* `/gallery` → Gallery page

### 3.2 Nested (Sub) Routes

Routes can be nested to represent hierarchy.

Example:

```
/about/user
```

### Detailed Explanation

| Type | Example | Meaning |
| --- | --- | --- |
| Root route | `/` | Application home / API root |
| Static route | `/about` | Fixed path |
| Nested route | `/about/user` | Hierarchical path |
| Dynamic route | `/users/:id` | Path with parameters |
| Query-based route | `/search?q=node` | Same path, different query data |

### Real-World Scenario

**Scenario:** An education platform might use:

- `/` → landing page
- `/courses` → course list
- `/courses/nodejs` → nested topic page
- `/courses/:id` → dynamic course details

### Best Practices

- Keep nesting shallow when possible (`/users/10/orders` is fine; deep trees get hard).
- Use nested routes to express ownership/hierarchy.
- For large apps, use `express.Router()` to group nested routes.

### Common Mistakes

- Over-nesting (`/a/b/c/d/e`) making URLs hard to maintain.
- Creating inconsistent hierarchies across modules.

---

## 4. HTTP Requests and CRUD Operations

Express.js handles **HTTP requests**, which map directly to **CRUD operations**:

| Operation | HTTP Method | Purpose                   |
| --------- | ----------- | ------------------------- |
| Read      | GET         | Fetch data or view a page |
| Create    | POST        | Add new data              |
| Update    | PUT         | Modify existing data      |
| Delete    | DELETE      | Remove data               |

Express provides **methods** for each:

* `app.get()`
* `app.post()`
* `app.put()`
* `app.delete()`

### Detailed Explanation

The same URL path can behave differently based on HTTP method:

```text
GET    /users      → list users
POST   /users      → create user
GET    /users/5    → get user 5
PUT    /users/5    → update user 5
DELETE /users/5    → delete user 5
```

### Additional Common Methods

| Method | Express API | Typical use |
| --- | --- | --- |
| PATCH | `app.patch()` | Partial update |
| ALL | `app.all()` | Run for every method on a path |
| USE | `app.use()` | Middleware or mounted routers |

### Practical Examples

```js
app.get('/users', (req, res) => {
  res.send('Fetch all users');
});

app.post('/users', (req, res) => {
  res.send('Create a new user');
});

app.put('/users/:id', (req, res) => {
  res.send(`Update user ${req.params.id}`);
});

app.delete('/users/:id', (req, res) => {
  res.send(`Delete user ${req.params.id}`);
});
```

### Real-World Scenario

**Scenario:** A mobile app creates an account with `POST /api/auth/register`, logs in with `POST /api/auth/login`, and fetches profile data with `GET /api/users/me`.

### Best Practices

- Follow REST conventions where practical.
- Use `PUT` for full replacement and `PATCH` for partial updates when you distinguish them.
- Never use `GET` to create/delete data (GET should be safe/read-only).

### Common Mistakes

- Using only `GET` for everything (including create/update).
- Forgetting that browsers' address bar only sends `GET` requests.
- Testing `POST`/`PUT`/`DELETE` only in the browser URL bar (use Postman, Thunder Client, or curl).

### Interview Insight

> CRUD maps to HTTP verbs. Routing decides which handler runs for each verb + path combination.

### Important Note

To read JSON bodies in `POST`/`PUT`, you typically need:

```js
app.use(express.json());
```

---

## 5. Express.js Project Setup (Recap)

### Installed Packages

* **express** – main framework
* **nodemon** – auto-restarts server on file changes

### Basic Server Setup

```js
const express = require('express');
const app = express();

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

### Detailed Setup Steps

```bash
mkdir express-routing-demo
cd express-routing-demo
npm init -y
npm install express
npm install nodemon --save-dev
```

`package.json` scripts example:

```json
{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}
```

### Recommended Starter File

```js
const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json()); // useful for POST/PUT later

// routes go here

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### Real-World Scenario

**Scenario:** During development, nodemon restarts the server whenever you save route changes, so you can test `/about` and `/gallery` quickly without manually stopping/starting Node.

### Best Practices

- Use `nodemon` only in development.
- Keep `app.js`/`index.js` as the entry point.
- Store port in env vars for production (`process.env.PORT`).

### Common Mistakes

- Defining routes **after** `app.listen` in a confusing order (routes should be registered before the server starts handling traffic; typically define routes first, then listen).
- Forgetting to save files and wondering why routes are missing (without nodemon).

### Important Note

Route order matters. Define specific routes before generic/parameterized ones when they could conflict.

---

## 6. Creating Routes Using GET Method

### Home Route

```js
app.get('/', (req, res) => {
  res.send('<h1>Welcome to Home Page</h1>');
});
```

Access in browser:

```
http://localhost:3000/
```

---

### About Route

```js
app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
});
```

Access:

```
http://localhost:3000/about
```

---

### Gallery Route

```js
app.get('/gallery', (req, res) => {
  res.send('<h1>Gallery Page</h1>');
});
```

### Detailed Explanation

`app.get(path, handler)` registers a route for HTTP GET requests.

Handler receives:

- `req` → request object (incoming data)
- `res` → response object (outgoing data)

Common response helpers:

| Method | Use |
| --- | --- |
| `res.send()` | Send string/HTML/Buffer/object |
| `res.json()` | Send JSON (sets content-type) |
| `res.status()` | Set HTTP status code |
| `res.redirect()` | Redirect to another URL |

### Complete Example Combining Routes

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Home Page</h1>');
});

app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
});

app.get('/gallery', (req, res) => {
  res.send('<h1>Gallery Page</h1>');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### API-Style Alternative

```js
app.get('/api/gallery', (req, res) => {
  res.json({
    page: 'gallery',
    images: ['img1.jpg', 'img2.jpg']
  });
});
```

### Real-World Scenario

**Scenario:** A portfolio website uses:

- `/` for intro
- `/about` for bio
- `/gallery` for project screenshots

A mobile app might instead call `/api/gallery` and receive JSON.

### Best Practices

- Keep handlers thin; move heavy logic to controllers/services later.
- Return proper content types (`res.json` for APIs).
- Use meaningful HTML or JSON responses while learning.

### Common Mistakes

- Calling `res.send()` twice in one handler (causes errors).
- Forgetting leading `/` in paths (`about` vs `/about`).
- Assuming route names are case-insensitive in all setups (treat them carefully).

---

## 7. Nested Routes (Sub-Routes)

Example:

```js
app.get('/about/user', (req, res) => {
  res.send('<h1>User Page</h1>');
});
```

Access:

```
http://localhost:3000/about/user
```

### Detailed Explanation

Nested routes represent hierarchy. `/about/user` is a more specific path under the about section.

Important: `/about` and `/about/user` are **different routes**. Defining one does not automatically create the other.

### Practical Expansion

```js
app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
});

app.get('/about/user', (req, res) => {
  res.send('<h1>User Page</h1>');
});

app.get('/about/team', (req, res) => {
  res.send('<h1>Team Page</h1>');
});
```

### Using `express.Router()` for Nested Groups

```js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => res.send('About Home'));
router.get('/user', (req, res) => res.send('About User'));
router.get('/team', (req, res) => res.send('About Team'));

module.exports = router;

// in app.js
// const aboutRouter = require('./routes/about');
// app.use('/about', aboutRouter);
```

Now:

- `/about` → About Home
- `/about/user` → About User
- `/about/team` → About Team

### Real-World Scenario

**Scenario:** An admin panel uses nested routes:

- `/admin/dashboard`
- `/admin/users`
- `/admin/settings`

A dedicated `adminRouter` mounted at `/admin` keeps code organized.

### Best Practices

- Use routers for feature modules (`users`, `products`, `admin`).
- Keep nested paths readable and predictable.
- Document nested route maps for frontend teams.

### Common Mistakes

- Expecting `/about` to handle `/about/user` automatically.
- Duplicating long prefixes in many files instead of mounting a router.

---

## 8. Handling Invalid Routes

If a route does not exist, Express returns an error:

```
Cannot GET /about-us
```

This happens when the route is not defined in code.

### Detailed Explanation

Express matches incoming requests against defined routes. If no match is found for that method + path, it falls through and returns a default 404-style response (`Cannot GET /path`).

### Custom 404 Handler (Best Practice)

Place this **after** all valid routes:

```js
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1>');
});
```

API-style 404:

```js
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`
  });
});
```

### Real-World Scenario

**Scenario:** A user types `/about-us` but your app only defines `/about`. Instead of a raw Express message, you return a branded 404 page or JSON error for the frontend.

### Best Practices

- Always add a final 404 handler in production apps.
- Log unknown routes to detect broken frontend links.
- Distinguish 404 (not found) from 500 (server error).

### Common Mistakes

- Putting the 404 middleware **before** real routes (everything becomes 404).
- Returning 200 OK for missing resources (makes debugging harder).

### Interview Insight

> 404 handlers should be registered after all routes. Error-handling middleware with 4 arguments `(err, req, res, next)` is different from 404 middleware.

---

## 9. Special Characters in Routes

Express routes can contain special characters:

* `.`
* `@`
* `$`
* `-`

Example:

```js
app.get('/random.text', (req, res) => {
  res.send('Random Page');
});
```

Access:

```
http://localhost:3000/random.text
```

### Detailed Explanation

Express path strings can include many literal characters. Some characters also have special meaning in path patterns (especially with regex/wildcards in advanced routing).

### More Examples

```js
app.get('/contact-us', (req, res) => {
  res.send('Contact Us');
});

app.get('/user@profile', (req, res) => {
  res.send('User Profile Alias');
});

app.get('/price$usd', (req, res) => {
  res.send('Price in USD');
});
```

### Important Notes

- `-` is very common and safe in readable URLs (`/contact-us`, `/sign-up`).
- `.` in paths is allowed, but for public websites prefer hyphenated slugs.
- Be careful with characters that need URL encoding in browsers (`@`, `$` may be awkward in practice).

### Real-World Scenario

**Scenario:** A marketing site uses SEO-friendly slugs like `/web-development-services` instead of `/webDevelopmentServices`.

### Best Practices

- Prefer lowercase kebab-case for public pages: `/about-us`, `/privacy-policy`.
- For APIs, prefer resource names: `/api/order-items` or `/api/orderItems` (pick one style and stay consistent).
- Avoid unusual characters unless there is a strong reason.

### Common Mistakes

- Creating hard-to-type routes with many special symbols.
- Confusing file extensions (`.text`) with actual static files.

---

## 10. Route Parameters (URL Parameters)

Route parameters allow sending **dynamic values** via the URL.

### Single Route Parameter

```js
app.get('/about/:id', (req, res) => {
  res.send(req.params);
});
```

Access:

```
/about/12
```

Output (JSON):

```json
{
  "id": "12"
}
```

---

### Multiple Route Parameters

```js
app.get('/user/:userId/book/:bookId', (req, res) => {
  res.send(req.params);
});
```

Access:

```
/user/10/book/22
```

Output:

```json
{
  "userId": "10",
  "bookId": "22"
}
```

---

### Accessing Individual Route Parameters

```js
res.send(req.params.userId);
```

or

```js
res.send(req.params.bookId);
```

---

### Sending Route Parameters with Messages

```js
res.send("Book ID: " + req.params.bookId);
```

---

### Multiple Parameters in a Single Route

```js
app.get('/user/:userId-:bookId', (req, res) => {
  res.send(req.params);
});
```

Access:

```
/user/john123-22
```

Output:

```json
{
  "userId": "john123",
  "bookId": "22"
}
```

### Detailed Explanation

Route parameters are dynamic path segments declared with `:`.

```text
Pattern:  /users/:id
Request:  /users/42
Result:   req.params.id === "42"
```

**Important:** values in `req.params` are strings by default, even if they look like numbers.

### Practical Examples

```js
app.get('/products/:id', (req, res) => {
  const productId = req.params.id;
  res.send(`Fetching product with ID: ${productId}`);
});

app.get('/users/:userId/orders/:orderId', (req, res) => {
  const { userId, orderId } = req.params;
  res.json({ userId, orderId });
});
```

### Optional / Advanced Patterns (Good to Know)

```js
// Optional parameter (using regex-style optional segment patterns in modern Express setups)
app.get('/posts/:slug?', (req, res) => {
  res.send(req.params);
});
```

### Real-World Scenario

**Scenario:** An e-commerce API uses:

- `GET /products/101` → product details
- `GET /users/55/orders/9001` → a specific order belonging to a user

Frontend React Router often mirrors these patterns (`/products/:id`).

### Route Order Warning

```js
app.get('/users/me', (req, res) => {
  res.send('Current user profile');
});

app.get('/users/:id', (req, res) => {
  res.send(`User ID: ${req.params.id}`);
});
```

Define `/users/me` **before** `/users/:id`, otherwise `"me"` may be captured as `:id`.

### Best Practices

- Validate params (check if ID exists / is valid ObjectId for MongoDB).
- Convert to numbers explicitly when needed: `Number(req.params.id)`.
- Use clear param names (`:userId`, `:productId`).

### Common Mistakes

- Forgetting params are strings (`"12" + 1` → `"121"`).
- Not handling missing resources (`/products/999` when 999 does not exist).
- Putting parameterized routes above static routes and breaking static matches.

### Interview Insight

> `req.params` comes from path segments defined with `:paramName`.

---

## 11. Query Parameters

Query parameters are sent using a **question mark (`?`)**.

Example URL:

```
/search?name=john123
```

---

### Accessing Query Parameters

```js
app.get('/search', (req, res) => {
  res.send(req.query);
});
```

Output:

```json
{
  "name": "john123"
}
```

---

### Multiple Query Parameters

```
/search?name=john123&age=20&city=Goa
```

Output:

```json
{
  "name": "john123",
  "age": "20",
  "city": "Goa"
}
```

---

### Extracting Specific Query Values

```js
app.get('/search', (req, res) => {
  const name = req.query.name;
  const age = req.query.age;

  res.send(`Name: ${name}, Age: ${age}`);
});
```

### Detailed Explanation

Query parameters are key-value pairs after `?`, separated by `&`.

```text
/search?name=john123&age=20
         |             |
         req.query.name
                       req.query.age
```

They are ideal for:

- filtering
- sorting
- pagination
- search text

They are **not** part of the route pattern itself. `/search` is the route; query values are extra data.

### Route Params vs Query Params

| Feature | Route Params (`req.params`) | Query Params (`req.query`) |
| --- | --- | --- |
| Location in URL | Path segment | After `?` |
| Example | `/users/10` | `/users?role=admin` |
| Declared in route? | Yes (`:id`) | No |
| Best for | Resource identity | Filters/options |
| Required? | Usually yes for that route | Often optional |

### Practical Pagination Example

```js
app.get('/products', (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  res.json({
    message: 'Product list',
    page,
    limit
  });
});
```

Access:

```
/products?page=2&limit=20
```

### Practical Search + Filter Example

```js
app.get('/search', (req, res) => {
  const { name, age, city } = req.query;

  res.json({
    filters: { name, age, city }
  });
});
```

### Real-World Scenario

**Scenario:** An online store frontend calls:

```
GET /api/products?category=mobile&sort=price&page=1&limit=12
```

Express reads filters from `req.query` and returns the filtered product list.

### Best Practices

- Provide defaults for missing query values.
- Validate and sanitize query input.
- Use query params for optional filters; use route params for required resource IDs.

### Common Mistakes

- Confusing `req.params` with `req.query`.
- Forgetting that query values are strings (`age=20` is `"20"`).
- Building filters that fail when query keys are missing (`undefined`).

### Interview Insight

> Use route params for **who/what resource**, and query params for **how to filter/sort/paginate** that resource.

---

## 12. Summary of Key Concepts

* Routes define how URLs map to server logic
* Express supports:

  * Basic routes
  * Nested routes
  * Route parameters
  * Query parameters
* HTTP methods map to CRUD operations
* `req.params` → Route parameters
* `req.query` → Query parameters
* `res.send()` → Sends response to the client

### Expanded Quick Reference

| Concept | Example | Access in Express |
| --- | --- | --- |
| Basic route | `/about` | `app.get('/about', ...)` |
| Nested route | `/about/user` | `app.get('/about/user', ...)` |
| Route param | `/users/:id` | `req.params.id` |
| Query param | `/search?name=john` | `req.query.name` |
| Create | `POST /users` | `app.post(...)` |
| Read | `GET /users` | `app.get(...)` |
| Update | `PUT /users/:id` | `app.put(...)` |
| Delete | `DELETE /users/:id` | `app.delete(...)` |

---

## 13. Mini Practice Lab

### Goal

Build a small Express app that practices all routing concepts from this document.

```js
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('<h1>Welcome to Home Page</h1>');
});

app.get('/about', (req, res) => {
  res.send('<h1>About Page</h1>');
});

app.get('/about/user', (req, res) => {
  res.send('<h1>User Page</h1>');
});

app.get('/gallery', (req, res) => {
  res.send('<h1>Gallery Page</h1>');
});

app.get('/random.text', (req, res) => {
  res.send('Random Page');
});

app.get('/user/:userId/book/:bookId', (req, res) => {
  res.json(req.params);
});

app.get('/search', (req, res) => {
  const { name, age, city } = req.query;
  res.send(`Name: ${name}, Age: ${age}, City: ${city}`);
});

// 404 handler (last)
app.use((req, res) => {
  res.status(404).send('Cannot find this route');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Test These URLs

- `http://localhost:3000/`
- `http://localhost:3000/about`
- `http://localhost:3000/about/user`
- `http://localhost:3000/random.text`
- `http://localhost:3000/user/10/book/22`
- `http://localhost:3000/search?name=john123&age=20&city=Goa`
- `http://localhost:3000/about-us` (should hit 404 handler)

---

## 14. Common Interview Questions

### Q1. What is routing in Express.js?

**Answer:** Routing determines how an application responds to client requests for specific HTTP methods and URL paths.

### Q2. Difference between `req.params` and `req.query`?

**Answer:** `req.params` reads dynamic path segments (`/users/:id`). `req.query` reads key-value pairs after `?` (`/search?name=john`).

### Q3. Can two routes share the same path?

**Answer:** Yes, if HTTP methods differ (for example `GET /users` and `POST /users`).

### Q4. Why do we get `Cannot GET /about-us`?

**Answer:** No matching route was defined for that method and path.

### Q5. Are route parameter values numbers or strings?

**Answer:** Strings by default. Convert explicitly when numeric operations are needed.

### Q6. What is the benefit of `express.Router()`?

**Answer:** It helps modularize nested/related routes into separate files and mount them with a prefix.

---

## 15. Key Takeaways

* Routing maps URLs + HTTP methods to server logic
* Clean Express routes hide internal file structure
* Use GET/POST/PUT/DELETE for CRUD-style APIs
* Nested routes express hierarchy
* Always handle unknown routes with a 404 middleware
* `req.params` = dynamic path values
* `req.query` = optional filters and search options
* Practice with Postman/curl for non-GET methods

### Practice Checklist

- [ ] Create `/`, `/about`, `/gallery` routes
- [ ] Add a nested route `/about/user`
- [ ] Add a custom 404 handler
- [ ] Build a route with one and multiple params
- [ ] Read multiple query parameters from `/search`
- [ ] Explain `req.params` vs `req.query` in one minute

---

*End of study notes — Express.js Routing.*
