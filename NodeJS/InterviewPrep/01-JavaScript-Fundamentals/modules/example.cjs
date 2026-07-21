/**
 * CommonJS modules demo
 * Run: node modules/example.cjs
 */
'use strict';

const { add, sub } = require('./math-util.cjs');
console.log(add(2, 3)); // 5
console.log(sub(9, 4)); // 5

// module cache demo
const again = require('./math-util.cjs');
console.log(again === require('./math-util.cjs')); // true
