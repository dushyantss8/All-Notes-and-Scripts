/** Slug helper — URL-safe slug with optional uniqueness suffix. */
function slugify(input) {
  return String(input)
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

function slugWithSuffix(base, n) {
  return n <= 0 ? base : `${base}-${n}`;
}

module.exports = { slugify, slugWithSuffix };
