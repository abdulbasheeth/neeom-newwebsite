import React, { useState, useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { ScrollReveal } from "../Ui/scroll-reveal";

// Your imports remain the same
import brand4 from "../../assets/brands/brands4.jpg";
import brand6 from "../../assets/brands/brands6.jpg";
import brand7 from "../../assets/brands/brands7.jpg";
import brand8 from "../../assets/brands/brands8.jpg";
import brand9 from "../../assets/brands/brands9.jpg";
import brand10 from "../../assets/brands/brands10.jpg";
import brand11 from "../../assets/brands/brands11.jpg";
import brand13 from "../../assets/brands/brands13.jpg";

const brands = [
  { id: 1, src: brand4, name: "Brand 4" },
  { id: 2, src: brand6, name: "Brand 6" },
  { id: 3, src: brand7, name: "Brand 7" },
  { id: 4, src: brand8, name: "Brand 8" },
  { id: 5, src: brand9, name: "Brand 9" },
  { id: 6, src: brand10, name: "Brand 10" },
  { id: 7, src: brand11, name: "Brand 11" },
  { id: 8, src: brand13, name: "Brand 13" },
];

const loopBrands = [...brands, ...brands];

const BrandsSection = () => {
  const controls = useAnimation();
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: ["0%", "-50%"],
        transition: {
          ease: "linear",
          duration: 25,
          repeat: Infinity,
          repeatType: "loop",
          repeatDelay: 0,
        },
      });
    }
  }, [isPaused, controls]);

  return (
    <section className="relative py-2 md:py-5 overflow-hidden bg-white">
      {/* Header */}
      <div className="text-center px-6">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold pt-5">
            <span className="bg-gradient-to-r from-[#0B2B5B] via-[#1A4A7A] to-[#0B2B5B] bg-clip-text text-transparent">
              Where Innovation Meets
            </span>
            <br />
            <span className="text-[#00A3AD] italic font-black">
              Excellence
            </span>
          </h2>
        </ScrollReveal>
      </div>

      {/* Carousel */}
      <div
        className="relative overflow-hidden rounded-[40px]"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Gradient Fade Mask – pure white edges */}
        <div
          className="pointer-events-none absolute inset-0 z-10
          [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]
          [-webkit-mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
        />

        {/* Curved edge effect – pure white gradients */}
        <div className="absolute inset-0 pointer-events-none z-10">
          <div className="absolute left-0 top-0 h-full w-24 bg-gradient-to-r from-white to-transparent rounded-l-[50%]" />
          <div className="absolute right-0 top-0 h-full w-24 bg-gradient-to-l from-white to-transparent rounded-r-[50%]" />
        </div>

        {/* Moving Track */}
        <motion.div
          className="flex gap-8 py-10"
          animate={controls}
          initial={{ x: "0%" }}
        >
          {loopBrands.map((brand, idx) => (
            <div
              key={`${brand.id}-${idx}`}
              className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 flex items-center justify-center group"
            >
              <img
                src={brand.src}
                alt={brand.name}
                className="w-full h-full object-contain transition-all duration-500 group-hover:scale-110 drop-shadow-md group-hover:drop-shadow-xl"
                loading="lazy"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BrandsSection;