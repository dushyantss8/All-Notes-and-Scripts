/**
 * Memory basics
 * Run: node memory-management/example.js
 */
'use strict';

console.log(process.memoryUsage());

let user = { name: 'Ada' };
user = null;

const before = process.memoryUsage().heapUsed;
const arr = new Array(1e5).fill(0);
const after = process.memoryUsage().heapUsed;
console.log('approx allocated bytes', after - before);
console.log('arr length', arr.length);

const wm = new WeakMap();
let obj = { id: 1 };
wm.set(obj, 'meta');
console.log(wm.get(obj));
obj = null; // key eligible for GC
