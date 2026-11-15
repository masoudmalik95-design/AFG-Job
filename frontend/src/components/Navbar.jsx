
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
    backendUrl,
  } = useContext(AppContext);

  const location = useLocation();
  const navigate = useNavigate();

  // Profile Image
  const userImage = userData?.image
    ? userData.image.startsWith("http")
      ? userData.image
      : `${backendUrl.replace(/\/$/, "")}/${userData.image.replace(/^\//, "")}`
    : assets.profile_icon;

  // Navigation Items
  const menu = [
    { name: "صفحه اصلی", path: "/" },
    { name: "تمام شغل‌ها", path: "/all-jobs/all" },
    { name: "درباره ما", path: "/about" },
    { name: "شرایط و قوانین", path: "/terms" },
  ];

  // Dark Mode
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

  // Mobile Menu
  const toggleMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  // Profile Menu
  const toggleProfileMenu = () => {
    setIsProfileMenuOpen((prev) => !prev);
  };

  // Close menus when clicking outside
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
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest("[data-mobile-menu-button]")
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

  // Close menus after navigation
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsProfileMenuOpen(false);
  }, [location.pathname]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("userToken");
    toast.success("از حساب کاربری خارج شدید");
    setIsLogin(false);
    navigate("/candidate-login");
  };

  // Active Link Styles
  const getDesktopLinkClass = ({ isActive }) =>
    `
      relative py-2 text-sm font-medium transition-all duration-200
      after:absolute after:right-0 after:bottom-0
      after:h-[2px] after:bg-[#2563EB]
      after:transition-all after:duration-300
      ${
        isActive
          ? "text-[#2563EB] after:w-full dark:text-blue-400 dark:after:bg-blue-400"
          : "text-[#142B4A] hover:text-[#2563EB] after:w-0 hover:after:w-full dark:text-slate-200 dark:hover:text-blue-400"
      }
    `;

  // Mobile Authentication Button Style
  const mobileAuthButtonClass = `
    flex items-center justify-center gap-2
    rounded-xl border border-[#D8E5F7]
    bg-white px-4 py-3
    text-sm font-medium text-[#142B4A]
    transition-all
    hover:border-[#2563EB]
    hover:bg-[#EAF2FF]
    hover:text-[#2563EB]
    dark:border-[#40536C]
    dark:bg-transparent
    dark:text-slate-200
    dark:hover:bg-[#203650]
    dark:hover:text-blue-400
  `;

  return (
    <header
      className="
        sticky top-0 z-[100]
        w-full
        border-b border-transparent
        bg-white/75
        backdrop-blur-md
        shadow-[0_2px_15px_rgba(20,43,74,0.04)]
        transition-colors duration-300
        dark:border-[#1f2937]/50
        dark:bg-[#111820]/75
      "
    >
      <div
        className="
          relative
          mx-auto flex min-h-[76px] w-[90%]
          items-center justify-between
          gap-3
        "
      >
        {/* Logo */}
        <Link
          to="/"
          className="flex shrink-0 items-center"
          aria-label="صفحه اصلی AFG Job"
        >
          <img
            src={assets.logo}
            alt="AFG Job"
            className="w-[115px] object-contain sm:w-[135px]"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8">
          {menu.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={getDesktopLinkClass}
            >
              {item.name}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-2 xl:gap-3 lg:flex">
          {/* Dark Mode */}
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="تغییر حالت تاریک"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-[#EAF2FF]
              bg-white text-[#142B4A]
              transition-all hover:bg-[#EAF2FF]
              dark:border-[#33445D]
              dark:bg-[#14243A] dark:text-yellow-300
              dark:hover:bg-[#203650]
            "
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          {!isLogin ? (
            <>
              <Link
                to="/recruiter-login"
                className="
                  flex items-center gap-2
                  rounded-full border border-[#D8E5F7]
                  px-4 py-2.5
                  text-sm font-medium text-[#142B4A]
                  transition-all
                  hover:border-[#2563EB]
                  hover:bg-[#EAF2FF]
                  hover:text-[#2563EB]
                  dark:border-[#40536C]
                  dark:text-slate-200
                  dark:hover:bg-[#203650]
                  dark:hover:text-blue-400
                "
              >
                <Briefcase size={17} />
                <span>ورود به عنوان کارفرما</span>
              </Link>

              <Link
                to="/candidate-login"
                className="
                  rounded-full bg-[#2563EB]
                  px-5 py-2.5
                  text-sm font-medium text-white
                  shadow-sm shadow-blue-200/50
                  transition-all duration-200
                  hover:-translate-y-0.5
                  hover:bg-[#1D4ED8]
                  hover:shadow-md
                  dark:shadow-none
                "
              >
                ورود به عنوان جویای کار
              </Link>
            </>
          ) : (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={toggleProfileMenu}
                aria-expanded={isProfileMenuOpen}
                className="
                  flex items-center gap-2
                  rounded-xl border border-[#EAF2FF]
                  bg-white px-3 py-2
                  transition-all hover:bg-[#F5F8FF]
                  dark:border-[#33445D]
                  dark:bg-[#14243A]
                  dark:hover:bg-[#203650]
                "
              >
                {userDataLoading ? (
                  <LoaderCircle
                    size={20}
                    className="animate-spin text-[#2563EB]"
                  />
                ) : (
                  <>
                    <img
                      src={userImage}
                      alt="Profile"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = assets.profile_icon;
                      }}
                      className="h-8 w-8 rounded-full object-cover"
                    />

                    <span className="max-w-[120px] truncate text-sm font-medium text-[#142B4A] dark:text-slate-100">
                      {userData?.name || "حساب کاربری"}
                    </span>

                    <ChevronDown
                      size={17}
                      className="text-slate-500 dark:text-slate-300"
                    />
                  </>
                )}
              </button>

              {isProfileMenuOpen && (
                <div
                  className="
                    absolute left-0 top-full z-[110]
                    mt-2 w-52 overflow-hidden rounded-xl
                    border border-[#EAF2FF]
                    bg-white shadow-xl
                    dark:border-[#33445D]
                    dark:bg-[#14243A]
                  "
                >
                  <Link
                    to="/applications"
                    className="
                      block px-4 py-3 text-sm
                      text-[#142B4A]
                      transition-colors
                      hover:bg-[#EAF2FF]
                      hover:text-[#2563EB]
                      dark:text-slate-200
                      dark:hover:bg-[#203650]
                    "
                  >
                    درخواست‌های من
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex w-full items-center gap-2
                      px-4 py-3 text-sm text-red-600
                      transition-colors
                      hover:bg-red-50
                      dark:hover:bg-red-950/30
                    "
                  >
                    <LogOut size={17} />
                    خروج از حساب
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={toggleDarkMode}
            aria-label="تغییر حالت تاریک"
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-[#EAF2FF]
              bg-white text-[#142B4A]
              transition-all hover:bg-[#EAF2FF]
              dark:border-[#33445D]
              dark:bg-[#14243A]
              dark:text-yellow-300
            "
          >
            {isDarkMode ? <Sun size={19} /> : <Moon size={19} />}
          </button>

          <button
            type="button"
            onClick={toggleMenu}
            data-mobile-menu-button
            aria-label="باز و بسته کردن منو"
            aria-expanded={isMobileMenuOpen}
            className="
              flex h-10 w-10 items-center justify-center
              rounded-full border border-[#D8E5F7]
              bg-[#EAF2FF] text-[#142B4A]
              transition-all hover:bg-[#DCEAFF]
              dark:border-[#33445D]
              dark:bg-[#14243A]
              dark:text-slate-100
            "
          >
            {isMobileMenuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="
              absolute right-0 left-0 top-[calc(100%+8px)]
              z-[110] rounded-2xl
              border border-[#EAF2FF]
              bg-white p-4 shadow-xl
              dark:border-[#33445D]
              dark:bg-[#14243A]
              lg:hidden
            "
          >
            <nav className="flex flex-col gap-1">
              {menu.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `
                      rounded-xl px-4 py-3 text-sm
                      font-medium transition-all
                      ${
                        isActive
                          ? "bg-[#EAF2FF] text-[#2563EB] dark:bg-[#203650] dark:text-blue-400"
                          : "text-[#142B4A] hover:bg-[#F5F8FF] dark:text-slate-200 dark:hover:bg-[#203650]"
                      }
                    `
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </nav>

            <div className="my-3 border-t border-[#EAF2FF] dark:border-[#33445D]" />

            {!isLogin ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/recruiter-login"
                  className={mobileAuthButtonClass}
                >
                  <Briefcase size={17} />
                  ورود به عنوان کارفرما
                </Link>

                <Link
                  to="/recruiter-signup"
                  className={mobileAuthButtonClass}
                >
                  ثبت شرکت
                </Link>

                <Link
                  to="/candidate-login"
                  className={mobileAuthButtonClass}
                >
                  ورود به عنوان جویای کار
                </Link>

                <Link
                  to="/candidate-signup"
                  className={mobileAuthButtonClass}
                >
                  ثبت‌نام به عنوان جویای کار
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 rounded-xl bg-[#F5F8FF] p-3 dark:bg-[#203650]">
                  <img
                    src={userImage}
                    alt="Profile"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = assets.profile_icon;
                    }}
                    className="h-10 w-10 rounded-full object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#142B4A] dark:text-white">
                      {userData?.name || "حساب کاربری"}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      جویای کار
                    </p>
                  </div>
                </div>

                <Link
                  to="/applications"
                  className="
                    rounded-xl px-4 py-3 text-sm
                    text-[#142B4A]
                    transition-all hover:bg-[#EAF2FF]
                    dark:text-slate-200
                    dark:hover:bg-[#203650]
                  "
                >
                  درخواست‌های من
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="
                    flex w-full items-center justify-center
                    gap-2 rounded-xl px-4 py-3
                    text-sm text-red-600
                    transition-all hover:bg-red-50
                    dark:hover:bg-red-950/30
                  "
                >
                  <LogOut size={17} />
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
