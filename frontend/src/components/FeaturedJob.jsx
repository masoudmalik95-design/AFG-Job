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
    <section className="mt-24">
      {/* عنوان */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-700 dark:text-gray-100 mb-2">
          مشاغل پیشنهادی
        </h1>

        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          ارزش خود را بدانید و کاری را پیدا کنید که شایسته زندگی و توانایی های
          شما باشد.
        </p>
      </div>

      {/* Loading */}
      {jobLoading ? (
        <div className="flex items-center justify-center mt-10">
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
            className="grid gap-4 grid-cols-1 md:grid-cols-2"
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
            className="text-center mt-12"
          >
            <button
              onClick={() => {
                navigate("/all-jobs/all");
                window.scrollTo(0, 0);
              }}
              className="
                bg-blue-600
                hover:bg-blue-700

                dark:bg-blue-600
                dark:hover:bg-blue-700

                text-white

                px-8
                py-2.5

                rounded-md

                transition
                duration-200

                cursor-pointer
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