
import bcrypt from "bcrypt";

import generateToken from "../utils/generateToken.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

export const registerCompany = async (req, res) => {
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
    console.log("📦 Body:", req.body);
    console.log("🖼️ File:", req.file);

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "نام کارفرما را وارد کنید",
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "ایمیل کارفرما را وارد کنید",
      });
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "رمز عبور را وارد کنید",
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "عکس کارفرما را آپلود کنید",
      });
    }

    const existingCompany = await Company.findOne({ email });
    console.log("🔍 Existing company:", existingCompany ? "YES" : "NO");

    if (existingCompany) {
      return res.status(409).json({
        success: false,
        message: "این کارفرما قبلاً ثبت شده است",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("🔐 Password hashed");

    // ساخت آدرس تصویر بدون استفاده از Cloudinary
    const imageUrl = `/uploads/companies/${imageFile.filename}`;
    console.log("🖼️ Image URL:", imageUrl);

    const company = new Company({
      name,
      email,
      password: hashedPassword,
      image: imageUrl,

      phone: phone || "",
      province: province || "",
      city: city || "",
      address: address || "",
      description: description || "",
      website: website || "",
    });

    await company.save();
    console.log("💾 Company saved:", company._id);

    const token = await generateToken(company._id);
    console.log("🎫 Token generated");

    return res.status(201).json({
      success: true,
      message: "ثبت کارفرما موفقانه انجام شد",
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
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "ثبت کارفرماانجام نشد",
    });
  }
};

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

    const company = await Company.findOne({ email });

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "کارفرما پیدا نشد",
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

export const fetchCompanyData = async (req, res) => {
  try {
    const company = req.companyData;

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "کارفرما پیدا نشد",
      });
    }

    return res.status(200).json({
      success: true,
      message: "اطلاعات کارفرما دریافت شد",
      companyData: company,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      success: false,
      message: "دریافت اطلاعات کارفرما انجام نشد",
    });
  }
};

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
        message: "حداکثر معاش نمی‌تواند کمتر از حداقل معاش باشد",
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
      message: "آگهی‌های وظایف دریافت شد",
      jobData: jobsData,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "دریافت آگهی‌های وظایف انجام نشد",
    });
  }
};

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

export const getCompanyJobApplicants = async (req, res) => {
  try {
    const companyId = req.companyData._id;

    const applicants = await JobApplication.find({ companyId })
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

