# Node.js Buffers

A `Buffer` is a fixed-size byte sequence used for binary I/O. Strings are text; encoding determines how text maps to bytes. `Buffer` extends `Uint8Array`, but Node APIs frequently return it for files, sockets, and streams.

```js
const bytes = Buffer.from("✓", "utf8");
console.log(bytes.length);             // byte length, not character count
console.log(bytes.toString("utf8"));   // decode explicitly
```

Use `Buffer.alloc(size)` for initialized memory, `Buffer.from` for known data, and avoid deprecated unsafe allocation unless you immediately overwrite all bytes. `slice`/`subarray` create views sharing memory, so mutations can be visible through both.

## Interview checks

1. Buffer versus string?
2. Why can byte length differ from string length?
3. `alloc` versus `allocUnsafe`?
