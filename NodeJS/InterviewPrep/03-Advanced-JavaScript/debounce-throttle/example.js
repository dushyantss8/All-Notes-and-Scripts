"use strict";

/**
 * Delays invocation until calls have stopped for `wait` milliseconds.
 * Provides cancel/flush like production UI utilities and retains `this`.
 */
function debounce(fn, wait) {
  if (typeof fn !== "function" || wait < 0) throw new TypeError("Invalid arguments");
  let timerId;
  let lastArgs;
  let lastThis;
  const invoke = () => {
    timerId = undefined;
    const result = fn.apply(lastThis, lastArgs);
    lastArgs = lastThis = undefined;
    return result;
  };
  function debounced(...args) {
    lastArgs = args;
    lastThis = this;
    clearTimeout(timerId);
    timerId = setTimeout(invoke, wait);
  }
  debounced.cancel = () => { clearTimeout(timerId); timerId = lastArgs = lastThis = undefined; };
  debounced.flush = () => (timerId === undefined ? undefined : (clearTimeout(timerId), invoke()));
  return debounced;
}

/**
 * Limits invocation to once per interval, with a trailing call.
 */
function throttle(fn, wait) {
  if (typeof fn !== "function" || wait < 0) throw new TypeError("Invalid arguments");
  let lastTime = 0, timerId, args, context;
  const invoke = (time) => { lastTime = time; timerId = undefined; fn.apply(context, args); context = args = undefined; };
  return function throttled(...nextArgs) {
    const now = Date.now(), remaining = wait - (now - lastTime);
    context = this; args = nextArgs;
    if (remaining <= 0 || remaining > wait) { clearTimeout(timerId); invoke(now); }
    else if (!timerId) timerId = setTimeout(() => invoke(Date.now()), remaining);
  };
}

module.exports = { debounce, throttle };
