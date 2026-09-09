import React, { useContext, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { assets } from "../assets/assets";
import moment from "moment";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const Applications = () => {
  const {
    userApplication,
    applicationsLoading,
    backendUrl,
    userToken,
    userData,
    fetchUserData,
    fetchUserApplication,
  } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleResumeSave = async () => {
    if (!resumeFile) {
      toast.error("لطفاً فایل CV را انتخاب کنید");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("resume", resumeFile);

      const { data } = await axios.post(
        `${backendUrl}/user/upload-resume`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            token: userToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        setResumeFile(null);
        fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Resume upload error:", error);

      toast.error(
        error?.response?.data?.message ||
          "آپلود CV انجام نشد"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserApplication();
  }, []);

  const getStatusClass = (status) => {
    switch (status) {
      case "تأیید شده":
        return "text-green-600";

      case "رد شده":
        return "text-red-600";

      case "مصاحبه":
        return "text-purple-600";

      default:
        return "text-blue-600";
    }
  };

  return (
    <>
      <Navbar />

      <section className="px-4 py-8 max-w-7xl mx-auto">
        {/* Resume */}
        <div className="mb-10">
          <h1 className="text-lg font-medium mb-3">
            CV شما
          </h1>

          {isEdit ? (
            <div className="flex items-center flex-wrap gap-3">
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="file"
                  hidden
                  accept="application/pdf"
                  onChange={(e) =>
                    setResumeFile(
                      e.target.files?.[0] || null
                    )
                  }
                />

                <span className="bg-blue-100 text-blue-500 rounded px-3 py-1.5 text-sm hover:bg-blue-200 transition-colors">
                  {resumeFile
                    ? resumeFile.name
                    : "انتخاب CV"}
                </span>

                <img
                  className="w-8"
                  src={assets.profile_upload_icon}
                  alt="Upload icon"
                />
              </label>

              <button
                disabled={!resumeFile || loading}
                onClick={handleResumeSave}
                className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm border border-gray-200 ${
                  !resumeFile || loading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-blue-100 text-blue-500 hover:bg-blue-200 cursor-pointer"
                }`}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4" />
                    در حال آپلود...
                  </>
                ) : (
                  "ذخیره"
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsEdit(false);
                  setResumeFile(null);
                }}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                لغو
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {userData?.resume ? (
                <a
                  href={userData.resume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-100 text-blue-500 rounded px-3 py-1.5 text-sm hover:bg-blue-200 transition-colors"
                >
                  مشاهده CV
                </a>
              ) : (
                <span className="bg-gray-100 text-gray-500 rounded px-3 py-1.5 text-sm">
                  هنوز CV آپلود نشده است
                </span>
              )}

              <button
                onClick={() => setIsEdit(true)}
                className="border border-gray-300 rounded px-3 py-1.5 text-sm hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {userData?.resume
                  ? "تغییر CV"
                  : "آپلود CV"}
              </button>
            </div>
          )}
        </div>

        {/* Applications */}
        {applicationsLoading ? (
          <div className="flex justify-center items-center mt-20">
            <Loader />
          </div>
        ) : !userApplication ||
          userApplication.length === 0 ? (
          <p className="text-center text-gray-500">
            هنوز برای هیچ شغل ای درخواست نداده‌اید
          </p>
        ) : (
          <>
            <h1 className="text-lg font-medium mb-3">
              درخواست‌ های کاری من
            </h1>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        کارفرما
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        عنوان شغل
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden sm:table-cell">
                        موقعیت
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 hidden md:table-cell">
                        تاریخ درخواست
                      </th>

                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                        وضعیت
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-200">
                    {userApplication.map((application) => (
                      <tr
                        key={application._id}
                        className="hover:bg-gray-50"
                      >
                        {/* Company */}
                        <td className="px-4 py-4">
                          <div className="flex items-center">
                            <img
                              src={
                                application?.companyId?.image ||
                                assets.default_profile
                              }
                              alt={
                                application?.companyId?.name ||
                                "Company"
                              }
                              className="h-8 w-8 rounded-full object-cover flex-shrink-0"
                              onError={(e) => {
                                e.target.src =
                                  assets.default_profile;
                              }}
                            />

                            <span className="ml-3 text-sm font-medium text-gray-900 truncate max-w-[150px]">
                              {application?.companyId?.name ||
                                "نامشخص"}
                            </span>
                          </div>
                        </td>

                        {/* Job */}
                        <td className="px-4 py-4 text-sm text-gray-900">
                          {application?.jobId?.title ||
                            "نامشخص"}
                        </td>

                        {/* Location */}
                        <td className="px-4 py-4 text-sm text-gray-500 hidden sm:table-cell">
                          {application?.jobId?.province &&
                          application?.jobId?.city
                            ? `${application.jobId.province}، ${application.jobId.city}`
                            : application?.jobId?.province ||
                              application?.jobId?.city ||
                              "نامشخص"}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-4 text-sm text-gray-500 hidden md:table-cell">
                          {application?.date
                            ? moment(application.date).format(
                                "ll"
                              )
                            : "-"}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-4">
                          <span
                            className={`px-2 inline-flex text-xs font-semibold ${getStatusClass(
                              application.status
                            )}`}
                          >
                            {application.status ||
                              "در انتظار بررسی"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </section>

      <Footer />
    </>
  );
};

export default Applications;