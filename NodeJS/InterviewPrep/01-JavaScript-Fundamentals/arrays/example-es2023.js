/**
 * ES2023 immutable array methods
 * Run: node arrays/example-es2023.js
 */
'use strict';

const arr = [3, 1, 2];
console.log(arr.toSorted((a, b) => a - b)); // [1,2,3]
console.log(arr); // unchanged
console.log(arr.toReversed());
console.log(arr.with(1, 99));
console.log(arr.toSpliced(1, 1, 8, 9));
console.log(arr);
