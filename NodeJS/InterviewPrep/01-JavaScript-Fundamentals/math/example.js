/**
 * Math — runnable examples
 * Run: node math/example.js
 */
'use strict';

console.log(Math.floor(1.9), Math.ceil(1.1), Math.round(1.5), Math.trunc(-1.9), Math.floor(-1.1));

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
console.log(clamp(120, 0, 100));
console.log(Math.max(1, 9, 3), Math.min(...[4, 2, 8]));

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
console.log('dice', randomInt(1, 6));

console.log(Math.PI, Math.pow(2, 10), 2 ** 10, Math.hypot(3, 4));
console.log(Math.abs(-7), Math.sign(-5));

const { randomInt: cryptoRandomInt } = require('crypto');
console.log('secure dice', cryptoRandomInt(1, 7));
