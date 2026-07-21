/**
 * Loop closure trap
 * Run: node closures/example-loop.js
 */
'use strict';

console.log('var loop (prints 3 3 3):');
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}

console.log('let loop (prints 0 1 2):');
for (let j = 0; j < 3; j++) {
  setTimeout(() => console.log(j), 10);
}
