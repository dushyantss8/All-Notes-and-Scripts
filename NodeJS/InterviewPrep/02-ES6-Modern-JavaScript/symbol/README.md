# Symbol

A Symbol is a unique primitive value, commonly used as a collision-free object property key and for language protocols such as iteration.

## Syntax and internal working

```js
const token = Symbol("token");
const record = { [token]: "secret" };
```

Every `Symbol()` call creates a distinct value. The global symbol registry, accessed with `Symbol.for`, returns the same symbol for the same string key. Symbols are not included by `Object.keys`, JSON serialization, or ordinary `for...in`.

## Examples

```js
const a = Symbol("id");
const b = Symbol("id");
console.log(a === b); // false

const sharedA = Symbol.for("app.cache");
const sharedB = Symbol.for("app.cache");
console.log(sharedA === sharedB); // true

const secret = Symbol("secret");
const user = { name: "Ada", [secret]: 42 };
console.log(Object.keys(user)); // ["name"]
console.log(user[secret]); // 42
console.log(Object.getOwnPropertySymbols(user)); // [Symbol(secret)]
```

Use symbols for library metadata, collision-resistant extension points, and custom protocols like `[Symbol.iterator]`. They are not a privacy/security mechanism.

## Common mistakes and best practices

- Symbols are unique even with the same description; descriptions are for debugging only.
- Use a symbol reference to read a symbol-keyed property; `Symbol("x")` cannot recreate it.
- `Symbol.for` is global within an agent/realm; use it only when shared identity is intended.
- `JSON.stringify` omits symbol-keyed properties.

## Interview questions

**Symbol versus string keys?** Symbols avoid accidental key collisions and are skipped by ordinary string-key enumeration.

**Are symbol properties private?** No. They can be discovered via `Object.getOwnPropertySymbols`.

**What are well-known symbols?** Built-in symbols such as `Symbol.iterator` that customize language behavior.

## References

- [MDN: Symbol](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol)
- [MDN: Well-known symbols](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Symbol#well-known_symbols)
