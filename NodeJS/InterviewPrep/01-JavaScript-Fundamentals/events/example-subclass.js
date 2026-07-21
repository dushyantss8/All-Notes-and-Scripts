/**
 * Subclass EventEmitter
 * Run: node events/example-subclass.js
 */
'use strict';

const { EventEmitter } = require('events');

class JobQueue extends EventEmitter {
  enqueue(job) {
    this.emit('job', job);
  }
}

const q = new JobQueue();
q.on('job', (job) => console.log('processing', job));
q.enqueue({ id: 42 });
console.log('listeners', q.listenerCount('job'));
