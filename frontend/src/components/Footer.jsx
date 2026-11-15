
import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="
      mt-20
      border-t border-gray-200
      py-6
      transition-colors duration-300
      dark:border-[#3f4245]
    ">
      <div className="
        mx-auto
        flex
        w-[90%]
        max-w-7xl
        flex-col
        items-center
        justify-between
        gap-6
        md:flex-row
      ">

        {/* Logo and Copyright */}
        <div className="
          flex
          flex-col
          items-center
          gap-4
          sm:flex-row
        ">
          <Link to="/">
            <img
              className="w-[120px] object-contain"
              src={assets.logo}
              alt="AFG Job"
            />
          </Link>

          <span className="
            hidden
            h-6
            items-center
            text-gray-400
            sm:flex
          ">
            |
          </span>

          <p className="
            text-center
            text-sm
            text-gray-600
            dark:text-gray-300
            sm:text-left
          ">
            همه حقوق AFG Job محفوظ است.
          </p>
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-5">

          {/* Facebook */}
          <a
            href="https://www.facebook.com/ms.wd.mlk.zadh.146775"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
            aria-label="Facebook"
          >
            <img
              src={assets.facebook_icon}
              alt="Facebook"
              className="
                h-7 w-7
                object-contain
                dark:brightness-0
                dark:invert
                dark:opacity-80
              "
              width={32}
              height={32}
              loading="lazy"
            />
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/93780319077"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-transform hover:scale-110"
            aria-label="WhatsApp"
          >
            <img
              src={assets.whatsapp_icon}
              alt="WhatsApp"
              className="
    h-7 w-7
    object-contain
    transition-transform
  "
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
