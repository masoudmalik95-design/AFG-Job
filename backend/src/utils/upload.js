
import multer from "multer";
import path from "path";

// بررسی فایل‌های تصویری
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  if (!allowedTypes.includes(file.mimetype)) {
    return cb(
      new Error("فقط تصاویر JPG، PNG، WEBP و GIF قابل قبول هستند")
    );
  }

  cb(null, true);
};

// بررسی فایل PDF
const resumeFileFilter = (req, file, cb) => {
  const extension = path.extname(file.originalname).toLowerCase();

  if (
    file.mimetype !== "application/pdf" ||
    extension !== ".pdf"
  ) {
    return cb(
      new Error("فقط فایل PDF برای CV قابل قبول است")
    );
  }

  cb(null, true);
};

// ذخیره موقت فایل‌ها در حافظه
const storage = multer.memoryStorage();

// عکس پروفایل کاربر: 5MB
export const profileUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// لوگوی شرکت: 5MB
export const companyUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// فایل CV: 10MB
export const resumeUpload = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

// حفظ سازگاری با Import پیش‌فرض قبلی
export default profileUpload;
