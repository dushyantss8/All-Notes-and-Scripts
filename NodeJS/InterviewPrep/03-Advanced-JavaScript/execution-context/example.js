"use strict";

/**
 * Demonstrates execution-context ideas: creation-order of bindings,
 * nested contexts, and that `this` is call-site driven (not lexical).
 */

function explainContext(label, thisValue) {
  return { label, thisType: typeof thisValue, thisValue };
}

function Counter(start) {
  // Function context: `start` and `this` bound at call time.
  this.value = start;
  this.inc = function inc() {
    // Nested function context; `this` depends on how `inc` is called.
    this.value += 1;
    return this.value;
  };
}

const counter = new Counter(10); // `new` sets this = new object
console.log("after new:", counter.value); // 10
console.log("method call:", counter.inc()); // 11

const looseInc = counter.inc;
try {
  looseInc(); // strict mode: this is undefined → TypeError
} catch (error) {
  console.log("detached method:", error.message);
}

// Nested contexts + lexical lookup (not `this`)
function makeAdder(base) {
  // Outer function context closes over `base`.
  return function add(n) {
    // Inner function context; resolves `base` via outer env reference.
    return base + n;
  };
}

const addFive = makeAdder(5);
console.log("closure lookup:", addFive(3)); // 8

// Arrow inherits `this` from surrounding context
const service = {
  name: "billing",
  describe() {
    const arrow = () => explainContext(this.name, this);
    return arrow();
  },
};

console.log("arrow lexical this:", service.describe());

module.exports = { Counter, makeAdder, explainContext };
