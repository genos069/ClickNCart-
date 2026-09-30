import "dotenv/config";
import mongoose from "mongoose";
import { app } from "./app.js";
if (
  !process.env.MONGO_URI ||
  !process.env.JWT_SECRET ||
  process.env.JWT_SECRET.length < 32
)
  throw new Error(
    "MONGO_URI and a JWT_SECRET of at least 32 characters are required",
  );
if (
  process.env.NODE_ENV === "production" &&
  !process.env.CLIENT_URL?.startsWith("https://")
)
  throw new Error("Production CLIENT_URL must use HTTPS");
await mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 10000,
  autoIndex: process.env.NODE_ENV !== "production",
});
const server = app.listen(process.env.PORT || 3000, () =>
  console.log("ClickNCart API ready"),
);
for (const signal of ["SIGTERM", "SIGINT"])
  process.on(signal, () => {
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  });
