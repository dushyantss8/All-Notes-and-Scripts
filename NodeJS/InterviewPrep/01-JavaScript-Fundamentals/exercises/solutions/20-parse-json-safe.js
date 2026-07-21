'use strict';
function parseJSONSafe(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (error) {
    return { ok: false, error };
  }
}
console.log(parseJSONSafe('{"a":1}'));
console.log(parseJSONSafe('{bad}').ok);
module.exports = { parseJSONSafe };
