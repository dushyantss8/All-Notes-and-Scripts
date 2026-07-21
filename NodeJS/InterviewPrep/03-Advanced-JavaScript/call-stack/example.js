"use strict";

/**
 * Call stack: nested frames, trace inspection, safe recursion with a
 * base case, and an iterative alternative to deep recursion.
 */

function leaf() {
  const err = new Error("capture");
  const frames = String(err.stack)
    .split("\n")
    .slice(1, 5)
    .map((line) => line.trim());
  return frames;
}

function middle() {
  return leaf();
}

function outer() {
  return middle();
}

console.log("nested frames (approx):");
for (const frame of outer()) {
  console.log(" ", frame);
}

/** Classic recursion — stack depth grows with n. */
function factorial(n) {
  if (typeof n !== "number" || n < 0 || !Number.isInteger(n)) {
    throw new TypeError("n must be a non-negative integer");
  }
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

console.log("factorial(5):", factorial(5)); // 120

/** Same result without growing the call stack with n. */
function factorialIterative(n) {
  if (typeof n !== "number" || n < 0 || !Number.isInteger(n)) {
    throw new TypeError("n must be a non-negative integer");
  }
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

console.log("factorialIterative(5):", factorialIterative(5));

/**
 * Demonstrates that the stack must unwind before a macrotask runs.
 * Output order: "sync-end" then "timeout".
 */
function scheduleAfterStack() {
  setTimeout(() => console.log("timeout (after stack empty)"), 0);
  console.log("sync-end");
}

scheduleAfterStack();

module.exports = { factorial, factorialIterative, outer };
