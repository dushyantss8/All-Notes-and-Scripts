/**
 * Hoisting — runnable examples
 * Run: node hoisting/example.js
 */
'use strict';

console.log(a); // undefined
var a = 5;
console.log(a); // 5

console.log(add(2, 3)); // 5
function add(x, y) {
  return x + y;
}

try {
  console.log(b);
} catch (e) {
  console.log('TDZ:', e.name);
}
let b = 1;
console.log(b);

var x = 1;
var x = 2;
console.log(x); // 2

class Person {}
const p = new Person();
console.log(p.constructor.name);
