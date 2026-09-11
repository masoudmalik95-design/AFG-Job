import { Lock, Mail, LoaderCircle } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import axios from "axios";

const convertPersianDigitsToEnglish = (value) =>
  value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );

const RecruiterLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    backendUrl,
    setCompanyData,
    setCompanyToken,
  } = useContext(AppContext);

  const navigate = useNavigate();

  // ===============================
  // Recruiter Login
  // ===============================
  const recruiterLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/company/login-company`,
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      if (data.success) {
        setCompanyToken(data.token);
        setCompanyData(data.companyData);

        localStorage.setItem(
          "companyToken",
          data.token
        );

        toast.success(data.message);

        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Recruiter login error:", error);

      toast.error(
        error?.response?.data?.message ||
          "ورود انجام نشد"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ===============================
          Main Dark Background
      =============================== */}

      <div
        className="
          min-h-screen
          bg-white
          dark:bg-[#0f0f0f00]
          transition-colors
          duration-300

        "
      >
        <main
          className="
            flex-grow
            flex
            items-center
            justify-center
            px-4
            py-10
          "
        >
          {/* ===============================
              Login Card
          =============================== */}

          <div
            className="
              w-full
              max-w-md
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
                ورود به عنوان کارفرما
              </h1>

              <p
                className="
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                  leading-7
                "
              >
                خوش آمدید!
                <br />
                برای ادامه وارد حساب خود شوید
              </p>
            </div>

            {/* ===============================
                Form
            =============================== */}

            <form
              className="space-y-4"
              onSubmit={recruiterLogin}
            >
              {/* ===============================
                  Email
              =============================== */}

              <div
                className="
                  border
                  border-gray-300
                  dark:border-[#4a4d50]
                  rounded-lg
                  flex
                  items-center
                  p-2.5
                  bg-white
                  dark:bg-[#1f2937]
                  focus-within:ring-2
                  focus-within:ring-blue-500
                  focus-within:border-transparent
                  transition-colors
                  duration-200
                "
              >
                <Mail
                  className="
                    h-5
                    w-5
                    text-gray-400
                    dark:text-gray-300
                    mr-2
                    shrink-0
                  "
                />

                <input
                  type="email"
                  placeholder="ایمیل"
                  className="
                    w-full
                    outline-none
                    text-sm
                    bg-transparent
                    text-gray-800
                    dark:text-gray-100
                    placeholder-gray-400
                    dark:placeholder-gray-400
                  "
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

              <div
                className="
                  border
                  border-gray-300
                  dark:border-[#4a4d50]
                  rounded-lg
                  flex
                  items-center
                  p-2.5
                  bg-white
                  dark:bg-[#1f2937]
                  focus-within:ring-2
                  focus-within:ring-blue-500
                  focus-within:border-transparent
                  transition-colors
                  duration-200
                "
              >
                <Lock
                  className="
                    h-5
                    w-5
                    text-gray-400
                    dark:text-gray-300
                    mr-2
                    shrink-0
                  "
                />

                <input
                  type="password"
                  placeholder="رمز عبور"
                  className="
                    w-full
                    outline-none
                    text-sm
                    bg-transparent
                    text-gray-800
                    dark:text-gray-100
                    placeholder-gray-400
                    dark:placeholder-gray-400
                  "
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              {/* ===============================
                  Remember Me
              =============================== */}

              <div className="flex items-center justify-between">
                <label
                  className="
                    flex
                    items-center
                    gap-2
                    cursor-pointer
                  "
                >
                  <input
                    type="checkbox"
                    className="
                      h-4
                      w-4
                      text-blue-600
                      rounded
                      border-gray-300
                      dark:border-[#4a4d50]
                      dark:bg-[#1f2937]
                      focus:ring-blue-500
                    "
                    required
                  />

                  <span
                    className="
                      text-sm
                      text-gray-600
                      dark:text-gray-300
                    "
                  >
                    مرا به خاطر بسپار
                  </span>
                </label>
              </div>

              {/* ===============================
                  Submit Button
              =============================== */}

              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  py-2.5
                  px-4
                  rounded-lg
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
                  "ورود"
                )}
              </button>

              {/* ===============================
                  Signup Link
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
                حساب کاربری ندارید؟{" "}

                <Link
                  to="/recruiter-signup"
                  className="
                    text-blue-600
                    dark:text-blue-400
                    hover:text-blue-800
                    dark:hover:text-blue-300
                    font-medium
                    hover:underline
                  "
                >
                  ثبت‌ نام
                </Link>
              </div>
            </form>
          </div>
        </main>

        {/* ===============================
            Footer
        =============================== */}

        <Footer />
      </div>
    </>
  );
};

export default RecruiterLogin;