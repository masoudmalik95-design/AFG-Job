import React, { useContext, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import {
  Mail,
  Lock,
  LoaderCircle,
} from "lucide-react";
import {
  Link,
  useNavigate,
} from "react-router-dom";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const convertPersianDigitsToEnglish = (value) =>
  value
    .replace(/[۰-۹]/g, (digit) =>
      String("۰۱۲۳۴۵۶۷۸۹".indexOf(digit))
    )
    .replace(/[٠-٩]/g, (digit) =>
      String("٠١٢٣٤٥٦٧٨٩".indexOf(digit))
    );

const CandidatesLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const {
    backendUrl,
    setUserData,
    setUserToken,
    setIsLogin,
    fetchUserApplication,
  } = useContext(AppContext);

  const userLoginHandler = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const { data } = await axios.post(
        `${backendUrl}/user/login-user`,
        {
          email: email.trim().toLowerCase(),
          password,
        }
      );

      if (data?.success) {
        setUserToken(data.token);
        setUserData(data.userData);
        setIsLogin(true);

        localStorage.setItem("userToken", data.token);

        await fetchUserApplication();

        toast.success(
          data.message || "ورود موفقانه انجام شد"
        );

        navigate("/");
      } else {
        toast.error(
          data?.message || "ورود انجام نشد"
        );
      }
    } catch (error) {
      console.error("Login error:", error);

      toast.error(
        error?.response?.data?.message ||
          "ایمیل یا رمز عبور نادرست است"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-[calc(100vh-80px)]">
        <main className="flex-grow flex items-center justify-center px-4 py-10">
          <div className="w-full max-w-md border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-700 mb-1">
                 ورود به عنوان جویای کار
              </h1>

              <p className="text-sm text-gray-600">
                !خوش آمدید<br></br> برای ادامه وارد حساب خود شوید
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={userLoginHandler}
            >
              {/* Email */}
              <div className="border border-gray-300 rounded flex items-center p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="email"
                  placeholder="ایمیل"
                  aria-label="ایمیل"
                  autoComplete="email"
                  className="w-full outline-none text-sm"
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

              {/* Password */}
              <div className="border border-gray-300 rounded flex items-center p-2.5 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="password"
                  placeholder="رمز عبور"
                  aria-label="رمز عبور"
                  autoComplete="current-password"
                  className="w-full outline-none text-sm"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              {/* Remember */}
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                  />

                  <span className="text-sm text-gray-600">
                    !مرا به خاطر بسپار
                  </span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2.5 px-4 rounded hover:bg-blue-700 transition flex justify-center items-center ${
                  loading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer"
                }`}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5" />
                ) : (
                  "ورود"
                )}
              </button>

              {/* Signup */}
              <div className="text-center text-sm text-gray-600 mt-3">
                حساب کاری ندارید؟{" "}
                <Link
                  to="/candidate-signup"
                  className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
                >
                  ثبت‌ نام
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

export default CandidatesLogin;