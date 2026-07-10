# Express.js Response Methods

## How to Use This Document

This guide is designed for:

- Beginners who already know Express routing
- Developers building APIs, file downloads, and server-rendered pages
- Interview candidates preparing for Express/`res` method questions

**Recommended learning flow:**

1. Read Sections 1–3 for core response methods (`send`, `json`).
2. Practice Sections 5–8 (redirect, render, download, sendFile).
3. Master Sections 10–13 (status codes, headers, `headersSent`).
4. Review the comparison tables and interview Q&A at the end.

---

## 1. Introduction to Server Responses in Express.js

Routes are defined using HTTP methods such as:

```js
app.get('/route', (req, res) => {
  // response logic
});
```

The **callback function** receives:

* `req` → request object
* `res` → response object

This tutorial focuses on **methods available on the `res` (response) object** in Express.js.

### Detailed Explanation

Every HTTP exchange has two sides:

```text
Client  --request-->  Express Server
Client  <--response-- Express Server
```

- `req` contains incoming data (URL, params, query, body, headers).
- `res` is how you send data back (HTML, JSON, files, redirects, status codes).

A route handler must eventually **end the response**. Common ways:

- `res.send()`
- `res.json()`
- `res.render()`
- `res.redirect()`
- `res.end()`
- `res.sendFile()` / `res.download()`

### Request/Response Mental Model

```js
app.get('/hello', (req, res) => {
  // 1. Read from req if needed
  // 2. Process business logic
  // 3. Send response with res.*
  res.send('Hello');
});
```

### Real-World Scenario

**Scenario:** A React app calls `GET /api/users`. Express reads the request, fetches users from MongoDB, then uses `res.status(200).json(users)` to return data.

### Best Practices

- Send exactly **one** response per request.
- Choose the response method based on content type (JSON vs HTML vs file).
- Always set meaningful HTTP status codes for APIs.

### Common Mistakes

- Calling `res.send()` twice → `Cannot set headers after they are sent`.
- Forgetting to return after sending in conditional logic.
- Using `res.send()` for APIs when `res.json()` is clearer.

### Interview Insight

> `req` is input, `res` is output. Most Express bugs in beginners come from mishandling the response lifecycle.

### Important Note

Once headers are sent, you cannot change status/headers or send another full response body safely.

---

## 2. `res.send()` – Sending Responses

### Purpose

Sends a response to the client. It is the most commonly used response method.

### Supported Data Types

`res.send()` can send:

* Text
* HTML
* JavaScript Objects
* Arrays
* Buffers (used in audio/video streaming)

### Examples

#### Sending Text

```js
res.send("Hello World");
```

#### Sending HTML

```js
res.send("<h1>Home Page</h1>");
```

#### Sending an Object (Auto-converted to JSON)

```js
res.send({ name: "Aman", age: 25 });
```

#### Sending an Array

```js
res.send(["Apple", "Banana", "Mango"]);
```

**Important:**
When objects or arrays are passed, Express automatically converts them to **JSON format**.

### Detailed Explanation

`res.send()` is a flexible helper. Express inspects the value and sets headers accordingly:

| Value type | Typical Content-Type | Behavior |
| --- | --- | --- |
| String | `text/html` | Sent as text/HTML |
| Object / Array | `application/json` | JSON stringified |
| Buffer | `application/octet-stream` | Binary data |
| `null` / empty | depends | Ends response |

### Practical Route Examples

```js
app.get('/text', (req, res) => {
  res.send('Hello World');
});

app.get('/html', (req, res) => {
  res.send('<h1>Home Page</h1>');
});

app.get('/object', (req, res) => {
  res.send({ name: 'Aman', age: 25 });
});

app.get('/array', (req, res) => {
  res.send(['Apple', 'Banana', 'Mango']);
});
```

### Real-World Scenario

**Scenario:** A simple marketing site returns HTML with `res.send('<h1>Welcome</h1>')`, while an internal health check returns `res.send({ status: 'ok' })`.

### Best Practices

- Use `res.send()` for quick responses and HTML snippets.
- For APIs, prefer `res.json()` for clarity and consistency.
- Chain status when needed: `res.status(201).send('Created')`.

### Common Mistakes

- Sending circular objects (can throw JSON errors).
- Assuming string responses are always plain text (default is often treated as HTML).
- Using `res.send(undefined)` unintentionally.

### Interview Insight

> `res.send(obj)` and `res.json(obj)` are similar for objects, but `res.json()` makes API intent explicit and is safer for JSON-only responses.

