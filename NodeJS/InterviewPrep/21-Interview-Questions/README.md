# Interview Questions — Index

Conceptual Q&A banks leveled for backend interviews. Use these for verbal practice; use [Coding Challenges](../20-Coding-Challenges/README.md) for hands-on coding.

Each topic folder includes leveled questions and answer frameworks (do not recite answers robotically — adapt to the interviewer).

## Categories

### Language and runtime

| Category | Path | Use when |
|---|---|---|
| JavaScript | [javascript/README.md](javascript/README.md) | Closures, types, `this`, event loop basics, coercion |
| ES6+ | [es6/README.md](es6/README.md) | `let`/`const`, promises, modules, modern syntax |
| Node.js | [nodejs/README.md](nodejs/README.md) | Modules, event loop, streams, cluster, libuv |

### Web APIs and frameworks

| Category | Path | Use when |
|---|---|---|
| Express | [express/README.md](express/README.md) | Middleware, routing, error handling, patterns |
| REST APIs | [rest-apis/README.md](rest-apis/README.md) | Resources, status codes, versioning, pagination |
| React | [react/README.md](react/README.md) | Full-stack roles that still probe frontend basics |

### Data stores

| Category | Path | Use when |
|---|---|---|
| MongoDB | [mongodb/README.md](mongodb/README.md) | Document modeling, aggregation, indexes |
| SQL | [sql/README.md](sql/README.md) | Joins, transactions, indexing, normalization |

### Security and access

| Category | Path | Use when |
|---|---|---|
| Authentication | [authentication/README.md](authentication/README.md) | Sessions, JWT, OAuth, refresh tokens |
| Security | [security/README.md](security/README.md) | OWASP-style topics, headers, injection, XSS/CSRF |

### Design

| Category | Path | Use when |
|---|---|---|
| System Design | [system-design/README.md](system-design/README.md) | Short conceptual SD questions |
| Full SD playbooks | [../16-System-Design/README.md](../16-System-Design/README.md) | End-to-end designs (URL shortener, chat, payments, …) |

## Suggested study order (Node backend ~4 YOE)

1. **JavaScript** → **ES6** → **Node.js** (close gaps in language/runtime first)  
2. **Express** + **REST APIs** (how you ship HTTP services)  
3. **SQL** and **MongoDB** (be able to compare)  
4. **Authentication** + **Security** (every backend loop asks these)  
5. **System Design** notes + [16-System-Design](../16-System-Design/README.md) practice  
6. Skim **React** if the job is full-stack or the panel includes UI engineers  

## How to practice Q&A

- Draw a random question; answer aloud in 2–3 minutes.  
- Structure: definition → example → pitfall → production note.  
- Keep a “weak list” of questions you hedge on; revisit weekly.  
- Pair with coding: after a Node conceptual day, do 3 Node challenges.

## Related folders

- [HR interview samples](../22-HR-Interview/README.md)  
- [Behavioral STAR stories](../23-Behavioral-Questions/README.md)  
- [Coding challenges](../20-Coding-Challenges/README.md)  
- [System design playbook](../16-System-Design/README.md)
