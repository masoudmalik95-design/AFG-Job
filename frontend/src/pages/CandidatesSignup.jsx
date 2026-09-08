import axios from "axios";
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  LoaderCircle,
  Lock,
  Mail,
  Upload,
  UserRound,
  Phone,
  MapPin,
  GraduationCap,
  Briefcase,
  Languages,
} from "lucide-react";

import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";


// ===============================
// Convert Persian/Arabic digits
// to English digits
// ===============================
const convertPersianDigitsToEnglish = (value) =>
  value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );


// ===============================
// Candidates Signup
// ===============================
const CandidatesSignup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [education, setEducation] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [languages, setLanguages] = useState("");
  const [preferredJobType, setPreferredJobType] =
    useState("تمام وقت");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [bio, setBio] = useState("");

  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // جلوگیری از ارسال چندباره فرم
  const submittingRef = useRef(false);

  const navigate = useNavigate();

  const {
    backendUrl,
    setUserData,
    setUserToken,
    setIsLogin,
  } = useContext(AppContext);


  // ===============================
  // Image Preview
  // ===============================
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(image);

    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [image]);


  // ===============================
  // Register User
  // ===============================
  const userSignupHandler = async (e) => {
    e.preventDefault();

    // اگر یک درخواست قبلی هنوز در حال ارسال است
    // درخواست جدید ارسال نشود
    if (submittingRef.current) {
      return;
    }

    // بررسی عکس
    if (!image) {
      toast.error("لطفاً عکس خود را آپلود کنید");
      return;
    }

    // قفل کردن ارسال فرم
    submittingRef.current = true;
    setLoading(true);

    try {
      const formData = new FormData();

      // اطلاعات کاربر
      formData.append("name", name.trim());

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      formData.append("email", normalizedEmail);

      formData.append("password", password);

      formData.append("phone", phone.trim());

      formData.append(
        "province",
        province.trim()
      );

      formData.append(
        "city",
        city.trim()
      );

      formData.append(
        "education",
        education.trim()
      );

      formData.append(
        "experience",
        experience.trim()
      );

      formData.append(
        "skills",
        skills.trim()
      );

      formData.append(
        "languages",
        languages.trim()
      );

      formData.append(
        "preferredJobType",
        preferredJobType
      );

      formData.append(
        "expectedSalary",
        expectedSalary
      );

      formData.append(
        "bio",
        bio.trim()
      );

      // عکس
      formData.append("image", image);


      console.log("📤 Sending signup request...");
      console.log("📧 Email:", normalizedEmail);


      // ===============================
      // Send Request
      // ===============================
      const { data } = await axios.post(
        `${backendUrl}/user/register-user`,
        formData
      );


      console.log("📥 Signup response:", data);


      // ===============================
      // Successful Registration
      // ===============================
      if (data.success) {
        setUserToken(data.token);

        setUserData(data.userData);

        setIsLogin(true);

        localStorage.setItem(
          "userToken",
          data.token
        );

        toast.success(
          data.message ||
            "ثبت‌نام موفقانه انجام شد"
        );

        navigate("/");
      } else {
        toast.error(
          data.message ||
            "ثبت‌نام انجام نشد"
        );
      }

    } catch (error) {
      console.error(
        "❌ Signup error:",
        error
      );

      // ===============================
      // Backend Error
      // ===============================
      if (error?.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Backend response:",
          error.response.data
        );
      }


      // پیام Backend
      const errorMessage =
        error?.response?.data?.message ||
        "ثبت‌نام انجام نشد";


      toast.error(errorMessage);

    } finally {
      // آزاد کردن قفل
      submittingRef.current = false;

      setLoading(false);
    }
  };


  return (
    <>
      <Navbar />

      <div>
        <main className="flex-grow flex items-center justify-center py-10 px-4">

          <div className="w-full max-w-2xl border border-gray-200 rounded-lg p-6 bg-white">

            {/* ===============================
                Header
            =============================== */}
            <div className="text-center mb-6">

              <h1 className="text-2xl font-semibold text-gray-700 mb-1.5">
                ثبت‌ نام جویای کار
              </h1>

              <p className="text-sm text-gray-600">
                .معلومات خود را وارد کنید
              </p>

            </div>


            {/* ===============================
                Form
            =============================== */}
            <form
              className="space-y-4"
              onSubmit={userSignupHandler}
            >

              {/* ===============================
                  Profile Image
              =============================== */}
              <div className="flex flex-col items-center mb-4">

                <label className="relative cursor-pointer flex items-center justify-between flex-col">

                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">

                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Upload className="h-5 w-5 text-gray-400" />
                    )}

                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) =>
                        setImage(
                          e.target.files?.[0] ||
                            null
                        )
                      }
                    />

                  </div>

                  <span className="block text-xs mt-2 text-gray-500">
                    {image
                      ? "تغییر عکس"
                      : "آپلود عکس"}
                  </span>

                </label>

              </div>


              {/* ===============================
                  Name
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <UserRound className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="نام کامل"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />

              </div>


              {/* ===============================
                  Email
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <Mail className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="email"
                  placeholder="ایمیل"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      convertPersianDigitsToEnglish(
                        e.target.value
                      )
                    )
                  }
                  required
                />

              </div>


              {/* ===============================
                  Password
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <Lock className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="password"
                  placeholder="رمز عبور"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={password}
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  required
                />

              </div>


              {/* ===============================
                  Phone
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <Phone className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="tel"
                  placeholder="شماره تماس"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ===============================
                  Province
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <MapPin className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="ولایت"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={province}
                  onChange={(e) =>
                    setProvince(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ===============================
                  City
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <MapPin className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="شهر / ولسوالی"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={city}
                  onChange={(e) =>
                    setCity(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ===============================
                  Education
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <GraduationCap className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="سطح تحصیلات"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={education}
                  onChange={(e) =>
                    setEducation(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ===============================
                  Experience
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <Briefcase className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="تجربه کاری"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={experience}
                  onChange={(e) =>
                    setExperience(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ===============================
                  Skills
              =============================== */}
              <div className="border border-gray-300 rounded p-2.5">

                <input
                  type="text"
                  placeholder=" ( JavaScript ,React ,مثلا: طراحی)مهارت ها "
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={skills}
                  onChange={(e) =>
                    setSkills(
                      e.target.value
                    )
                  }
                />

                <p className="text-xs text-gray-400 mt-1">
                  مهارت‌ها را با کامه جدا کنید
                </p>

              </div>


              {/* ===============================
                  Languages
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <Languages className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="زبان‌ها (مثلاً: دری, پشتو, انگلیسی)"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={languages}
                  onChange={(e) =>
                    setLanguages(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ===============================
                  Job Type
              =============================== */}
              <div className="border border-gray-300 rounded p-2.5">

                <label className="block text-sm text-gray-600 mb-2">
                  تایم کاری
                </label>

                <select
                  className="w-full outline-none text-sm bg-transparent"
                  value={preferredJobType}
                  onChange={(e) =>
                    setPreferredJobType(
                      e.target.value
                    )
                  }
                >

                  <option value="تمام وقت">
                    تمام وقت
                  </option>

                  <option value="نیمه وقت">
                    نیمه وقت
                  </option>

                  <option value="قراردادی">
                    قراردادی
                  </option>

                  <option value="فریلنسری">
                    فریلنسری
                  </option>

                  <option value="کارآموزی">
                    کارآموزی
                  </option>

                </select>

              </div>


              {/* ===============================
                  Expected Salary
              =============================== */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="معاش مورد انتظار به افغانی"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400"
                  value={expectedSalary}
                  onChange={(e) =>
                    setExpectedSalary(
                      convertPersianDigitsToEnglish(
                        e.target.value
                      ).replace(
                        /[^0-9]/g,
                        ""
                      )
                    )
                  }
                />

              </div>


              {/* ===============================
                  Bio
              =============================== */}
              <div className="border border-gray-300 rounded p-2.5">

                <textarea
                  placeholder="درباره خود و توانایی‌های کاری‌ تان بنویسید"
                  className="w-full outline-none text-sm bg-transparent placeholder-gray-400 resize-none"
                  rows="4"
                  value={bio}
                  onChange={(e) =>
                    setBio(
                      e.target.value
                    )
                  }
                />

              </div>


              {/* ===============================
                  Terms
              =============================== */}
              <label
                htmlFor="terms-checkbox"
                className="flex items-center gap-1 cursor-pointer text-sm text-gray-600"
              >

                <input
                  id="terms-checkbox"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  required
                />

                {" "}

                موافقم

                <Link
                  to="/terms"
                  className="text-blue-600 hover:underline"
                >
                  شرایط و قوانین
                </Link>

                {" "}

                من با تمام

              </label>


              {/* ===============================
                  Submit Button
              =============================== */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex justify-center items-center ${
                  loading
                    ? "cursor-not-allowed opacity-50"
                    : "cursor-pointer"
                }`}
              >

                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5" />
                ) : (
                  "ایجاد حساب"
                )}

              </button>


              {/* ===============================
                  Login
              =============================== */}
              <div className="text-center text-sm text-gray-600 pt-2">

                قبلاً حساب ساخته‌اید؟{" "}

                <Link
                  to="/candidate-login"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  ورود
                </Link>

              </div>

            </form>

          </div>

        </main>

        <Footer />
      </div>
    </>
  );
};


export default CandidatesSignup;