---

## 3. `res.json()` – Sending JSON Only

### Purpose

Used when the server must send **JSON responses only**, especially for APIs.

### Example

```js
res.json({ name: "Rahul", age: 30 });
```

### Array of Objects

```js
const users = [
  { id: 1, name: "Peter Parker" },
  { id: 2, name: "Leon S Kennedy" }
];

res.json(users);
```

This method explicitly returns JSON and is preferred for **REST APIs**.

### Detailed Explanation

`res.json()`:

- Converts data to JSON
- Sets `Content-Type: application/json`
- Is the standard choice for REST/GraphQL-style JSON APIs

### Practical API Example

```js
app.get('/api/users', (req, res) => {
  const users = [
    { id: 1, name: 'Peter Parker' },
    { id: 2, name: 'Leon S Kennedy' }
  ];

  res.status(200).json({
    success: true,
    count: users.length,
    data: users
  });
});
```

### `res.send()` vs `res.json()`

| Aspect | `res.send()` | `res.json()` |
| --- | --- | --- |
| Accepts HTML/text | Yes | Not intended for HTML |
| JSON objects/arrays | Yes | Yes |
| API readability | Good | Better |
| Content-Type for objects | application/json | application/json |
| Preferred for REST APIs | Okay | Recommended |

### Real-World Scenario

**Scenario:** A mobile app expects JSON only. Using `res.json()` ensures consistent API responses and correct content-type headers for clients.

### Best Practices

- Standardize API response shape (`success`, `data`, `message`, `error`).
- Always pair with proper status codes.
- Never mix HTML strings into JSON APIs.

### Common Mistakes

- Returning plain strings from API endpoints inconsistently.
- Forgetting error JSON format for failures.

### Important Note

`res.json()` can also send non-objects (for example `res.json('hello')`), but APIs usually return objects/arrays.

---

## 4. `res.jsonp()` – JSON with Padding (JSONP)

### Purpose

Used for **cross-domain requests** (older technique).

### Key Points

* Returns JSON wrapped inside a callback function
* Considered **less secure**
* Requires CORS handling in real projects

### Example

```js
res.jsonp({ name: "User", age: 20 });
```

With a callback:

```
/api?callback=myFunction
```

Response:

```js
myFunction({ name: "User", age: 20 });
```

### Recommendation

Use `res.json()` with **CORS middleware** instead of JSONP.

### Detailed Explanation

JSONP was used before CORS became standard. The browser loads a `<script>` from another domain, and the server returns JavaScript that calls a callback with data.

### Why JSONP Is Risky

- Executes as script (not pure data)
- Limited to GET-like usage patterns historically
- Callback name handling can introduce security concerns if not carefully controlled

### Modern Alternative (CORS)

```bash
npm install cors
```

```js
const cors = require('cors');
app.use(cors());

app.get('/api/data', (req, res) => {
  res.json({ name: 'User', age: 20 });
});
```

### Real-World Scenario

**Scenario:** An old jQuery app used JSONP to fetch data from another domain. A modern rewrite replaces it with `fetch` + CORS + `res.json()`.

### Best Practices

- Avoid JSONP in new projects.
- Use CORS, proxies, or same-origin APIs.
- If maintaining legacy JSONP, restrict allowed callback names tightly.

### Common Mistakes

- Choosing JSONP for new APIs.
- Confusing JSONP with CORS (they solve similar problems differently).

### Interview Insight

> JSONP is legacy. Prefer CORS with `res.json()` for cross-origin APIs.

---

## 5. `res.redirect()` – Redirecting Users

### Purpose

Redirects the user from one route to another route or website.

### Example: Redirect to Another Route

```js
res.redirect('/users');
```

### Example: Redirect to External Website

```js
res.redirect('https://google.com');
```

### Redirect Status Codes

| Code | Meaning                      |
| ---- | ---------------------------- |
| 301  | Permanent redirect           |
| 302  | Temporary redirect           |
| 303  | Redirect after POST/PUT      |
| 307  | Temporary redirect (non-GET) |
| 308  | Permanent (non-GET)          |

Example:

```js
res.redirect(301, '/new-page');
```

### Redirect Back

```js
res.redirect('back');
// OR
res.redirect('..');
```

### Detailed Explanation

`res.redirect()` sends a response with:

- a redirect status code (default is **302**)
- a `Location` header pointing to the new URL

The browser then automatically requests the new location.

### Practical Examples

