
import express from "express";
import { ObjectId } from "mongodb";

import {
  registerCompany,
  loginCompany,
  fetchCompanyData,
  updateCompanyImage,
  postJob,
  getCompanyPostedAllJobs,
  changeJobVisibility,
  getCompanyJobApplicants,
  changeStatus,
} from "../controllers/companyController.js";

import upload from "../utils/upload.js";
import companyAuthMiddleware from "../middlewares/companyAuthMiddleware.js";
import { getGridFSBucket } from "../gridfs.js";
import JobApplication from "../models/JobApplication.js";

const router = express.Router();

// =================================
// دریافت تصویر از MongoDB GridFS
// =================================
router.get("/image/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "شناسه تصویر معتبر نیست",
      });
    }

    const bucket = getGridFSBucket();

    const files = await bucket
      .find({ _id: new ObjectId(id) })
      .toArray();

    if (!files.length) {
      return res.status(404).json({
        success: false,
        message: "تصویر پیدا نشد",
      });
    }

    const file = files[0];

    if (
      !["company-image", "user-image"].includes(
        file.metadata?.purpose
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "دسترسی به این فایل مجاز نیست",
      });
    }

    res.set(
      "Content-Type",
      file.contentType || "application/octet-stream"
    );

    res.set("Cache-Control", "public, max-age=86400");

    const downloadStream = bucket.openDownloadStream(
      new ObjectId(id)
    );

    downloadStream.on("error", (error) => {
      console.error("GridFS image error:", error);

      if (!res.headersSent) {
        res.status(404).json({
          success: false,
          message: "دریافت تصویر انجام نشد",
        });
      } else {
        res.destroy(error);
      }
    });

    downloadStream.pipe(res);
  } catch (error) {
    console.error("Get GridFS image error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: "خطا در دریافت تصویر",
      });
    }
  }
});

// =================================
// دانلود امن CV از MongoDB GridFS
// =================================
router.get(
  "/resume/:applicationId",
  companyAuthMiddleware,
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const companyId = req.companyData._id;

      if (!ObjectId.isValid(applicationId)) {
        return res.status(400).json({
          success: false,
          message: "شناسه درخواست معتبر نیست",
        });
      }

      const application = await JobApplication.findOne({
        _id: applicationId,
        companyId,
      }).populate("userId", "resume");

      if (!application) {
        return res.status(404).json({
          success: false,
          message: "درخواست کاری پیدا نشد",
        });
      }

      const resumeId = application.userId?.resume;

      if (!resumeId || !ObjectId.isValid(resumeId)) {
        return res.status(404).json({
          success: false,
          message: "CV برای این کارجو ثبت نشده است",
        });
      }

      const bucket = getGridFSBucket();
      const fileObjectId = new ObjectId(resumeId);

      const files = await bucket
        .find({ _id: fileObjectId })
        .toArray();

      if (!files.length) {
        return res.status(404).json({
          success: false,
          message: "فایل CV پیدا نشد",
        });
      }

      const file = files[0];

      if (file.metadata?.purpose !== "resume") {
        return res.status(403).json({
          success: false,
          message: "دسترسی به این فایل مجاز نیست",
        });
      }

      res.set("Content-Type", "application/pdf");
      res.set(
        "Content-Disposition",
        'attachment; filename="resume.pdf"'
      );
      res.set("Cache-Control", "private, no-store");

      const downloadStream = bucket.openDownloadStream(
        fileObjectId
      );

      downloadStream.on("error", (error) => {
        console.error("GridFS resume error:", error);

        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: "دانلود CV انجام نشد",
          });
        } else {
          res.destroy(error);
        }
      });

      downloadStream.pipe(res);
    } catch (error) {
      console.error("Download resume error:", error);

      if (!res.headersSent) {
        return res.status(500).json({
          success: false,
          message: "خطا در دانلود CV",
        });
      }
    }
  }
);

// =================================
// ثبت شرکت
// =================================
router.post(
  "/register-company",
  upload.single("image"),
  registerCompany
);

// =================================
// تغییر عکس شرکت
// =================================
router.put(
  "/update-company-image",
  companyAuthMiddleware,
  upload.single("image"),
  updateCompanyImage
);

// ورود شرکت
router.post("/login-company", loginCompany);

// دریافت اطلاعات شرکت
router.get(
  "/company-data",
  companyAuthMiddleware,
  fetchCompanyData
);

// نشر آگهی وظیفه
router.post(
  "/post-job",
  companyAuthMiddleware,
  postJob
);

// دریافت تمام آگهی‌های شرکت
router.get(
  "/posted-jobs",
  companyAuthMiddleware,
  getCompanyPostedAllJobs
);

// تغییر وضعیت نمایش آگهی
router.post(
  "/change-visiblity",
  companyAuthMiddleware,
  changeJobVisibility
);

// دریافت درخواست‌های کاری
router.post(
  "/view-applications",
  companyAuthMiddleware,
  getCompanyJobApplicants
);

// تغییر وضعیت درخواست کاری
router.post(
  "/change-status",
  companyAuthMiddleware,
  changeStatus
);

export default router;
