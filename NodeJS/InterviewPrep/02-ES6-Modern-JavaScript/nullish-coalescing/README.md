# Nullish Coalescing (`??`)

`left ?? right` evaluates to `right` only when `left` is `null` or `undefined`; otherwise it preserves `left`, including valid falsy values.

## Syntax and internal working

```js
const pageSize = config.pageSize ?? 20;
```

The left operand is evaluated once. If it is nullish, the right operand is evaluated; otherwise the right side is skipped (short-circuiting).

## Examples

```js
console.log(0 ?? 10); // 0
console.log(false ?? true); // false
console.log("" ?? "anonymous"); // ""
console.log(null ?? "anonymous"); // anonymous
console.log(undefined ?? "anonymous"); // anonymous

let timeout;
timeout ??= 5_000;
console.log(timeout); // 5000
```

Use it for optional configuration values where `0`, `false`, and empty strings are meaningful.

## Common mistakes and best practices

- `||` defaults all falsy values, while `??` defaults only nullish ones. Pick the semantic rule you mean.
- JavaScript forbids mixing `??` directly with `&&` or `||` without parentheses: write `(a ?? b) || c`.
- Use `??=` only when assigning a default to nullish existing values is intended.
- Combine with optional chaining: `response?.settings?.theme ?? "system"`.

## Interview questions

**Why was `??` added when `||` already exists?** To default missing values without replacing valid falsy values.

**Does `??` treat `NaN` as absent?** No. Only `null` and `undefined` are nullish.

**Is the fallback always evaluated?** No, it is evaluated only when the left side is nullish.

## References

- [MDN: Nullish coalescing](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/Nullish_coalescing)
