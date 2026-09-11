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

    if (submittingRef.current) {
      return;
    }

    if (!image) {
      toast.error("لطفاً عکس خود را آپلود کنید");
      return;
    }

    submittingRef.current = true;
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name.trim());

      const normalizedEmail = email
        .trim()
        .toLowerCase();

      formData.append("email", normalizedEmail);
      formData.append("password", password);
      formData.append("phone", phone.trim());
      formData.append("province", province.trim());
      formData.append("city", city.trim());
      formData.append("education", education.trim());
      formData.append("experience", experience.trim());
      formData.append("skills", skills.trim());
      formData.append("languages", languages.trim());
      formData.append(
        "preferredJobType",
        preferredJobType
      );
      formData.append("expectedSalary", expectedSalary);
      formData.append("bio", bio.trim());
      formData.append("image", image);

      console.log("📤 Sending signup request...");
      console.log("📧 Email:", normalizedEmail);

      const { data } = await axios.post(
        `${backendUrl}/user/register-user`,
        formData
      );

      console.log("📥 Signup response:", data);

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

      const errorMessage =
        error?.response?.data?.message ||
        "ثبت‌نام انجام نشد";

      toast.error(errorMessage);
    } finally {
      submittingRef.current = false;
      setLoading(false);
    }
  };

  // ===============================
  // Common Classes
  // ===============================

  const fieldClass = `
    border
    border-gray-300
    dark:border-[#3f4245]
    rounded-lg
    flex
    items-center
    p-2.5
    bg-white
    dark:bg-[#1f2937]
    transition-colors
    duration-200
    focus-within:ring-2
    focus-within:ring-blue-500
  `;

  const inputClass = `
    w-full
    outline-none
    text-sm
    bg-transparent
    text-gray-800
    dark:text-gray-100
    placeholder-gray-400
    dark:placeholder-gray-400
  `;

  const iconClass =
    "h-5 w-5 text-gray-400 dark:text-gray-300 mr-2 shrink-0";

  return (
    <>
      <Navbar />

      <div className="min-h-screen flex flex-col bg-white dark:bg-[#0e0d0d15] transition-colors duration-300">
        <main className="flex-grow flex items-center justify-center py-10 px-4">

          {/* ===============================
              Signup Card
          =============================== */}

          <div
            className="
              w-full
              max-w-2xl
              border
              border-gray-200
              dark:border-[#3f4245]
              rounded-xl
              p-6
              sm:p-8
              bg-white
              dark:bg-[#242526]
              shadow-sm
              dark:shadow-black/40
              transition-colors
              duration-300
            "
          >

            {/* ===============================
                Header
            =============================== */}

            <div className="text-center mb-7">

              <h1
                className="
                  text-2xl
                  font-semibold
                  text-gray-700
                  dark:text-gray-100
                  mb-2
                "
              >
                ثبت‌ نام جویای کار
              </h1>

              <p
                className="
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                "
              >
                معلومات خود را وارد کنید.
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

              <div className="flex flex-col items-center mb-5">

                <label
                  className="
                    relative
                    cursor-pointer
                    flex
                    items-center
                    justify-between
                    flex-col
                  "
                >

                  <div
                    className="
                      w-20
                      h-20
                      rounded-full
                      bg-gray-100
                      dark:bg-[#1f2937]
                      flex
                      items-center
                      justify-center
                      overflow-hidden
                      border-2
                      border-dashed
                      border-gray-300
                      dark:border-[#4a4d50]
                      hover:border-blue-500
                      transition-colors
                    "
                  >

                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Profile preview"
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />
                    ) : (
                      <Upload
                        className="
                          h-5
                          w-5
                          text-gray-400
                          dark:text-gray-300
                        "
                      />
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

                  <span
                    className="
                      block
                      text-xs
                      mt-2
                      text-gray-500
                      dark:text-gray-300
                    "
                  >
                    {image
                      ? "تغییر عکس"
                      : "آپلود عکس"}
                  </span>

                </label>

              </div>

              {/* ===============================
                  Name
              =============================== */}

              <div className={fieldClass}>

                <UserRound
                  className={iconClass}
                />

                <input
                  type="text"
                  placeholder="نام کامل"
                  className={inputClass}
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

              <div className={fieldClass}>

                <Mail
                  className={iconClass}
                />

                <input
                  type="email"
                  placeholder="ایمیل"
                  className={inputClass}
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

              <div className={fieldClass}>

                <Lock
                  className={iconClass}
                />

                <input
                  type="password"
                  placeholder="رمز عبور"
                  className={inputClass}
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />

              </div>

              {/* ===============================
                  Phone
              =============================== */}

              <div className={fieldClass}>

                <Phone
                  className={iconClass}
                />

                <input
                  type="tel"
                  placeholder="شماره تماس"
                  className={inputClass}
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      convertPersianDigitsToEnglish(
                        e.target.value
                      )
                    )
                  }
                />

              </div>

              {/* ===============================
                  Province
              =============================== */}

              <div className={fieldClass}>

                <MapPin
                  className={iconClass}
                />

                <input
                  type="text"
                  placeholder="ولایت"
                  className={inputClass}
                  value={province}
                  onChange={(e) =>
                    setProvince(e.target.value)
                  }
                />

              </div>

              {/* ===============================
                  City
              =============================== */}

              <div className={fieldClass}>

                <MapPin
                  className={iconClass}
                />

                <input
                  type="text"
                  placeholder="شهر / ولسوالی"
                  className={inputClass}
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                />

              </div>

              {/* ===============================
                  Education
              =============================== */}

              <div className={fieldClass}>

                <GraduationCap
                  className={iconClass}
                />

                <input
                  type="text"
                  placeholder="سطح تحصیلات"
                  className={inputClass}
                  value={education}
                  onChange={(e) =>
                    setEducation(e.target.value)
                  }
                />

              </div>

              {/* ===============================
                  Experience
              =============================== */}

              <div className={fieldClass}>

                <Briefcase
                  className={iconClass}
                />

                <input
                  type="text"
                  placeholder="تجربه کاری"
                  className={inputClass}
                  value={experience}
                  onChange={(e) =>
                    setExperience(e.target.value)
                  }
                />

              </div>

              {/* ===============================
                  Skills
              =============================== */}

              <div
                className="
                  border
                  border-gray-300
                  dark:border-[#3f4245]
                  rounded-lg
                  p-2.5
                  bg-white
                  dark:bg-[#1f2937]
                  transition-colors
                "
              >

                <input
                  type="text"
                  placeholder="مهارت‌ها (مثلاً: طراحی، React, JavaScript)"
                  className={inputClass}
                  value={skills}
                  onChange={(e) =>
                    setSkills(e.target.value)
                  }
                />

                <p
                  className="
                    text-xs
                    text-gray-400
                    dark:text-gray-400
                    mt-1
                  "
                >
                  مهارت‌ها را با کامه جدا کنید.
                </p>

              </div>

              {/* ===============================
                  Languages
              =============================== */}

              <div className={fieldClass}>

                <Languages
                  className={iconClass}
                />

                <input
                  type="text"
                  placeholder="زبان‌ها (مثلاً: دری، پشتو، انگلیسی)"
                  className={inputClass}
                  value={languages}
                  onChange={(e) =>
                    setLanguages(e.target.value)
                  }
                />

              </div>

              {/* ===============================
                  Job Type
              =============================== */}

              <div
                className="
                  border
                  border-gray-300
                  dark:border-[#3f4245]
                  rounded-lg
                  p-2.5
                  bg-white
                  dark:bg-[#1f2937]
                  transition-colors
                "
              >

                <label
                  className="
                    block
                    text-sm
                    text-gray-600
                    dark:text-gray-200
                    mb-2
                  "
                >
                  تایم کاری
                </label>

                <select
                  className="
                    w-full
                    outline-none
                    text-sm
                    bg-transparent
                    text-gray-800
                    dark:text-gray-100
                  "
                  value={preferredJobType}
                  onChange={(e) =>
                    setPreferredJobType(
                      e.target.value
                    )
                  }
                >

                  <option
                    value="تمام وقت"
                    className="bg-white dark:bg-[#1f2937]"
                  >
                    تمام وقت
                  </option>

                  <option
                    value="نیمه وقت"
                    className="bg-white dark:bg-[#1f2937]"
                  >
                    نیمه وقت
                  </option>

                  <option
                    value="قراردادی"
                    className="bg-white dark:bg-[#1f2937]"
                  >
                    قراردادی
                  </option>

                  <option
                    value="فریلنسری"
                    className="bg-white dark:bg-[#1f2937]"
                  >
                    فریلنسری
                  </option>

                  <option
                    value="کارآموزی"
                    className="bg-white dark:bg-[#1f2937]"
                  >
                    کارآموزی
                  </option>

                </select>

              </div>

              {/* ===============================
                  Expected Salary
              =============================== */}

              <div className={fieldClass}>

                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="معاش مورد انتظار به افغانی"
                  className={inputClass}
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

              <div
                className="
                  border
                  border-gray-300
                  dark:border-[#3f4245]
                  rounded-lg
                  p-2.5
                  bg-white
                  dark:bg-[#1f2937]
                  transition-colors
                "
              >

                <textarea
                  placeholder="درباره خود و توانایی‌های کاری‌ تان بنویسید"
                  className={`
                    ${inputClass}
                    resize-none
                  `}
                  rows="4"
                  value={bio}
                  onChange={(e) =>
                    setBio(e.target.value)
                  }
                />

              </div>

              {/* ===============================
                  Terms
              =============================== */}

              <label
                htmlFor="terms-checkbox"
                className="
                  flex
                  items-center
                  gap-1
                  cursor-pointer
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                "
              >

                <input
                  id="terms-checkbox"
                  type="checkbox"
                  className="
                    h-4
                    w-4
                    text-blue-600
                    rounded
                    border-gray-300
                    dark:border-[#4a4d50]
                    dark:bg-[#1f2937]
                  "
                  required
                />

                من با تمام

                <Link
                  to="/terms"
                  className="
                    text-blue-600
                    dark:text-blue-400
                    hover:underline
                  "
                >
                  قوانین و شرایط
                  
                </Link>

                موافقم

              </label>

              {/* ===============================
                  Submit Button
              =============================== */}

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full
                  bg-blue-600
                  text-white
                  py-2.5
                  px-4
                  rounded-lg
                  hover:bg-blue-700
                  transition
                  flex
                  justify-center
                  items-center
                  ${
                    loading
                      ? "cursor-not-allowed opacity-50"
                      : "cursor-pointer"
                  }
                `}
              >

                {loading ? (
                  <LoaderCircle
                    className="
                      animate-spin
                      h-5
                      w-5
                    "
                  />
                ) : (
                  "ایجاد حساب"
                )}

              </button>

              {/* ===============================
                  Login
              =============================== */}

              <div
                className="
                  text-center
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                  pt-2
                "
              >

                قبلاً حساب ساخته‌اید؟{" "}

                <Link
                  to="/candidate-login"
                  className="
                    text-blue-600
                    dark:text-blue-400
                    hover:text-blue-800
                    dark:hover:text-blue-300
                    font-medium
                    hover:underline
                  "
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