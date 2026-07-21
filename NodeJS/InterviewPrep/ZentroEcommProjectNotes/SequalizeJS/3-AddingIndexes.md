| Index | Why |
|---|---|
| `roles_slug_unique` on `slug` | Enforces unique role identifiers (`super_admin`, `admin`, etc.) and speeds lookups by slug (common when resolving a user’s role). |
| `roles_is_active_idx` on `is_active` | Speeds queries that filter active vs inactive roles (e.g. listing only active roles). |

`slug` also has `unique: true` on the column; the named unique index makes that constraint explicit and named for migrations/DB tooling.