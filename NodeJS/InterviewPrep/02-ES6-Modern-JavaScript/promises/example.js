// Run: node example.js
const after = (value, ms) =>
  new Promise((resolve) => setTimeout(resolve, ms, value));

// Returning a value fulfills the next promise in the chain.
after(2, 10)
  .then((value) => value * 3)
  .then((value) => console.log(value)); // 6

// Promise.all waits for all independent successful operations.
Promise.all([after("Ada", 5), after("Lin", 5)])
  .then((names) => console.log(names.join(" and "))); // Ada and Lin

// A thrown error becomes a rejected promise.
Promise.resolve()
  .then(() => { throw new Error("invalid input"); })
  .catch((error) => console.log(`Handled: ${error.message}`));
