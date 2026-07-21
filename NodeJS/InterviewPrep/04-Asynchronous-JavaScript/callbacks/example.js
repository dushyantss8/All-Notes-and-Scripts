"use strict";

function readSetting(name, callback) {
  setTimeout(() => {
    if (!name) return callback(new TypeError("A setting name is required"));
    callback(null, { name, enabled: true }); // Error-first callback contract.
  }, 10);
}

readSetting("telemetry", (error, setting) => {
  if (error) return console.error(error.message);
  console.log(setting);
});
