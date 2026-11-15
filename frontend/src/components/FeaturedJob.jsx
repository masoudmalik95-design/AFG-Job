
import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";
import JobCard from "./JobCard";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";

const FeaturedJob = () => {
  const { jobs, jobLoading } = useContext(AppContext);
  const navigate = useNavigate();

  return (
    <section className="mt-24 w-full px-[5%]">
      {/* عنوان */}
      <div className="mb-10 text-center">
        <h1 className="mb-2 text-3xl font-bold text-gray-700 dark:text-gray-100">
          مشاغل پیشنهادی
        </h1>

        <p className="mx-auto max-w-2xl text-gray-600 dark:text-gray-400">
          ارزش خود را بدانید و کاری را پیدا کنید که شایسته زندگی و توانایی های
          شما باشد.
        </p>
      </div>

      {/* Loading */}
      {jobLoading ? (
        <div className="mt-10 flex items-center justify-center">
          <Loader />
        </div>
      ) : !Array.isArray(jobs) || jobs.length === 0 ? (
        <p className="text-center text-gray-500 dark:text-gray-400">
          هیچ شغلی پیدا نشد
        </p>
      ) : (
        <>
          {/* لیست مشاغل */}
          <motion.div
            variants={SlideUp(0.5)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="
              mx-auto
              grid
              w-full
              max-w-6xl
              grid-cols-1
              gap-5
              md:grid-cols-2
            "
          >
            {[...jobs]
              .reverse()
              .slice(0, 6)
              .map((job, index) => (
                <JobCard
                  job={job}
                  key={job._id || job.id || index}
                />
              ))}
          </motion.div>

          {/* دکمه See More */}
          <motion.div
            variants={SlideUp(0.6)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <button
              onClick={() => {
                navigate("/all-jobs/all");
                window.scrollTo(0, 0);
              }}
              className="
                cursor-pointer
                rounded-md
                bg-blue-600
                px-8
                py-2.5
                text-white
                transition
                duration-200
                hover:bg-blue-700
              "
            >
              See more
            </button>
          </motion.div>
        </>
      )}
    </section>
  );
};

export default FeaturedJob;
