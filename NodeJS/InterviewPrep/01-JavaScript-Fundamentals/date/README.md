# Date

> Creating, parsing, formatting, and the timezone pitfalls that show up in backend interviews.

**Difficulty:** Intermediate → Advanced  
**Docs:** [MDN: Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)

---

## Explanation

The built-in `Date` object stores a timestamp as milliseconds since the Unix epoch (UTC). Display depends on local timezone unless you format carefully.

**Interview truth:** Date handling is a common production bug source. Prefer ISO-8601 UTC at boundaries; consider libraries (`luxon`, `date-fns`, Temporal when available) for complex zones.

```mermaid
flowchart LR
  Input[Input string/ms] --> Parse[Date parse]
  Parse --> Epoch[UTC ms instant]
  Epoch --> Format[Format for locale/UTC]
```

> Note: **Temporal** is the modern standard API emerging for better date/time; Node support evolves — know `Date` deeply and mention Temporal in senior interviews.

---

## Syntax

```js
const now = new Date();
const fromMs = new Date(1_700_000_000_000);
const fromIso = new Date('2024-01-15T10:00:00.000Z');
```

---

## Examples

### Example 1 — Now & components

```js
const d = new Date('2024-06-01T12:30:00.000Z');
console.log(d.toISOString()); // 2024-06-01T12:30:00.000Z
console.log(d.getUTCFullYear()); // 2024
console.log(d.getUTCMonth());    // 5  (0-based!)
console.log(d.getUTCDate());     // 1
```

### Example 2 — Epoch ms

```js
const ms = Date.now();
const d = new Date(ms);
console.log(d.getTime() === ms); // true
```

### Example 3 — Parsing pitfalls

```js
console.log(new Date('2024-01-01').toISOString());
// Often treated as UTC midnight for ISO date-only forms
console.log(Number.isNaN(new Date('not a date').getTime())); // true
```

### Example 4 — Diff durations

```js
const start = new Date('2024-01-01T00:00:00Z');
const end = new Date('2024-01-02T00:00:00Z');
const hours = (end - start) / (1000 * 60 * 60);
console.log(hours); // 24
```

### Example 5 — Formatting

```js
const d = new Date('2024-01-15T10:00:00Z');
console.log(d.toISOString());
console.log(d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));
```

### Example 6 — Mutable Date trap

```js
const a = new Date('2024-01-01T00:00:00Z');
const b = a;
b.setUTCDate(5);
console.log(a.toISOString()); // also changed — shared reference
```

---

## Common Mistakes

1. Forgetting months are **0-based** (`getMonth()`).
2. Parsing ambiguous locale strings (`DD/MM` vs `MM/DD`).
3. Mixing local getters with UTC getters inconsistently.
4. Mutating shared `Date` instances.
5. Storing local-time strings in DB instead of UTC instants.

---

## Best Practices

- Persist UTC ISO strings or epoch ms in databases.
- Accept/parse ISO-8601 at API edges; reject ambiguous formats.
- Never trust `Date.parse` with arbitrary user strings.
- Clone before mutating: `new Date(d.getTime())`.
- For schedules/timezones, use a dedicated library or Temporal.

---

## Performance Considerations

- Creating many `Date` objects is fine at request scale; avoid in extremely hot micro-loops — use numeric ms.
- Formatting with locales can be relatively expensive — cache formatters when possible.

---

## Interview Questions

**Q1. What does `Date` store internally?**  
Milliseconds since Unix epoch (UTC).

**Q2. Why is `getMonth()` surprising?**  
Returns 0–11.

**Q3. `Date.now()` vs `new Date()`?**  
`Date.now()` → number ms; `new Date()` → Date object.

**Q4. How do you compute differences?**  
Subtract Date objects / timestamps to get ms, then convert.

**Q5. UTC vs local?**  
Same instant; different calendar fields when read with local vs UTC getters.

---

## Notes

- Run [`example.js`](./example.js).
- Related: [Numbers](../numbers/README.md), [Math](../math/README.md).

---

## References

- [MDN: Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)
- [MDN: Temporal (overview)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal)
- [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601)
