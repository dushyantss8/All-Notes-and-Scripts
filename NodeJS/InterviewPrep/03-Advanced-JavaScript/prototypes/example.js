"use strict";

/**
 * Prototypes: Object.create, constructor/.prototype, class extends,
 * own vs inherited properties, and a safe dictionary object.
 */

const animalProto = {
  speak() {
    return `${this.name} makes a noise`;
  },
};

function createAnimal(name) {
  const animal = Object.create(animalProto);
  animal.name = name;
  return animal;
}

const duck = createAnimal("Duck");
console.log(duck.speak()); // Duck makes a noise
console.log(
  "proto link:",
  Object.getPrototypeOf(duck) === animalProto
);

function Person(name) {
  this.name = name;
}
Person.prototype.hello = function hello() {
  return `Hello, ${this.name}`;
};

class Employee extends Person {
  constructor(name, role) {
    super(name);
    this.role = role;
  }
  hello() {
    return `${Person.prototype.hello.call(this)} (${this.role})`;
  }
}

const emp = new Employee("Ada", "Engineer");
console.log(emp.hello());
console.log(
  "instanceof chain:",
  emp instanceof Employee,
  emp instanceof Person,
  emp instanceof Object
);

const bag = Object.create(null);
bag.token = "secret";
console.log("dict keys:", Object.keys(bag));
console.log("no inherited toString:", typeof bag.toString); // undefined

console.log("own:", Object.hasOwn(emp, "name"), Object.hasOwn(emp, "hello"));

module.exports = { createAnimal, animalProto, Person, Employee };
