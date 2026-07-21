# Math

> Rounding, clamping, random numbers, trigonometry, and interview-ready numeric helpers.

**Difficulty:** Beginner → Intermediate  
**Docs:** [MDN: Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)

---

## Explanation

`Math` is a built-in object providing constants and functions for numeric operations. It is not a constructor (`new Math()` throws).

Common interview uses: clamp values, random integers, rounding modes, min/max, and understanding `Math.random()` is **not** cryptographically secure.

---

## Syntax

```js
Math.max(1, 5, 3);
Math.min(...arr);
Math.floor(1.9);
Math.ceil(1.1);
Math.round(1.5);
Math.trunc(1.9);
Math.random();
```

---

## Examples

### Example 1 — Rounding modes

```js
console.log(Math.floor(1.9));  // 1
console.log(Math.ceil(1.1));   // 2
console.log(Math.round(1.5));  // 2
console.log(Math.trunc(-1.9)); // -1
console.log(Math.floor(-1.1)); // -2
```

### Example 2 — min / max / clamp

```js
const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
console.log(clamp(120, 0, 100)); // 100
console.log(Math.max(1, 9, 3));  // 9
console.log(Math.min(...[4, 2, 8])); // 2
```

### Example 3 — Random integer in range

```js
function randomInt(min, max) {
  // inclusive min/max
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log(randomInt(1, 6)); // dice roll 1..6
```

### Example 4 — Constants & powers

```js
console.log(Math.PI);
console.log(Math.SQRT2);
console.log(Math.pow(2, 10)); // 1024
console.log(2 ** 10);         // 1024
console.log(Math.hypot(3, 4)); // 5
```

### Example 5 — Absolute & sign

```js
console.log(Math.abs(-7)); // 7
console.log(Math.sign(-5)); // -1
console.log(Math.sign(0));  // 0
```

### Example 6 — Crypto random (Node)

```js
const { randomInt } = require('crypto');
console.log(randomInt(1, 7)); // secure 1..6
```

---

## Common Mistakes

1. Using `Math.random` for tokens/OTP/security.
2. Wrong inclusive/exclusive bounds in random helpers.
3. Confusing `floor` vs `trunc` for negatives.
4. Spreading huge arrays into `Math.max(...arr)` → stack overflow; use loop/reduce.
5. Expecting `Math` methods to fix float money issues.

---

## Best Practices

- Use `crypto.randomInt` / `crypto.randomBytes` for security.
- Write a tested `clamp` / `randomInt` utility.
- Prefer `**` over `Math.pow` for readability.
- Document inclusive vs exclusive ranges.
- For stats on large arrays, use a loop to avoid call-stack limits.

---

## Performance Considerations

- `Math` calls are cheap; algorithmic complexity dominates.
- Avoid `Math.max(...hugeArray)` — iterative max is safer.
- Don’t recompute constants in tight loops unnecessarily (usually negligible).

---

## Interview Questions

**Q1. Is `Math.random` secure?**  
No — use Web Crypto / Node `crypto` for security-sensitive randomness.

**Q2. Difference between `floor` and `trunc`?**  
`trunc` toward 0; `floor` toward −∞.

**Q3. How to clamp a number?**  
`Math.min(max, Math.max(min, n))`.

**Q4. How to get random int 0..n-1?**  
`Math.floor(Math.random() * n)`.

**Q5. Can you construct `Math`?**  
No — it’s not a constructor.

---

## Notes

- Run [`example.js`](./example.js).
- Related: [Numbers](../numbers/README.md).

---

## References

- [MDN: Math](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math)
- [Node.js crypto.randomInt](https://nodejs.org/api/crypto.html#cryptorandomintmin-max-callback)
