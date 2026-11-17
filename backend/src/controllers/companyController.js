
import bcrypt from "bcrypt";

import generateToken from "../utils/generateToken.js";
import {
  uploadToGridFS,
  deleteFromGridFS,
} from "../utils/gridfsStorage.js";

import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

// ===============================
// Register Company
// ===============================
export const registerCompany = async (req, res) => {
  let uploadedImageId = null;

  try {
    console.log("🟢 registerCompany request received");

    const {
      name,
      email,
      password,
      phone,
      province,
      city,
      address,
      description,
      website,
    } = req.body;

    const imageFile = req.file;

    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "نام شرکت را وارد کنید",
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "ایمیل شرکت را وارد کنید",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "رمز عبور شرکت را وارد کنید",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "لوگوی شرکت را آپلود کنید",
      });
    }

    const normalizedPhone = String(phone || "").trim();

    if (!/^[0-9]{10,}$/.test(normalizedPhone)) {
      return res.status(400).json({
        success: false,
        message: "شماره تلفن باید حداقل ۱۰ رقم باشد",
      });
    }

    const existingCompany = await Company.findOne({
      email: email.trim().toLowerCase(),
    });

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "این ایمیل قبلاً ثبت شده است",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    uploadedImageId = await uploadToGridFS(
      imageFile.buffer,
      imageFile.originalname,
      imageFile.mimetype,
      "company-image"
    );

    console.log("✅ Company image uploaded:", uploadedImageId);

    const company = new Company({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      image: uploadedImageId,
      phone: normalizedPhone,
      province: province || "",
      city: city || "",
      address: address || "",
      description: description || "",
      website: website || "",
    });

    await company.save();

    console.log("💾 Company saved:", company._id);

    const token = await generateToken(company._id);

    return res.status(201).json({
      success: true,
      message: "ثبت شرکت موفقانه انجام شد",
      companyData: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
        phone: company.phone,
        province: company.province,
        city: company.city,
        address: company.address,
        description: company.description,
        website: company.website,
        verified: company.verified,
      },
      token,
    });
  } catch (error) {
    console.error("Register company error:", error);

    if (uploadedImageId) {
      try {
        await deleteFromGridFS(
          uploadedImageId,
          "company-image"
        );
      } catch (deleteError) {
        console.error("GridFS cleanup error:", deleteError);
      }
    }

    return res.status(500).json({
      success: false,
      message: "ثبت شرکت انجام نشد",
    });
  }
};

// ===============================
// Update Company Image
// ===============================
export const updateCompanyImage = async (req, res) => {
  let newImageId = null;
  let databaseUpdated = false;

  try {
    const imageFile = req.file;

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "لطفاً عکس جدید شرکت را انتخاب کنید",
      });
    }

    const company = await Company.findById(
      req.companyData._id
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "شرکت پیدا نشد",
      });
    }

    // شناسه عکس قبلی
    const oldImageId = company.image;

    // ذخیره عکس جدید در GridFS
    newImageId = await uploadToGridFS(
      imageFile.buffer,
      imageFile.originalname,
      imageFile.mimetype,
      "company-image"
    );

    // جایگزینی عکس جدید در دیتابیس
    company.image = newImageId;
    await company.save();

    databaseUpdated = true;

    console.log("✅ Company image updated:", newImageId);

    // حذف عکس قبلی فقط بعد از ذخیره موفق عکس جدید
    if (oldImageId && oldImageId !== newImageId) {
      try {
        await deleteFromGridFS(
          oldImageId,
          "company-image"
        );

        console.log("🗑️ Old company image deleted");
      } catch (deleteError) {
        console.error(
          "Old company image deletion error:",
          deleteError
        );
      }
    }

    return res.status(200).json({
      success: true,
      message: "عکس شرکت با موفقیت تغییر کرد",
      companyData: {
        _id: company._id,
        name: company.name,
        email: company.email,
        image: company.image,
      },
    });
  } catch (error) {
    console.error("Update company image error:", error);

    // اگر دیتابیس هنوز به عکس جدید تغییر نکرده،
    // فایل جدید حذف شود و عکس قبلی حفظ گردد.
    if (newImageId && !databaseUpdated) {
      try {
        await deleteFromGridFS(
          newImageId,
          "company-image"
        );
      } catch (deleteError) {
        console.error(
          "New image cleanup error:",
          deleteError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message: "تغییر عکس شرکت با مشکل مواجه شد",
    });
  }
};

// ===============================
// Login Company
// ===============================
export const loginCompany = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
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

    const company = await Company.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!company) {
      return res.status(404).json({
        success: false,
        message:
          "حساب کارفرما پیدا نشد. لطفاً ابتدا ثبت شرکت کنید",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      company.password
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "رمز عبور نادرست است",
      });
    }

    const token = generateToken(company._id);

    const companyData = company.toObject();
    delete companyData.password;

    return res.status(200).json({
      success: true,
      message: "ورود موفقانه انجام شد",
      companyData,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "ورود انجام نشد",
    });
  }
};

