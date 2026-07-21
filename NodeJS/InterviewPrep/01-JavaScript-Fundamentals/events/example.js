/**
 * EventEmitter basics
 * Run: node events/example.js
 */
'use strict';

const { EventEmitter } = require('events');
const ee = new EventEmitter();

ee.on('ping', (n) => console.log('ping', n));
ee.once('ready', () => console.log('ready once'));

ee.emit('ping', 1);
ee.emit('ping', 2);
ee.emit('ready');
ee.emit('ready');

ee.on('error', (err) => console.log('handled', err.message));
ee.emit('error', new Error('boom'));

function onData(chunk) {
  console.log('data', chunk);
}
ee.on('data', onData);
ee.off('data', onData);
ee.emit('data', 'x'); // no output
