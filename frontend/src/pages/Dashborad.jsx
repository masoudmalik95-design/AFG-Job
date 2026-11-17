
import { useContext, useEffect, useRef, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import {
  LoaderCircle,
  LogOut,
  Camera,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const imageInputRef = useRef(null);

  const { companyData, companyLoading, backendUrl } =
    useContext(AppContext);

  const [uploadingImage, setUploadingImage] = useState(false);

  const companyImage = companyData?.image
    ? companyData.image.startsWith("http")
      ? companyData.image
      : `${backendUrl.replace(/\/$/, "")}/company/image/${companyData.image}`
    : assets.avatarPlaceholder;

  const sidebarLinks = [
    {
      id: "manage-jobs",
      name: "Manage Jobs",
      path: "/dashboard/manage-jobs",
      icon: assets.home_icon,
    },
    {
      id: "add-job",
      name: "Add Job",
      path: "/dashboard/add-job",
      icon: assets.add_icon,
    },
    {
      id: "view-applications",
      name: "View Applications",
      path: "/dashboard/view-applications",
      icon: assets.person_tick_icon,
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("companyToken");
    toast.success("Logout successfully");
    navigate("/recruiter-login");
  };

  // انتخاب و آپلود عکس جدید شرکت
  const handleImageChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // بررسی نوع فایل
    if (!file.type.startsWith("image/")) {
      toast.error("لطفاً یک فایل تصویری انتخاب کنید");
      event.target.value = "";
      return;
    }

    // بررسی حجم فایل (حداکثر 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error("حجم عکس نباید بیشتر از 2MB باشد");
      event.target.value = "";
      return;
    }

    const companyToken = localStorage.getItem("companyToken");

    if (!companyToken) {
      toast.error("لطفاً دوباره وارد حساب شرکت شوید");
      navigate("/recruiter-login");
      return;
    }

    try {
      setUploadingImage(true);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${backendUrl.replace(/\/$/, "")}/company/update-company-image`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "آپلود عکس شرکت موفق نشد"
        );
      }

      toast.success("عکس شرکت با موفقیت تغییر کرد");

      // دریافت دوباره اطلاعات شرکت از سرور
      window.location.reload();
    } catch (error) {
      console.error("Company image upload error:", error);
      toast.error(
        error.message || "در آپلود عکس مشکلی به وجود آمد"
      );
    } finally {
      setUploadingImage(false);
      event.target.value = "";
    }
  };

  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      location.pathname === "/dashboard/"
    ) {
      document.title = "AFG Job | Dashboard";
      navigate("/dashboard/manage-jobs");
    }
  }, [location.pathname, navigate]);

  return (
    <div className="flex flex-col min-h-screen bg-white dark:bg-[#0f0f0f]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-200 dark:border-[#3f4245] py-3 bg-white dark:bg-[#242526] sticky top-0 z-10 px-4 transition-colors">
        <Link to="/dashboard" className="flex items-center">
          <img
            className="w-[90px]"
            src={assets.logo}
            alt="AFG Job Logo"
          />
        </Link>

        {companyLoading ? (
          <LoaderCircle className="animate-spin text-gray-500 dark:text-gray-300" />
        ) : companyData ? (
          <div className="flex items-center gap-4 md:gap-3">
            <div className="flex items-center gap-2">
              <p className="text-gray-600 dark:text-gray-200">
                سلام, {companyData?.name}
              </p>

              {/* Company Image */}
              <div className="relative group">
                <img
                  className="w-9 h-9 rounded-full object-cover border border-gray-200 dark:border-gray-600"
                  src={companyImage}
                  alt={`${companyData?.name} profile`}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = assets.avatarPlaceholder;
                  }}
                />

                {/* Change Image Button */}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage}
                  title="تغییر عکس شرکت"
                  aria-label="Change company image"
                  className="absolute inset-0 flex items-center justify-center rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer disabled:cursor-not-allowed"
                >
                  {uploadingImage ? (
                    <LoaderCircle
                      size={18}
                      className="animate-spin"
                    />
                  ) : (
                    <Camera size={17} />
                  )}
                </button>

                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </div>

              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="text-xs text-indigo-600 dark:text-blue-400 hover:underline disabled:opacity-50"
              >
                {uploadingImage ? "در حال آپلود..." : "تغییر عکس"}
              </button>
            </div>

            <button
              className="w-[30px] h-[30px] flex items-center justify-center rounded bg-gray-50 dark:bg-[#1f2937] border border-gray-200 dark:border-[#3f4245] hover:bg-gray-100 dark:hover:bg-[#30343b] transition-colors cursor-pointer"
              onClick={handleLogout}
              aria-label="Logout"
            >
              <LogOut
                size={18}
                className="text-gray-700 dark:text-gray-200"
              />
            </button>
          </div>
        ) : null}
      </header>

      {/* Dashboard Content */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="md:w-64 w-16 border-r border-gray-200 dark:border-[#3f4245] bg-white dark:bg-[#242526] flex flex-col shrink-0 transition-colors">
          <nav className="pt-4 rounded-l-2xl">
            {sidebarLinks.map((item) => (
              <NavLink
                to={item.path}
                key={item.id}
                className={({ isActive }) =>
                  `flex items-center py-3 px-4 gap-3 transition-colors rounded-l-md ${
                    isActive
                      ? "border-r-4 md:border-r-[6px] bg-indigo-50 dark:bg-[#1e293b] border-indigo-500 text-indigo-600 dark:text-blue-400 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#30343b]"
                  }`
                }
                end={item.path === "/dashboard/manage-jobs"}
              >
                <img
                  src={item.icon}
                  alt={`${item.name} icon`}
                  className="w-5 h-5 dark:brightness-0 dark:invert dark:opacity-90"
                  aria-hidden="true"
                />

                <span className="md:block hidden">
                  {item.name}
                </span>
              </NavLink>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-auto pl-4 pt-4 bg-white dark:bg-[#29272700] transition-colors">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
