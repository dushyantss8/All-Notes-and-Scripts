'use strict';
function withDefaults(options = {}) {
  const defaults = { retries: 3, timeout: 3000, verbose: false };
  return {
    retries: options.retries ?? defaults.retries,
    timeout: options.timeout ?? defaults.timeout,
    verbose: options.verbose ?? defaults.verbose,
  };
}
console.log(withDefaults({ retries: 0 }));
module.exports = { withDefaults };