```js
// Temporary redirect (default 302)
app.get('/home', (req, res) => {
  res.redirect('/users');
});

// Permanent redirect (SEO-friendly when URL permanently changed)
app.get('/old-about', (req, res) => {
  res.redirect(301, '/about');
});

// After successful login/signup style flow
app.post('/login', (req, res) => {
  // validate user...
  res.redirect('/dashboard');
});
```

### Real-World Scenario

**Scenario:** After a user submits a contact form (`POST /contact`), the server redirects to `/thank-you` so refreshing the page does not resubmit the form (Post/Redirect/Get pattern).

### Best Practices

- Use **301** only for permanent URL changes.
- Use **302/303** for temporary or post-submit redirects.
- Prefer relative paths for internal redirects (`/users`).

### Common Mistakes

- Redirect loops (`/a` → `/b` → `/a`).
- Using 301 during testing and getting browsers to cache redirects aggressively.
- Redirecting APIs that expect JSON (APIs usually return JSON errors, not redirects).

### Important Notes

- `res.redirect('back')` uses the `Referer` header when available; behavior can vary if Referer is missing.
- `res.redirect('..')` goes one path segment up relative to the current URL.

### Interview Insight

> Redirects are common in server-rendered apps and auth flows; JSON APIs usually avoid redirects and return status + JSON instead.

---

## 6. `res.render()` – Rendering HTML with Template Engines

### Purpose

Used to render **dynamic HTML pages** using a **template engine**.

### Template Engine Used

**EJS (Embedded JavaScript)**

### Installation

```bash
npm install ejs
```

### Setup

```js
app.set('view engine', 'ejs');
```

### Folder Structure

```
project/
 ├─ views/
 │   └─ user.ejs
 └─ app.js
```

### Route Example

```js
app.get('/user', (req, res) => {
  res.render('user');
});
```

**Note:**

* `.ejs` extension is NOT written in `res.render()`
* Express automatically looks inside the `views` folder

### Detailed Explanation

`res.render(view, data)`:

1. Finds the template in `views`
2. Injects dynamic data
3. Generates final HTML
4. Sends HTML to the browser

This is **server-side rendering (SSR)** with templates.

### Passing Data to Templates

`views/user.ejs`:

```ejs
<!DOCTYPE html>
<html>
  <body>
    <h1>Welcome, <%= name %></h1>
    <p>Age: <%= age %></p>
  </body>
</html>
```

Route:

```js
app.set('view engine', 'ejs');

app.get('/user', (req, res) => {
  res.render('user', {
    name: 'Aman',
    age: 25
  });
});
```

### Optional Views Path Configuration

```js
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
```

### Real-World Scenario

**Scenario:** An admin dashboard page needs username and notification count from the database. Express fetches data and renders `dashboard.ejs` with dynamic values.

### Best Practices

- Keep business logic out of templates.
- Escape output by default (`<%= %>` in EJS) to reduce XSS risk.
- Use layouts/partials for repeated UI sections.

### Common Mistakes

- Writing `res.render('user.ejs')` unnecessarily (extension usually omitted).
- Forgetting `app.set('view engine', 'ejs')`.
- Putting templates outside the configured `views` folder.

### Interview Insight

> `res.render()` is for HTML pages via template engines. `res.json()` is for APIs. Many modern apps use React for UI and Express only as JSON API, but EJS is still useful for simple server-rendered sites.

---

## 7. `res.download()` – Force File Download

### Purpose

Forces the browser to **download a file**.

### Example

```js
res.download('./files/shortcut.pdf');
```

### Custom Download Name

```js
res.download('./files/shortcut.pdf', 'document.pdf');
```

Supported file types:

* PDF
* Images
* Audio
* Video
* ZIP, etc.

### Detailed Explanation

`res.download()` sets headers that tell the browser to download the file (typically `Content-Disposition: attachment`).

### Practical Example with Callback

```js
const path = require('path');

app.get('/download/report', (req, res) => {
  const filePath = path.join(__dirname, 'files', 'shortcut.pdf');

  res.download(filePath, 'document.pdf', (err) => {
    if (err) {
      console.error(err);
      if (!res.headersSent) {
        res.status(404).send('File not found');
      }
    }
  });
});
```

### Real-World Scenario

**Scenario:** A billing system lets users click “Download Invoice” and receive `invoice-2026-03.pdf` as a forced download.

### Best Practices

- Always use safe path joining (`path.join`) to avoid path traversal attacks.
- Validate that requested files are inside an allowed directory.
- Provide a clean download filename for users.

### Common Mistakes

