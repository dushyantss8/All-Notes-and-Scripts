/**
 * Objects — runnable examples
 * Run: node objects/example.js
 */
'use strict';

const o = { a: 1, 'b-c': 2 };
console.log(o.a, o['b-c']);
o.d = 4;
delete o.a;
console.log(o);

const key = 'status';
const status = 'active';
const row = { status, [key + 'Code']: 200 };
console.log(row);

const user = { id: 1, name: 'Ada' };
console.log(Object.keys(user));
console.log(Object.values(user));
console.log(Object.entries(user));
console.log(Object.fromEntries([['x', 1]]));
console.log(Object.hasOwn(user, 'id'));

const original = { a: 1, nested: { b: 2 } };
const shallow = { ...original };
shallow.nested.b = 9;
console.log('shallow leak', original.nested.b); // 9

const deep = structuredClone(original);
deep.nested.b = 1;
console.log('deep ok', original.nested.b); // 9

const config = { port: 3000 };
Object.freeze(config);
console.log(Object.isFrozen(config));
