# **MongoDB Tutorial: Deleting Documents from a Collection**

This tutorial explains how to delete documents from a MongoDB collection using `deleteOne()` and `deleteMany()`. It also demonstrates how to delete all documents from a collection through practical examples.

---

## **1. Overview of Document Deletion in MongoDB**

MongoDB provides two primary methods for deleting documents within a collection:

1. **`deleteOne(filter)`**
   Deletes the first matching document based on the specified filter.

2. **`deleteMany(filter)`**
   Deletes all documents that match the filter condition.
   Passing an empty filter `{}` removes all documents in the collection.

---

# **2. Syntax and Usage**

## **2.1 deleteOne()**

### **Purpose**

Deletes the first document matching the filter.

### **Syntax**

```
db.collectionName.deleteOne({ field: value })
```

### **Behavior**

* If multiple documents match the filter, only the first match is deleted.
* Typically, `_id` is preferred for deletion because it is unique.

---

## **2.2 deleteMany()**

### **Purpose**

Deletes all documents matching the filter.

### **Syntax**

```
db.collectionName.deleteMany({ field: value })
```

### **Behavior**

* Every document that satisfies the condition is removed.

---

## **2.3 Delete All Documents in a Collection**

### **Purpose**

Removes all records from the collection without dropping the collection itself.

### **Syntax**

```
db.collectionName.deleteMany({})
```

### **Important**

* Curly braces `{}` **must be present** but empty.
* This removes all documents but keeps the collection structure intact.

---

# **3. Practical Demonstration**

The transcript uses a database named **school** and a collection named **students**.

---

## **3.1 Starting MongoDB Server**

```
mongo
```

## **3.2 View All Databases**

```
show dbs
```

## **3.3 Select the Database**

```
use school
```

## **3.4 View Collections**

```
show collections
```

Output included collections:

* `personal`
* `students`

## **3.5 View All Documents in `students`**

```
db.students.find()
```

---

# **4. Deleting Documents**

## **4.1 Delete a Document Using `_id` (Using deleteOne)**

### **Example**

Suppose the document for *Salman Khan* has the following `_id`:

```
{ "_id": ObjectId("65a123abc...") }
```

### **Command**

```
db.students.deleteOne({ _id: ObjectId("65a123abc...") })
```

### **Result**

```
{ acknowledged: true, deletedCount: 1 }
```

The document is successfully removed.

---

## **4.2 Delete a Single Document by Matching a Field (deleteOne)**

Example: Delete the first student whose class is `"BCA"`.

```
db.students.deleteOne({ class: "BCA" })
```

### **Behavior**

* Only the first matching record is deleted.
* MongoDB does not delete all “BCA” students.

---

## **4.3 Delete Multiple Documents Using deleteMany**

Example: Delete all students whose class is `"BCA"`.

```
db.students.deleteMany({ class: "BCA" })
```

### **Result**

```
{ acknowledged: true, deletedCount: 2 }
```

All documents with `"class": "BCA"` are deleted.

---

## **4.4 Delete All Documents from the Collection**

### **Command**

```
db.students.deleteMany({})
```

### **Note**

* Curly braces are required.
* This removes all documents while keeping the collection.

### **Verification**

```
db.students.find()
```

Output:

```
[]
```

The collection is now empty.

---

# **5. Summary of Key Commands**

### **Delete One Document**

```
db.collection.deleteOne({ field: value })
```

### **Delete Multiple Documents**

```
db.collection.deleteMany({ field: value })
```

### **Delete All Documents**

```
db.collection.deleteMany({})
```

---