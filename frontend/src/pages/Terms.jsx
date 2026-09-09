import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from "framer-motion";
import { SlideLeft, SlideUp } from "../utils/Animation";

const terms = [
  {
    id: 1,
    title: "پذیرش قوانین و شرایط",
    description:
      "با استفاده از وب‌سایت افغان جاب، شما می‌پذیرید که این قوانین و شرایط را مطالعه کرده و با تمام موارد آن موافق هستید. اگر با بخشی از این شرایط موافق نیستید، لطفاً از خدمات وب‌سایت استفاده نکنید.",
  },
  {
    id: 2,
    title: "ثبت‌نام و ایجاد حساب کاربری",
    description:
      "برای استفاده از برخی خدمات افغان جاب، ممکن است نیاز به ایجاد حساب کاربری داشته باشید. شما مسئول ارائه معلومات درست و به‌روز هستید و باید معلومات حساب خود را محفوظ نگه دارید.",
  },
  {
    id: 3,
    title: "مسئولیت کاربران",
    description:
      "کاربران باید از وب‌سایت به شکل قانونی و مسئولانه استفاده کنند. وارد کردن معلومات نادرست، نشر آگهی‌های جعلی، فریب کاربران، ایجاد مزاحمت و استفاده نادرست از خدمات وب‌سایت مجاز نیست.",
  },
  {
    id: 4,
    title: "آگهی‌های کاری",
    description:
      "کارفرمایان مسئول صحت معلومات مربوط به فرصت‌های کاری، شرایط استخدام، معاش، محل کار و سایر معلوماتی هستند که در آگهی‌های خود منتشر می‌کنند. افغان جاب مسئولیت صحت یا نتیجه نهایی استخدام را بر عهده نمی‌گیرد.",
  },
  {
    id: 5,
    title: "درخواست‌های کاری",
    description:
      "ارسال درخواست برای یک فرصت کاری به معنی تضمین استخدام نیست. تصمیم نهایی در مورد بررسی درخواست، مصاحبه و استخدام مربوط به کارفرما است.",
  },
  {
    id: 6,
    title: "معلومات شخصی کاربران",
    description:
      "ما تلاش می‌کنیم معلومات کاربران را با روش‌های مناسب محافظت کنیم. کاربران نیز باید هنگام وارد کردن معلومات شخصی، به‌خصوص معلومات تماس و اسناد کاری، دقت لازم را داشته باشند.",
  },
  {
    id: 7,
    title: "استفاده از محتوای وب‌سایت",
    description:
      "محتوا، طراحی، لوگو و سایر بخش‌های وب‌سایت نباید بدون اجازه برای اهداف تجاری یا استفاده‌های غیرمجاز کپی، تغییر یا بازنشر شود.",
  },
  {
    id: 8,
    title: "تغییر در قوانین و شرایط",
    description:
      "افغان جاب می‌تواند در صورت نیاز این قوانین و شرایط را تغییر یا به‌روزرسانی کند. ادامه استفاده از وب‌سایت پس از تغییر شرایط به معنی پذیرفتن نسخه جدید قوانین و شرایط خواهد بود.",
  },
  {
    id: 9,
    title: "محدودیت مسئولیت",
    description:
      "افغان جاب یک بستر برای ارتباط میان کارجویان و کارفرمایان است. ما استخدام، پرداخت معاش یا انجام معامله میان کارجو و کارفرما را تضمین نمی‌کنیم و کاربران باید قبل از هرگونه توافق، معلومات لازم را بررسی کنند.",
  },
  {
    id: 10,
    title: "تماس با ما",
    description:
      "اگر در مورد قوانین و شرایط، حساب کاربری یا استفاده از خدمات افغان جاب پرسشی دارید، می‌توانید از طریق راه‌های ارتباطی موجود در وب‌سایت با ما تماس بگیرید.",
  },
];

const Terms = () => {
  return (
    <>
      <Navbar />

      <section
        dir="rtl"
        className="
          max-w-4xl
          mx-auto

          px-4
          sm:px-6
          lg:px-8

          py-12

          text-right
        "
      >
        {/* عنوان صفحه */}
        <div className="text-center mb-12">
          <motion.h1
            variants={SlideUp(0.3)}
            initial="hidden"
            animate="visible"
            className="
              text-3xl
              md:text-4xl

              font-semibold

              text-gray-700
              dark:text-gray-100

              mb-4
            "
          >
            قوانین و شرایط
          </motion.h1>

          <motion.p
            variants={SlideUp(0.4)}
            initial="hidden"
            animate="visible"
            className="
              text-gray-600
              dark:text-gray-400

              max-w-2xl
              mx-auto

              leading-relaxed
            "
          >
            لطفاً پیش از استفاده از خدمات افغان جاب، قوانین و شرایط زیر را با
            دقت مطالعه کنید.
          </motion.p>
        </div>

        {/* قوانین و شرایط */}
        <div>
          {terms.map((term) => (
            <motion.div
              variants={SlideLeft(0.3)}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              key={term.id}
              className="
                border
                border-gray-200
                dark:border-[#3f4245]

                bg-white
                dark:bg-[#1f2937]

                rounded-lg

                hover:bg-gray-50
                dark:hover:bg-[#272b2f]

                transition-colors
                duration-200

                mb-5
              "
            >
              <div className="p-6 md:p-8">

                {/* عنوان قانون */}
                <h2
                  className="
                    text-xl
                    md:text-2xl

                    font-semibold

                    text-gray-700
                    dark:text-gray-100

                    mb-4

                    flex
                    items-start

                    gap-3
                  "
                >
                  <span className="text-blue-600 dark:text-blue-400 shrink-0">
                    {term.id}.
                  </span>

                  <span>{term.title}</span>
                </h2>

                {/* توضیحات */}
                <div
                  className="
                    text-gray-600
                    dark:text-gray-400

                    leading-relaxed

                    pr-8
                  "
                >
                  <p>{term.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* اطلاعیه حقوقی */}
        <motion.div
          variants={SlideUp(0.3)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="
            mt-12

            bg-blue-50
            dark:bg-blue-950/30

            rounded-lg

            p-6

            border
            border-blue-100
            dark:border-blue-900/50
          "
        >
          <h3
            className="
              text-lg
              font-medium

              text-blue-800
              dark:text-blue-300

              mb-3
            "
          >
            اطلاعیه مهم
          </h3>

          <p
            className="
              text-blue-700
              dark:text-blue-300

              leading-relaxed
            "
          >
            با استفاده از خدمات افغان جاب، شما می‌پذیرید که قوانین و شرایط
            فوق را رعایت کنید. در صورت عدم موافقت با هر یک از این شرایط،
            لطفاً از خدمات وب‌سایت استفاده نکنید.
          </p>
        </motion.div>
      </section>

      <Footer />
    </>
  );
};

export default Terms;