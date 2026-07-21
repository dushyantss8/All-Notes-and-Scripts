# Express.js Request Properties and Methods

## How to Use This Document

This guide is designed for:

- Beginners who already know Express routing and response methods
- Developers building APIs that accept JSON/form data
- Interview candidates preparing for `req` object questions

**Recommended learning flow:**

1. Read Sections 1–2 for the request model and core properties.
2. Practice Sections 3–8 with Postman (JSON + form data).
3. Study Sections 9–12 for hostname, IP, headers, and content negotiation.
4. Review the comparison tables and interview Q&A at the end.

---

## 1. Introduction to Client–Server Requests in Express.js

In this tutorial, the focus is on **Express.js request (`req`) properties and methods**.

Focus on:

* **How clients send requests to the server**
* How Express.js reads and processes those requests using **request properties and methods**

Clients may send requests to:

* Read data
* Add new data
* Update existing data
* Delete data

To handle these effectively, we must understand **request properties (`req`)** and **request methods**.

### Detailed Explanation

Every Express route handler receives two main objects:

```js
app.post('/about', (req, res) => {
  // req  = incoming request from client
  // res  = outgoing response to client
});
```

```text
Client (Browser / Postman / Mobile App)
        |
        |  HTTP Request (method, URL, headers, body)
        v
   Express Server (req object)
        |
        |  Process data / DB / business logic
        v
   HTTP Response (res object)
```

### Where Request Data Can Come From

| Source | Express property | Example |
| --- | --- | --- |
| Path params | `req.params` | `/users/12` |
| Query string | `req.query` | `/search?name=john` |
| Request body | `req.body` | JSON or form fields |
| Cookies | `req.cookies` | session/token cookies |
| Headers | `req.headers` / `req.get()` | `Content-Type`, `Authorization` |

### Real-World Scenario

**Scenario:** A mobile app registers a user:

- Method: `POST`
- URL: `/api/users`
- Body: `{ "name": "Aman", "email": "aman@mail.com" }`

Express reads that payload from `req.body`, validates it, saves it to MongoDB, and returns a response.

### Best Practices

- Know which property to use for each data source.
- Never trust client input without validation.
- Use the correct HTTP method for the operation.

### Common Mistakes

- Expecting `req.body` to work without middleware.
- Putting sensitive data in query strings.
- Confusing `req.params`, `req.query`, and `req.body`.

### Interview Insight

> `res` is how you reply. `req` is how you understand what the client asked for and sent.

---

## 2. Important Request Properties in Express.js

The most commonly used request properties are:

1. `req.params`
2. `req.query`
3. `req.body`
4. `req.cookies`

### 2.1 `req.params` and `req.query`

* Used for **route parameters** and **query parameters**
* Data is embedded directly into the URL

### Detailed Comparison

| Property | Location in URL | Declared in route? | Best for |
| --- | --- | --- | --- |
| `req.params` | Path segment | Yes (`:id`) | Resource identity |
| `req.query` | After `?` | No | Filters, search, pagination |
| `req.body` | Request body | No | Create/update payloads |
| `req.cookies` | Cookie header | Needs parser | Sessions, preferences |

### Quick Examples

```js
// Route params
app.get('/users/:id', (req, res) => {
  res.send(req.params); // { id: '12' }
});

// Query params
app.get('/search', (req, res) => {
  res.send(req.query); // { name: 'john' }
});
```

### About `req.cookies`

Cookies are not available on `req.cookies` by default. You typically need:

```bash
npm install cookie-parser
```

```js
const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.get('/profile', (req, res) => {
  res.send(req.cookies);
});
```

### Real-World Scenario

**Scenario:**

- `GET /products/55` → `req.params.id = "55"` (which product)
- `GET /products?category=mobile&page=2` → `req.query` filters
- `POST /products` with JSON body → `req.body` creates product
- Auth token in cookie → `req.cookies.token`

### Best Practices

- Use params for required resource IDs.
- Use query for optional filters.
- Use body for structured create/update data.
- Use cookies carefully (prefer HTTP-only cookies for auth tokens when using cookie-based auth).

### Common Mistakes

- Trying to read body data from a GET request in the browser address bar.
- Forgetting cookie-parser and thinking cookies are broken.
- Storing large payloads in query strings.

### Important Note

`req.params` and `req.query` values are strings by default.

---

## 3. `req.body` – Handling JSON and Form Data

### Purpose

