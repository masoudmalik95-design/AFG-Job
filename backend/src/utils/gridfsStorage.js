
import { ObjectId } from "mongodb";
import { getGridFSBucket } from "../gridfs.js";

// ذخیره فایل در MongoDB GridFS
const uploadToGridFS = (
  buffer,
  originalName,
  mimeType,
  purpose
) => {
  return new Promise((resolve, reject) => {
    try {
      const bucket = getGridFSBucket();

      const filename = `${Date.now()}-${originalName.replace(
        /[^a-zA-Z0-9._-]/g,
        "_"
      )}`;

      const uploadStream = bucket.openUploadStream(filename, {
        contentType: mimeType,
        metadata: {
          purpose,
          originalName,
        },
      });

      uploadStream.on("error", reject);

      uploadStream.on("finish", () => {
        resolve(uploadStream.id.toString());
      });

      uploadStream.end(buffer);
    } catch (error) {
      reject(error);
    }
  });
};

// حذف فایل از MongoDB GridFS
const deleteFromGridFS = async (fileId) => {
  if (!fileId || !ObjectId.isValid(fileId)) {
    return;
  }

  const bucket = getGridFSBucket();

  try {
    await bucket.delete(new ObjectId(fileId));
  } catch (error) {
    if (error.message?.includes("FileNotFound")) {
      return;
    }

    throw error;
  }
};

export {
  uploadToGridFS,
  deleteFromGridFS,
};
