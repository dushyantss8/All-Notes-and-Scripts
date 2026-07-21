'use strict';
function daysBetween(a, b) {
  const msPerDay = 24 * 60 * 60 * 1000;
  const d1 = Date.parse(`${a}T00:00:00.000Z`);
  const d2 = Date.parse(`${b}T00:00:00.000Z`);
  if (Number.isNaN(d1) || Number.isNaN(d2)) throw new RangeError('invalid date');
  return Math.round(Math.abs(d2 - d1) / msPerDay);
}
console.log(daysBetween('2024-01-01', '2024-01-03'));
module.exports = { daysBetween };
