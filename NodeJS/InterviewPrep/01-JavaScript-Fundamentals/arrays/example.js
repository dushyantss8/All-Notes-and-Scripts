/**
 * Arrays — runnable examples
 * Run: node arrays/example.js
 */
'use strict';

const a = [10, 20, 30];
a.push(40);
console.log(a.length, a.at(-1));

const nums = [1, 2, 3, 4];
console.log(nums.map((n) => n * 2));
console.log(nums.filter((n) => n % 2 === 0));
console.log(nums.reduce((acc, n) => acc + n, 0));

const users = [
  { id: 1, active: true },
  { id: 2, active: false },
];
console.log(users.find((u) => u.id === 2));
console.log(users.some((u) => u.active));
console.log(users.every((u) => u.active));
console.log([1, 2, 3].includes(2));

console.log([1, [2, [3]]].flat(2));
console.log([1, 2].flatMap((n) => [n, n * 10]));

let x = 1;
let y = 2;
[x, y] = [y, x];
console.log(x, y);
