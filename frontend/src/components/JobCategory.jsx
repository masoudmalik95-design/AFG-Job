import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { categoryIcon } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideLeft } from "../utils/Animation";

const JobCategory = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const navigate = useNavigate();

  const handleClick = useCallback(
    (index, name) => {
      setActiveIndex(index);

      setTimeout(() => {
        setActiveIndex(null);
      }, 150);

      navigate(`/all-jobs/${encodeURIComponent(name)}`);
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  return (
    <section className="mt-24">
      {/* عنوان */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-2">
          مشاغل مورد توجه
        </h1>

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          دسته های کاری برتر را که متناسب با مهارت ها و اهداف کاری شما هستند،
          پیدا کنید
        </p>
      </div>

      {/* دسته‌بندی‌ها */}
      <motion.div
        variants={SlideLeft(0.3)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-6"
      >
        {Array.isArray(categoryIcon) &&
          categoryIcon.map((icon, index) => {
            const isActive = activeIndex === index;

            return (
              <div
                key={index}
                onClick={() => handleClick(index, icon.name)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleClick(index, icon.name);
                  }
                }}
                tabIndex={0}
                role="button"
                aria-pressed={isActive}
                className={`
                  relative group

                  bg-white dark:bg-[#1f2937]

                  p-4 md:p-6

                  rounded-lg md:rounded-md

                  border border-gray-100
                  dark:border-[#35383b]

                  hover:border-gray-200
                  dark:hover:border-[#4a4d50]

                  shadow
                  dark:shadow-black/20

                  hover:shadow-md

                  cursor-pointer

                  transition-all duration-200

                  flex flex-col
                  items-center
                  text-center

                  ${
                    isActive
                      ? "scale-[0.98] bg-blue-50 dark:bg-gray-700 border-blue-200 dark:border-blue-500"
                      : ""
                  }
                `}
              >
                {/* آیکن */}
                <div
                  className="
                    bg-blue-50
                    dark:bg-gray-700

                    p-3

                    rounded-full

                    mb-3 md:mb-4

                    transition-transform

                    group-hover:scale-105
                  "
                >
                  <img
                    className="w-7 h-7 md:w-8 md:h-8"
                    src={icon.icon}
                    alt={icon.name}
                    title={icon.name}
                    loading="lazy"
                  />
                </div>

                {/* نام دسته */}
                <span className="font-medium text-gray-700 dark:text-gray-200 text-sm">
                  {icon.name}
                </span>
              </div>
            );
          })}
      </motion.div>
    </section>
  );
};

export default JobCategory;