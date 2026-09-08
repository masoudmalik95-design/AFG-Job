import bcrypt from "bcrypt";


import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import JobApplication from "../models/JobApplication.js";
import Job from "../models/Job.js";

// ===============================
// Register User
// ===============================
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      province,
      city,
      education,
      skills,
      experience,
      languages,
      preferredJobType,
      expectedSalary,
      bio,
    } = req.body;

    const imageFile = req.file;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "نام خود را وارد کنید",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "ایمیل خود را وارد کنید",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "رمز عبور خود را وارد کنید",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "رمز عبور باید حداقل ۶ کاراکتر باشد",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "عکس خود را آپلود کنید",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "این ایمیل قبلاً ثبت شده است",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");
    

    const user = new User({
  name: name.trim(),
  email: normalizedEmail,
  password: hashedPassword,
  image: imageFile ? `/uploads/companies/${imageFile.filename}` : "",

      phone: phone?.trim() || "",
      province: province?.trim() || "",
      city: city?.trim() || "",
      education: education?.trim() || "",
      experience: experience?.trim() || "",
      bio: bio?.trim() || "",

      skills: Array.isArray(skills)
        ? skills
        : skills
        ? skills
            .split(",")
            .map((skill) => skill.trim())
            .filter(Boolean)
        : [],

      languages: Array.isArray(languages)
        ? languages
        : languages
        ? languages
            .split(",")
            .map((language) => language.trim())
            .filter(Boolean)
        : [],

      preferredJobType: preferredJobType || "تمام وقت",

      expectedSalary:
        expectedSalary !== undefined &&
        expectedSalary !== null &&
        expectedSalary !== ""
          ? Number(expectedSalary)
          : 0,
    });

    await user.save();

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    return res.status(201).json({
      success: true,
      message: "ثبت‌نام موفقانه انجام شد",
      userData,
      token,
    });
  } catch (error) {
    console.error("Register user error:", error);

    return res.status(500).json({
      success: false,
      message: "ثبت‌نام انجام نشد",
    });
  }
};

// ===============================
// Login User
// ===============================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "ایمیل الزامی است",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "رمز عبور الزامی است",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "کاربر پیدا نشد",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "رمز عبور نادرست است",
      });
    }

    const token = generateToken(user._id);

    const userData = user.toObject();
    delete userData.password;

    return res.status(200).json({
      success: true,
      message: "ورود موفقانه انجام شد",
      userData,
      token,
    });
  } catch (error) {
    console.error("Login user error:", error);

    return res.status(500).json({
      success: false,
      message: "ورود انجام نشد",
    });
  }
};

// ===============================
// Fetch User Data
// ===============================
export const fetchUserData = async (req, res) => {
  try {
    const userData = req.userData;

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "کاربر پیدا نشد",
      });
    }

    return res.status(200).json({
      success: true,
      message: "اطلاعات کاربر دریافت شد",
      userData,
    });
  } catch (error) {
    console.error("Fetch user data error:", error);

    return res.status(500).json({
      success: false,
      message: "دریافت اطلاعات کاربر انجام نشد",
    });
  }
};

// ===============================
// Apply For Job
// ===============================
export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const userId = req.userData?._id;

    if (!userId || !jobId) {
      return res.status(400).json({
        success: false,
        message: "شناسه کاربر و وظیفه الزامی است",
      });
    }

    const jobData = await Job.findById(jobId);

    if (!jobData) {
      return res.status(404).json({
        success: false,
        message: "وظیفه پیدا نشد",
      });
    }

    // بررسی قابل مشاهده بودن آگهی
    if (!jobData.visible) {
      return res.status(400).json({
        success: false,
        message: "این آگهی دیگر قابل مشاهده نیست",
      });
    }

    // بررسی تاریخ ختم آگهی
    if (jobData.deadline && new Date(jobData.deadline) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "مهلت درخواست برای این آگهی به پایان رسیده است",
      });
    }

    // جلوگیری از درخواست تکراری
    const isAlreadyApplied = await JobApplication.findOne({
      userId,
      jobId,
    });

    if (isAlreadyApplied) {
      return res.status(409).json({
        success: false,
        message: "شما قبلاً برای این وظیفه درخواست داده‌اید",
      });
    }

    const jobApplication = new JobApplication({
      jobId,
      userId,
      companyId: jobData.companyId,
      date: new Date(),
    });

    await jobApplication.save();

    return res.status(201).json({
      success: true,
      message: "درخواست کاری شما با موفقیت ثبت شد",
      jobApplication,
    });
  } catch (error) {
    console.error("Job application error:", error);

    // برای جلوگیری از خطای درخواست تکراری در صورت race condition
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "شما قبلاً برای این وظیفه درخواست داده‌اید",
      });
    }

    return res.status(500).json({
      success: false,
      message: "ثبت درخواست کاری انجام نشد",
    });
  }
};

// ===============================
// Get User Applications
// ===============================
export const getUserAppliedJobs = async (req, res) => {
  try {
    const userId = req.userData?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "لطفاً دوباره وارد حساب خود شوید",
      });
    }

    const applications = await JobApplication.find({
      userId,
    })
      .populate(
        "companyId",
        "name email image phone province city address description website verified"
      )
      .populate(
        "jobId",
        "title description province city locationType jobType level category salaryMin salaryMax education experience skills deadline date visible"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "درخواست‌های کاری دریافت شد",
      jobApplications: applications,
    });
  } catch (error) {
    console.error("Get user applications error:", error);

    return res.status(500).json({
      success: false,
      message: "دریافت درخواست‌های کاری انجام نشد",
    });
  }
};

// ===============================
// Upload Resume
// ===============================
export const uploadResume = async (req, res) => {
  try {
    const userId = req.userData?._id;
    const resumeFile = req.file;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "لطفاً دوباره وارد حساب خود شوید",
      });
    }

    if (!resumeFile) {
      return res.status(400).json({
        success: false,
        message: "فایل CV الزامی است",
      });
    }

    const userData = await User.findById(userId);

    if (!userData) {
      return res.status(404).json({
        success: false,
        message: "کاربر پیدا نشد",
      });
    }

    const uploadedResume = await cloudinary.uploader.upload(
      resumeFile.path,
      {
        resource_type: "raw",
      }
    );

    userData.resume = uploadedResume.secure_url;

    await userData.save();

    return res.status(200).json({
      success: true,
      message: "CV با موفقیت آپلود شد",
      resumeUrl: userData.resume,
    });
  } catch (error) {
    console.error("Upload resume error:", error);

    return res.status(500).json({
      success: false,
      message: "آپلود CV انجام نشد",
    });
  }
};
