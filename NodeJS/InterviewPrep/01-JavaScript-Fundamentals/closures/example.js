/**
 * Closures — runnable examples
 * Run: node closures/example.js
 */
'use strict';

function outer() {
  const message = 'hello';
  return function inner() {
    return message;
  };
}
console.log(outer()()); // hello

function createBank(initial) {
  let balance = initial;
  return {
    deposit(n) {
      balance += n;
      return balance;
    },
    withdraw(n) {
      if (n > balance) throw new Error('insufficient');
      balance -= n;
      return balance;
    },
    getBalance() {
      return balance;
    },
  };
}
const acct = createBank(100);
acct.deposit(50);
console.log(acct.getBalance()); // 150

function multiplyBy(factor) {
  return (n) => n * factor;
}
console.log(multiplyBy(2)(21)); // 42

const service = (() => {
  const cache = new Map();
  return {
    get(key) {
      return cache.get(key);
    },
    set(key, val) {
      cache.set(key, val);
    },
  };
})();
service.set('a', 1);
console.log(service.get('a')); // 1
