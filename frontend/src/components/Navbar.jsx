import {
  Briefcase,
  ChevronDown,
  LoaderCircle,
  LogOut,
  Menu,
  Moon,
  Sun,
  X,
} from "lucide-react";

import React, { useContext, useEffect, useRef, useState } from "react";
import { toast } from "react-hot-toast";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const [isDarkMode, setIsDarkMode] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const profileMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const {
    isLogin,
    userData,
    userDataLoading,
    setIsLogin,
  } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();

  // =========================
  // Navigation Menu
  // =========================

  const menu = [
    {
      name: "صفحه اصلی",
      path: "/",
    },
    {
      name: "تمام شغل‌ ها",
      path: "/all-jobs/all",
    },
    {
      name: "درباره ما",
      path: "/about",
    },
    {
      name: "شرایط و قوانین",
      path: "/terms",
    },
  ];

  // =========================
  // Dark Mode
  // =========================

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  // =========================
  // Mobile Menu
  // =========================

  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // =========================
  // Profile Menu
  // =========================

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  // =========================
  // Close menus when clicking outside
  // =========================

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileMenuOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // =========================
  // Close menus after navigation
  // =========================

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("userToken");

    toast.success("از حساب کاربری خارج شدید");

    setIsLogin(false);

    navigate("/candidate-login");
  };

  return (
    <header
      className="
        border-b
        border-gray-200
        dark:border-[#35383b]
        mb-10
        transition-colors
        duration-300
        bg-white
        dark:bg-[#0f0f0f00]
      "
    >
      <div
        className="
          w-[90%]
          mx-auto
          min-h-[80px]
          flex
          items-center
          justify-between
          relative
        "
      >
        {/* =========================
            Logo
        ========================= */}

        <Link to="/" className="flex items-center shrink-0">
          <img
            src={assets.logo}
            alt="AFG Job"
            className="
              w-[120px]
              sm:w-[140px]
              object-contain
            "
          />
        </Link>

        {/* =========================
            Desktop Navigation
        ========================= */}

        <nav className="hidden lg:flex items-center gap-7">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `
                text-sm
                font-medium
                transition-colors
                duration-200
                ${
                  isActive
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                }
                `
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* =========================
            Desktop Right Side
        ========================= */}

        <div className="hidden lg:flex items-center gap-3">
          {/* Dark Mode */}

          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="تغییر حالت تاریک"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              border
              border-gray-200
              dark:border-[#3f4245]
              bg-white
              dark:bg-[#242526]
              text-gray-700
              dark:text-gray-200
              hover:bg-gray-100
              dark:hover:bg-[#303236]
              transition-all
            "
          >
            {isDarkMode ? (
              <Sun size={20} />
            ) : (
              <Moon size={20} />
            )}
          </button>

          {!isLogin ? (
            <>
              {/* Recruiter Login */}

              <Link
                to="/recruiter-login"
                className="
                  flex
                  items-center
                  gap-2
                  px-4
                  py-2.5
                  rounded-lg
                  border
                  border-gray-200
                  dark:border-[#3f4245]
                  text-gray-700
                  dark:text-gray-200
                  hover:bg-gray-50
                  dark:hover:bg-[#242526]
                  transition-all
                  text-sm
                "
              >
                <Briefcase size={18} />

                <span>
                  ورود به عنوان کارفرما
                </span>
              </Link>

              {/* Candidate Login */}

              <Link
                to="/candidate-login"
                className="
                  px-5
                  py-2.5
                  rounded-lg
                  bg-blue-600
                  hover:bg-blue-700
                  text-white
                  transition-all
                  text-sm
                "
              >
                ورود به عنوان جویای کار
              </Link>
            </>
          ) : (
            /* =========================
               Logged In User
            ========================= */

            <div
              className="relative"
              ref={profileMenuRef}
            >
              <button
                type="button"
                onClick={toggleProfileMenu}
                className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  border
                  border-gray-200
                  dark:border-[#3f4245]
                  bg-white
                  dark:bg-[#242526]
                  hover:bg-gray-50
                  dark:hover:bg-[#303236]
                  transition-all
                "
              >
                {userDataLoading ? (
                  <LoaderCircle
                    size={20}
                    className="animate-spin text-blue-600"
                  />
                ) : (
                  <>
                    <img
                      src={
                        userData?.image ||
                        assets.profile_icon
                      }
                      alt="Profile"
                      className="
                        w-8
                        h-8
                        rounded-full
                        object-cover
                      "
                    />

                    <span className="text-sm font-medium text-gray-800 dark:text-gray-100">
                      {userData?.name || "حساب کاربری"}
                    </span>

                    <ChevronDown
                      size={18}
                      className="text-gray-500 dark:text-gray-300"
                    />
                  </>
                )}
              </button>

              {isProfileMenuOpen && (
                <div
                  className="
                    absolute
                    left-0
                    top-full
                    mt-2
                    w-52
                    rounded-xl
                    border
                    border-gray-200
                    dark:border-[#3f4245]
                    bg-white
                    dark:bg-[#242526]
                    shadow-lg
                    overflow-hidden
                    z-50
                  "
                >
                  <Link
                    to="/applications"
                    className="
                      block
                      px-4
                      py-3
                      text-sm
                      text-gray-700
                      dark:text-gray-200
                      hover:bg-gray-100
                      dark:hover:bg-[#303236]
                    "
                  >
                    درخواست‌های من
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex
                      items-center
                      gap-2
                      px-4
                      py-3
                      text-sm
                      text-red-600
                      hover:bg-gray-100
                      dark:hover:bg-[#303236]
                    "
                  >
                    <LogOut size={18} />

                    خروج از حساب
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* =========================
            Mobile Buttons
        ========================= */}

        <div className="lg:hidden flex items-center gap-2">
          {/* Dark Mode */}

          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="تغییر حالت تاریک"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              border
              border-gray-200
              dark:border-[#3f4245]
              bg-white
              dark:bg-[#242526]
              text-gray-700
              dark:text-gray-200
              transition-all
            "
          >
            {isDarkMode ? (
              <Sun size={19} />
            ) : (
              <Moon size={19} />
            )}
          </button>

          {/* Menu */}

          <button
            type="button"
            onClick={toggleMenu}
            aria-label="منو"
            className="
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              border
              border-gray-200
              dark:border-[#3f4245]
              bg-white
              dark:bg-[#242526]
              text-gray-700
              dark:text-gray-200
              transition-all
            "
          >
            {isMobileMenuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>

        {/* =========================
            Mobile Menu
        ========================= */}

        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="
              absolute
              top-[75px]
              left-0
              right-0
              z-50
              rounded-xl
              border
              border-gray-200
              dark:border-[#3f4245]
              bg-white
              dark:bg-[#242526]
              shadow-xl
              p-4
              lg:hidden
            "
          >
            {/* Navigation */}

            <nav className="flex flex-col gap-1">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    transition-all
                    ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-[#1e3a5f] dark:text-blue-400"
                        : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#303236]"
                    }
                    `
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div
              className="
                border-t
                border-gray-200
                dark:border-[#35383b]
                my-3
              "
            />

            {!isLogin ? (
              <div className="flex flex-col gap-2">
                {/* Recruiter Login */}

                <Link
                  to="/recruiter-login"
                  className="
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-4
                    py-3
                    rounded-lg
                    border
                    border-gray-200
                    dark:border-[#3f4245]
                    text-gray-700
                    dark:text-gray-200
                    hover:bg-gray-100
                    dark:hover:bg-[#303236]
                    transition-all
                    text-sm
                  "
                >
                  <Briefcase size={18} />

                  ورود به عنوان کارفرما
                </Link>

                {/* Recruiter Signup */}

                <Link
                  to="/recruiter-signup"
                  className="
                    flex
                    items-center
                    justify-center
                    px-4
                    py-3
                    rounded-lg
                    bg-gray-100
                    dark:bg-[#303236]
                    text-gray-800
                    dark:text-gray-100
                    hover:bg-gray-200
                    dark:hover:bg-[#3a3d40]
                    transition-all
                    text-sm
                  "
                >
                  ثبت‌ نام به عنوان کارفرما
                </Link>

                {/* Candidate Login */}

                <Link
                  to="/candidate-login"
                  className="
                    flex
                    items-center
                    justify-center
                    px-4
                    py-3
                    rounded-lg
                    bg-blue-600
                    hover:bg-blue-700
                    text-white
                    transition-all
                    text-sm
                  "
                >
                  ورود به عنوان جویای کار
                </Link>

                {/* Candidate Signup */}

                <Link
                  to="/candidate-signup"
                  className="
                    flex
                    items-center
                    justify-center
                    px-4
                    py-3
                    rounded-lg
                    border
                    border-blue-600
                    text-blue-600
                    dark:text-blue-400
                    dark:border-blue-500
                    hover:bg-blue-50
                    dark:hover:bg-[#1e3a5f]
                    transition-all
                    text-sm
                  "
                >
                  ثبت‌ نام به عنوان جویای کار
                </Link>

                {/* IMPORTANT:
                    Candidate signup is /candidate-signup
                    NOT /recruiter-signup
                */}

                <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
                  حساب کاربری ندارید؟

                  <Link
                    to="/candidate-signup"
                    className="
                      mr-1
                      text-blue-600
                      dark:text-blue-400
                      hover:underline
                    "
                  >
                    ثبت‌ نام
                  </Link>
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {/* Applications */}

                <Link
                  to="/applications"
                  className="
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    text-gray-700
                    dark:text-gray-200
                    hover:bg-gray-100
                    dark:hover:bg-[#303236]
                  "
                >
                  درخواست‌های من
                </Link>

                {/* Logout */}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    w-full
                    flex
                    items-center
                    justify-center
                    gap-2
                    px-4
                    py-3
                    rounded-lg
                    text-sm
                    text-red-600
                    hover:bg-red-50
                    dark:hover:bg-[#3a2020]
                  "
                >
                  <LogOut size={18} />

                  خروج از حساب
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;