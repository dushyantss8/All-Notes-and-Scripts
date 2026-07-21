/**
 * Temporal Dead Zone demo
 * Run: node variables/example-tdz.js
 */

'use strict';

function showTdz() {
  try {
    console.log(value);
  } catch (err) {
    console.log('TDZ error:', err.name); // ReferenceError
  }

  let value = 42;
  console.log('After init:', value); // 42
}

showTdz();

function showVarHoist() {
  console.log('var before assign:', flag); // undefined
  var flag = true;
  console.log('var after assign:', flag); // true
}

showVarHoist();
