# BigInt

`BigInt` represents integers larger than `Number.MAX_SAFE_INTEGER` (`9_007_199_254_740_991`). Create one with an `n` suffix or `BigInt()`.

## Syntax and internal working

```js
const id = 9_007_199_254_740_992n;
const alsoId = BigInt("9007199254740992");
```

Numbers use IEEE-754 doubles, so large integers lose precision. BigInts store integer precision separately and support integer arithmetic; they cannot represent fractions.

## Examples

```js
console.log(9007199254740993 === 9007199254740992); // true (Number precision loss)
console.log(9007199254740993n === 9007199254740992n); // false
console.log(10n ** 3n); // 1000n
console.log(7n / 2n); // 3n (integer division)
console.log(5n < 6); // true (relational comparison permits mixing)
```

Use BigInt for database identifiers, counters, cryptography, and exact large integer calculations.

## Common mistakes and best practices

- Do not mix arithmetic types: `1n + 1` throws `TypeError`; convert deliberately with `BigInt(number)` or `Number(bigint)` after checking range.
- `Math.*` and JSON do not directly support BigInt. Convert or define an explicit serialization format.
- `7n / 2n` truncates, not `3.5`; use Number/decimal arithmetic if fractions are required.
- Prefer strings for externally serialized IDs when consumers may not support BigInt.

## Interview questions

**Why not use Number for all IDs?** Numbers cannot exactly represent every integer above `MAX_SAFE_INTEGER`.

**Can BigInt and Number be compared?** Yes with relational operators and loose equality in some cases, but strict equality is false because their types differ. Arithmetic mixing throws.

**Why does `JSON.stringify({ id: 1n })` fail?** JSON has no BigInt type; choose a string or custom serializer.

## References

- [MDN: BigInt](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
- [MDN: Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER)
