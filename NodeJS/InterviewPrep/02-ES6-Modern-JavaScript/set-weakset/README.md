# Set and WeakSet

`Set` stores unique values in insertion order. `WeakSet` stores only objects weakly, so entries do not keep those objects alive.

## Syntax and internal working

```js
const tags = new Set(["js", "node", "js"]);
console.log(tags.size); // 2
```

Set uniqueness uses SameValueZero: `NaN` equals `NaN`, and `0` and `-0` are the same. Object values are unique by identity. WeakSet is non-enumerable for the same garbage-collection reason as WeakMap.

## Examples

```js
const ids = new Set([1, 2, 2, 3]);
console.log([...ids]); // [1, 2, 3]
console.log(ids.has(2)); // true
ids.delete(2);
console.log(ids.has(2)); // false

const visited = new WeakSet();
const node = {};
visited.add(node);
console.log(visited.has(node)); // true
```

Use Set for deduplicating values, membership tests, and collecting unique tags. Use WeakSet to mark object instances without extending their lifetime, such as visited nodes during object graph processing.

## Common mistakes and best practices

- `new Set(array)` deduplicates primitive values but not separately-created equal-looking objects.
- Set does not perform deep equality; choose a key or explicit comparison for object content.
- WeakSet cannot contain primitives, cannot be iterated, and has no `size`.
- Prefer `set.has(value)` over `array.includes(value)` for repeated large membership checks.

## Interview questions

**Set versus array?** Set enforces uniqueness and has efficient membership semantics; arrays preserve duplicates and indexed order.

**Why can’t WeakSet be iterated?** Listing members would make weak collection behavior observable and conflict with garbage collection.

**Does Set consider `{}` and `{}` duplicates?** No; they are distinct object references.

## References

- [MDN: Set](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Set)
- [MDN: WeakSet](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/WeakSet)
