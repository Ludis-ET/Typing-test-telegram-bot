import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;
if (!mongoUri)
  throw new Error("MONGO_URI is not defined in environment variables");

mongoose
  .connect(mongoUri)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error: unknown) => console.error("MongoDB connection error:", error));
