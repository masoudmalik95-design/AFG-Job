
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const ViewApplications = () => {
  const [viewApplicationsPageData, setViewApplicationsPageData] =
    useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchViewApplicationsPageData = async () => {
    if (!companyToken) return;

    setIsLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/company/view-applications`,
        {},
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data?.success) {
        setViewApplicationsPageData(
          Array.isArray(data.viewApplicationData)
            ? data.viewApplicationData
            : []
        );
      } else {
        setViewApplicationsPageData([]);
        toast.error(data?.message || "دریافت درخواست‌ هاانجام نشد");
      }
    } catch (error) {
      console.error(
        "Fetch applications error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "دریافت درخواست‌ های کاری انجام نشد"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    if (!id || !status || updatingStatus) return;

    setUpdatingStatus(id);

    try {
      const { data } = await axios.post(
        `${backendUrl}/company/change-status`,
        {
          id,
          status,
        },
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data?.success) {
        toast.success(data?.message || "وضعیت درخواست تغییر کرد");

        // فقط همان درخواست را در صفحه به‌روزرسانی می‌کنیم
        setViewApplicationsPageData((previousApplications) =>
          previousApplications.map((application) =>
            application._id === id
              ? {
                  ...application,
                  status,
                }
              : application
          )
        );
      } else {
        toast.error(data?.message || "تغییر وضعیت انجام نشد");
      }
    } catch (error) {
      console.error(
        "Update status error:",
        error?.response?.data || error
      );

      toast.error(
        error?.response?.data?.message ||
          "تغییر وضعیت درخواست انجام نشد"
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  useEffect(() => {
    document.title = "Superio - Job Portal | درخواست‌های کاری";
  }, []);

  useEffect(() => {
    fetchViewApplicationsPageData();
  }, [companyToken]);

  return (
    <section>
      {isLoading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader />
        </div>
      ) : viewApplicationsPageData.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          هیچ درخواست کاری پیدا نشد.
        </div>
      ) : (
        <div className="shadow-sm rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    #
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                    کاربر
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[180px]">
                    عنوان وظیفه
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    موقعیت
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    تاریخ
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    CV
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[220px]">
                    وضعیت
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {viewApplicationsPageData.map((job, index) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    {/* Number */}
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {index + 1}
                    </td>

                    {/* User */}
                    <td className="px-4 py-4">
                      <div className="flex items-center">
                        <img
                          src={
                            job?.userId?.image ||
                            assets.default_profile
                          }
                          alt={job?.userId?.name || "Applicant"}
                          className="h-9 w-9 rounded-full object-cover flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src =
                              assets.default_profile;
                          }}
                        />

                        <div className="ml-3 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {job?.userId?.name || "نامعلوم"}
                          </p>

                          <p className="text-xs text-gray-500 truncate">
                            {job?.userId?.email || ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Job Title */}
                    <td className="px-4 py-4 text-sm text-gray-900">
                      <div className="max-w-[220px] truncate">
                        {job?.jobId?.title || "بدون عنوان"}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {job?.jobId?.province &&
                      job?.jobId?.city ? (
                        <>
                          {job.jobId.province}، {job.jobId.city}
                        </>
                      ) : (
                        job?.jobId?.city ||
                        job?.jobId?.province ||
                        "نامعلوم"
                      )}
                    </td>

                    {/* Date */}
                    <td className="px-4 py-4 text-sm text-gray-500 hidden lg:table-cell">
                      {job?.date
                        ? moment(job.date).format("ll")
                        : "نامعلوم"}
                    </td>

                    {/* Resume */}
                    <td className="px-4 py-4 text-center">
                      {job?.userId?.resume ? (
                        <a
                          href={job.userId.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center text-xs bg-blue-100 text-blue-600 px-3 py-1.5 rounded hover:bg-blue-200 transition-colors"
                          aria-label="مشاهده CV"
                        >
                          مشاهده
                          <img
                            src={assets.resume_download_icon}
                            alt=""
                            className="ml-1.5 h-3 w-3"
                          />
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">
                          CV موجود نیست
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-4 py-4 text-center">
                      {updatingStatus === job._id ? (
                        <div className="flex justify-center">
                          <LoaderCircle className="animate-spin h-5 w-5 text-gray-500" />
                        </div>
                      ) : job.status === "در انتظار بررسی" ? (
                        <div className="flex justify-center items-center gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(
                                job._id,
                                "تأیید شده"
                              )
                            }
                            className="text-xs bg-green-100 text-green-800 px-3 py-1.5 rounded hover:bg-green-200 transition cursor-pointer"
                          >
                            تأیید
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(
                                job._id,
                                "رد شده"
                              )
                            }
                            className="text-xs bg-red-100 text-red-800 px-3 py-1.5 rounded hover:bg-red-200 transition cursor-pointer"
                          >
                            رد
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleStatusUpdate(
                                job._id,
                                "مصاحبه"
                              )
                            }
                            className="text-xs bg-blue-100 text-blue-800 px-3 py-1.5 rounded hover:bg-blue-200 transition cursor-pointer"
                          >
                            مصاحبه
                          </button>
                        </div>
                      ) : (
                        <span
                          className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${
                            job.status === "تأیید شده"
                              ? "bg-green-100 text-green-800"
                              : job.status === "رد شده"
                              ? "bg-red-100 text-red-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {job.status || "در انتظار بررسی"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};

export default ViewApplications;

