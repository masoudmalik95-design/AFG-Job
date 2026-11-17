
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
const deleteFromGridFS = async (fileId, expectedPurpose = null) => {
  if (!fileId || !ObjectId.isValid(fileId)) {
    return;
  }

  const bucket = getGridFSBucket();
  const objectId = new ObjectId(fileId);

  try {
    // پیدا کردن فایل
    const files = await bucket
      .find({ _id: objectId })
      .limit(1)
      .toArray();

    if (!files.length) {
      return;
    }

    // بررسی نوع فایل برای جلوگیری از حذف اشتباهی
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
  deleteFromGridFS,
};
