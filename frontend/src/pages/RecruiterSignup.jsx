import axios from "axios";
import {
  Lock,
  Mail,
  Upload,
  LoaderCircle,
  Phone,
  MapPin,
  Building2,
  Globe,
  FileText,
} from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
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

const RecruiterSignup = () => {
  const [companyLogo, setCompanyLogo] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");

  const [loading, setLoading] = useState(false);

  const { backendUrl, setCompanyData, setCompanyToken } =
    useContext(AppContext);

  const navigate = useNavigate();

  const recruiterSignup = async (e) => {
    e.preventDefault();

    if (!companyLogo) {
      toast.error("لوگوی شرکت را آپلود کنید");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email.trim().toLowerCase());
      formData.append("password", password);
      formData.append("image", companyLogo);

      formData.append("phone", phone);
      formData.append("province", province);
      formData.append("city", city);
      formData.append("address", address);
      formData.append("website", website);
      formData.append("description", description);

      const { data } = await axios.post(
        `${backendUrl}/company/register-company`,
        formData
      );

      if (data.success) {
        setCompanyToken(data.token);
        setCompanyData(data.companyData);

        localStorage.setItem("companyToken", data.token);

        toast.success(data.message);

        navigate("/dashboard");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Signup error:", error);

      toast.error(
        error?.response?.data?.message ||
          "ثبت‌ نام شرکت انجام نشد"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow flex items-center justify-center px-4 py-8">
          <div className="w-full max-w-lg border border-gray-200 rounded-lg p-6 bg-white shadow">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-700 mb-1.5">
                ثبت‌ نام کارفرما
              </h1>

              <p className="text-sm text-gray-600">
                معلومات شرکت را وارد کنید
              </p>
            </div>

            <form
              className="space-y-4"
              onSubmit={recruiterSignup}
            >
              {/* Logo */}
              <div className="flex flex-col items-center mb-4">
                <label className="relative cursor-pointer flex items-center justify-between flex-col">
                  <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors">
                    {companyLogo ? (
                      <img
                        src={URL.createObjectURL(companyLogo)}
                        alt="Company logo preview"
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
                        setCompanyLogo(
                          e.target.files?.[0] || null
                        )
                      }
                    />
                  </div>

                  <span className="block text-xs mt-2 text-gray-500">
                    {companyLogo
                      ? "تغییر لوگو"
                      : "آپلود لوگوی شرکت"}
                  </span>
                </label>
              </div>

              {/* Company Name */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <Building2 className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="نام شرکت"
                  className="w-full outline-none text-sm bg-transparent"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  required
                />
              </div>

              {/* Email */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="email"
                  placeholder="ایمیل شرکت"
                  className="w-full outline-none text-sm bg-transparent"
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

              {/* Phone */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <Phone className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="tel"
                  placeholder="شماره تماس"
                  className="w-full outline-none text-sm bg-transparent"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  required
                />
              </div>

              {/* Province */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="ولایت"
                  className="w-full outline-none text-sm bg-transparent"
                  value={province}
                  onChange={(e) =>
                    setProvince(e.target.value)
                  }
                  required
                />
              </div>

              {/* City */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="شهر / ولسوالی"
                  className="w-full outline-none text-sm bg-transparent"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  required
                />
              </div>

              {/* Address */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <MapPin className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="text"
                  placeholder="آدرس شرکت"
                  className="w-full outline-none text-sm bg-transparent"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />
              </div>

              {/* Website */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <Globe className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="url"
                  placeholder="وب‌سایت شرکت (اختیاری)"
                  className="w-full outline-none text-sm bg-transparent"
                  value={website}
                  onChange={(e) =>
                    setWebsite(e.target.value)
                  }
                />
              </div>

              {/* Description */}
              <div className="border border-gray-300 rounded flex items-start p-2.5">
                <FileText className="h-5 w-5 text-gray-400 mr-2 mt-1" />

                <textarea
                  placeholder="توضیحات درباره شرکت"
                  className="w-full outline-none text-sm bg-transparent resize-none"
                  rows="3"
                  value={description}
                  onChange={(e) =>
                    setDescription(e.target.value)
                  }
                />
              </div>

              {/* Password */}
              <div className="border border-gray-300 rounded flex items-center p-2.5">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />

                <input
                  type="password"
                  placeholder="رمز عبور"
                  className="w-full outline-none text-sm bg-transparent"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  required
                />
              </div>

              {/* Terms */}
              <label
                htmlFor="terms-checkbox"
                className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer"
              >
                <input
                  id="terms-checkbox"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  required
                />

                موافقم{" "}
                <Link
                  to="/terms"
                  className="text-blue-600 hover:underline"
                >
                 تمام قوانین و شرایط
                </Link>{" "}
                 من با
              </label>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition flex justify-center items-center cursor-pointer ${
                  loading
                    ? "cursor-not-allowed opacity-50"
                    : ""
                }`}
              >
                {loading ? (
                  <LoaderCircle className="animate-spin h-5 w-5" />
                ) : (
                  "ثبت شرکت"
                )}
              </button>

              <div className="text-center text-sm text-gray-600 pt-2">
                 قبلاً حساب دارید؟{" "}
                <Link
                  to="/recruiter-login"
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

export default RecruiterSignup;