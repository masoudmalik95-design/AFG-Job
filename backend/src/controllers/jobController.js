import Job from "../models/Job.js";

const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      visible: true,
      $or: [
        { deadline: null },
        { deadline: { $gte: new Date() } },
      ],
    })
      .populate(
        "companyId",
        "name image phone province city address description website verified"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "آگهی‌های وظایف با موفقیت دریافت شد",
      jobData: jobs,
    });
  } catch (error) {
    console.error("Get all jobs error:", error);

    return res.status(500).json({
      success: false,
      message: "دریافت آگهی‌های وظایف انجام نشد",
    });
  }
};

export default getAllJobs;