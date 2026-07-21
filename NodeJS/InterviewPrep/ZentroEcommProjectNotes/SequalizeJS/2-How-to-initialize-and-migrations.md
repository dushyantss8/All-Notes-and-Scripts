## How to init Sequilize.JS in a NodeJS Project : -

### 1. Install packages
```bash
npm install sequelize mysql2
npm install -D sequelize-cli
```
(`mysql2` for MySQL; use `pg` / `sqlite3` for other DBs.)

### 2. Init CLI scaffold
```bash
npx sequelize-cli init
```
Creates `config/`, `models/`, `migrations/`, `seeders/`.

### 3. Configure DB connection
Point env vars / config at host, DB name, user, password, dialect (`mysql`, etc.).

### 4. Create the Sequelize instance (in app code)
```js
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: '127.0.0.1',
  dialect: 'mysql',
  logging: false,
});

await sequelize.authenticate(); // verify connection
```

### 5. Define models + migrate
- Write models (or generate with CLI).
- Create/run migrations: `npx sequelize-cli db:migrate`
- Optionally seed: `npx sequelize-cli db:seed:all`

---

In this project that maps to: `sequelize` + `mysql2` in `package.json`, CLI config via `.sequelizerc`, runtime instance in `src/config/database.js`, models under `src/models/`.


## How to create migrations in Sequilize JS : -

Use the **Sequelize CLI** to generate a new migration.

### Create a Migration

```bash
npx sequelize-cli migration:generate --name create-users
```

npx sequelize-cli migration:generate --name create-roles

Example:

```bash
npx sequelize-cli migration:generate --name create-products
```

This creates a file similar to:

```text
src/migrations/
└── 20260712184530-create-products.js
```

---

### Migration Template

```javascript
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Apply changes
  },

  async down(queryInterface, Sequelize) {
    // Revert changes
  }
};
```

* `up()` → Contains the changes to apply.
* `down()` → Reverts the changes made in `up()`.

---

### Common Migration Commands

```bash
# Generate a migration
npx sequelize-cli migration:generate --name migration-name

# Run all pending migrations
npx sequelize-cli db:migrate

# Undo the last migration
npx sequelize-cli db:migrate:undo

# Undo all migrations
npx sequelize-cli db:migrate:undo:all

# Check migration status
npx sequelize-cli db:migrate:status
```

### Naming Convention

Use descriptive names, for example:

```text
create-users
create-products
create-orders
add-phone-to-users
add-status-to-orders
remove-avatar-from-users
rename-price-to-unit_price
create-product-categories
```

This makes the purpose of each migration immediately clear from its filename.