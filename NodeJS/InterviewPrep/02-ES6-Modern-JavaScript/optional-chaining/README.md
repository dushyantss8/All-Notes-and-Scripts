# Optional Chaining (`?.`)

Optional chaining safely reads or calls through a possibly `null`/`undefined` value. It returns `undefined` instead of throwing at that point.

## Syntax and internal working

```js
const city = user?.profile?.address?.city;
const first = list?.[0];
callback?.("saved");
```

Each optional segment tests its immediate base for nullishness and short-circuits the continuous chain. It does not catch errors from an existing property getter or a non-function call.

## Examples

```js
const user = { profile: { name: "Ada" } };
console.log(user.profile?.name); // Ada
console.log(user.profile?.address?.city); // undefined
console.log(null?.name); // undefined

function notify(message, onNotify) {
  onNotify?.(message);
}
notify("done"); // no error
notify("done", console.log); // done
```

Use it for optional API fields, callbacks, DOM queries, and nested configuration. Pair with `??` when an actual default is needed.

## Common mistakes and best practices

- `undeclaredVariable?.x` still throws `ReferenceError`; the variable itself must exist.
- `obj?.method()` only protects `obj`; use `obj.method?.()` when the method itself may be missing.
- `obj?.a.b` can throw if `a` is nullish; write `obj?.a?.b`.
- It cannot be used on the left of assignment (`obj?.x = 1` is invalid).
- Avoid using it to hide invariants: required data should be validated and fail clearly.

## Interview questions

**What values short-circuit optional chaining?** Only `null` and `undefined`, not other falsy values.

**Does it catch any error?** No. It only prevents nullish property access/calls in the chain.

**Difference between `obj?.fn()` and `obj.fn?.()`?** The first guards the object; the second guards whether `fn` is callable.

## References

- [MDN: Optional chaining](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Optional_chaining)
