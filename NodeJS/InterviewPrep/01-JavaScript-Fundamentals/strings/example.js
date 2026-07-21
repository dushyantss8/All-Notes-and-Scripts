/**
 * Strings — runnable examples
 * Run: node strings/example.js
 */
'use strict';

const s = 'Node.js';
console.log(s.length, s[0], s.at(-1), s.toUpperCase());

const url = 'https://api.example.com/users';
console.log(url.includes('api'), url.startsWith('https'), url.endsWith('/users'));
console.log(url.indexOf('example'), url.slice(8, 11));

console.log('a,b,c'.split(','));
console.log(['a', 'b'].join('-'));
console.log('foo foo'.replaceAll('foo', 'bar'));
console.log('  hi  '.trim());
console.log('5'.padStart(3, '0'));

const user = { name: 'Ada', role: 'admin' };
console.log(`<div>${user.name} (${user.role})</div>`);

const emoji = '🙂';
console.log('utf16 length', emoji.length);
console.log('code points', [...emoji].length);

const broken = '\uD800';
console.log(broken.isWellFormed());
console.log(broken.toWellFormed());
