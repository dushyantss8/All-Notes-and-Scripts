require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const port = Number(process.env.PORT || 3001);

async function start() {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is required");
  }
  await mongoose.connect(process.env.MONGODB_URI);
  const server = app.listen(port, () => {
    console.log(`task-api listening on ${port}`);
  });

  const stop = async () => {
    server.close();
    await mongoose.disconnect();
    process.exit(0);
  };
  process.on("SIGTERM", stop);
  process.on("SIGINT", stop);
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
