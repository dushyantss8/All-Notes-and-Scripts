import crypto from 'node:crypto';
const hash = value => crypto.createHash('sha256').update(value).digest('hex');
const issue = () => crypto.randomBytes(48).toString('base64url');
const old = issue(), storedHash = hash(old); // Persist hash, family, expiry, revocation.
function rotate(presented) { if (hash(presented) !== storedHash) throw new Error('invalid refresh token'); return issue(); }
console.log({ rotated: rotate(old), neverStoreRawTokens: true });
