Sequelize CLI provides built-in support for seeders, just like migrations.

## 1. Generate a Seeder

Run:

```bash
npx sequelize-cli seed:generate --name roles
```

This creates a file like:

```text
src/
├── seeders/
│   └── 20260713195632-roles.js
```

> Ensure your `.sequelizerc` or `sequelize.cjs` is configured so that the `seeders` directory points to `src/seeders`.

---

## 2. Seeder Structure

Example `roles` seeder:

```javascript
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        name: 'Super Admin',
        slug: 'super-admin',
        description: 'Full system access',
        permissions: JSON.stringify(['*']),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Admin',
        slug: 'admin',
        description: 'Administrator',
        permissions: JSON.stringify([
          'users.read',
          'users.create',
          'users.update',
          'users.delete',
        ]),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: 'Customer',
        slug: 'customer',
        description: 'Customer role',
        permissions: JSON.stringify([]),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', null, {});
  },
};
```

---

## 3. Run All Seeders

```bash
npx sequelize-cli db:seed:all
```

---

## 4. Run a Specific Seeder

```bash
npx sequelize-cli db:seed --seed 20260713195632-roles.js
```

---

## 5. Undo the Last Seeder

```bash
npx sequelize-cli db:seed:undo
```

---

## 6. Undo All Seeders

```bash
npx sequelize-cli db:seed:undo:all
```

---

## 7. Add Scripts to `package.json`

```json
{
  "scripts": {
    "db:migrate": "sequelize-cli db:migrate",
    "db:migrate:undo": "sequelize-cli db:migrate:undo",
    "db:migrate:undo:all": "sequelize-cli db:migrate:undo:all",

    "db:seed": "sequelize-cli db:seed:all",
    "db:seed:undo": "sequelize-cli db:seed:undo",
    "db:seed:undo:all": "sequelize-cli db:seed:undo:all"
  }
}
```

Now you can simply run:

```bash
npm run db:seed
```

---

## 8. Recommended Seeder Order

For a production-ready application, execute seeders in dependency order:

```text
seeders/
├── 20260713100001-roles.js
├── 20260713100002-permissions.js
├── 20260713100003-role-permissions.js
├── 20260713100004-admin-user.js
├── 20260713100005-categories.js
├── 20260713100006-brands.js
├── 20260713100007-settings.js
```

Since Sequelize executes seeders by filename timestamp, this ensures foreign key dependencies are satisfied.

---

## 9. Example `.sequelizerc`

If you're keeping everything under `src`, your `.sequelizerc` should look like:

```javascript
const path = require('path');

module.exports = {
  config: path.resolve('src/config/sequelize.cjs'),
  'models-path': path.resolve('src/models'),
  'seeders-path': path.resolve('src/seeders'),
  'migrations-path': path.resolve('src/migrations'),
};
```

This configuration allows Sequelize CLI to correctly locate your models, migrations, seeders, and configuration files.
