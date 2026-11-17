
import express from "express";

import {
  registerUser,
  loginUser,
  fetchUserData,
  applyJob,
  getUserAppliedJobs,
  uploadResume,
  viewUserResume,
} from "../controllers/userController.js";

import {
  profileUpload,
  resumeUpload,
} from "../utils/upload.js";

import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

// Candidate signup - Profile image maximum 5 MB
router.post(
  "/register-user",
  profileUpload.single("image"),
  registerUser
);

// Candidate login
router.post(
  "/login-user",
  loginUser
);

// Candidate data
router.get(
  "/user-data",
  userAuthMiddleware,
  fetchUserData
);

// Apply for job
router.post(
  "/apply-job",
  userAuthMiddleware,
  applyJob
);

// Candidate applications
router.post(
  "/get-user-applications",
  userAuthMiddleware,
  getUserAppliedJobs
);

// Upload resume - PDF maximum 10 MB
router.post(
  "/upload-resume",
  userAuthMiddleware,
  resumeUpload.single("resume"),
  uploadResume
);

// View candidate resume
router.get(
  "/view-resume",
  userAuthMiddleware,
  viewUserResume
);

export default router;
