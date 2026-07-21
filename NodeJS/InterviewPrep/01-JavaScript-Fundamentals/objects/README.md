# Objects

> Object literals, property access, prototypes, descriptors, cloning, and ES2023/2024 helpers.

**Difficulty:** Beginner → Advanced  
**Docs:** [MDN: Working with objects](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Working_with_objects) · [Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)

---

## Explanation

Almost everything non-primitive is an object. Objects are collections of properties (key → value) with a link to a **prototype** for inheritance.

```mermaid
flowchart TD
  Obj[Object instance] -->|[[Prototype]]| Proto[Prototype object]
  Proto -->|[[Prototype]]| Parent[Parent prototype]
  Parent -->|[[Prototype]]| Null[null]
```

Property lookup walks the prototype chain until found or `null`.

---

## Syntax

```js
const user = {
  id: 1,
  name: 'Ada',
  greet() {
    return `Hi ${this.name}`;
  },
};

const { name, ...rest } = user;
const copy = { ...user, role: 'admin' };
```

---

## Examples

### Example 1 — Creation & access

```js
const o = { a: 1, 'b-c': 2 };
console.log(o.a);       // 1
console.log(o['b-c']);  // 2
o.d = 4;
delete o.a;
```

### Example 2 — Shorthand & computed keys

```js
const key = 'status';
const status = 'active';
const row = { status, [key + 'Code']: 200 };
console.log(row); // { status: 'active', statusCode: 200 }
```

### Example 3 — Prototype basics

```js
const proto = {
  greet() {
    return `hi ${this.name}`;
  },
};
const user = Object.create(proto);
user.name = 'Ada';
console.log(user.greet()); // hi Ada
console.log(Object.getPrototypeOf(user) === proto); // true
```

### Example 4 — Descriptors & freeze

```js
const config = { port: 3000 };
Object.defineProperty(config, 'port', { writable: false });
Object.freeze(config);
// config.port = 4000; // ignored/strict TypeError
console.log(Object.isFrozen(config)); // true
```

### Example 5 — Cloning

```js
const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 9;
console.log(original.nested.b); // 9 (shared)

const deep = structuredClone(original);
deep.nested.b = 1;
console.log(original.nested.b); // 9
```

### Example 6 — `Object` helpers

```js
const user = { id: 1, name: 'Ada' };
console.log(Object.keys(user));              // ['id','name']
console.log(Object.values(user));            // [1,'Ada']
console.log(Object.entries(user));           // [['id',1],['name','Ada']]
console.log(Object.fromEntries([['x', 1]])); // { x: 1 }
console.log(Object.hasOwn(user, 'id'));      // true (ES2022)
```

### Example 7 — Optional chaining assignment patterns

```js
const state = { user: { profile: { age: 30 } } };
console.log(state.user?.profile?.age); // 30
```

---

## Common Mistakes

1. Shallow copy when deep copy was needed.
2. Using `in` without realizing it checks the prototype chain — prefer `Object.hasOwn`.
3. Mutating shared objects returned from caches/APIs.
4. Comparing objects with `===` for structural equality.
5. Forgetting `__proto__` pollution risks when merging untrusted keys.

---

## Best Practices

- Prefer plain objects or `Map` intentionally (string keys vs arbitrary keys).
- Use `Object.hasOwn` / `Object.create(null)` for dictionaries from external input.
- Prefer `structuredClone` for deep clones when supported and data is cloneable.
- Avoid mutating objects you don’t own.
- Use classes or factory functions for behavior-heavy domain models.

---

## Performance Considerations

- Shape-stable objects (same properties added in same order) optimize better in V8.
- Large prototype chains can slow lookups — keep inheritance shallow.
- `Object.keys` allocates arrays — cache if used repeatedly in hot loops.
- Maps can outperform objects for frequent add/delete of dynamic keys.

---

## Interview Questions

**Q1. How does prototype inheritance work?**  
Failed own-property lookup continues on `[[Prototype]]` until `null`.

**Q2. Shallow vs deep copy?**  
Shallow copies top-level only; nested refs shared. Deep copies recursively / via `structuredClone`.

**Q3. `in` vs `hasOwn`?**  
`in` includes prototype; `Object.hasOwn` is own properties only.

**Q4. What does `Object.freeze` do?**  
Shallow immutability: no add/remove/reassign of own properties.

**Q5. Why is `__proto__` dangerous with user input?**  
Attackers can inject `__proto__` to pollute Object.prototype.

---

## Notes

- Run [`example.js`](./example.js) and [`example-prototype.js`](./example-prototype.js).
- Related: [Arrays](../arrays/README.md), [Memory Management](../memory-management/README.md).

---

## References

- [MDN: Object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object)
- [MDN: Inheritance and the prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)
- [MDN: structuredClone](https://developer.mozilla.org/en-US/docs/Web/API/structuredClone)
