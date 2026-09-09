import React from "react";
import Counter from "../components/Counter";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import Testimonials from "../components/Testimonials";
import { assets } from "../assets/assets";
import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "../utils/Animation";

const About = () => {
  return (
    <>
      <Navbar />

      <section
        dir="rtl"
        className="
          transition-colors
          duration-300

          text-right
        "
      >
        {/* ================= Counter ================= */}
        <Counter />

        {/* ================= About Section ================= */}
        <div className="mt-16">
          <motion.h1
            variants={SlideUp(0.3)}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="
              text-3xl
              md:text-4xl

              font-semibold

              mb-8

              text-center

              text-gray-700
              dark:text-gray-100
            "
          >
            درباره افغان جاب
          </motion.h1>

          <div
            className="
              max-w-4xl

              text-center

              mx-auto

              space-y-6

              text-gray-600
              dark:text-gray-400
            "
          >
            <motion.p
              variants={SlideUp(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                leading-relaxed
              "
            >
              افغان جاب یک بستر آنلاین برای پیدا کردن فرصت‌های کاری و ارتباط
              میان کارجویان و کارفرمایان در افغانستان است. هدف ما این است که
              جستجوی کار را برای کارجویان ساده‌تر و دسترسی کارفرمایان به افراد
              بااستعداد را آسان‌تر بسازیم.
            </motion.p>

            <motion.p
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                text-lg

                leading-relaxed
              "
            >
              ما تلاش می‌کنیم با فراهم کردن فرصت‌های کاری متنوع، جستجوی ساده و
              سریع و امکانات مناسب برای کارجویان و کارفرمایان، گام مثبتی در
              راستای توسعه بازار کار افغانستان برداریم.
            </motion.p>
          </div>
        </div>

        {/* ================= Testimonials ================= */}
        <Testimonials />

        {/* ================= How It Works ================= */}
        <div className="mt-24">
          {/* عنوان */}
          <div className="text-center mb-12">
            <motion.h1
              variants={SlideUp(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                text-3xl
                md:text-4xl

                font-semibold

                text-gray-800
                dark:text-gray-100

                mb-3
              "
            >
              چگونه کار می‌کند؟
            </motion.h1>

            <motion.p
              variants={SlideUp(0.4)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                text-lg

                text-gray-500
                dark:text-gray-400
              "
            >
              پیدا کردن کار برای همه، در هر جا
            </motion.p>
          </div>

          {/* ================= Steps ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

            {/* Step 1 */}
            <motion.div
              variants={SlideLeft(0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                bg-white
                dark:bg-[#242526]

                p-8

                rounded-xl

                border
                border-gray-100
                dark:border-[#3f4245]

                shadow-md
                dark:shadow-black/20

                hover:shadow-lg

                dark:hover:border-[#4a4d50]

                transition-all
                duration-300

                text-center
              "
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_1}
                  alt="ارزیابی رزومه"
                  className="h-16 w-16 object-contain"
                />
              </div>

              <h3
                className="
                  text-xl

                  font-semibold

                  mb-4

                  text-gray-800
                  dark:text-gray-100
                "
              >
                بررسی رایگان رزومه
              </h3>

              <p
                className="
                  text-gray-600
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                رزومه و معلومات کاری خود را ثبت کنید تا کارفرمایان بتوانند
                مهارت‌ها و تجربه‌های شما را بهتر مشاهده کنند.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              variants={SlideLeft(0.4)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                bg-white
                dark:bg-[#242526]

                p-8

                rounded-xl

                border
                border-gray-100
                dark:border-[#3f4245]

                shadow-md
                dark:shadow-black/20

                hover:shadow-lg

                dark:hover:border-[#4a4d50]

                transition-all
                duration-300

                text-center
              "
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_2}
                  alt="پیدا کردن شغل مناسب"
                  className="h-16 w-16 object-contain"
                />
              </div>

              <h3
                className="
                  text-xl

                  font-semibold

                  mb-4

                  text-gray-800
                  dark:text-gray-100
                "
              >
                پیدا کردن شغل مناسب
              </h3>

              <p
                className="
                  text-gray-600
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                با استفاده از فیلترها و جستجوی پیشرفته، فرصت‌های کاری متناسب
                با مهارت‌ها، تجربه و علاقه‌مندی‌های خود را پیدا کنید.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              variants={SlideLeft(0.6)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="
                bg-white
                dark:bg-[#242526]

                p-8

                rounded-xl

                border
                border-gray-100
                dark:border-[#3f4245]

                shadow-md
                dark:shadow-black/20

                hover:shadow-lg

                dark:hover:border-[#4a4d50]

                transition-all
                duration-300

                text-center
              "
            >
              <div className="flex justify-center mb-6">
                <img
                  src={assets.work_3}
                  alt="راهنمایی در مسیر کاری"
                  className="h-16 w-16 object-contain"
                />
              </div>

              <h3
                className="
                  text-xl

                  font-semibold

                  mb-4

                  text-gray-800
                  dark:text-gray-100
                "
              >
                همراهی در مسیر کاری
              </h3>

              <p
                className="
                  text-gray-600
                  dark:text-gray-400

                  leading-relaxed
                "
              >
                در مسیر پیدا کردن فرصت مناسب کاری، امکانات لازم را در اختیار
                شما قرار می‌دهیم تا با اطمینان بیشتری به سوی آینده شغلی خود
                حرکت کنید.
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default About;