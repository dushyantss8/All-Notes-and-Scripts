/**
 * Numbers — runnable examples
 * Run: node numbers/example.js
 */
'use strict';

console.log(0.1 + 0.2);
console.log(Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON);

console.log(Number.isSafeInteger(2 ** 53 - 1));
console.log(Number.isSafeInteger(2 ** 53));
console.log(9007199254740993);
console.log(9007199254740993n);

console.log(Number('42'), Number('42px'), parseInt('42px', 10));
console.log(Number.isNaN(NaN), Number.isNaN('hello'), isNaN('hello'));
console.log(Number.isFinite(1 / 0));

console.log((1.005).toFixed(2), Math.round(1.5), Math.trunc(-1.9));
console.log(10n + 5n);
console.log(10n > 5);
console.log(Number(10n));
