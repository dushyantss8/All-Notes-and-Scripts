# Callbacks and Callback Hell

A callback is a function supplied to run after an operation completes. Node’s error-first convention is `(error, value)`: on failure pass an `Error`; on success pass `null` then the result.

```js
readFile(path, "utf8", (error, text) => {
  if (error) return report(error);
  process(text);
});
```

Nested callbacks obscure sequencing and duplicate error handling (“callback hell”). Extract named steps, use a control-flow library where appropriate, or promisify a correctly designed callback API with `node:util`.

Do not throw asynchronously expecting an outer `try/catch` to receive it. Do not invoke a callback twice; use `return` after error paths.

## Interview checks

1. Why is error-first ordering useful?
2. What is Zalgo (sometimes-sync callbacks) and why avoid it?
3. How does `promisify` handle multiple success values?