- Passing unsanitized user input directly into file paths.
- Forgetting to handle missing files.
- Using relative paths inconsistently across environments.

### Security Note

Never do this with raw user input:

```js
// DANGEROUS
res.download('./files/' + req.query.file);
```

A malicious user could request `../../etc/passwd`-style paths.

---

## 8. `res.sendFile()` – Open File in Browser

### Purpose

Displays files directly in the browser instead of forcing download.

### Example (Relative Path)

```js
res.sendFile('./files/shortcut.pdf');
```

### Example (Absolute Path)

```js
res.sendFile(__dirname + '/files/shortcut.pdf');
```

### Difference Between `download` and `sendFile`

| Method       | Behavior                  |
| ------------ | ------------------------- |
| `download()` | Forces Save dialog        |
| `sendFile()` | Opens file in browser tab |

### Detailed Explanation

`res.sendFile()` streams a file to the client with headers that usually allow inline display (for PDFs/images in supporting browsers).

### Preferred Absolute Path Pattern

```js
const path = require('path');

app.get('/view/report', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'shortcut.pdf'));
});
```

### Important Technical Note

In many Express versions/setups, `sendFile` expects an **absolute path**. Using `__dirname` / `path.join` is the reliable approach.

### Real-World Scenario

**Scenario:** A documentation portal opens PDF guides in a new browser tab with `sendFile`, while “Download ZIP of all docs” uses `download`.

### Best Practices

- Prefer `path.join(__dirname, ...)` over string concatenation.
- Set correct static asset strategy (`express.static`) for public files.
- Use `sendFile` for controlled private files that need auth checks first.

### Common Mistakes

- Confusing `sendFile` with `express.static`.
- Using relative paths and getting path errors.
- Serving sensitive files without authentication.

### `express.static` vs `sendFile`

| Approach | Best for |
| --- | --- |
| `express.static('public')` | Public CSS/JS/images |
| `res.sendFile(...)` | One-off/protected file responses |

---

## 9. `res.end()` – End the Response

### Purpose

Stops the response immediately.

### Example

```js
res.write("Processing...");
res.end();
```

Used when:

* Ending response conditionally
* No further output is needed

### Detailed Explanation

`res.end()` finishes the response. It comes from Node’s HTTP response API and is lower-level than `res.send()`.

Typical uses:

- ending after manual `res.write()`
- ending with no body
- low-level/streaming style responses

### Practical Examples

```js
app.get('/ping', (req, res) => {
  res.status(204).end(); // No Content
});

app.get('/stream-demo', (req, res) => {
  res.write('Processing...');
  res.end();
});
```

### Real-World Scenario

**Scenario:** A webhook endpoint acknowledges receipt quickly with `res.status(200).end()` after queueing background work.

### Best Practices

- Prefer `res.send()` / `res.json()` for normal app responses.
- Use `res.end()` for no-body responses or advanced/manual writing.
- Ensure all code paths end the response.

### Common Mistakes

- Calling `res.end()` and then `res.send()`.
- Leaving requests hanging with no `send/json/end`.

### Interview Insight

> `res.send()` is high-level and convenient. `res.end()` is lower-level and just closes the response.

---

## 10. `res.sendStatus()` – Send HTTP Status Only

### Purpose

Sends **only a status code** as the response.

### Example

```js
res.sendStatus(404);
```

Browser Output:

```
Not Found
```

### Detailed Explanation

`res.sendStatus(code)` sets the status and sends the default status text body.

Examples:

```js
res.sendStatus(200); // body: OK
res.sendStatus(201); // body: Created
res.sendStatus(403); // body: Forbidden
res.sendStatus(500); // body: Internal Server Error
```

### Real-World Scenario

**Scenario:** A DELETE endpoint removes a resource and returns `res.sendStatus(204)` style no-content behavior, or a simple auth middleware returns `res.sendStatus(401)` when unauthorized.

### Best Practices

- Useful for quick status-only responses.
- For APIs, many teams prefer `res.status(404).json({ message: 'Not Found' })` for machine-readable errors.

### Common Mistakes

- Using `sendStatus` when the client expects JSON error details.
- Confusing `sendStatus(404)` with custom 404 HTML pages.

---

## 11. `res.status()` – Send Status with Data

### Purpose

Attach a status code to a response.

### Example

```js
res.status(200).send("Hello");
```

### Common HTTP Status Codes

| Code | Meaning               |
| ---- | --------------------- |
| 200  | OK                    |
| 201  | Created               |
| 403  | Forbidden             |
| 404  | Not Found             |
| 500  | Internal Server Error |
| 503  | Service Unavailable   |
| 504  | Gateway Timeout       |

