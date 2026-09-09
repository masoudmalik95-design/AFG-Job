import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";
import { toast } from "react-hot-toast";

const ManageJobs = () => {
  const [manageJobData, setManageJobData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changingVisibility, setChangingVisibility] = useState(null);

  const { backendUrl, companyToken } = useContext(AppContext);

  const fetchManageJobsData = async () => {
    if (!companyToken) return;

    setLoading(true);

    try {
      const { data } = await axios.get(
        `${backendUrl}/company/posted-jobs`,
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data.success) {
        setManageJobData(
          Array.isArray(data.jobData) ? data.jobData : []
        );
      } else {
        toast.error(data.message || "دریافت آگهی‌ها انجام نشد");
      }
    } catch (error) {
      console.error("Fetch manage jobs error:", error);

      toast.error(
        error?.response?.data?.message ||
          "دریافت آگهی‌های وظایف انجام نشد"
      );
    } finally {
      setLoading(false);
    }
  };

  const changeJobVisibility = async (id) => {
    if (!id || !companyToken) return;

    setChangingVisibility(id);

    try {
      const { data } = await axios.post(
        `${backendUrl}/company/change-visiblity`,
        { id },
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message || "وضعیت آگهی تغییر کرد");

        setManageJobData((prevJobs) =>
          prevJobs.map((job) =>
            job._id === id
              ? {
                  ...job,
                  visible: data.visible,
                }
              : job
          )
        );
      } else {
        toast.error(data.message || "تغییر وضعیت آگهی انجام نشد");
      }
    } catch (error) {
      console.error("Change job visibility error:", error);

      toast.error(
        error?.response?.data?.message ||
          "تغییر وضعیت آگهی انجام نشد"
      );
    } finally {
      setChangingVisibility(null);
    }
  };

  useEffect(() => {
    document.title = "Superio - Job Portal | Manage Jobs";
  }, []);

  useEffect(() => {
    fetchManageJobsData();
  }, [companyToken]);

  return (
    <section>
      {loading ? (
        <div className="flex items-center justify-center h-[70vh]">
          <Loader />
        </div>
      ) : manageJobData.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          هیچ آگهی شغل‌ای پیدا نشد.
        </div>
      ) : (
        <div className="overflow-x-auto shadow rounded-lg border border-gray-200">
          <table className="w-full bg-white">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  #
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  عنوان شغل
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  موقعیت
                </th>

                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  تاریخ
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  درخواست‌ها
                </th>

                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  نمایش
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {[...manageJobData]
                .sort(
                  (a, b) =>
                    new Date(b.createdAt || b.date) -
                    new Date(a.createdAt || a.date)
                )
                .map((job, index) => (
                  <tr
                    key={job._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 text-sm font-medium text-gray-700">
                      {job.title || "بدون عنوان"}
                    </td>

                    <td className="px-4 py-3 text-sm text-gray-500">
                      {job.province && job.city
                        ? `${job.province}، ${job.city}`
                        : job.city || job.province || "نامشخص"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {job.date
                        ? moment(job.date).format("ll")
                        : job.createdAt
                        ? moment(job.createdAt).format("ll")
                        : "نامشخص"}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <span className="inline-flex items-center justify-center min-w-8 h-8 px-2 rounded-full bg-blue-50 text-blue-600 font-medium">
                        {job.applicants || 0}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center gap-2">
                        <input
                          type="checkbox"
                          checked={Boolean(job.visible)}
                          disabled={changingVisibility === job._id}
                          onChange={() =>
                            changeJobVisibility(job._id)
                          }
                          className="h-4 w-4 cursor-pointer accent-blue-600 disabled:cursor-not-allowed"
                        />

                        <span
                          className={`text-xs ${
                            job.visible
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                        >
                          {job.visible ? "نمایش" : "پنهان"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ManageJobs;