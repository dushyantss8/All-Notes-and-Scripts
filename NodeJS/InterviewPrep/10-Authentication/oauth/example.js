import crypto from 'node:crypto';
const verifier = crypto.randomBytes(32).toString('base64url');
const challenge = crypto.createHash('sha256').update(verifier).digest('base64url');
const state = crypto.randomBytes(24).toString('base64url');
console.log({ state, challenge, note: 'Store state and verifier server-side; validate state at callback.' });
