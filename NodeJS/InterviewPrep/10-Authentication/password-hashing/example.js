import bcrypt from 'bcrypt';
const password = 'correct horse battery staple';
const hash = await bcrypt.hash(password, 12); // Benchmark the work factor for your environment.
console.log({ matches: await bcrypt.compare(password, hash), wrong: await bcrypt.compare('wrong', hash) });
