
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";

let gridFSBucket = null;

const initializeGridFS = () => {
  if (mongoose.connection.readyState !== 1) {
    throw new Error("MongoDB is not connected");
  }

  if (!gridFSBucket) {
    gridFSBucket = new GridFSBucket(
      mongoose.connection.db,
      {
        bucketName: "uploads",
      }
    );

    console.log("✅ GridFS initialized successfully");
  }

  return gridFSBucket;
};

const getGridFSBucket = () => {
  if (!gridFSBucket) {
    throw new Error("GridFS has not been initialized");
  }

  return gridFSBucket;
};

export { initializeGridFS, getGridFSBucket };
