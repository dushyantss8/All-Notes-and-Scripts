/**
 * Functions — runnable examples
 * Run: node functions/example.js
 */
'use strict';

console.log(declared()); // ok
function declared() {
  return 'ok';
}

const expr = function () {
  return 'later';
};
console.log(expr());

function createUser(name, role = 'user', ...tags) {
  return { name, role, tags };
}
console.log(createUser('Ada'));
console.log(createUser('Bob', 'admin', 'a', 'b'));

function withLogging(fn) {
  return function (...args) {
    console.log('args', args);
    return fn(...args);
  };
}
const loggedAdd = withLogging((a, b) => a + b);
console.log(loggedAdd(2, 3));

const result = (() => {
  const secret = 42;
  return secret * 2;
})();
console.log(result); // 84

function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
console.log(sum(1, 2, 3, 4)); // 10
