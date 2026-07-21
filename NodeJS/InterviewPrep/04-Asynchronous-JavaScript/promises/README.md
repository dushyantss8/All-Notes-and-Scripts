# Promises

A Promise represents a future result: it starts `pending` and settles exactly once as fulfilled or rejected. `.then` always returns a new Promise, enabling chaining and centralized error propagation.

```js
const user = await fetchUser(id)
  .then(validateUser)
  .catch(error => { throw new Error(`User load failed: ${error.message}`); });
```

## APIs

- `Promise.all`: fulfills ordered results; rejects fast on the first rejection.
- `Promise.allSettled`: reports every outcome; use for independent best-effort work.
- `Promise.race`: settles with the first settlement; useful for timeouts with cleanup.
- `Promise.any`: fulfills with the first success; rejects with `AggregateError` if all fail.

Never wrap a Promise unnecessarily in `new Promise`; return it. Always return/await chains, and attach context while preserving the original error with `cause`.

## Interview checks

1. What does returning a value, Promise, or throwing inside `then` do?
2. Why does `all` preserve order despite concurrent completion?
3. How do you prevent an unhandled rejection?