### Detailed Explanation

`res.status(code)` does **not** send the response by itself. It sets the status, then you chain a sender:

```js
res.status(200).send('Hello');
res.status(201).json({ id: 1, name: 'Aman' });
res.status(404).json({ message: 'User not found' });
```

### Expanded Status Code Guide

| Code | When to use |
| --- | --- |
| 200 | Successful GET/PUT/PATCH |
| 201 | Successful POST creating a resource |
| 204 | Success with no response body |
| 400 | Bad request / validation error |
| 401 | Unauthenticated |
| 403 | Authenticated but not allowed |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, etc.) |
| 500 | Unexpected server error |
| 503 | Service down / maintenance |
| 504 | Upstream timeout |

### Practical API Examples

```js
// Success
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Created
app.post('/api/users', (req, res) => {
  res.status(201).json({ id: 101, name: 'Rahul' });
});

// Not found
app.get('/api/users/:id', (req, res) => {
  res.status(404).json({ message: 'User not found' });
});

// Server error
app.get('/api/crash-demo', (req, res) => {
  res.status(500).json({ message: 'Internal Server Error' });
});
```

### Real-World Scenario

**Scenario:** Frontend shows different UI based on status:

- `201` → show “User created”
- `400` → show validation errors
- `401` → redirect to login

### Best Practices

- Always set status intentionally in APIs.
- Keep status meaning consistent across endpoints.
- Include error messages/codes in JSON body for clients.

### Common Mistakes

- Returning errors with `200 OK` and only an error message in body.
- Using `500` for validation failures (should be `400`).
- Calling `res.status(404)` without sending a body/ending response.

### Interview Insight

> `res.status()` sets the code; you still need `send`, `json`, `end`, etc. to finish the response.

---

## 12. `res.headersSent` – Check If Response Is Sent

### Purpose

Checks whether the response has already been sent.

### Example

```js
console.log(res.headersSent); // false
res.send("Hello");
console.log(res.headersSent); // true
```

Useful to prevent **multiple responses** in complex logic.

### Detailed Explanation

`res.headersSent` is a boolean:

- `false` → response not started
- `true` → headers already sent (response started/finished)

This is especially useful in error handlers and callbacks.

### Practical Example

```js
app.get('/safe', (req, res) => {
  try {
    res.send('Hello');
  } catch (err) {
    if (!res.headersSent) {
      res.status(500).send('Something went wrong');
    }
  }
});
```

### Real-World Scenario

**Scenario:** A file download callback receives an error after streaming started. Checking `res.headersSent` prevents crashing when trying to send a second error response.

### Best Practices

- Use in error-handling paths and async callbacks.
- Design code so only one clear response path exists whenever possible.
- Log when a second send is attempted.

### Common Mistakes

- Ignoring this check in nested callbacks and getting header errors.
- Relying on it as a substitute for clean control flow.

---

## 13. `res.set()` and `res.get()` – Custom Headers

### Purpose

Acts like **variables** stored in response headers.

### Set Header

```js
res.set('custom-header', 'hello123');
```

### Get Header

```js
console.log(res.get('custom-header'));
```

### Example

```js
res.set('custom-header', 'hello123');
res.send('Header Set');
```

Used for:

* Custom metadata
* Tokens
* API headers

### Detailed Explanation

HTTP headers are metadata sent with the response. Express lets you set/read them before the response is sent.

### Practical Examples

```js
app.get('/headers-demo', (req, res) => {
  res.set('X-Powered-By', 'Express-Study-Notes');
  res.set('Cache-Control', 'no-store');
  res.set({
    'Content-Language': 'en',
    'X-Request-Id': 'abc-123'
  });

  console.log(res.get('X-Request-Id')); // abc-123
  res.send('Header Set');
});
```

### Common Real Headers

| Header | Purpose |
| --- | --- |
| `Content-Type` | Type of body (json/html/file) |
| `Cache-Control` | Caching rules |
| `Location` | Redirect target |
| `Set-Cookie` | Cookies |
| `Authorization` related custom headers | Tokens/metadata (careful with security) |

### Real-World Scenario

**Scenario:** An API sets `X-Request-Id` so logs, support teams, and clients can correlate a specific request during incident debugging.

### Best Practices

- Set headers before `send/json/download`.
- Use standard headers when possible.
- Do not expose sensitive secrets in custom headers.

### Common Mistakes

