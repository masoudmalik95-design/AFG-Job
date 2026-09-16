import multer from "multer";
import path from "path";
import fs from "fs";

// ===============================
// Company/User Images
// ===============================
const companyUploadDir = "uploads/companies";

if (!fs.existsSync(companyUploadDir)) {
  fs.mkdirSync(companyUploadDir, { recursive: true });
}

const companyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, companyUploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, filename);
  },
});

const upload = multer({
  storage: companyStorage,
});

// ===============================
// Resume / CV Upload
// ===============================
const resumeUploadDir = "uploads/resumes";

if (!fs.existsSync(resumeUploadDir)) {
  fs.mkdirSync(resumeUploadDir, { recursive: true });
}

const resumeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumeUploadDir);
  },

  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    const filename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${extension}`;

    cb(null, filename);
  },
});

const resumeUpload = multer({
  storage: resumeStorage,

  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension !== ".pdf") {
      return cb(
        new Error("فقط فایل PDF برای CV قابل قبول است")
      );
    }

    cb(null, true);
  },

  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export { resumeUpload };

export default upload;