/**
 * this binding — call / apply / bind / arrow
 * Run: node functions/example-this.js
 */
'use strict';

function greet(greeting) {
  return `${greeting}, ${this.name}`;
}
const user = { name: 'Ada' };
console.log(greet.call(user, 'Hi'));
console.log(greet.apply(user, ['Yo']));
const bound = greet.bind(user, 'Hello');
console.log(bound());

const timer = {
  seconds: 0,
  tick() {
    // arrow keeps lexical this → timer
    const bump = () => {
      this.seconds += 1;
      return this.seconds;
    };
    return bump();
  },
};
console.log(timer.tick()); // 1
console.log(timer.tick()); // 2
