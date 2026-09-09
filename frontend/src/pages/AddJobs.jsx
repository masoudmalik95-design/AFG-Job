
import React, { useContext, useEffect, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import toast from "react-hot-toast";
import { LoaderCircle } from "lucide-react";

const convertPersianDigitsToEnglish = (value) =>
  value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );

const AddJob = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [province, setProvince] = useState("کابل");
  const [city, setCity] = useState("");

  const [locationType, setLocationType] = useState("حضوری");
  const [jobType, setJobType] = useState("تمام وقت");
  const [level, setLevel] = useState("متوسط");
  const [category, setCategory] = useState("برنامه‌نویسی");

  const [salaryMin, setSalaryMin] = useState("");
  const [salaryMax, setSalaryMax] = useState("");

  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [deadline, setDeadline] = useState("");

  const [loading, setLoading] = useState(false);

  const { backendUrl, companyToken } = useContext(AppContext);

  useEffect(() => {
    document.title = "Superio - Job Portal | افزودن شغل";
  }, []);

  const postJob = async (e) => {
    e.preventDefault();

    if (!description || description === "<p><br></p>") {
      toast.error("توضیحات شغل را وارد کنید");
      return;
    }

    if (!province) {
      toast.error("ولایت را انتخاب کنید");
      return;
    }

    if (!city.trim()) {
      toast.error("شهر را وارد کنید");
      return;
    }

    if (!salaryMin || !salaryMax) {
      toast.error("حداقل و حداکثر معاش را وارد کنید");
      return;
    }

    if (Number(salaryMax) < Number(salaryMin)) {
      toast.error("حداکثر معاش نمی‌تواند کمتر از حداقل معاش باشد");
      return;
    }

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/company/post-job`,
        {
          title: title.trim(),
          description,

          province,
          city: city.trim(),

          locationType,
          jobType,
          level,
          category,

          salaryMin: Number(salaryMin),
          salaryMax: Number(salaryMax),

          education: education.trim(),
          experience: experience.trim(),

          skills: skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill.length > 0),

          deadline: deadline || null,
        },
        {
          headers: {
            token: companyToken,
          },
        }
      );

      if (data.success) {
        toast.success(data.message);

        setTitle("");
        setDescription("");

        setProvince("کابل");
        setCity("");

        setLocationType("حضوری");
        setJobType("تمام وقت");
        setLevel("متوسط");
        setCategory("برنامه‌نویسی");

        setSalaryMin("");
        setSalaryMax("");

        setEducation("");
        setExperience("");
        setSkills("");
        setDeadline("");

        const editor = document.querySelector(".ql-editor");

        if (editor) {
          editor.innerHTML = "";
        }
      } else {
        toast.error(data.message || "نشر آگهی انجام نشد");
      }
    } catch (error) {
      console.error("Post job error:", error);

      toast.error(
        error?.response?.data?.message ||
          "نشر آگهی شغل انجام نشد"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const editorElement = document.getElementById(
      "job-description-editor"
    );

    if (!editorElement) return;

    const quill = new Quill(editorElement, {
      theme: "snow",
      placeholder: "...توضیحات شغل را اینجا بنویسید ",
    });

    quill.on("text-change", () => {
      setDescription(quill.root.innerHTML);
    });

    return () => {
      const toolbar =
        editorElement.parentElement?.querySelector(
          ".ql-toolbar"
        );

      if (toolbar) {
        toolbar.remove();
      }

      editorElement.innerHTML = "";
    };
  }, []);

  const provinces = [
    "کابل",
    "پروان",
    "پنجشیر",
    "کاپیسا",
    "غزنی",
    "وردک",
    "لوگر",
    "بامیان",
    "دایکندی",
    "میدان وردک",
    "ننگرهار",
    "لغمان",
    "کنر",
    "نورستان",
    "خوست",
    "پکتیا",
    "پکتیکا",
    "کندهار",
    "هلمند",
    "زابل",
    "ارزگان",
    "فراه",
    "نیمروز",
    "بادغیس",
    "هرات",
    "غور",
    "فاریاب",
    "جوزجان",
    "سرپل",
    "بلخ",
    "سمنگان",
    "بغلان",
    "کندز",
    "تخار",
    "بدخشان",
  ];

  return (
    <section className="mr-1 mb-8">
      <form onSubmit={postJob}>
        {/* Job Title */}
        <div className="mb-6">
          <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
            عنوان شغل
          </label>

          <input
            type="text"
            placeholder="مثلاً: توسعه‌دهنده وب"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Job Description */}
        <div className="mb-8">
          <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
            توضیحات شغل
          </label>

          <div
            id="job-description-editor"
            style={{
              minHeight: "180px",
            }}
          />
        </div>

        {/* Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              ولایت
            </label>

            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              {provinces.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              شهر
            </label>

            <input
              type="text"
              placeholder="مثلاً: چاریکار"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Location Type + Job Type */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              نوع محل کار
            </label>

            <select
              value={locationType}
              onChange={(e) => setLocationType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="حضوری">حضوری</option>
              <option value="دورکاری">دورکاری</option>
              <option value="هیبریدی">هیبریدی</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              نوع شغل
            </label>

            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="تمام وقت">تمام وقت</option>
              <option value="نیمه وقت">نیمه وقت</option>
              <option value="قراردادی">قراردادی</option>
              <option value="فریلنسری">فریلنسری</option>
              <option value="کارآموزی">کارآموزی</option>
            </select>
          </div>
        </div>

        {/* Level + Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              سطح شغل
            </label>

            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="مبتدی">مبتدی</option>
              <option value="متوسط">متوسط</option>
              <option value="ارشد">ارشد</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              کتگوری
            </label>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="برنامه‌نویسی">برنامه‌نویسی</option>
              <option value="دیتا ساینس">دیتا ساینس</option>
              <option value="طراحی">طراحی</option>
              <option value="شبکه">شبکه</option>
              <option value="امنیت سایبری">امنیت سایبری</option>
              <option value="مدیریت">مدیریت</option>
              <option value="بازاریابی">بازاریابی</option>
              <option value="حسابداری">حسابداری</option>
              <option value="منابع بشری">منابع بشری</option>
              <option value="سایر">سایر</option>
            </select>
          </div>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Minimum Salary */}
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              حداقل معاش (افغانی)
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="مثلاً: 15000"
              value={salaryMin}
              onChange={(e) =>
                setSalaryMin(
                  convertPersianDigitsToEnglish(
                    e.target.value
                  ).replace(/[^0-9]/g, "")
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Maximum Salary */}
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              حداکثر معاش (افغانی)
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="مثلاً: 30000"
              value={salaryMax}
              onChange={(e) =>
                setSalaryMax(
                  convertPersianDigitsToEnglish(
                    e.target.value
                  ).replace(/[^0-9]/g, "")
                )
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Education + Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              تحصیلات
            </label>

            <input
              type="text"
              placeholder="مثلاً: لیسانس کمپیوتر ساینس"
              value={education}
              onChange={(e) => setEducation(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
              تجربه کاری
            </label>

            <input
              type="text"
              placeholder="مثلاً: ۲ سال تجربه"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
            مهارت‌ها
          </label>

          <input
            type="text"
            placeholder=" React ,JavaScript ,CSS ,HTML :مثلا"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <p className="text-xs text-gray-500 mt-2">
            مهارت‌ ها را با کامه جدا کنید
          </p>
        </div>

        {/* Deadline */}
        <div className="mb-8">
          <label className="block text-gray-800 text-lg font-semibold mb-3 pb-1 border-b border-gray-200">
            آخرین مهلت درخواست
          </label>

          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-8 font-semibold rounded-lg flex items-center justify-center gap-2 ${
            loading
              ? "cursor-not-allowed opacity-50"
              : "cursor-pointer"
          }`}
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin h-5 w-5" />
              ...در حال نشر
            </>
          ) : (
            "نشر آگهی شغل"
          )}
        </button>
      </form>
    </section>
  );
};

export default AddJob;

