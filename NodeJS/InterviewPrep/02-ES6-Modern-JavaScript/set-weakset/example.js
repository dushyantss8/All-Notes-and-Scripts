// Run: node example.js
const tags = new Set(["node", "js", "node"]);

// Set maintains insertion order and removes duplicate primitive values.
console.log([...tags]); // [ 'node', 'js' ]
console.log(tags.has("js")); // true
tags.add("testing");
console.log(tags.size); // 3

// WeakSet is useful for marking objects without retaining them.
const visited = new WeakSet();
const firstNode = {};
visited.add(firstNode);
console.log(visited.has(firstNode)); // true
