// Run: node example.js
const privateId = Symbol("id");
const user = {
  name: "Ada",
  [privateId]: 42
};

// Symbol keys do not collide with ordinary string keys.
console.log(user[privateId]); // 42
console.log(Object.keys(user)); // [ 'name' ]
console.log(Object.getOwnPropertySymbols(user)); // [ Symbol(id) ]

// The registry intentionally returns the same shared symbol.
const cacheKey = Symbol.for("example.cache");
console.log(cacheKey === Symbol.for("example.cache")); // true
