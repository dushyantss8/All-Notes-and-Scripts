/**
 * Loops — runnable examples
 * Run: node loops/example.js
 */
'use strict';

const nums = [10, 20, 30];
for (let i = 0; i < nums.length; i++) {
  console.log('for', i, nums[i]);
}

for (const n of nums) {
  console.log('for-of', n);
}

for (const ch of 'hi') {
  console.log('char', ch);
}

const user = { name: 'Ada', age: 36 };
for (const [k, v] of Object.entries(user)) {
  console.log(k, v);
}

let i = 0;
while (i < 5) {
  i += 1;
  if (i === 2) continue;
  if (i === 4) break;
  console.log('while', i);
}

const map = new Map([
  ['a', 1],
  ['b', 2],
]);
for (const [k, v] of map) {
  console.log(k, v);
}
