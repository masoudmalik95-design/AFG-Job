import React from "react";
import { assets } from "../assets/assets";
import { CheckCheck } from "lucide-react";
import CountUp from "react-countup";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";

const Counter = () => {
  return (
    <section>
      {/* Main Content Section */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch gap-8 mb-6">
        {/* Image Container */}
        <div className="lg:w-[50%] lg:h-[400px] w-full flex">
          <motion.img
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ stiffness: 90, delay: 0.1 }}
            src={assets.counter_image}
            alt="مردم باهم کار میکنند"
            className="w-full h-full object-cover rounded-lg shadow-lg"
          />
        </div>

        {/* Content Container */}
        <div className="w-full lg:w-[50%] flex flex-col justify-center">
          <div className="py-6 lg:py-0 lg:px-8">
            <motion.h1
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
            >
              در میان میلیون ها شغل {" "}
              <span className="text-blue-600">یک فرصت مناسب </span> برای شما
            </motion.h1>
            <motion.p
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              className="text-lg text-gray-600 mb-8"
            >
              شغل مناست  خود را پیدا کنید و قدم بعدی را در مسیر حرفه ای تان بردارید
            </motion.p>
            <motion.ul
              variants={SlideUp(0.5)}
              initial="hidden"
              whileInView="visible"
              className="space-y-4 mb-8"
            >
              <li className="flex items-start gap-3">
                <CheckCheck className="text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">
                  فرصت های شغلی متنوع
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCheck className="text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">
                  جستجوی سریع وآسان
                </span>
              </li>
              <li className="flex items-start gap-3">
                <CheckCheck className="text-green-500 flex-shrink-0 mt-1" />
                <span className="text-gray-700">
                  پیدا کردن شغل متناسب با مهارت های شما
                </span>
              </li>
            </motion.ul>
            <motion.button
              variants={SlideUp(0.6)}
              initial="hidden"
              whileInView="visible"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg transition-colors "
            >
              شروع کنید
            </motion.button>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-8">
        <div className="text-center p-4">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            <CountUp
              start={1}
              end={0}
              duration={3}
              enableScrollSpy={true}
              scrollSpyOnce={false}
            />
            <span>K</span>
          </div>
          <span className="text-gray-600">کاربران فعال روزانه</span>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            <CountUp
              start={1}
              end={0}
              duration={3}
              enableScrollSpy={true}
              scrollSpyOnce={false}
              suffix="+"
            />
          </div>
          <span className="text-gray-600">موقیعت شغلی موجود</span>
        </div>
        <div className="text-center p-4">
          <div className="text-4xl font-bold text-blue-600 mb-2">
            <CountUp
              start={1}
              end={0}
              duration={3}
              enableScrollSpy={true}
              scrollSpyOnce={false}
              suffix="+"
            />
          </div>
          <span className="text-gray-600">داستان های به اشتراک گذاشته شده </span>
        </div>
      </div>
    </section>
  );
};

export default Counter;
