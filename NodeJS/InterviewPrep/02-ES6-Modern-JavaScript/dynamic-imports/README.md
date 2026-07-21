# Dynamic Imports

`import()` loads an ES module at runtime and returns a Promise for its module namespace object. Unlike static `import`, it can appear inside functions and conditions.

## Syntax and internal working

```js
const module = await import("./formatter.js");
console.log(module.format("Ada"));
// Ada
```

The host resolves, fetches, parses, and evaluates the module using the ESM module cache. Repeated imports of the same resolved specifier reuse the module rather than re-evaluating it.

## Examples

```js
async function formatWhenNeeded(text) {
  const { format } = await import("./formatter.js");
  return format(text);
}

async function loadLocale(locale) {
  const messages = await import(`./locales/${locale}.js`);
  console.log(messages.default.title);
}
// loadLocale("en") might print: Welcome
```

Use dynamic import for code splitting, optional integrations, on-demand locale/feature loading, and plugin systems. Dynamic specifiers should be constrained to known values, especially in bundler applications.

## Common mistakes and best practices

- `import()` returns a Promise; it does not return exports synchronously.
- A dynamic import still needs a valid module and can reject due to resolution, network, or evaluation errors—handle failures.
- Do not interpolate unchecked user input into a module path; use an allowlist mapping.
- Keep ordinary dependencies static when possible: static imports are easier for tools to analyze and optimize.
- In Node.js, ensure imported files use ESM semantics (`.mjs` or `"type": "module"`).

## Interview questions

**Static import versus `import()`?** Static imports are declarative and resolved before execution; dynamic import is runtime, conditional, and Promise-based.

**What does dynamic import resolve to?** A module namespace object containing the exports (with `default` for a default export).

**Is a module executed on every dynamic import?** Normally no; ESM caches modules by resolved specifier.

## References

- [MDN: import()](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/import)
- [MDN: JavaScript modules](https://developer.mozilla.org/docs/Web/JavaScript/Guide/Modules)
