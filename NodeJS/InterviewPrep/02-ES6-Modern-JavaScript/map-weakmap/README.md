# Map and WeakMap

`Map` is an ordered key-value collection whose keys can be any value. `WeakMap` keys must be objects and are weakly held, allowing garbage collection when no other references remain.

## Syntax and internal working

```js
const counts = new Map([["ready", 1]]);
counts.set({}, "object key");
```

Map compares keys with SameValueZero (`NaN` equals `NaN`; object keys compare by identity). WeakMap is intentionally non-enumerable: exposing keys would prevent its garbage-collection guarantee.

## Examples

```js
const map = new Map();
map.set("name", "Ada").set(1, "one");
console.log(map.get("name")); // Ada
console.log(map.size); // 2
console.log([...map.keys()]); // ["name", 1]

const metadata = new WeakMap();
let user = { name: "Ada" };
metadata.set(user, { lastSeen: "today" });
console.log(metadata.get(user).lastSeen); // today
user = null; // its metadata can now be collected
```

Use Map for caches, frequency counts, and keys that are not strings. Use WeakMap for metadata tied to object lifetimes or private-like external state.

## Common mistakes and best practices

- `map.get(key)` returning `undefined` is ambiguous; use `map.has(key)` when `undefined` can be a stored value.
- Object literals convert object keys to strings; use Map when identity matters.
- WeakMap has no `size`, `keys`, or `forEach`; it is not for data you need to enumerate.
- Do not depend on when garbage collection occurs.

## Interview questions

**Map versus object?** Map supports any key type, has predictable iteration order and `size`, while objects are primarily property records.

**Why is WeakMap not iterable?** Enumerating keys could reveal or retain objects whose collection must remain observable only indirectly.

**Does WeakMap make an object immediately collectible?** No; collection happens only after all strong references are gone and at the engine’s discretion.

## References

- [MDN: Map](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Map)
- [MDN: WeakMap](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakMap)
