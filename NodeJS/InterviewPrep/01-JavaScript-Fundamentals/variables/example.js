/**
 * Variables — runnable examples
 * Run: node variables/example.js
 */

'use strict';

// --- const vs let ---
const PORT = 3000;
let connections = 0;

connections += 1;
console.log('PORT:', PORT); // 3000
console.log('connections:', connections); // 1

// --- const object: binding fixed, contents mutable ---
const config = { host: 'localhost', port: PORT };
config.host = '127.0.0.1';
console.log('config:', config); // { host: '127.0.0.1', port: 3000 }

// --- block scope ---
function processOrder(status) {
  if (status === 'paid') {
    let message = 'ready to ship';
    var legacy = 'visible outside block';
    console.log(message); // ready to ship
  }
  // console.log(message); // ReferenceError if uncommented
  console.log(legacy); // visible outside block
}
processOrder('paid');

// --- shadowing ---
let total = 10;
{
  let total = 99;
  console.log('inner total:', total); // 99
}
console.log('outer total:', total); // 10

// --- destructuring ---
const user = { id: 1, name: 'Ada', role: 'admin' };
const { name, role } = user;
const tags = ['node', 'api', 'auth'];
const [primary, ...otherTags] = tags;
console.log(name, role); // Ada admin
console.log(primary, otherTags); // node [ 'api', 'auth' ]
