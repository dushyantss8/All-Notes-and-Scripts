# EJS Template Engine with Express.js (Part 1) –

## 1. Introduction to EJS

**EJS (Embedded JavaScript Templates)** is a JavaScript-based template engine used with Express.js to generate dynamic HTML pages.

### Key Features of EJS

* Allows embedding JavaScript directly inside HTML
* Helps create **dynamic, reusable, and clean HTML**
* Eliminates the need for `<script>` tags for simple logic
* No need to manually target DOM elements
* Ideal for server-side rendering with Express.js

---

## 2. Why Use a Template Engine?

Without a template engine:

* HTML files remain static
* JavaScript logic must be added separately

With EJS:

* JavaScript logic can be written directly in HTML
* Dynamic data can be injected from the server
* Control structures like loops and conditions can be used in HTML

---

## 3. EJS Syntax and Tags

### 3.1 Commonly Used EJS Tags

| Tag      | Purpose                                    |
| -------- | ------------------------------------------ |
| `<% %>`  | Execute JavaScript code (if, loops, logic) |
| `<%= %>` | Print variable value (HTML escaped – safe) |
| `<%- %>` | Print raw HTML (unsafe, no escaping)       |
| `<%# %>` | Comment in EJS                             |
| `<%_ %>` | Remove whitespace before the tag           |
| `<% -%>` | Prevent automatic new line                 |
| `<% %_>` | Remove whitespace after the tag            |

> **Most frequently used tags:**
> `<% %>` and `<%= %>`

---

## 4. Printing Values and Loops in EJS

### Example: Loop inside HTML

```ejs
<ul>
  <% for(let i = 1; i <= 3; i++) { %>
    <li><%= i %></li>
  <% } %>
</ul>
```

### Output:

```html
1
2
3
```

### Security Note

* `<%= %>` escapes HTML and protects against **XSS attacks**
* `<%- %>` does not escape HTML and is unsafe

---

## 5. Installing EJS with Express.js

### Step 1: Initialize Node.js Project

```bash
npm init -y
```

### Step 2: Install Required Packages

```bash
npm install express nodemon ejs
```

---

## 6. Project Setup

### Folder Structure

```
ejs-project/
│
├── index.js
├── package.json
└── views/
    └── about.ejs
```

---

## 7. Configuring Express.js with EJS

### Enable ES6 Imports

In `package.json`:

```json
"type": "module"
```

### index.js Basic Setup

```js
import express from "express";

const app = express();

app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
```

> By default, Express looks for `.ejs` files inside the **views** folder.

---

## 8. Creating Routes and Rendering Views

### Static Route Example

```js
app.get("/", (req, res) => {
  res.send("Home Page");
});
```

### Rendering an EJS File

```js
app.get("/about", (req, res) => {
  res.render("about");
});
```

This automatically loads:

```
views/about.ejs
```

---

## 9. Passing Data to EJS Templates

### Sending Data from Route

```js
app.get("/about", (req, res) => {
  res.render("profile", {
    title: "About Page",
    message: "Welcome to EJS"
  });
});
```

### Accessing Data in EJS

```ejs
<title><%= title %></title>
<h1><%= title %></h1>
<p><%= message %></p>
```

---

## 10. Conditional Rendering (if–else)

### EJS If Statement

```ejs
<% if(message) { %>
  <p><%= message %></p>
<% } else { %>
  <span>There is no message</span>
<% } %>
```

* Paragraph is shown only if `message` exists
* Else block executes if message is empty or null

---

## 11. Using Loops with Arrays

### Example: Looping Through an Array

#### Route

```js
app.get("/about", (req, res) => {
  const items = ["Apple", "Banana", "Cherry"];
  res.render("about", { items });
});
```

#### EJS Template

```ejs
<ul>
  <% items.forEach(item => { %>
    <li><%= item %></li>
  <% }) %>
</ul>
```

---

## 12. Removing Extra Whitespace

To avoid extra new lines:

```ejs
<% items.forEach(item => { -%>
  <li><%= item %></li>
<% }) -%>
```

---

## 13. Passing Array of Objects (Users Example)

### Data from Route

```js
const users = [
  { name: "Aman", age: 25, city: "Delhi" },
  { name: "Rohit", age: 30, city: "Mumbai" },
  { name: "Neha", age: 22, city: "Pune" }
];

res.render("about", { users });
```

---

## 14. Displaying Data in a Table

### EJS Table Example

```ejs
<table border="1" width="500">
  <tr>
    <th>Name</th>
    <th>Age</th>
    <th>City</th>
  </tr>

  <% users.forEach(user => { %>
    <tr>
      <td><%= user.name %></td>
      <td><%= user.age %></td>
      <td><%= user.city %></td>
    </tr>
  <% }) %>
</table>
```

---

## 15. Key Takeaways

* EJS allows mixing JavaScript with HTML
* Express automatically loads EJS files from `views`
* Data can be passed using `res.render()`
* Supports:

  * Variables
  * Conditions
  * Loops
  * Arrays
  * Array of objects
* `<%= %>` is secure and recommended

---