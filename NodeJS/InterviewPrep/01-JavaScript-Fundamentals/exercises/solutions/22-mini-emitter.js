'use strict';
class MiniEmitter {
  constructor() {
    this.events = Object.create(null);
  }
  on(event, fn) {
    (this.events[event] ??= []).push(fn);
    return this;
  }
  off(event, fn) {
    const list = this.events[event];
    if (!list) return this;
    this.events[event] = list.filter((f) => f !== fn);
    return this;
  }
  once(event, fn) {
    const wrap = (...args) => {
      this.off(event, wrap);
      fn(...args);
    };
    return this.on(event, wrap);
  }
  emit(event, ...args) {
    const list = [...(this.events[event] ?? [])];
    for (const fn of list) fn(...args);
    return this;
  }
}
const bus = new MiniEmitter();
bus.on('hi', (n) => console.log('hi', n));
bus.once('ready', () => console.log('ready'));
bus.emit('hi', 1);
bus.emit('ready');
bus.emit('ready');
module.exports = { MiniEmitter };