`req.body` is used to receive:

* JSON data
* Form data (URL-encoded)

This is extremely common in:

* APIs
* Web applications
* Mobile app backends

### Detailed Explanation

`req.body` contains data sent in the HTTP request body. Express does **not** parse it automatically unless middleware is enabled.

Without middleware:

```js
console.log(req.body); // undefined
```

With middleware:

```js
console.log(req.body); // { name: 'Yahoo Baba', age: 25 }
```

### Common Body Formats

| Format | Content-Type | Middleware |
| --- | --- | --- |
| JSON | `application/json` | `express.json()` |
| Form fields | `application/x-www-form-urlencoded` | `express.urlencoded()` |
| File uploads | `multipart/form-data` | `multer` (not covered by built-in parsers) |

### Real-World Scenario

**Scenario:** A contact form posts name/email/message. Express reads `req.body`, validates fields, and stores the message in the database.

### Best Practices

- Enable body parsers once near the top of `app.js`.
- Validate and sanitize `req.body` before using it.
- Limit body size to reduce abuse risk.

### Common Mistakes

- Assuming `req.body` always exists.
- Sending JSON but forgetting `Content-Type: application/json`.
- Using URL-encoded parser for multipart file uploads (won't work).

### Interview Insight

> `req.body` is empty/undefined until parsing middleware runs.

---

## 4. Enabling JSON Data in Express.js

To accept JSON requests, a middleware must be added:

```js
app.use(express.json());
```

### Why this is required

* Without this middleware, Express cannot read JSON request bodies
* It enables the entire app to accept JSON payloads

### Detailed Explanation

`express.json()` is built-in middleware that:

1. Checks if request content-type is JSON
2. Reads the raw body
3. Parses it into a JavaScript object
4. Assigns it to `req.body`
5. Calls `next()`

### Recommended Placement

```js
const express = require('express');
const app = express();

app.use(express.json()); // early in the middleware chain

app.post('/about', (req, res) => {
  res.send(req.body);
});
```

### Optional Configuration

```js
app.use(express.json({
  limit: '100kb' // protect against huge payloads
}));
```

### Real-World Scenario

**Scenario:** A React app sends:

```http
POST /api/login
Content-Type: application/json

{"email":"user@mail.com","password":"secret"}
```

Without `express.json()`, login route cannot read email/password from `req.body`.

### Best Practices

- Register `express.json()` before routes that need body data.
- Keep payload size limits reasonable.
- Combine with validation libraries (Joi, Zod, express-validator).

### Common Mistakes

- Adding middleware after routes (too late).
- Enabling it multiple times unnecessarily.
- Expecting it to parse form-urlencoded data (it does not).

---

## 5. Sending JSON Data Using POST Requests

### Route Setup

```js
app.post("/about", (req, res) => {
  res.send(req.body);
});
```

* `POST` is used to **send data to the server**
* The server reads data using `req.body`
* The same data is sent back in the response for testing

### Detailed Explanation

This echo-style route is perfect for learning:

1. Client sends JSON
2. Express parses it into `req.body`
3. Server returns the same object

In real apps, you would validate and save data instead of only echoing it.

### More Realistic Example

```js
app.post('/api/users', (req, res) => {
  const { name, age } = req.body;

  if (!name || !age) {
    return res.status(400).json({
      success: false,
      message: 'name and age are required'
    });
  }

  // save to DB here...
  res.status(201).json({
    success: true,
    data: { name, age }
  });
});
```

### Real-World Scenario

**Scenario:** Signup API receives user details via POST JSON, checks duplicates, hashes password, and inserts a MongoDB document.

### Best Practices

- Use `POST` for create operations.
- Return `201 Created` when a resource is created.
- Do not log sensitive body fields (passwords, tokens).

### Common Mistakes

- Using `GET` for create operations.
- Forgetting validation and accepting any body shape.
- Mutating `req.body` carelessly across middleware.

---

## 6. Testing JSON Requests with Postman

### Steps in Postman:

1. Select **POST** method
2. Enter URL:
   `http://localhost:3000/about`
3. Go to **Body → Raw**
4. Select **JSON**
5. Send data:

   ```json
   {
     "name": "Yahoo Baba",
     "age": 25
   }
   ```
6. Click **Send**

### Result

* Server receives JSON
* `req.body` captures it
* Response returns the same JSON

### Detailed Explanation

Browsers' address bars only send GET requests. For POST JSON testing, use:

- Postman
- Thunder Client (VS Code)
- Insomnia
- curl

### Equivalent curl Command

```bash
curl -X POST http://localhost:3000/about \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Yahoo Baba\",\"age\":25}"
```

### What You Should See

Request body in Postman:

```json
{
  "name": "Yahoo Baba",
  "age": 25
}
```

Server response (echo):

```json
{
  "name": "Yahoo Baba",
  "age": 25
}
```

### Real-World Scenario

**Scenario:** Before connecting a React frontend, backend developers test all create/update endpoints in Postman to verify `req.body` parsing and validation.

### Best Practices

- Always set Body → Raw → JSON in Postman.
- Save Postman collections for your API.
- Check status code and response body together.

### Common Mistakes

- Sending JSON while method is GET.
- Forgetting to choose JSON (sending as Text).
- Server not running / wrong port.

### Important Note

If middleware is missing, Postman may still send data, but Express `req.body` will be empty/`undefined`.

---

## 7. Enabling Form (URL-Encoded) Data

To accept form data, another middleware is required:

```js
app.use(express.urlencoded({ extended: false }));
```

### Purpose

* Allows Express to accept:

  * HTML form data
  * `x-www-form-urlencoded` data

### Detailed Explanation

HTML forms commonly submit as:

```text
Content-Type: application/x-www-form-urlencoded
```

Body looks like:

```text
name=Akshay+Kumar&age=25&city=Delhi
```

`express.urlencoded()` parses that into:

```js
{
  name: 'Akshay Kumar',
  age: '25',
  city: 'Delhi'
}
```

### `extended` Option

| Option | Meaning |
| --- | --- |
| `extended: false` | Uses querystring library; simpler key-value parsing |
| `extended: true` | Uses qs library; supports nested objects |

Example with nested data (`extended: true`):

```text
user[name]=Aman&user[age]=25
```

Can become:

```js
{ user: { name: 'Aman', age: '25' } }
```

### Recommended Setup Together

```js
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
```

### Real-World Scenario

**Scenario:** A classic server-rendered login form posts username/password as URL-encoded fields. Express reads them from `req.body`.

### Best Practices

- Enable both JSON and urlencoded parsers in most apps.
- Choose `extended` intentionally and keep it consistent.
- Still validate all incoming fields.

### Common Mistakes

- Enabling only JSON parser and wondering why HTML forms fail.
- Using urlencoded parser for file uploads (`multipart/form-data` needs multer).

---

## 8. Sending Form Data Using Postman

### Steps:

1. Method: **POST**
2. URL: `http://localhost:3000/about`
3. Body → **x-www-form-urlencoded**
4. Add key-value pairs:

   * `name` → Akshay Kumar
   * `age` → 25
   * `city` → Delhi
5. Click **Send**

### Result

* Form data appears in `req.body`
* Server returns it as JSON

### Detailed Explanation

Postman’s `x-www-form-urlencoded` mode simulates traditional HTML form submissions.

### HTML Form Equivalent

```html
<form action="/about" method="POST">
  <input name="name" value="Akshay Kumar" />
  <input name="age" value="25" />
  <input name="city" value="Delhi" />
  <button type="submit">Send</button>
</form>
```

### Expected `req.body`

```json
{
  "name": "Akshay Kumar",
  "age": "25",
  "city": "Delhi"
}
```

### Real-World Scenario

**Scenario:** Before building the frontend form UI, you verify backend form handling in Postman using urlencoded key-value pairs.

### Best Practices

- Test both JSON and urlencoded for endpoints that may receive either.
- Confirm field names match exactly (`name` vs `fullName`).
- Remember form values arrive as strings (`"25"` not `25`).

### Common Mistakes

- Using form-data (multipart) in Postman when route expects urlencoded.
- Comparing values with strict types without conversion.

---

## 9. Other Important Request Properties

### 9.1 `req.hostname`

* Returns the hostname of the request
* Example output:

  * `localhost`
  * `::1` (local IP)
* On a live server, it returns the actual domain IP

#### Expanded Explanation

`req.hostname` returns the host name from the `Host` header, without port.

```js
app.get('/host-info', (req, res) => {
  res.json({ hostname: req.hostname });
});
```

Examples:

- Request to `http://localhost:3000` → often `localhost`
- Request to `https://api.example.com` → `api.example.com`

#### Important Note

The original note mentioning `::1` is more typical for IP-related values (`req.ip`). Hostname is usually a domain-like value such as `localhost`.

#### Real-World Scenario

**Scenario:** A multi-tenant app serves different content based on hostname (`shop1.example.com` vs `shop2.example.com`).

---

### 9.2 `req.ip` and `req.ips`

* `req.ip`: Single client IP
* `req.ips`: Used when:

  * Load balancing
  * Multiple proxy servers
* Mostly useful in production environments

#### Expanded Explanation

```js
app.get('/ip-info', (req, res) => {
  res.json({
    ip: req.ip,
    ips: req.ips
  });
});
```

When your app runs behind proxies (Nginx, AWS ALB, Cloudflare), enable trust proxy:

```js
app.set('trust proxy', true);
```

Then Express can derive client IP from `X-Forwarded-For`.

#### Real-World Scenario

**Scenario:** Rate limiting and audit logs store `req.ip` to detect abuse and trace suspicious activity.

#### Best Practices

- Enable `trust proxy` only when you actually have a trusted proxy.
- Do not trust arbitrary forwarded headers from the public internet without proper proxy setup.

---

### 9.3 `req.method`

* Returns HTTP method used:

  * GET
  * POST
  * PUT
  * DELETE

Example output:

```text
GET
```

#### Practical Example

```js
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});
```

#### Real-World Scenario

**Scenario:** Logging middleware records method + URL for every API call to help debug production issues.

---

### 9.4 `req.originalUrl`

* Returns the full URL after hostname
* Includes:

  * Route
  * Query parameters

Example:

```text
/about?name=abc
```

#### Practical Example

```js
app.get('/about', (req, res) => {
  res.send(req.originalUrl); // /about?name=abc
});
```

---

### 9.5 `req.path`

* Returns only the route path
* Excludes query parameters

Example:

```text
/about
```

#### `originalUrl` vs `path` vs `url`

| Property | Example value | Includes query? |
| --- | --- | --- |
| `req.originalUrl` | `/about?name=abc` | Yes |
| `req.url` | `/about?name=abc` (can change in mounted routers) | Yes |
| `req.path` | `/about` | No |

#### Real-World Scenario

**Scenario:** Analytics tracks visited paths using `req.path`, while debugging uses `req.originalUrl` to preserve full request details.

---

### 9.6 `req.protocol` and `req.secure`

* `req.protocol`: `http` or `https`
* `req.secure`:

  * `true` → HTTPS
  * `false` → HTTP

Used to detect secure connections

#### Practical Example

```js
app.get('/security-check', (req, res) => {
  res.json({
    protocol: req.protocol,
    secure: req.secure
  });
});
```

#### Real-World Scenario

**Scenario:** Force HTTPS in production:

```js
app.use((req, res, next) => {
  if (!req.secure && process.env.NODE_ENV === 'production') {
    return res.redirect('https://' + req.headers.host + req.originalUrl);
  }
  next();
});
```

#### Important Note

Behind proxies, set `trust proxy` so `req.secure` / `req.protocol` reflect the original client protocol.

---

### 9.7 `req.route`

* Provides internal route information
* Includes:

  * Route path
  * Supported methods
  * Stack information

Useful for debugging and advanced routing logic

#### Practical Example

```js
app.get('/about/:id', (req, res) => {
  console.log(req.route);
  res.send('Route debug');
});
```

Typical useful fields:

- `req.route.path`
- `req.route.methods`

#### Real-World Scenario

**Scenario:** Advanced logging prints which route pattern matched (`/users/:id`) rather than only the raw URL.

---

## 10. Request Methods in Express.js

### 10.1 `req.accepts()` – Content Negotiation

Checks which content type the client supports:

* HTML
* JSON
* XML

### Example Usage

```js
if (req.accepts("html")) {
  res.send("<h1>Hello HTML</h1>");
} else if (req.accepts("json")) {
  res.json({ message: "Hello JSON" });
} else if (req.accepts("xml")) {
  res.send("<message>Hello XML</message>");
} else {
  res.status(400).send("Content type not supported");
}
```

### Use Case

* API decides response format based on client capability

### Detailed Explanation

Clients send an `Accept` header, for example:

```http
Accept: application/json
```

`req.accepts()` checks whether the server can satisfy that preference.

### Practical Route

```js
app.get('/content', (req, res) => {
  if (req.accepts('html')) {
    res.send('<h1>Hello HTML</h1>');
  } else if (req.accepts('json')) {
    res.json({ message: 'Hello JSON' });
  } else if (req.accepts('xml')) {
    res.send('<message>Hello XML</message>');
  } else {
    res.status(400).send('Content type not supported');
  }
});
```

### Related Helpers

```js
req.accepts('json')
req.is('application/json') // checks Content-Type of incoming body
req.get('Accept')
```

### Real-World Scenario

**Scenario:** The same `/reports` endpoint returns HTML for browsers and JSON for mobile apps based on `Accept`.

### Best Practices

- Prefer explicit API routes (`/api/...`) when possible.
- Use content negotiation carefully; keep behavior predictable.
- Return `406 Not Acceptable` in strict APIs when no type matches.

### Common Mistakes

- Confusing `Accept` (what client wants back) with `Content-Type` (what client sent).
- Assuming all clients send useful `Accept` headers.

---

## 11. Reading Request Headers

### 11.1 Using `req.headers`

Returns all headers:

```js
res.send(req.headers);
```

Example data:

* Host
* Connection status
* Cache control
* Accepted formats

### Detailed Explanation

Headers are metadata key-value pairs sent with every request.

```js
app.get('/headers', (req, res) => {
  res.json(req.headers);
});
```

Header names in `req.headers` are generally lowercased:

- `content-type`
- `user-agent`
- `authorization`

---

### 11.2 Using `req.get()`

Retrieve a specific header value:

```js
req.get("host");
req.get("connection");
req.get("accept");
```

### Practical Example

```js
app.get('/header-check', (req, res) => {
  res.json({
    host: req.get('host'),
    connection: req.get('connection'),
    accept: req.get('accept'),
    contentType: req.get('content-type')
  });
});
```

### `req.headers` vs `req.get()`

| Approach | Best for |
| --- | --- |
| `req.headers` | Inspect all headers |
| `req.get('name')` | Read one header safely/conveniently |

### Real-World Scenario

**Scenario:** Auth middleware reads `Authorization` header:

```js
const authHeader = req.get('Authorization');
// Bearer <token>
```

### Best Practices

- Use `req.get()` for case-insensitive convenient access.
- Never log secrets from headers in plain text.
- Validate expected headers for protected routes.

### Common Mistakes

- Looking up mixed-case keys inconsistently in `req.headers`.
- Trusting spoofable headers without proxy/app safeguards.

---

## 12. Validating Content Type Using Headers

### Example Logic

```js
if (req.get("content-type") === "application/json") {
  res.send("Valid JSON data");
} else {
  res.status(400).send("Unsupported content type");
}
```

### Practical Use

* Validate request format
* Prevent unsupported data from being processed

### Detailed Explanation

`Content-Type` describes the body format the client is sending.

### More Robust Check

Exact string match can fail when charset is included:

```text
application/json; charset=utf-8
```

Better approaches:

```js
// Option 1: startsWith
const type = req.get('content-type') || '';
if (type.startsWith('application/json')) {
  res.send('Valid JSON data');
} else {
  res.status(400).send('Unsupported content type');
}

// Option 2: req.is()
if (req.is('application/json')) {
  res.send('Valid JSON data');
} else {
  res.status(400).send('Unsupported content type');
}
```

### Real-World Scenario

**Scenario:** An upload endpoint only accepts JSON for metadata creation and rejects other content types early with `400`.

### Best Practices

- Prefer `req.is()` for content-type checks.
- Combine content-type checks with schema validation.
- Return clear error messages for clients.

### Common Mistakes

- Strict equality checks that break with `charset=utf-8`.
- Validating content-type but not validating body fields.

---

## 13. HTTP Method Importance (GET vs POST)

* **GET**

  * Used for reading data
  * No request body
* **POST**

  * Used for sending data
  * Required for JSON/form data

Incorrect method usage leads to:

* Unsupported content type errors

### Detailed Explanation

| Method | Body expected? | Typical use |
| --- | --- | --- |
| GET | No (usually ignored) | Read/list/search |
| POST | Yes | Create / submit forms |
| PUT | Yes | Replace resource |
| PATCH | Yes | Partial update |
| DELETE | Optional | Remove resource |

### Why GET + Body Is a Bad Habit

- Many clients/tools ignore GET bodies
- Caching proxies may behave unexpectedly
- Semantics say GET should be safe/read-only

### Practical Demo

```js
app.get('/about', (req, res) => {
  res.send({
    method: req.method,
    body: req.body // usually empty for GET
  });
});

app.post('/about', (req, res) => {
  res.send({
    method: req.method,
    body: req.body // JSON/form data appears here
  });
});
```

### Real-World Scenario

**Scenario:** A beginner sends JSON in Postman with method GET and wonders why `req.body` is empty. Switching to POST fixes it.

### Best Practices

- Use GET for reads and query filters.
- Use POST/PUT/PATCH for writes with body data.
- Keep method semantics consistent across your API.

### Common Mistakes

- Creating data with GET routes.
- Forgetting that Postman method must match Express route method.

### Interview Insight

> Method mismatch is one of the most common beginner API debugging issues.

---

## 14. Summary

In this tutorial, we learned:

* How clients send requests to Express.js
* How to read:

  * JSON data
  * Form data
* Core request properties:

  * `req.body`
  * `req.hostname`
  * `req.method`
  * `req.originalUrl`
  * `req.path`
  * `req.protocol`
* Request methods:

  * `req.accepts()`
  * `req.headers`
  * `req.get()`
* Testing APIs using **Postman**
* Validating content types and request formats

This forms the foundation for:

* API development
* Database integration
* Secure request handling

### Expanded Quick Reference

| Need | Use |
| --- | --- |
| `/users/10` ID | `req.params` |
| `?page=2&sort=asc` | `req.query` |
| JSON/form payload | `req.body` |
| Cookie values | `req.cookies` (with cookie-parser) |
| Client IP | `req.ip` / `req.ips` |
| HTTP verb | `req.method` |
| Full path + query | `req.originalUrl` |
| Path only | `req.path` |
| http/https | `req.protocol`, `req.secure` |
| Preferred response type | `req.accepts()` |
| One header | `req.get('name')` |
| All headers | `req.headers` |
| Incoming body type | `req.is('json')` / `Content-Type` |

---

## 15. Mini Practice Lab

```js
const express = require('express');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post('/about', (req, res) => {
  res.json({
    body: req.body,
    method: req.method,
    path: req.path,
    originalUrl: req.originalUrl,
    hostname: req.hostname,
    ip: req.ip,
    protocol: req.protocol,
    secure: req.secure,
    contentType: req.get('content-type')
  });
});

app.get('/content', (req, res) => {
  if (req.accepts('html')) {
    res.send('<h1>Hello HTML</h1>');
  } else if (req.accepts('json')) {
    res.json({ message: 'Hello JSON' });
  } else {
    res.status(400).send('Content type not supported');
  }
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
```

### Practice Checklist

- [ ] Send JSON via Postman and inspect `req.body`
- [ ] Send x-www-form-urlencoded data and compare results
- [ ] Log `req.method`, `req.path`, and `req.originalUrl`
- [ ] Read `Content-Type` with `req.get()` and `req.is()`
- [ ] Test `req.accepts()` with different Accept headers
- [ ] Explain `params` vs `query` vs `body` in one minute

---

## 16. Common Interview Questions

### Q1. Why is `req.body` undefined?

**Answer:** Body parser middleware (`express.json()` or `express.urlencoded()`) is missing, or the request has no/incorrect body content-type.

### Q2. Difference between `req.params`, `req.query`, and `req.body`?

**Answer:** Params come from path segments, query from `?key=value`, body from request payload (JSON/form).

### Q3. Difference between `req.path` and `req.originalUrl`?

**Answer:** `path` excludes query string; `originalUrl` includes path + query.

### Q4. What does `req.accepts()` do?

**Answer:** It performs content negotiation based on the client's `Accept` header.

### Q5. GET vs POST for sending JSON?

**Answer:** Use POST (or PUT/PATCH) for JSON/form bodies. GET is for reading and typically does not use a body.

### Q6. How do you read a single header?

**Answer:** `req.get('Authorization')` or `req.headers['authorization']`.

---

## 17. Key Takeaways

* Clients send data through URL, query, body, cookies, and headers
* `req` properties let Express read that incoming data
* Enable `express.json()` and `express.urlencoded()` before body routes
* Test POST bodies with Postman/curl, not the browser address bar
* Use `req.get()` / `req.is()` / `req.accepts()` for header-based logic
* Choose HTTP methods correctly (GET read, POST write)
* Validate every external input before using it in business logic or DB queries

---

*End of study notes — Express.js Request Properties and Methods.*
