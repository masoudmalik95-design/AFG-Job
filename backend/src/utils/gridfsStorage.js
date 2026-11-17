
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

// دریافت فایل از GridFS
const getFileFromGridFS = async (fileId, expectedPurpose = null) => {
  if (!fileId || !ObjectId.isValid(fileId)) {
    return null;
  }

  const bucket = getGridFSBucket();
  const objectId = new ObjectId(fileId);

  const files = await bucket
    .find({ _id: objectId })
    .limit(1)
    .toArray();

  if (!files.length) {
    return null;
  }

  const file = files[0];

  if (
    expectedPurpose &&
    file.metadata?.purpose !== expectedPurpose
  ) {
    return null;
  }

  return {
    file,
    stream: bucket.openDownloadStream(objectId),
  };
};

// حذف فایل از MongoDB GridFS
const deleteFromGridFS = async (fileId, expectedPurpose = null) => {
  if (!fileId || !ObjectId.isValid(fileId)) {
    return;
  }

  const bucket = getGridFSBucket();
  const objectId = new ObjectId(fileId);

  try {
    const files = await bucket
      .find({ _id: objectId })
      .limit(1)
      .toArray();

    if (!files.length) {
      return;
    }

    if (
      expectedPurpose &&
      files[0].metadata?.purpose !== expectedPurpose
    ) {
      console.warn(
        "GridFS file purpose mismatch. File was not deleted:",
        fileId
      );
      return;
    }

    await bucket.delete(objectId);
  } catch (error) {
    if (error.message?.includes("FileNotFound")) {
      return;
    }

    throw error;
  }
};

export {
  uploadToGridFS,
  getFileFromGridFS,
  deleteFromGridFS,
};
