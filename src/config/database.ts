import mongoose from "mongoose";

export const connectDB = async () => {
  const dbURI =
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sgu-database-local";
  try {
    await mongoose.connect(dbURI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log("MongoDB disconnected successfully");
  } catch (error) {
    console.error("MongoDB disconnected failed:", error);
    process.exit(1);
  }
};
