"use strict";

const delay = (ms, value, reject = false) =>
  new Promise((resolve, rejectPromise) =>
    setTimeout(() => (reject ? rejectPromise(new Error(String(value))) : resolve(value)), ms));

async function loadDashboard() {
  const [profile, settings] = await Promise.all([delay(20, "profile"), delay(10, "settings")]);
  return { profile, settings }; // Result position matches input position.
}

loadDashboard().then(console.log).catch(console.error);
