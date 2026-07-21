"use strict";

/**
 * Closures: private state, shared bindings, once(), and safe loop capture.
 */

function createStore(initial) {
  let state = initial;
  const listeners = new Set();

  return {
    getState() {
      return state;
    },
    setState(next) {
      state = typeof next === "function" ? next(state) : next;
      for (const listener of listeners) listener(state);
      return state;
    },
    subscribe(listener) {
      if (typeof listener !== "function") throw new TypeError("listener required");
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

const store = createStore({ n: 0 });
const unsubscribe = store.subscribe((s) => console.log("notify:", s));
store.setState((s) => ({ n: s.n + 1 }));
unsubscribe();
store.setState({ n: 99 }); // no notify

/** Run fn only once; later calls return the first result. */
function once(fn) {
  if (typeof fn !== "function") throw new TypeError("fn required");
  let called = false;
  let value;
  return function wrapped(...args) {
    if (called) return value;
    called = true;
    value = fn.apply(this, args);
    return value;
  };
}

const init = once((x) => {
  console.log("init ran");
  return x * 2;
});
console.log(init(21), init(100)); // 42 42

// Shared environment between siblings
function makePair() {
  let shared = 0;
  return {
    left: () => ++shared,
    right: () => shared,
  };
}

const pair = makePair();
pair.left();
pair.left();
console.log("shared:", pair.right()); // 2

// Per-iteration capture
const values = [];
for (let i = 0; i < 3; i += 1) {
  values.push(() => i);
}
console.log(
  "loop:",
  values.map((fn) => fn())
); // [0,1,2]

module.exports = { createStore, once, makePair };
