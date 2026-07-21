"use strict";

const pipe = (...functions) => input =>
  functions.reduce((value, fn) => fn(value), input);

const trim = value => value.trim();
const nonEmpty = value => {
  if (!value) throw new Error("Value is required");
  return value;
};
const normalizeEmail = value => value.toLowerCase();

console.log(pipe(trim, nonEmpty, normalizeEmail)(" Ada@Example.COM "));
module.exports = { pipe };
