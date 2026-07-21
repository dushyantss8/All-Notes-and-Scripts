# Exercises — JavaScript Fundamentals

> 28 practice problems from beginner to advanced. Attempt each before opening [`solutions/`](./solutions/).

**How to use**

1. Solve in a scratch file or Node REPL.
2. Check edge cases listed under each problem.
3. Compare with the linked solution — study approach, not just the answer.
4. Re-solve later without notes.

---

## Problem Index

| # | Difficulty | Topic | Problem |
|---|------------|--------|---------|
| 01 | Beginner | Variables | [swap without temp](#01-swap-two-variables) |
| 02 | Beginner | Types | [type classifier](#02-type-classifier) |
| 03 | Beginner | Operators | [default with nullish](#03-nullish-defaults) |
| 04 | Beginner | Functions | [sum with rest](#04-sum-rest-params) |
| 05 | Beginner | Scope | [predict the output](#05-scope-output) |
| 06 | Intermediate | Hoisting | [fix the TDZ bug](#06-fix-tdz-bug) |
| 07 | Intermediate | Closures | [makeCounter](#07-makecounter) |
| 08 | Intermediate | Closures | [once(fn)](#08-oncefn) |
| 09 | Intermediate | Objects | [deep freeze shallow check](#09-isdeepfrozen-shallow) |
| 10 | Intermediate | Objects | [pick keys](#10-pick) |
| 11 | Intermediate | Arrays | [chunk array](#11-chunk) |
| 12 | Intermediate | Arrays | [unique values](#12-unique) |
| 13 | Intermediate | Arrays | [groupBy](#13-groupby) |
| 14 | Beginner | Loops | [fizzbuzz](#14-fizzbuzz) |
| 15 | Intermediate | Strings | [isPalindrome](#15-ispalindrome) |
| 16 | Intermediate | Strings | [compress string](#16-compress) |
| 17 | Intermediate | Numbers | [safe add large ints as strings](#17-add-strings) |
| 18 | Beginner | Math | [clamp](#18-clamp) |
| 19 | Intermediate | Date | [days between](#19-days-between) |
| 20 | Intermediate | Errors | [parseJSONSafe](#20-parsejsonsafe) |
| 21 | Intermediate | Modules | [design a tiny util module](#21-util-module) |
| 22 | Intermediate | Events | [simple EventEmitter](#22-mini-event-emitter) |
| 23 | Advanced | Closures | [createStore](#23-createstore) |
| 24 | Advanced | Arrays | [flatten deeply](#24-flatten) |
| 25 | Advanced | Memory | [bounded TTL cache](#25-ttl-cache) |
| 26 | Advanced | Functions | [debounce](#26-debounce) |
| 27 | Advanced | Objects | [deepEqual](#27-deep-equal) |
| 28 | Advanced | Mixed | [pipeline compose](#28-compose) |

---

## 01. Swap two variables

**Task:** Swap `a` and `b` without a temporary variable (use destructuring).

```js
let a = 1, b = 2;
// your code
// a === 2, b === 1
```

**Solution:** [01-swap.js](./solutions/01-swap.js)

---

## 02. Type classifier

**Task:** Write `classify(value)` returning `'null' | 'array' | 'function' | typeof value` (fixing `typeof null` and arrays).

**Examples**

```js
classify(null);        // 'null'
classify([]);          // 'array'
classify(() => {});    // 'function'
classify(1);           // 'number'
```

**Solution:** [02-classify.js](./solutions/02-classify.js)

---

## 03. Nullish defaults

**Task:** Merge `options` with defaults using `??` / `??=` so `0` and `false` are preserved.

```js
withDefaults({ retries: 0 });
// { retries: 0, timeout: 3000, verbose: false }
```

Defaults: `{ retries: 3, timeout: 3000, verbose: false }`

**Solution:** [03-nullish-defaults.js](./solutions/03-nullish-defaults.js)

---

## 04. Sum rest params

**Task:** `sum(...nums)` returns total; ignore non-finite numbers.

```js
sum(1, 2, 3);          // 6
sum(1, 'x', 2, NaN);   // 3
```

**Solution:** [04-sum.js](./solutions/04-sum.js)

---

## 05. Scope output

**Task:** Without running, predict logs; then verify.

```js
let x = 1;
function f() {
  console.log(x);
  if (true) {
    let x = 2;
    console.log(x);
  }
  console.log(x);
}
f();
```

**Solution:** [05-scope-output.js](./solutions/05-scope-output.js)

---

## 06. Fix TDZ bug

**Task:** Fix so it logs `10` without moving the `console.log` below the declaration improperly — initialize properly / reorder legally.

```js
function broken() {
  console.log(value);
  let value = 10;
}
```

**Solution:** [06-fix-tdz.js](./solutions/06-fix-tdz.js)

---

## 07. makeCounter

**Task:** `makeCounter(start=0)` returns `{ inc, dec, value }` using closure private state.

**Solution:** [07-make-counter.js](./solutions/07-make-counter.js)

---

## 08. once(fn)

**Task:** `once(fn)` returns a function that calls `fn` only the first time; later calls return the first result.

**Solution:** [08-once.js](./solutions/08-once.js)

---

## 09. isDeepFrozen (shallow)

**Task:** `isPlainFrozen(obj)` returns true if `Object.isFrozen(obj)` (shallow). Bonus: discuss why deep freeze is recursive.

**Solution:** [09-is-frozen.js](./solutions/09-is-frozen.js)

---

## 10. pick

**Task:** `pick(obj, keys)` returns a new object with only listed own keys.

```js
pick({ a: 1, b: 2, c: 3 }, ['a', 'c']); // { a:1, c:3 }
```

**Solution:** [10-pick.js](./solutions/10-pick.js)

---

## 11. chunk

**Task:** `chunk(arr, size)` splits into arrays of length `size`.

```js
chunk([1,2,3,4,5], 2); // [[1,2],[3,4],[5]]
```

**Solution:** [11-chunk.js](./solutions/11-chunk.js)

---

## 12. unique

**Task:** `unique(arr)` returns new array with duplicates removed (preserve order).

**Solution:** [12-unique.js](./solutions/12-unique.js)

---

## 13. groupBy

**Task:** `groupBy(arr, keyFn)` groups items into an object of arrays.

```js
groupBy(['one','two','three'], (s) => s.length);
// { '3': ['one','two'], '5': ['three'] }
```

**Solution:** [13-group-by.js](./solutions/13-group-by.js)

---

## 14. FizzBuzz

**Task:** Return array for `1..n` with Fizz/Buzz/FizzBuzz rules.

**Solution:** [14-fizzbuzz.js](./solutions/14-fizzbuzz.js)

---

## 15. isPalindrome

**Task:** Ignore case and non-alphanumeric characters.

```js
isPalindrome('A man, a plan, a canal: Panama'); // true
```

**Solution:** [15-is-palindrome.js](./solutions/15-is-palindrome.js)

---

## 16. compress

**Task:** Run-length encode: `'aaabbc'` → `'a3b2c1'` (if helpful). Characters assumed alphanumeric.

**Solution:** [16-compress.js](./solutions/16-compress.js)

---

## 17. addStrings

**Task:** Add non-negative integers given as strings (may exceed safe integer).

```js
addStrings('9007199254740993', '1'); // '9007199254740994'
```

**Solution:** [17-add-strings.js](./solutions/17-add-strings.js)

---

## 18. clamp

**Task:** `clamp(n, min, max)`.

**Solution:** [18-clamp.js](./solutions/18-clamp.js)

---

## 19. daysBetween

**Task:** Whole UTC days between two ISO date strings (`YYYY-MM-DD`).

```js
daysBetween('2024-01-01', '2024-01-03'); // 2
```

**Solution:** [19-days-between.js](./solutions/19-days-between.js)

---

## 20. parseJSONSafe

**Task:** Return `{ ok: true, value }` or `{ ok: false, error }` — never throw.

**Solution:** [20-parse-json-safe.js](./solutions/20-parse-json-safe.js)

---

## 21. Util module

**Task:** Create a tiny CJS module exporting `clamp` and `unique`. Load it with `require`.

**Solution:** [21-util-module.js](./solutions/21-util-module.js) + [21-util.cjs](./solutions/21-util.cjs)

---

## 22. Mini EventEmitter

**Task:** Implement `on`, `off`, `emit`, `once` (in-memory).

**Solution:** [22-mini-emitter.js](./solutions/22-mini-emitter.js)

---

## 23. createStore

**Task:** Tiny store: `getState`, `setState`, `subscribe` (closure + listeners).

**Solution:** [23-create-store.js](./solutions/23-create-store.js)

---

## 24. flatten

**Task:** Deep flatten nested arrays (any depth). Don’t use `flat(Infinity)` if asked to implement manually — then show both.

**Solution:** [24-flatten.js](./solutions/24-flatten.js)

---

## 25. TTL cache

**Task:** `createTtlCache({ max, ttlMs })` with `get/set/has` — evict expired and enforce max size (simple FIFO ok).

**Solution:** [25-ttl-cache.js](./solutions/25-ttl-cache.js)

---

## 26. debounce

**Task:** `debounce(fn, waitMs)` — trailing edge.

**Solution:** [26-debounce.js](./solutions/26-debounce.js)

---

## 27. deepEqual

**Task:** Compare plain objects/arrays/primitives deeply (no cycles required for base version).

**Solution:** [27-deep-equal.js](./solutions/27-deep-equal.js)

---

## 28. compose

**Task:** `compose(f, g, h)(x)` = `f(g(h(x)))`.

**Solution:** [28-compose.js](./solutions/28-compose.js)

---

## Stretch Goals

- Add cycle detection to `deepEqual`
- Make TTL cache LRU instead of FIFO
- Rewrite module exercise as ESM (`.mjs`)

---

## References

- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- Section topics: [../README.md](../README.md)
