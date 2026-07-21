// Run: node example.js
const scores = new Map();
scores.set("Ada", 10);
scores.set("Lin", 15);

console.log(scores.get("Ada")); // 10
console.log(scores.has("Grace")); // false
console.log([...scores.entries()]); // [ [ 'Ada', 10 ], [ 'Lin', 15 ] ]

// WeakMap metadata disappears when its object key becomes unreachable.
const metadata = new WeakMap();
const user = { name: "Ada" };
metadata.set(user, { role: "admin" });
console.log(metadata.get(user)); // { role: 'admin' }
console.log(metadata.has(user)); // true
