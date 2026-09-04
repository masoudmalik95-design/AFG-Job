import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    // کاربری که برای وظیفه درخواست داده است
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // شرکتی که وظیفه را نشر کرده است
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // وظیفه‌ای که کاربر برای آن درخواست داده است
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // نامه همراه درخواست
    coverLetter: {
      type: String,
      default: "",
      trim: true,
    },

    // لینک رزومه
    resume: {
      type: String,
      default: "",
    },

    // وضعیت درخواست
    status: {
      type: String,
      enum: [
        "در انتظار بررسی",
        "تأیید شده",
        "رد شده",
        "مصاحبه",
      ],
      default: "در انتظار بررسی",
    },

    // تاریخ درخواست
    date: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

/*
  جلوگیری از ارسال چند درخواست
  توسط یک کاربر برای یک وظیفه
*/
jobApplicationSchema.index(
  { userId: 1, jobId: 1 },
  { unique: true }
);

/*
  برای دریافت سریع درخواست‌های یک شرکت
*/
jobApplicationSchema.index({
  companyId: 1,
  createdAt: -1,
});

/*
  برای دریافت درخواست‌های مربوط به یک وظیفه
*/
jobApplicationSchema.index({
  jobId: 1,
  createdAt: -1,
});

const JobApplication = mongoose.model(
  "JobApplication",
  jobApplicationSchema
);

export default JobApplication;