"use strict";

/**
 * Event-loop ordering: sync → microtasks → macrotasks.
 * Also shows await continuation as a microtask and a bounded microtask chain.
 */

const log = [];

function record(label) {
  log.push(label);
  console.log(label);
}

record("1-sync-start");

setTimeout(() => record("5-macrotask-timeout"), 0);

Promise.resolve()
  .then(() => {
    record("3-microtask-then");
    return Promise.resolve();
  })
  .then(() => record("4-microtask-then-2"));

queueMicrotask(() => record("3b-queueMicrotask"));

record("2-sync-end");

async function withAwait() {
  record("await-before");
  await null; // schedules continuation as a microtask
  record("await-after-microtask");
}

withAwait();

/**
 * Bounded microtask drain helper — processes items without blocking forever.
 */
function drainMicroBatch(items, handle) {
  if (!Array.isArray(items) || typeof handle !== "function") {
    throw new TypeError("drainMicroBatch(items, handle)");
  }
  return new Promise((resolve) => {
    const queue = items.slice();
    const pump = () => {
      if (queue.length === 0) {
        resolve();
        return;
      }
      handle(queue.shift());
      queueMicrotask(pump);
    };
    queueMicrotask(pump);
  });
}

drainMicroBatch(["a", "b", "c"], (item) => record(`batch-${item}`)).then(() => {
  record("batch-done");
  console.log("final order:", log.join(" → "));
});

module.exports = { drainMicroBatch };
