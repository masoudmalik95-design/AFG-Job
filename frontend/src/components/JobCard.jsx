import React from "react";
import moment from "moment";
import { assets } from "../assets/assets";
import { MapPin, Clock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  // تبدیل عدد حقوق به شکل خوانا
  const formatSalary = (value) => {
    if (!value || Number(value) <= 0) {
      return "";
    }

    return new Intl.NumberFormat("fa-AF").format(Number(value));
  };

  // ساخت متن حقوق
  const getSalaryText = () => {
    const min = Number(job?.salaryMin || 0);
    const max = Number(job?.salaryMax || 0);

    if (min > 0 && max > 0) {
      return `${formatSalary(min)} - ${formatSalary(max)} افغانی`;
    }

    if (min > 0) {
      return `از ${formatSalary(min)} افغانی`;
    }

    if (max > 0) {
      return `تا ${formatSalary(max)} افغانی`;
    }

    return "توافقی";
  };

  return (
    <div
      onClick={() => {
        navigate(`/apply-job/${job._id}`);
        window.scrollTo(0, 0);
      }}
      className="
        flex gap-4

        rounded-lg

        border
        border-gray-200
        dark:border-[#3f4245]

        bg-white
        dark:bg-[#1f2937]

        p-5

        hover:shadow

        dark:hover:shadow-black/20

        hover:border-gray-300
        dark:hover:border-[#4a4d50]

        transition

        cursor-pointer
      "
    >
      {/* لوگوی شرکت */}
      <img
        className="w-[50px] h-[50px] object-contain shrink-0"
        src={job.companyId?.image || assets.company_icon}
        alt={`${job.companyId?.name || "Company"} Logo`}
      />

      <div className="flex-1 min-w-0">
        {/* عنوان شغل */}
        <h1 className="text-xl text-gray-700 dark:text-gray-100 font-semibold mb-1">
          {job.title}
        </h1>

        {/* اطلاعات شغل */}
        <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mt-3">
          {/* شرکت */}
          <div className="flex items-center gap-2">
            <img
              src={assets.suitcase_icon}
              alt="Company"
              className="w-5 h-5"
            />

            <span>{job.companyId?.name || "شرکت نامشخص"}</span>
          </div>

          {/* سطح شغلی */}
          <div className="flex items-center gap-2">
            <User
              size={20}
              className="text-gray-500 dark:text-gray-400"
            />

            <span>{job.level || "نامشخص"}</span>
          </div>

          {/* محل */}
          <div className="flex items-center gap-2">
            <MapPin
              size={19}
              className="text-gray-500 dark:text-gray-400"
            />

            <span>
              {job.province && job.city
                ? `${job.province}، ${job.city}`
                : job.city || job.province || "نامشخص"}
            </span>
          </div>

          {/* تاریخ */}
          <div className="flex items-center gap-2">
            <Clock
              size={19}
              className="text-gray-500 dark:text-gray-400"
            />

            <span>
              {job.date ? moment(job.date).fromNow() : "تازه"}
            </span>
          </div>

          {/* حقوق */}
          <div className="flex items-center gap-2">
            <img
              src={assets.money_icon}
              alt="Salary"
              className="w-5 h-5"
            />

            <span>{getSalaryText()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobCard;