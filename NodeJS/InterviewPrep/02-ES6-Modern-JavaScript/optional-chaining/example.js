// Run: node example.js
const response = { user: { profile: { name: "Ada" } } };

// Each optional segment stops safely if its base is nullish.
console.log(response.user?.profile?.name); // Ada
console.log(response.user?.profile?.address?.city); // undefined

function save(record, onSaved) {
  // Optional callback invocation avoids an explicit if statement.
  onSaved?.(record.id);
}

save({ id: 7 });
save({ id: 8 }, (id) => console.log(`Saved ${id}`)); // Saved 8
