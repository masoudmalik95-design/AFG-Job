import heroImage from "../assets/testimonials/malik.webp";
import React, {
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

import { Search, MapPin } from "lucide-react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SlideUp } from "../utils/Animation";

const Hero = () => {
  const navigate = useNavigate();

  const titleRef = useRef(null);
  const locationRef = useRef(null);

  const { setSearchFilter, setIsSearched } = useContext(AppContext);

  // Typing Animation
  const words = ["شغلی", "کاری", "تازه"];

  const [wordIndex, setWordIndex] = useState(0);
  const [displayedWord, setDisplayedWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timeout;

    if (!isDeleting && displayedWord === currentWord) {
      timeout = setTimeout(() => {
        setIsDeleting(true);
      }, 1400);
    } else if (isDeleting && displayedWord === "") {
      setIsDeleting(false);
      setWordIndex((prev) => (prev + 1) % words.length);
    } else {
      timeout = setTimeout(() => {
        setDisplayedWord(
          currentWord.slice(
            0,
            displayedWord.length + (isDeleting ? -1 : 1)
          )
        );
      }, isDeleting ? 65 : 110);
    }

    return () => clearTimeout(timeout);
  }, [displayedWord, isDeleting, wordIndex]);

  // Search Handler
  const searchHandler = (e) => {
    e.preventDefault();

    const title = titleRef.current?.value || "";
    const location = locationRef.current?.value || "";

    setSearchFilter({
      title,
      location,
    });

    setIsSearched(true);

    if (title || location) {
      navigate("/all-jobs/all");
    }
  };

  return (
    <section
      dir="ltr"
      className="
        hero-full
        min-h-[520px]
        bg-gradient-to-r
        from-blue-50
        to-indigo-200
        dark:from-[#141821]
        dark:to-[#111820]
        overflow-hidden
      "
    >
      <div
        className="
          min-h-[520px]
          grid
          grid-cols-1
          md:grid-cols-2
          items-center
        "
      >

        {/* Left Side: Text and Search */}
        <div
          dir="rtl"
          className="
            order-2
            md:order-1
            flex
            flex-col
            justify-center
            items-start
            w-full
            py-8
            px-5
            md:px-10
            md:py-12
          "
        >
          {/* Animated Title */}
          <motion.h1
            className="
              text-3xl
              sm:text-4xl
              md:text-5xl
              font-bold
              text-gray-700
              dark:text-gray-100
              mb-5
              leading-tight
              text-right
              w-full
            "
            variants={SlideUp(0.4)}
            initial="hidden"
            animate="visible"
          >
            فرصت‌های{" "}
            <span className="text-blue-600 dark:text-blue-400">
              {displayedWord}
            </span>
            {" "}را پیدا کنید
          </motion.h1>

          {/* Description */}
          <motion.p
            className="
              text-gray-600
              dark:text-gray-300
              mb-7
              text-sm
              sm:text-base
              leading-8
              text-right
            "
            variants={SlideUp(0.4)}
            initial="hidden"
            animate="visible"
          >
            گام بزرگ بعدی در مسیر کاری تان را از همین جا آغاز کنید.
            <br />
            بهترین فرصت‌های کاری را جستجو کنید و نخستین قدم را به سوی آینده خود بردارید.
          </motion.p>

          {/* Search Form */}
          <motion.form
            onSubmit={searchHandler}
            className="
              w-full
              max-w-sm
              flex
              flex-col
              items-center
              gap-3
            "
            variants={SlideUp(0.5)}
            initial="hidden"
            animate="visible"
          >
            {/* Job Title */}
            <div
              className="
                flex
                items-center
                gap-2
                border
                border-gray-300
                dark:border-[#4a4d50]
                rounded-xl
                px-3
                py-2
                bg-white
                dark:bg-[#272b2f]
                shadow-sm
                w-full
                max-w-[300px]
              "
            >
              <Search
                size={17}
                className="text-gray-400 shrink-0"
              />

              <input
                type="text"
                name="job"
                placeholder="عنوان شغلی..."
                aria-label="عنوان شغلی"
                autoComplete="on"
                className="
                  w-full
                  outline-none
                  text-sm
                  bg-transparent
                  text-gray-800
                  dark:text-gray-100
                  placeholder-gray-500
                  text-right
                "
                ref={titleRef}
              />
            </div>

            {/* Location */}
            <div
              className="
                flex
                items-center
                gap-2
                border
                border-gray-300
                dark:border-[#4a4d50]
                rounded-xl
                px-3
                py-2
                bg-white
                dark:bg-[#272b2f]
                shadow-sm
                w-full
                max-w-[300px]
              "
            >
              <MapPin
                size={17}
                className="text-gray-400 shrink-0"
              />

              <input
                type="text"
                name="location"
                placeholder="محل کار..."
                aria-label="محل کار"
                autoComplete="on"
                className="
                  w-full
                  outline-none
                  text-sm
                  bg-transparent
                  text-gray-800
                  dark:text-gray-100
                  placeholder-gray-500
                  text-right
                "
                ref={locationRef}
              />
            </div>

            {/* Search Button */}
            <button
              type="submit"
              className="
                w-full
                max-w-[180px]
                bg-blue-500
                hover:bg-blue-600
                text-white
                font-semibold
                py-2
                px-4
                rounded-xl
                transition
                text-sm
                cursor-pointer
                flex
                items-center
                justify-center
                gap-2
              "
            >
              <Search size={16} />
              جستجوی شغل
            </button>
          </motion.form>
        </div>

        {/* Right Side: Full Width Hero Image */}
        <div
          className="
            order-1
            md:order-2
            relative
            w-full
            h-[280px]
            md:h-[520px]
            overflow-hidden
            rounded-none
            md:[clip-path:ellipse(90%_100%_at_100%_50%)]
          "
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundColor: "#cbd5e1",
          }}
        />

      </div>
    </section>
  );
};

export default Hero;
