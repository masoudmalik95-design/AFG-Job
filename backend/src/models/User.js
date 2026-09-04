
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    province: {
      type: String,
      default: "",
      trim: true,
    },

    city: {
      type: String,
      default: "",
      trim: true,
    },

    education: {
      type: String,
      default: "",
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    experience: {
      type: String,
      default: "",
      trim: true,
    },

    languages: {
      type: [String],
      default: [],
    },

    preferredJobType: {
      type: String,
      enum: [
        "تمام وقت",
        "نیمه وقت",
        "قراردادی",
        "فریلنسری",
        "کارآموزی",
      ],
      default: "تمام وقت",
    },

    expectedSalary: {
      type: Number,
      default: 0,
      min: 0,
    },

    bio: {
      type: String,
      default: "",
      trim: true,
    },

    resume: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

export default User;

