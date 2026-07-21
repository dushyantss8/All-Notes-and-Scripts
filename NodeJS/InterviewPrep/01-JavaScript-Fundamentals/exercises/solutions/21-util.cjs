function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
function unique(arr) {
  return [...new Set(arr)];
}
module.exports = { clamp, unique };
