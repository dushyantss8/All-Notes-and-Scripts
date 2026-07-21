# Proxy and Reflect

A `Proxy` intercepts fundamental operations on a target object through handler traps. `Reflect` provides corresponding default operations, useful for forwarding traps correctly.

## Syntax and internal working

```js
const user = new Proxy({ name: "Ada" }, {
  get(target, key, receiver) {
    return Reflect.get(target, key, receiver);
  }
});
```

Property access, assignment, `in`, function calls, construction, and enumeration may invoke traps. Engines enforce invariants: a proxy cannot report impossible facts about non-configurable properties or non-extensible targets.

## Examples

```js
const settings = new Proxy({ theme: "dark" }, {
  get(target, key, receiver) {
    if (!(key in target)) throw new ReferenceError(`Unknown setting: ${key}`);
    return Reflect.get(target, key, receiver);
  },
  set(target, key, value, receiver) {
    if (key === "theme" && !["dark", "light"].includes(value)) return false;
    return Reflect.set(target, key, value, receiver);
  }
});
console.log(settings.theme); // dark

const point = { x: 3 };
console.log(Reflect.has(point, "x")); // true
console.log(Reflect.ownKeys(point)); // ["x"]
```

Use proxies for validation, observability, virtualization, and reactive frameworks. Use Reflect inside traps to preserve ordinary prototype and receiver behavior.

## Common mistakes and best practices

- Always consider invariants; violating them throws `TypeError`.
- A `set` trap should return a boolean. In strict mode, returning false makes assignment throw.
- Proxies are not a security boundary and can affect performance/debugging.
- Avoid surprising hidden behavior in general application objects; expose clear APIs where possible.

## Interview questions

**Proxy versus `Object.defineProperty`?** Proxy can intercept many operations, including unknown future properties and functions; descriptors affect specific properties.

**Why use `Reflect.get`?** It implements default lookup with the correct receiver, preserving getters and prototype behavior.

**Can a proxy intercept private `#fields`?** No. Private elements are lexical and their access is not a normal property operation.

## References

- [MDN: Proxy](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
- [MDN: Reflect](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Reflect)
