import express from "express";
import getAllJobs from "../controllers/jobController.js";

const router = express.Router();

// دریافت تمام آگهی‌های فعال
router.get("/all-jobs", getAllJobs);

export default router;