# Populate

> **Interview goal:** explain the mechanism, identify the trade-off, then show how you would verify it in production.

## What it is

Populate resolves referenced documents through additional queries. It improves ergonomics but can over-fetch and conceal N+1 behavior.


## Core APIs and concepts

- populate, select, match, options, refPath, lean
- Prefer official API contracts over folklore; behavior can vary across Node, Express, MongoDB, Mongoose, MySQL, and PostgreSQL versions.
- Keep input validation, authorization, limits, error translation, and observability close to the system boundary.

## Practical example

```js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true },
  name: { type: String, required: true, minlength: 2 },
}, { timestamps: true });

// Document hooks are explicit about changed fields.
userSchema.pre("save", function () {
  if (this.isModified("email")) this.email = this.email.toLowerCase();
});

export const User = mongoose.model("User", userSchema);
// For updates, request validation explicitly:
// await User.findByIdAndUpdate(id, update, { new: true, runValidators: true });
```

The runnable starter is in [`example.js`](./example.js). Adapt it with explicit tests and environment-specific configuration; do not paste credentials into source.

## Production notes

1. Measure before optimizing: collect latency, error, saturation, and execution-plan evidence.
2. Make timeouts, resource limits, retries, and cancellation intentional.
3. Treat all external input and operational metadata as untrusted until validated or redacted.

## Interview questions with answer direction

1. **When is populate inappropriate?**  
   Start with the invariant or runtime behavior, then state the trade-off and a concrete operational example.
2. **How do you limit populated fields?**  
   Mention failure modes, observability, and how you would test the claim.
3. **What would change at 10× traffic or data volume?**  
   Discuss bottlenecks, load distribution, indexes/caching/queues where relevant, and correctness first.

## Exercises

- [ ] Return posts with author summaries efficiently.
- [ ] Write a failing test for its error or boundary case.
- [ ] Record the metric, trace, explain plan, or benchmark that would prove the implementation is correct.

## Official references

- [Mongoose ODM Patterns documentation](https://mongoosejs.com/docs/)