// ===============================
// Fetch Company Data
// ===============================
export const fetchCompanyData = async (req, res) => {
  try {
    const company = req.companyData;

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "اطلاعات شرکت پیدا نشد",
      });
    }

    return res.status(200).json({
      success: true,
      message: "اطلاعات شرکت دریافت شد",
      companyData: company,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "دریافت اطلاعات شرکت انجام نشد",
    });
  }
};

// ===============================
// Post Job
// ===============================
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      province,
      city,
      locationType,
      jobType,
      level,
      category,
      salaryMin,
      salaryMax,
      education,
      experience,
      skills,
      deadline,
    } = req.body;

    if (
      !title ||
      !description ||
      !province ||
      !city ||
      !jobType ||
      !level ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "تمام معلومات ضروری را وارد کنید",
      });
    }

    if (
      salaryMin !== undefined &&
      salaryMax !== undefined &&
      Number(salaryMax) < Number(salaryMin)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "حداکثر معاش نمی‌تواند کمتر از حداقل معاش باشد",
      });
    }

    const companyId = req.companyData._id;

    const job = new Job({
      title,
      description,
      province,
      city,
      locationType: locationType || "حضوری",
      jobType,
      level,
      category,
      salaryMin: salaryMin ? Number(salaryMin) : 0,
      salaryMax: salaryMax ? Number(salaryMax) : 0,
      education: education || "",
      experience: experience || "",
      skills: Array.isArray(skills)
        ? skills
        : skills
          ? skills.split(",").map((skill) => skill.trim())
          : [],
      companyId,
      deadline: deadline || null,
      date: new Date(),
    });

    await job.save();

    return res.status(201).json({
      success: true,
      message: "آگهی شغل با موفقیت نشر شد",
      job,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "نشر آگهی شغل انجام نشد",
    });
  }
};

// ===============================
// Get Company Posted Jobs
// ===============================
export const getCompanyPostedAllJobs = async (req, res) => {
  try {
    const companyId = req.companyData._id;

    const jobs = await Job.find({ companyId }).sort({
      createdAt: -1,
    });

    const jobsData = await Promise.all(
      jobs.map(async (job) => {
        const applicants = await JobApplication.countDocuments({
          jobId: job._id,
        });

        return {
          ...job.toObject(),
          applicants,
        };
      })
    );

    return res.status(200).json({
      success: true,
      message: "آگهی‌های شغلی دریافت شد",
      jobData: jobsData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "دریافت آگهی‌های شغلی انجام نشد",
    });
  }
};

// ===============================
// Change Job Visibility
// ===============================
export const changeJobVisibility = async (req, res) => {
  try {
    const { id } = req.body;
    const companyId = req.companyData._id;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "شناسه شغل الزامی است",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "شغل پیدا نشد",
      });
    }

    if (job.companyId.toString() !== companyId.toString()) {
      return res.status(403).json({
        success: false,
        message: "شما اجازه تغییر این آگهی را ندارید",
      });
    }

    job.visible = !job.visible;
    await job.save();

    return res.status(200).json({
      success: true,
      message: "وضعیت آگهی تغییر کرد",
      visible: job.visible,
    });
  } catch (error) {
    console.error("Error changing job visibility:", error);

    return res.status(500).json({
      success: false,
      message: "تغییر وضعیت آگهی انجام نشد",
    });
  }
};

// ===============================
// Get Company Job Applicants
// ===============================
export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.companyData._id;

    const applicants = await JobApplication.find({
      companyId,
    })
      .populate(
        "userId",
        "name email phone image resume province city education skills experience languages"
      )
      .populate(
        "jobId",
        "title province city locationType jobType level category salaryMin salaryMax"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "درخواست‌های کاری دریافت شد",
      viewApplicationData: applicants,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "دریافت درخواست‌های کاری انجام نشد",
    });
  }
};

// ===============================
// Change Application Status
// ===============================
export const changeStatus = async (req, res) => {
  try {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({
        success: false,
        message: "شناسه درخواست و وضعیت الزامی است",
      });
    }

    const allowedStatuses = [
      "در انتظار بررسی",
      "تأیید شده",
      "رد شده",
      "مصاحبه",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "وضعیت انتخاب‌شده معتبر نیست",
      });
    }

    const application = await JobApplication.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "درخواست کاری پیدا نشد",
      });
    }

    if (
      application.companyId.toString() !==
      req.companyData._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "شما اجازه تغییر این درخواست را ندارید",
      });
    }

    application.status = status;
    await application.save();

    return res.status(200).json({
      success: true,
      message: "وضعیت درخواست تغییر کرد",
      application,
    });
  } catch (error) {
    console.error("Change application status error:", error);

    return res.status(500).json({
      success: false,
      message: "تغییر وضعیت درخواست انجام نشد",
    });
  }
};
