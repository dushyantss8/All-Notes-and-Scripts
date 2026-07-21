/**
 * Operators — runnable examples
 * Run: node operators/example.js
 */
'use strict';

console.log('--- equality ---');
console.log(0 == false);  // true
console.log(0 === false); // false
console.log(null == undefined);  // true
console.log(null === undefined); // false

console.log('--- short-circuit / nullish ---');
true && console.log('runs');
console.log(null || 'fallback'); // fallback
console.log(0 || 'fallback');    // fallback
console.log(0 ?? 'fallback');    // 0

console.log('--- optional chaining ---');
const user = { profile: null };
console.log(user.profile?.name); // undefined

console.log('--- nullish assign ---');
const cfg = { retries: 0 };
cfg.retries ??= 3;
cfg.timeout ??= 5000;
console.log(cfg); // { retries: 0, timeout: 5000 }

console.log('--- precedence ---');
console.log(1 + 2 * 3); // 7
console.log(true || false && false); // true

console.log('--- bitwise flags ---');
const READ = 1, WRITE = 2;
const perms = READ | WRITE;
console.log((perms & WRITE) !== 0); // true
