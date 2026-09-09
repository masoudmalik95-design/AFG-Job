import express from "express";

import {
  registerCompany,
  loginCompany,
  fetchCompanyData,
  postJob,
  getCompanyPostedAllJobs,
  changeJobVisibility,
  getCompanyJobApplicants,
  changeStatus,
} from "../controllers/companyController.js";

import upload from "../utils/upload.js";
import companyAuthMiddleware from "../middlewares/companyAuthMiddleware.js";

const router = express.Router();

// ثبت کارفرما
router.post(
  "/register-company",
  upload.single("image"),
  registerCompany
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