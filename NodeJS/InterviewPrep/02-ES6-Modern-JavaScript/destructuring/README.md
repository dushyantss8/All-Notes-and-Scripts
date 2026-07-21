# Destructuring

Destructuring binds object properties or iterable positions to variables. It is a concise boundary tool for function parameters and API responses.

```js
const { id, profile: { name = "Anonymous" } = {} } = response;
const [first, , third, ...rest] = values;
function render({ title, options: { compact = false } = {} }) { /* ... */ }
```

Defaults apply for `undefined`, not `null`; destructuring `null`/`undefined` throws unless an outer default is provided. Rename to avoid collisions and keep deeply nested patterns readable.

Interview: array holes, rest placement, defaults, and object property rename syntax.
