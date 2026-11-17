
import express from "express";
import "dotenv/config";
import bodyParser from "body-parser";
import cors from "cors";
import multer from "multer";

import connectDB from "./src/db/connectDB.js";
import { initializeGridFS } from "./src/gridfs.js";

import userRoutes from "./src/routes/userRoutes.js";
import companyRoutes from "./src/routes/companyRoutes.js";
import jobRoutes from "./src/routes/jobRoutes.js";

const app = express();

// =================================
// تنظیمات عمومی سرور
// =================================
app.use(bodyParser.json());
app.use(cors());

// =================================
// تست Backend
// =================================
app.get("/", (req, res) => {
  res.send("api is working");
});

// =================================
// تعریف Routeها
// =================================
app.use("/user", userRoutes);
app.use("/company", companyRoutes);
app.use("/job", jobRoutes);

// =================================
// مدیریت مرکزی خطاهای آپلود و سرور
// =================================
app.use((error, req, res, next) => {
  console.error("Backend Error:", error);

  if (res.headersSent) {
    return next(error);
  }

  const url = req.originalUrl.toLowerCase();

  // تشخیص خطاهای Multer
  if (error instanceof multer.MulterError) {

    // حجم بیش از حد مجاز
    if (error.code === "LIMIT_FILE_SIZE") {
      let message =
        "حجم فایل انتخاب‌شده بیشتر از حد مجاز است.";

      // خطای CV
      if (url.includes("/user/upload-resume")) {
        message =
          "حجم فایل CV نباید بیشتر از ۱۰ مگابایت باشد.";
      }

      // خطای لوگوی شرکت
      else if (url.includes("/company/")) {
        message =
          "حجم لوگوی شرکت نباید بیشتر از ۵ مگابایت باشد.";
      }

      // خطای عکس پروفایل
      else if (url.includes("/user/register-user")) {
        message =
          "حجم عکس پروفایل نباید بیشتر از ۵ مگابایت باشد.";
      }

      return res.status(413).json({
        success: false,
        message,
      });
    }

    // فایل یا فیلد غیرمجاز
    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({
        success: false,
        message:
          "فایل ارسالی معتبر نیست یا تعداد فایل‌ها بیش از حد مجاز است.",
      });
    }

    // سایر خطاهای Multer
    return res.status(400).json({
      success: false,
      message:
        "در آپلود فایل مشکلی رخ داد. لطفاً دوباره تلاش کنید.",
    });
  }

  // خطاهای مربوط به فرمت فایل
  if (
    error.message ===
      "فقط تصاویر JPG، PNG، WEBP و GIF قابل قبول هستند" ||
    error.message ===
      "فقط فایل PDF برای CV قابل قبول است"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  // سایر خطاهای سرور
  return res.status(error.status || 500).json({
    success: false,
    message:
      error.status && error.status < 500
        ? error.message
        : "خطای داخلی سرور رخ داده است. لطفاً دوباره تلاش کنید.",
  });
});

// =================================
// شروع سرور
// =================================
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    initializeGridFS();

    app.listen(PORT, () => {
      console.log(`🌐 Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
};

startServer();
