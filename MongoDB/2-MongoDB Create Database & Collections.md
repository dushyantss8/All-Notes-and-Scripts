## Database and Collection Management (Create, View, Rename, Delete)

---

## 1. Introduction to MongoDB Structure

### 1.1 What Is a Database?

A **database** is a container that stores organized data on the server.
Example scenario:

* A school database may contain student records, library records, and department information.

### 1.2 Collections

Inside a database, MongoDB stores data in **collections**.
A collection is similar to a file or table that holds related records.

Examples in a school database:

* `students`
* `library`
* `teachers`

### 1.3 Documents

A **document** is a single record inside a collection.
MongoDB documents are in **BSON/JSON-like structure**.

Example:

```json
{
  "name": "John",
  "age": 20,
  "class": "10A"
}
```

### 1.4 Hierarchy Summary

```
Database
   └── Collections
         └── Documents
```

---

# 2. Connecting to MongoDB Shell

MongoDB operations are executed using the **Mongo Shell (mongosh)**.

### Methods to open mongosh

1. **Via installation folder**
   Double-click `mongosh.exe` inside the MongoDB installation directory.

2. **Via system command prompt**

   ```bash
   mongosh
   ```

Once opened, MongoDB displays a successful connection message.

---

# 3. Viewing Existing Databases

### Command

```javascript
show dbs
```

This lists all available databases such as:

* `admin`
* `config`
* `local`

Note: Newly created databases appear only after at least one collection or document is added.

---

# 4. Creating and Selecting a Database

### Command

```javascript
use databaseName
```

### Example

```javascript
use school
```

MongoDB behavior:

* If the database exists → it switches to it.
* If not → it creates the database and switches to it.

### Check current database

```javascript
db
```

---

# 5. Creating a Collection

### Syntax

```javascript
db.createCollection("collectionName")
```

### Example

Create a `students` collection:

```javascript
db.createCollection("students")
```

Response:

```json
{ "ok" : 1 }
```

### View all collections

```javascript
show collections
```

Example output:

```
students
library
```

---

# 6. Renaming a Collection

### Syntax

```javascript
db.oldCollectionName.renameCollection("newCollectionName")
```

### Example

Rename `students` → `student`:

```javascript
db.students.renameCollection("student")
```

Verification:

```javascript
show collections
```

---

# 7. Helpful MongoDB Shell Commands

### 7.1 General help

```javascript
help
```

### 7.2 Database-level help

```javascript
db.help()
```

Displays commonly used operations such as:

* `find`
* `count`
* `updateOne/updateMany`
* `deleteOne/deleteMany`
* `createCollection`
* Indexing methods

### 7.3 Collection-level help

```javascript
db.collectionName.help()
```

Example:

```javascript
db.student.help()
```

Shows commands specifically usable on that collection.

---

# 8. Deleting a Collection

### Syntax

```javascript
db.collectionName.drop()
```

### Example

```javascript
db.library.drop()
```

If successful, MongoDB returns:

```
true
```

---

# 9. Deleting a Database

Before deleting, ensure you are inside the target database:

```javascript
use school
```

### Command to delete database

```javascript
db.dropDatabase()
```

Response:

```json
{ "ok" : 1, "dropped" : "school" }
```

### Verify

```javascript
show dbs
```

Now `school` will no longer be listed.

---

# 10. Switching Between Databases

### Example

```javascript
use admin
use config
```

This is done using the **same `use` command**.

---

# 11. Summary of Key Commands

### Database-related commands

| Purpose                | Command             |
| ---------------------- | ------------------- |
| Show all databases     | `show dbs`          |
| Create/switch database | `use databaseName`  |
| Show current database  | `db`                |
| Delete database        | `db.dropDatabase()` |

### Collection-related commands

| Purpose           | Command                                  |
| ----------------- | ---------------------------------------- |
| Show collections  | `show collections`                       |
| Create collection | `db.createCollection("name")`            |
| Rename collection | `db.oldName.renameCollection("newName")` |
| Delete collection | `db.collectionName.drop()`               |

### Help commands

| Purpose         | Command                    |
| --------------- | -------------------------- |
| General help    | `help`                     |
| Database help   | `db.help()`                |
| Collection help | `db.collectionName.help()` |

---