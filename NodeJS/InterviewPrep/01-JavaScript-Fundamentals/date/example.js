/**
 * Date — runnable examples
 * Run: node date/example.js
 */
'use strict';

const d = new Date('2024-06-01T12:30:00.000Z');
console.log(d.toISOString());
console.log(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());

const ms = Date.now();
console.log(new Date(ms).getTime() === ms);

console.log(Number.isNaN(new Date('not a date').getTime()));

const start = new Date('2024-01-01T00:00:00Z');
const end = new Date('2024-01-02T00:00:00Z');
console.log((end - start) / (1000 * 60 * 60)); // 24

console.log(d.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

const a = new Date('2024-01-01T00:00:00Z');
const b = a;
b.setUTCDate(5);
console.log('shared mutation', a.toISOString());

const clone = new Date(a.getTime());
clone.setUTCDate(10);
console.log('original after clone mutate', a.toISOString());
console.log('clone', clone.toISOString());
