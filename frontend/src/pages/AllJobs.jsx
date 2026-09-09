import {
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";

import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
} from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  JobCategories,
  JobLocations,
} from "../assets/assets";

import JobCard from "../components/JobCard";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import Loader from "../components/Loader";

import { motion } from "framer-motion";
import {
  slideRigth,
  SlideUp,
} from "../utils/Animation";

function AllJobs() {
  const [jobData, setJobData] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const {
    jobs,
    searchFilter,
    setSearchFilter,
    setIsSearched,
    isSearched,
    fetchJobsData,
  } = useContext(AppContext);

  const { category } = useParams();
  const navigate = useNavigate();

  const jobsPerPage = 6;

  const [searchInput, setSearchInput] = useState({
    title: "",
    location: "",
    selectedCategories: [],
    selectedLocations: [],
  });

  // دریافت اطلاعات شغل‌ها
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      await fetchJobsData();

      setLoading(false);
    };

    fetchData();
  }, []);

  // فیلتر بر اساس دسته‌بندی
  useEffect(() => {
    if (!jobs?.length) return;

    let filtered = [...jobs];

    if (category !== "all") {
      filtered = filtered.filter(
        (job) =>
          job.category?.toLowerCase() ===
          category?.toLowerCase()
      );
    }

    setJobData(filtered);

    setSearchInput({
      title: isSearched ? searchFilter.title : "",
      location: isSearched ? searchFilter.location : "",
      selectedCategories: [],
      selectedLocations: [],
    });

    setCurrentPage(1);
  }, [
    category,
    jobs,
    isSearched,
    searchFilter,
  ]);

  // فیلترهای جستجو
  useEffect(() => {
    let results = [...jobData];

    // عنوان شغل
    if (searchInput.title.trim()) {
      results = results.filter((job) =>
        job.title
          ?.toLowerCase()
          .includes(
            searchInput.title.trim().toLowerCase()
          )
      );
    }

    // محل شغل
    if (searchInput.location.trim()) {
      const locationQuery =
        searchInput.location.trim().toLowerCase();

      results = results.filter((job) => {
        const location =
          `${job.province || ""} ${
            job.city || ""
          }`.toLowerCase();

        return location.includes(locationQuery);
      });
    }

    // دسته‌بندی
    if (
      searchInput.selectedCategories.length > 0
    ) {
      results = results.filter((job) =>
        searchInput.selectedCategories.includes(
          job.category
        )
      );
    }

    // محل‌ها
    if (
      searchInput.selectedLocations.length > 0
    ) {
      results = results.filter(
        (job) =>
          searchInput.selectedLocations.includes(
            job.province
          ) ||
          searchInput.selectedLocations.includes(
            job.city
          )
      );
    }

    setFilteredJobs(results);
    setCurrentPage(1);
  }, [jobData, searchInput]);

  // تغییر Input
  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    setSearchInput((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // انتخاب دسته‌بندی
  const handleCategoryToggle = (cat) => {
    setSearchInput((prev) => {
      const updated =
        prev.selectedCategories.includes(cat)
          ? prev.selectedCategories.filter(
              (c) => c !== cat
            )
          : [...prev.selectedCategories, cat];

      return {
        ...prev,
        selectedCategories: updated,
      };
    });
  };

  // انتخاب محل
  const handleLocationToggle = (loc) => {
    setSearchInput((prev) => {
      const updated =
        prev.selectedLocations.includes(loc)
          ? prev.selectedLocations.filter(
              (l) => l !== loc
            )
          : [...prev.selectedLocations, loc];

      return {
        ...prev,
        selectedLocations: updated,
      };
    });
  };

  // پاک کردن تمام فیلترها
  const clearAllFilters = () => {
    setSearchInput({
      title: "",
      location: "",
      selectedCategories: [],
      selectedLocations: [],
    });

    setSearchFilter({
      title: "",
      location: "",
    });

    setIsSearched(false);

    navigate("/all-jobs/all");
  };

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  // Pagination
  const paginatedJobs = useMemo(() => {
    return [...filteredJobs]
      .reverse()
      .slice(
        (currentPage - 1) * jobsPerPage,
        currentPage * jobsPerPage
      );
  }, [filteredJobs, currentPage]);

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#111827]">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <section>
        {/* دکمه فیلتر در موبایل */}
        <div className="md:hidden flex justify-end mb-4">
          <button
            onClick={() =>
              setShowFilters(!showFilters)
            }
            className="
              flex
              items-center
              gap-2

              bg-blue-500
              hover:bg-blue-600

              text-white

              px-4
              py-2

              rounded-md

              transition
            "
          >
            <Filter size={18} />

            {showFilters
              ? "پنهان کردن فیلترها"
              : "نمایش فیلترها"}
          </button>
        </div>

        <motion.div
          variants={slideRigth(0.5)}
          initial="hidden"
          animate="visible"
          className="
            flex
            flex-col
            md:flex-row

            md:gap-8
            lg:gap-16
          "
        >
          {/* ================= FILTERS ================= */}

          <div
            className={`
              lg:w-1/4

              p-4

              rounded-lg

              border
              border-gray-200
              dark:border-[#3f4245]

              bg-white
              dark:bg-[#1f2937]

              ${
                showFilters
                  ? "block"
                  : "hidden md:block"
              }
            `}
          >
            <div className="space-y-6">

              {/* عنوان شغل */}
              <div>
                <h2 className="
                  text-lg
                  font-semibold

                  text-gray-800
                  dark:text-gray-100

                  mb-2
                ">
                  عنوان شغل
                </h2>

                <input
                  type="text"
                  name="title"
                  value={searchInput.title}
                  onChange={handleSearchChange}
                  placeholder="عنوان شغل را وارد کنید"
                  className="
                    w-full

                    border
                    border-gray-300
                    dark:border-[#4a4d50]

                    rounded-md

                    px-4
                    py-2

                    bg-white
                    dark:bg-[#272b2f]

                    text-gray-800
                    dark:text-gray-100

                    placeholder-gray-500
                    dark:placeholder-gray-500

                    outline-none

                    focus:border-blue-400
                    dark:focus:border-blue-500

                    transition
                  "
                />
              </div>

              {/* محل شغل */}
              <div>
                <h2 className="
                  text-lg
                  font-semibold

                  text-gray-800
                  dark:text-gray-100

                  mb-2
                ">
                  محل شغل
                </h2>

                <input
                  type="text"
                  name="location"
                  value={searchInput.location}
                  onChange={handleSearchChange}
                  placeholder="محل شغل را وارد کنید"
                  className="
                    w-full

                    border
                    border-gray-300
                    dark:border-[#4a4d50]

                    rounded-md

                    px-4
                    py-2

                    bg-white
                    dark:bg-[#272b2f]

                    text-gray-800
                    dark:text-gray-100

                    placeholder-gray-500
                    dark:placeholder-gray-500

                    outline-none

                    focus:border-blue-400
                    dark:focus:border-blue-500

                    transition
                  "
                />
              </div>

              {/* دسته‌بندی‌ها */}
              <div>
                <h2 className="
                  text-lg
                  font-semibold

                  text-gray-800
                  dark:text-gray-100

                  mb-2
                ">
                  دسته‌ بندی‌ ها
                </h2>

                <ul className="space-y-2">
                  {JobCategories.map(
                    (cat, i) => (
                      <li
                        key={i}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={`cat-${i}`}
                          checked={searchInput.selectedCategories.includes(
                            cat
                          )}
                          onChange={() =>
                            handleCategoryToggle(cat)
                          }
                          className="
                            h-4
                            w-4

                            accent-blue-500

                            cursor-pointer
                          "
                        />

                        <label
                          htmlFor={`cat-${i}`}
                          className="
                            ml-2

                            text-gray-700
                            dark:text-gray-300

                            cursor-pointer
                          "
                        >
                          {cat}
                        </label>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* محل‌ها */}
              <div>
                <h2 className="
                  text-lg
                  font-semibold

                  text-gray-800
                  dark:text-gray-100

                  mb-2
                ">
                  محل‌ ها
                </h2>

                <ul className="space-y-2">
                  {JobLocations.map(
                    (loc, i) => (
                      <li
                        key={i}
                        className="flex items-center"
                      >
                        <input
                          type="checkbox"
                          id={`loc-${i}`}
                          checked={searchInput.selectedLocations.includes(
                            loc
                          )}
                          onChange={() =>
                            handleLocationToggle(loc)
                          }
                          className="
                            h-4
                            w-4

                            accent-blue-500

                            cursor-pointer
                          "
                        />

                        <label
                          htmlFor={`loc-${i}`}
                          className="
                            ml-2

                            text-gray-700
                            dark:text-gray-300

                            cursor-pointer
                          "
                        >
                          {loc}
                        </label>
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* ================= JOB CARDS ================= */}

          <div className="lg:w-3/4">
            {/* عنوان */}
            <div className="mb-6">
              <h1 className="
                text-2xl
                font-bold

                text-gray-700
                dark:text-gray-100

                capitalize

                mb-2
              ">
                {category === "all"
                  ? "آخرین شغل‌ها"
                  : `شغل‌های ${
                      category === "it"
                        ? "فناوری اطلاعات"
                        : category === "marketing"
                        ? "بازاریابی"
                        : "دیگر"
                    }`}

                {filteredJobs.length > 0 && (
                  <span className="
                    ml-2

                    text-gray-500
                    dark:text-gray-400

                    text-lg
                  ">
                    (
                    {filteredJobs.length}{" "}
                    {filteredJobs.length === 1
                      ? "شغل"
                      : "شغل‌ها"}
                    )
                  </span>
                )}
              </h1>

              <p className="
                text-gray-600
                dark:text-gray-400
              ">
                شغل مورد نظر خود را از کارفرما های برتر
                پیدا کنید
              </p>
            </div>

            {/* لیست شغل‌ها */}
            <motion.div
              variants={SlideUp(0.5)}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {paginatedJobs.length > 0 ? (
                paginatedJobs.map((job, i) => (
                  <JobCard
                    key={job._id || i}
                    job={job}
                  />
                ))
              ) : (
                <div className="
                  text-center

                  bg-white
                  dark:bg-[#1f2937]

                  p-6

                  border
                  border-gray-200
                  dark:border-[#3f4245]

                  rounded-md
                ">
                  <h3 className="
                    text-lg
                    font-semibold

                    text-gray-800
                    dark:text-gray-100

                    mb-1
                  ">
                    شغلی یافت نشد!
                  </h3>

                  <p className="
                    text-gray-500
                    dark:text-gray-400

                    mb-3
                  ">
                    سعی کنید فیلترهای جستجو را تنظیم کنید
                  </p>

                  <button
                    onClick={clearAllFilters}
                    className="
                      px-4
                      py-2

                      bg-blue-500
                      hover:bg-blue-600

                      text-white

                      rounded-md

                      transition
                    "
                  >
                    پاک کردن تمام فلتر ها!
                  </button>
                </div>
              )}
            </motion.div>

            {/* ================= PAGINATION ================= */}

            {totalPages > 1 && (
              <div className="
                flex
                justify-center
                items-center

                gap-2

                mt-8

                flex-wrap
              ">
                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.max(prev - 1, 1)
                    )
                  }
                  disabled={currentPage === 1}
                  className="
                    p-2

                    border
                    border-gray-300
                    dark:border-[#4a4d50]

                    rounded-md

                    bg-white
                    dark:bg-[#1f2937]

                    text-gray-700
                    dark:text-gray-300

                    hover:bg-gray-100
                    dark:hover:bg-[#272b2f]

                    disabled:opacity-50

                    transition
                  "
                >
                  <ChevronLeft size={20} />
                </button>

                {/* شماره صفحات */}
                {Array.from(
                  { length: totalPages },
                  (_, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setCurrentPage(i + 1)
                      }
                      className={`
                        w-10
                        h-10

                        rounded-md

                        border

                        text-center

                        cursor-pointer

                        transition

                        ${
                          currentPage === i + 1
                            ? `
                              bg-blue-50
                              dark:bg-blue-900/30

                              text-blue-500
                              dark:text-blue-400

                              border-blue-300
                              dark:border-blue-500
                            `
                            : `
                              bg-white
                              dark:bg-[#1f2937]

                              border-gray-300
                              dark:border-[#4a4d50]

                              text-gray-700
                              dark:text-gray-300

                              hover:bg-gray-100
                              dark:hover:bg-[#272b2f]
                            `
                        }
                      `}
                    >
                      {i + 1}
                    </button>
                  )
                )}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        Math.min(
                          prev + 1,
                          totalPages
                        )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="
                    p-2

                    border
                    border-gray-300
                    dark:border-[#4a4d50]

                    rounded-md

                    bg-white
                    dark:bg-[#1f2937]

                    text-gray-700
                    dark:text-gray-300

                    hover:bg-gray-100
                    dark:hover:bg-[#272b2f]

                    disabled:opacity-50

                    transition
                  "
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </section>

      <Footer />
    </>
  );
}

export default AllJobs;