- Setting headers after response is sent.
- Putting JWTs in custom headers insecurely without HTTPS.
- Overusing custom headers when body data is more appropriate.

### Related Helpers

```js
res.type('json');                 // Content-Type shortcut
res.set('Content-Type', 'text/html');
res.append('Set-Cookie', 'a=1');  // append instead of overwrite
```

---

## 14. Summary of Response Methods

| Method            | Use Case              |
| ----------------- | --------------------- |
| `send()`          | Send any type of data |
| `json()`          | Send JSON APIs        |
| `jsonp()`         | Legacy cross-domain   |
| `redirect()`      | Redirect users        |
| `render()`        | Render HTML pages     |
| `download()`      | Force file download   |
| `sendFile()`      | Open file in browser  |
| `end()`           | End response          |
| `sendStatus()`    | Status only           |
| `status()`        | Status + data         |
| `headersSent`     | Check response state  |
| `set()` / `get()` | Manage headers        |

---

This tutorial establishes **complete mastery of Express.js response handling**, which is essential for:

* APIs
* File serving
* Authentication
* Dynamic websites

### Expanded Decision Guide

| You want to... | Use |
| --- | --- |
| Send HTML/text quickly | `res.send()` |
| Send API JSON | `res.json()` |
| Support legacy cross-domain script clients | `res.jsonp()` (avoid if possible) |
| Send user to another URL | `res.redirect()` |
| Render EJS/Pug page | `res.render()` |
| Force download | `res.download()` |
| Open/view file in browser | `res.sendFile()` |
| Close response with little/no body | `res.end()` / `res.sendStatus()` |
| Add status + body | `res.status(...).json/send` |
| Avoid double-send bugs | check `res.headersSent` |
| Add metadata | `res.set()` |

---

## 15. Mini Practice Lab

```js
const express = require('express');
const path = require('path');
const app = express();

app.set('view engine', 'ejs');

app.get('/send', (req, res) => {
  res.send('<h1>Home Page</h1>');
});

app.get('/json', (req, res) => {
  res.json({ name: 'Rahul', age: 30 });
});

app.get('/redirect', (req, res) => {
  res.redirect('/json');
});

app.get('/user', (req, res) => {
  res.render('user', { name: 'Aman', age: 25 });
});

app.get('/download', (req, res) => {
  res.download(path.join(__dirname, 'files', 'shortcut.pdf'), 'document.pdf');
});

app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, 'files', 'shortcut.pdf'));
});

app.get('/status', (req, res) => {
  res.status(201).json({ message: 'Created' });
});

app.get('/headers', (req, res) => {
  res.set('custom-header', 'hello123');
  res.send('Header Set');
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
```

### Practice Checklist

- [ ] Compare `res.send` vs `res.json` in browser/Postman
- [ ] Create a 301 redirect from an old route
- [ ] Render an EJS page with dynamic data
- [ ] Test `download` vs `sendFile` with a PDF
- [ ] Return `404` and `201` with JSON bodies
- [ ] Log `res.headersSent` before and after sending

---

## 16. Common Interview Questions

### Q1. Difference between `res.send()` and `res.json()`?

**Answer:** Both can send objects as JSON, but `res.json()` is explicitly for JSON responses and is preferred in REST APIs. `res.send()` is more general (text/HTML/buffers/objects).

### Q2. Difference between `res.download()` and `res.sendFile()`?

**Answer:** `download()` forces a save/download dialog; `sendFile()` typically opens/serves the file in the browser.

### Q3. Does `res.status()` send the response?

**Answer:** No. It only sets the status code. You must chain `send`, `json`, `end`, etc.

### Q4. Why is JSONP discouraged?

**Answer:** It is an older, less secure cross-domain approach. Modern apps use CORS with JSON APIs.

### Q5. What is `res.headersSent` used for?

**Answer:** To check whether a response has already started, preventing duplicate send errors in callbacks/error handlers.

### Q6. When do you use `res.render()`?

**Answer:** When generating HTML on the server with a template engine like EJS.

---

## 17. Key Takeaways

* Every route handler responds through the `res` object
* Choose methods based on response type (HTML, JSON, file, redirect)
* Prefer `res.json()` for APIs
* Prefer CORS over JSONP
* Use status codes intentionally (`200`, `201`, `404`, `500`, ...)
* `download` vs `sendFile` differs by force-download vs inline view
* Never send a response twice; use `headersSent` when needed
* Set custom headers with `res.set()` before sending the body

---

*End of study notes — Express.js Response Methods.*
