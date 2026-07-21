# `async` / `await`

An `async` function always returns a Promise. `await` pauses only that function’s continuation; it does not block the event loop. Its continuation resumes as a microtask after the awaited value settles.

```js
async function getUser(id, signal) {
  try {
    const response = await fetch(`/users/${id}`, { signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (error) {
    throw new Error("Unable to load user", { cause: error });
  }
}
```

Start independent operations before awaiting to run them concurrently; do not accidentally serialize them. Use `try`/`catch` around the await that can fail, rethrow contextual errors, and accept `AbortSignal` for cancellable I/O.

## Interview checks

1. Does `await` block JavaScript?
2. Why is `return await` usually redundant, and when can it improve a `try/catch`?
3. Sequential versus concurrent awaits?
