'use strict';
const { clamp, unique } = require('./21-util.cjs');
console.log(clamp(150, 0, 100));
console.log(unique([1, 1, 2, 3, 2]));
