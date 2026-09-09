import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-[#3f4245] mt-20 py-5 transition-colors duration-300">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">

        {/* Logo and Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/">
            <img
              className="w-[120px] object-contain"
              src={assets.logo}
              alt="Company Logo"
            />
          </Link>

          <span className="hidden sm:block text-gray-500 dark:text-gray-400 h-6 lg:flex items-center">
            |
          </span>

          <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base text-center sm:text-left">
            همه حقوق AFG Job محفوظ است.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-6 mt-4 sm:mt-0">

          {/* Facebook */}
          <a
            href="#"
            className="transition-transform hover:scale-110"
            aria-label="Facebook"
          >
            <img
              src={assets.facebook_icon}
              alt="Facebook"
              className="h-6 w-6 sm:h-8 sm:w-8 object-contain dark:brightness-0 dark:invert dark:opacity-80"
              width={32}
              height={32}
              loading="lazy"
            />
          </a>

          {/* Twitter */}
          <a
            href="#"
            className="transition-transform hover:scale-110"
            aria-label="Twitter"
          >
            <img
              src={assets.twitter_icon}
              alt="Twitter"
              className="h-6 w-6 sm:h-8 sm:w-8 object-contain dark:brightness-0 dark:invert dark:opacity-80"
              width={32}
              height={32}
              loading="lazy"
            />
          </a>

          {/* Instagram */}
          <a
            href="#"
            className="transition-transform hover:scale-110"
            aria-label="Instagram"
          >
            <img
              src={assets.instagram_icon}
              alt="Instagram"
              className="h-6 w-6 sm:h-8 sm:w-8 object-contain dark:brightness-0 dark:invert dark:opacity-80"
              width={32}
              height={32}
              loading="lazy"
            />
          </a>

        </div>
      </div>
    </footer>
  );
};

export default Footer;