# Default Parameters

Default parameters assign a value when an argument is `undefined` or omitted. They do not apply to `null`, `0`, `false`, or `""`.

## Syntax and internal working

```js
function greet(name = "guest", punctuation = "!") {
  return `Hello, ${name}${punctuation}`;
}
```

Defaults are evaluated at call time, left to right, in a parameter scope that can reference earlier parameters. This avoids shared mutable defaults.

## Examples

```js
console.log(greet()); // Hello, guest!
console.log(greet(undefined, "?")); // Hello, guest?
console.log(greet(null)); // Hello, null!

function createUser(name, id = `${name}-${Date.now()}`) {
  return { name, id };
}
console.log(createUser("Ada").name); // Ada

function addItem(item, list = []) {
  list.push(item);
  return list;
}
console.log(addItem("a")); // ["a"]
console.log(addItem("b")); // ["b"]
```

Use them for optional configuration, dependency injection, and safe per-call collections.

## Common mistakes and best practices

- `value || fallback` treats valid falsy values as absent; use a default parameter or `??` when null should also be absent.
- Place required parameters first. Passing `undefined` to skip a middle parameter is less readable than an options object.
- A default expression runs each call, so avoid costly work unless it is intentional.
- `function.length` counts parameters before the first default, which may affect code that inspects arity.

## Interview questions

**When is a default used?** Only when the corresponding argument is `undefined` or missing.

**Why are `[]` and `{}` safe defaults in JavaScript?** The expression is evaluated for every call, creating a fresh object—unlike Python’s definition-time defaults.

**Can defaults reference other parameters?** Yes, earlier parameters are available; later ones are not.

## References

- [MDN: Default parameters](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Functions/Default_parameters)
