import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    // نام شرکت
    name: {
      type: String,
      required: true,
      trim: true,
    },

    // ایمیل شرکت
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    // رمز عبور
    password: {
      type: String,
      required: true,
    },

    // لوگوی شرکت
    image: {
      type: String,
      required: true,
    },

    // شماره تماس
    phone: {
      type: String,
      default: "",
      trim: true,
    },

    // ولایت
    province: {
      type: String,
      default: "",
      trim: true,
    },

    // شهر / ولسوالی
    city: {
      type: String,
      default: "",
      trim: true,
    },

    // آدرس شرکت
    address: {
      type: String,
      default: "",
      trim: true,
    },

    // معرفی شرکت
    description: {
      type: String,
      default: "",
      trim: true,
    },

    // وب‌سایت شرکت
    website: {
      type: String,
      default: "",
      trim: true,
    },

    // وضعیت تأیید شرکت
    verified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;