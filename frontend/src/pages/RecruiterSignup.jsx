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

  const {
    backendUrl,
    setCompanyData,
    setCompanyToken,
  } = useContext(AppContext);

  const navigate = useNavigate();

  // ===============================
  // Recruiter Signup
  // ===============================
  const recruiterSignup = async (e) => {
    e.preventDefault();

    if (!companyLogo) {
      toast.error("عکس کارفرما را آپلود کنید");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append(
        "email",
        email.trim().toLowerCase()
      );
      formData.append("password", password);
      formData.append("image", companyLogo);

      formData.append("phone", phone.trim());
      formData.append("province", province.trim());
      formData.append("city", city.trim());
      formData.append("address", address.trim());
      formData.append("website", website.trim());
      formData.append(
        "description",
        description.trim()
      );

      const { data } = await axios.post(
        `${backendUrl}/company/register-company`,
        formData
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
      console.error(
        "Recruiter signup error:",
        error
      );

      toast.error(
        error?.response?.data?.message ||
          "ثبت‌ نام کارفرما انجام نشد"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      {/* ===============================
          Main Background
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
              Signup Card
          =============================== */}

          <div
            className="
              w-full
              max-w-lg
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
                ثبت‌ نام کارفرما
              </h1>

              <p
                className="
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                "
              >
                معلومات کارفرما را وارد کنید
              </p>
            </div>

            {/* ===============================
                Form
            =============================== */}

            <form
              className="space-y-4"
              onSubmit={recruiterSignup}
            >
              {/* ===============================
                  Company Logo
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
                    {companyLogo ? (
                      <img
                        src={URL.createObjectURL(
                          companyLogo
                        )}
                        alt="Company logo preview"
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
                        setCompanyLogo(
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
                    {companyLogo
                      ? "تغییر عکس"
                      : "آپلود عکس کارفرما"}
                  </span>
                </label>
              </div>

              {/* ===============================
                  Company Name
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
                "
              >
                <Building2
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
                  type="text"
                  placeholder="نام کارفرما"
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
                  placeholder="ایمیل کارفرما"
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
                  Phone
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
                "
              >
                <Phone
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
                  type="tel"
                  placeholder="شماره تماس"
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
                  value={phone}
                  onChange={(e) =>
                    setPhone(
                      convertPersianDigitsToEnglish(
                        e.target.value
                      )
                    )
                  }
                  required
                />
              </div>

              {/* ===============================
                  Province
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
                "
              >
                <MapPin
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
                  type="text"
                  placeholder="ولایت"
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
                  value={province}
                  onChange={(e) =>
                    setProvince(e.target.value)
                  }
                  required
                />
              </div>

              {/* ===============================
                  City
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
                "
              >
                <MapPin
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
                  type="text"
                  placeholder="شهر / ولسوالی"
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
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  required
                />
              </div>

              {/* ===============================
                  Address
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
                "
              >
                <MapPin
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
                  type="text"
                  placeholder="آدرس کارفرما"
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
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                />
              </div>

              {/* ===============================
                  Website
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
                "
              >
                <Globe
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
                  type="url"
                  placeholder="وب‌سایت کارفرما (اختیاری)"
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
                  value={website}
                  onChange={(e) =>
                    setWebsite(e.target.value)
                  }
                />
              </div>

              {/* ===============================
                  Description
              =============================== */}

              <div
                className="
                  border
                  border-gray-300
                  dark:border-[#4a4d50]
                  rounded-lg
                  flex
                  items-start
                  p-2.5
                  bg-white
                  dark:bg-[#1f2937]
                  focus-within:ring-2
                  focus-within:ring-blue-500
                  focus-within:border-transparent
                  transition-colors
                "
              >
                <FileText
                  className="
                    h-5
                    w-5
                    text-gray-400
                    dark:text-gray-300
                    mr-2
                    mt-1
                    shrink-0
                  "
                />

                <textarea
                  placeholder="توضیحات درباره کارفرما"
                  className="
                    w-full
                    outline-none
                    text-sm
                    bg-transparent
                    text-gray-800
                    dark:text-gray-100
                    placeholder-gray-400
                    dark:placeholder-gray-400
                    resize-none
                  "
                  rows="3"
                  value={description}
                  onChange={(e) =>
                    setDescription(
                      e.target.value
                    )
                  }
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
                  Terms
              =============================== */}

              <label
                htmlFor="terms-checkbox"
                className="
                  text-sm
                  text-gray-600
                  dark:text-gray-300
                  flex
                  items-center
                  gap-2
                  cursor-pointer
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
                    focus:ring-blue-500
                  "
                  required
                />

                موافقم{" "}

                <Link
                  to="/terms"
                  className="
                    text-blue-600
                    dark:text-blue-400
                    hover:text-blue-800
                    dark:hover:text-blue-300
                    hover:underline
                  "
                >
                  تمام قوانین و شرایط
                </Link>

                {" "}من با
              </label>

              {/* ===============================
                  Submit
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
                  "ثبت کارفرما"
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
                قبلاً حساب دارید؟{" "}

                <Link
                  to="/recruiter-login"
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

export default RecruiterSignup;