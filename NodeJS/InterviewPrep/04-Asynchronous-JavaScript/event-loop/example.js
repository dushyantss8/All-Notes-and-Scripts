"use strict";

console.log("sync: start");
setTimeout(() => console.log("task: timer"), 0);
Promise.resolve().then(() => console.log("microtask: promise"));
queueMicrotask(() => console.log("microtask: explicit"));
console.log("sync: end");
// Output: start, end, promise, explicit, timer.
