import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // عنوان وظیفه
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // توضیحات وظیفه
    description: {
      type: String,
      required: true,
      trim: true,
    },

    // ولایت
    province: {
      type: String,
      required: true,
      trim: true,
    },

    // شهر / ولسوالی
    city: {
      type: String,
      required: true,
      trim: true,
    },

    // نوع محل کار
    locationType: {
      type: String,
      enum: ["حضوری", "غیرحضوری"],
      default: "حضوری",
    },

    // نوع وظیفه
    jobType: {
      type: String,
      enum: [
        "تمام وقت",
        "نیمه وقت",
        "قراردادی",
        "فریلنسری",
        "کارآموزی",
      ],
      required: true,
    },

    // سطح وظیفه
    level: {
      type: String,
      required: true,
      trim: true,
    },

    // دسته‌بندی وظیفه
    category: {
      type: String,
      required: true,
      trim: true,
    },

    // حداقل معاش
    salaryMin: {
      type: Number,
      default: 0,
      min: 0,
    },

    // حداکثر معاش
    salaryMax: {
      type: Number,
      default: 0,
      min: 0,
    },

    // سطح تحصیلات
    education: {
      type: String,
      default: "",
      trim: true,
    },

    // تجربه کاری
    experience: {
      type: String,
      default: "",
      trim: true,
    },

    // مهارت‌های مورد نیاز
    skills: {
      type: [String],
      default: [],
    },

    // شرکت منتشرکننده آگهی
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    // آخرین مهلت درخواست
    deadline: {
      type: Date,
      default: null,
    },

    // تاریخ نشر آگهی
    date: {
      type: Date,
      default: Date.now,
    },

    // نمایش یا عدم نمایش آگهی
    visible: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// برای جستجوی سریع‌تر وظایف قابل نمایش
jobSchema.index({ visible: 1, deadline: 1 });

// برای نمایش وظایف یک شرکت
jobSchema.index({ companyId: 1, createdAt: -1 });

const Job = mongoose.model("Job", jobSchema);

export default Job;