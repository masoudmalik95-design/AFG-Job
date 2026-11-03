
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUrl = process.env.DATABASE_CONNECTION_URL;

    if (!mongoUrl) {
      throw new Error("DATABASE_CONNECTION_URL is not defined");
    }

    await mongoose.connect(mongoUrl, {
      dbName: "AFG-Job",
    });

    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❎ Database connection failed:", error);
  }
};

export default connectDB;
