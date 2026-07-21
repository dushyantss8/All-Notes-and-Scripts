"use strict";

const delay = (ms, value) => new Promise(resolve => setTimeout(resolve, ms, value));

async function concurrent() {
  // Start both before awaiting either: total duration is roughly 30ms, not 50ms.
  const first = delay(30, "first");
  const second = delay(20, "second");
  return Promise.all([first, second]);
}

concurrent().then(console.log).catch(console.error);
