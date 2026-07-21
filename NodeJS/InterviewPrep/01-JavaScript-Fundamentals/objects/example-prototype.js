/**
 * Prototypes
 * Run: node objects/example-prototype.js
 */
'use strict';

const proto = {
  greet() {
    return `hi ${this.name}`;
  },
};
const user = Object.create(proto);
user.name = 'Ada';
console.log(user.greet());
console.log(Object.getPrototypeOf(user) === proto);

function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function () {
  return `${this.name} makes a noise`;
};
const dog = new Animal('Rex');
console.log(dog.speak());
console.log(dog instanceof Animal);
