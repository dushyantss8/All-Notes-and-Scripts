/**
 * Data types — runnable examples
 * Run: node data-types/example.js
 */
'use strict';

console.log('--- typeof catalog ---');
console.log(typeof 1);          // number
console.log(typeof NaN);        // number
console.log(typeof 'x');        // string
console.log(typeof true);       // boolean
console.log(typeof undefined);  // undefined
console.log(typeof null);       // object (quirk)
console.log(typeof {});         // object
console.log(typeof []);         // object
console.log(Array.isArray([])); // true
console.log(typeof (() => {})); // function
console.log(typeof 10n);        // bigint
console.log(typeof Symbol('id')); // symbol

console.log('--- value vs reference ---');
let a = 1;
let b = a;
b = 2;
console.log(a, b); // 1 2

const o1 = { x: 1 };
const o2 = o1;
o2.x = 9;
console.log(o1.x); // 9

console.log('--- nullish vs falsy ---');
const count = 0;
console.log(count || 10); // 10
console.log(count ?? 10); // 0

console.log('--- conversions ---');
console.log(Number('42'), String(42), Boolean(0), Boolean('0'));
console.log(parseInt('08', 10));
