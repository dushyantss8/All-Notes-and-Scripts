"use strict";

/**
 * call / apply / bind: receivers, partial args, method borrowing,
 * and a small bind helper that preserves `this` for callbacks.
 */

function format(prefix, suffix) {
  return `${prefix}${this.value}${suffix}`;
}

const packet = { value: 42 };
console.log("call:", format.call(packet, "<", ">"));
console.log("apply:", format.apply(packet, ["[", "]"]));

const boundFormat = format.bind(packet, "(");
console.log("bind partial:", boundFormat(")")); // (42)

// Later call cannot override bound thisArg
console.log(
  "bound ignores new this:",
  boundFormat.call({ value: 99 }, ")")
); // (42)

const arrayLike = { 0: "x", 1: "y", 2: "z", length: 3 };
const joined = Array.prototype.join.call(arrayLike, ":");
console.log("borrow join:", joined); // x:y:z

/**
 * Production-style bind helper: validate, preserve arity hint, expose target.
 */
function hardBind(fn, thisArg, ...presetArgs) {
  if (typeof fn !== "function") throw new TypeError("fn must be a function");
  function bound(...args) {
    return fn.apply(thisArg, presetArgs.concat(args));
  }
  Object.defineProperty(bound, "length", {
    value: Math.max(0, fn.length - presetArgs.length),
  });
  bound.target = fn;
  bound.boundThis = thisArg;
  return bound;
}

const service = {
  name: "auth",
  handle(event) {
    return `${this.name}:${event}`;
  },
};

const onEvent = hardBind(service.handle, service);
console.log("hardBind:", onEvent("login"));

// Spread preferred over apply for variadic builtins
const nums = [3, 1, 7, 2];
console.log("max spread:", Math.max(...nums));

module.exports = { format, hardBind };
