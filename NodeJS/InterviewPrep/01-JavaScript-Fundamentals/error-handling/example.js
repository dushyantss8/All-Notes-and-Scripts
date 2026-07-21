/**
 * Error handling — runnable examples
 * Run: node error-handling/example.js
 */
'use strict';

try {
  JSON.parse('{bad');
} catch (err) {
  console.log(err instanceof SyntaxError, err.message);
}

function read() {
  try {
    return 'ok';
  } finally {
    console.log('cleanup');
  }
}
console.log(read());

try {
  throw new Error('outer', { cause: new Error('root') });
} catch (err) {
  console.log(err.message, err.cause.message);
}

function divide(a, b) {
  if (typeof a !== 'number' || typeof b !== 'number') throw new TypeError('numbers required');
  if (b === 0) throw new RangeError('division by zero');
  return a / b;
}
console.log(divide(10, 2));
try {
  divide(1, 0);
} catch (e) {
  console.log(e.name);
}

try {
  throw new AggregateError([new Error('a'), new Error('b')], 'multiple');
} catch (err) {
  console.log(err.errors.length);
}
