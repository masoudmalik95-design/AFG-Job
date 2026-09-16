import express from "express";

import {
  registerUser,
  loginUser,
  fetchUserData,
  applyJob,
  getUserAppliedJobs,
  uploadResume,
} from "../controllers/userController.js";

import upload, { resumeUpload } from "../utils/upload.js";
import userAuthMiddleware from "../middlewares/userAuthMiddleware.js";

const router = express.Router();

// Candidate signup
router.post(
  "/register-user",
  upload.single("image"),
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

// Upload resume
router.post(
  "/upload-resume",
  userAuthMiddleware,
  resumeUpload.single("resume"),
  uploadResume
);

export default router;