
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUrl =
      process.env.DATABASE_CONNECTION_URL ||
      "mongodb://127.0.0.1:27017";

    await mongoose.connect(`${mongoUrl}/superio-job-portal`);

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❎ Database connection failed:", error.message);
  }
};

export default connectDB;

