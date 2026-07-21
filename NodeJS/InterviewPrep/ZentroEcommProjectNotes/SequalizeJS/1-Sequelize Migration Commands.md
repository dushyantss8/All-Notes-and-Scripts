## Sequelize Migration Commands (`package.json`)

```json
{
  "db:migrate": "npx sequelize-cli db:migrate",
  "db:migrate:undo": "npx sequelize-cli db:migrate:undo",
  "db:seed": "npx sequelize-cli db:seed:all",
  "db:seed:undo": "npx sequelize-cli db:seed:undo:all",
  "db:reset": "npx sequelize-cli db:migrate:undo:all && npx sequelize-cli db:migrate && npx sequelize-cli db:seed:all"
}
```

### Command Descriptions

| Command                   | Description                                                                               |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `npm run db:migrate`      | Runs all pending database migrations.                                                     |
| `npm run db:migrate:undo` | Reverts the last executed migration.                                                      |
| `npm run db:seed`         | Executes all database seeders.                                                            |
| `npm run db:seed:undo`    | Removes all seeded data.                                                                  |
| `npm run db:reset`        | Resets the database by undoing migrations, running them again, and executing all seeders. |

---