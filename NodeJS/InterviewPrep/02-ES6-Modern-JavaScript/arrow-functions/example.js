"use strict";

class Counter {
  #value = 0;
  start() {
    return setInterval(() => {
      this.#value += 1; // `this` is Counter instance, not timer.
      console.log(this.#value);
    }, 1000);
  }
}

const timerId = new Counter().start();
setTimeout(() => clearInterval(timerId), 3100);
