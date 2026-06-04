import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Users, Globe, Leaf, Sparkles } from "lucide-react";

// Animated Counter Component
const AnimatedCounter = ({ target, suffix = "+", label, startCounting }) => {
  const [count, setCount] = useState(0);
  const animatedRef = useRef(false);
  const animationRef = useRef(null);

  useEffect(() => {
    if (startCounting && !animatedRef.current && target > 0) {
      animatedRef.current = true;
      const startTime = performance.now();
      const duration = 1500;

      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / duration);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);
        const currentCount = Math.floor(easeOutQuad * target);
        setCount(currentCount);

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          setCount(target);
          animationRef.current = null;
        }
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [startCounting, target]);

  return (
    <>
      <div className="text-2xl md:text-3xl font-extrabold text-indigo-600 tracking-tight">
        {count}
        {suffix}
      </div>
      <div className="text-xs text-slate-500 mt-0.5 font-medium">
        {label}
      </div>
    </>
  );
};

// Data definitions (unchanged)
const values = [
  {
    icon: CheckCircle,
    title: "Quality Assurance",
    description:
      "Every product is rigorously tested to meet international hospitality standards.",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  {
    icon: Users,
    title: "Client-First Approach",
    description:
      "Dedicated account managers ensure personalized service for every client.",
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Serving hospitality businesses across 30+ countries with reliable logistics.",
    color: "text-teal-600",
    bgColor: "bg-teal-50",
    borderColor: "border-teal-200",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Growing range of eco-friendly products to help you meet green hospitality goals.",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
];

const About = () => {
  const statsData = [
    { target: 150, label: "Happy Customer" },
    { target: 100, label: "Supply Brands" },
    { target: 400, label: "Products" },
    { target: 50, label: "Projects Completed" },
  ];

  const statsRef = useRef(null);
  const [statsVisible, setStatsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !statsVisible) {
          setStatsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsVisible]);

  return (
    <main className="min-h-screen bg-white font-sans text-slate-700 antialiased overflow-hidden">
      {/* Hero Header */}
      <section
        id="about"
        className="relative pt-12 pb-4 md:pt-20 md:pb-6 bg-gradient-to-b from-slate-50 to-white"
      >
        <div className="container mx-auto px-4 text-center">
          <motion.span
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-block px-3 py-1 mb-4 text-xs font-semibold tracking-wider text-indigo-600 uppercase bg-indigo-100 rounded-full"
          >
            About Our Company
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-indigo-700 via-slate-800 to-indigo-600 bg-clip-text text-transparent"
          >
            Redefining Hospitality <br className="hidden md:block" />
            Standards
          </motion.h1>

          {/* Tagline – wraps on mobile, single line on desktop */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-full mx-auto text-sm sm:text-base md:text-lg text-slate-500 whitespace-normal md:whitespace-nowrap px-2"
          >
            Your trusted partner for premium supplies, delivering excellence across continents.
          </motion.p>
        </div>

        {/* Decorative Background Blurs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-100 rounded-full filter blur-3xl opacity-30 -z-10"></div>
      </section>

      {/* Main Story Section – tight spacing */}
      <section className="container mx-auto py-2 md:py-0 px-4">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 space-y-4"
          >
            <div className="space-y-4 text-slate-600 leading-relaxed text-base md:text-lg">
              <p className="first-letter:text-4xl first-letter:font-bold first-letter:text-indigo-600 first-letter:mr-2 first-letter:float-left first-letter:mt-1">
                Formerly known as Neom Hospitality Supplies LLC, we have been a
                reliable name in the UAE's hospitality supply industry. With
                years of experience, we are a trusted wholesale & retail
                supplier for hotels, resorts, hospitals, restaurants, and
                various businesses.
              </p>

              {/* Highlight Box */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="border-l-4 border-indigo-500 pl-4 py-2 bg-indigo-50/50 rounded-r-xl my-4 flex gap-3 items-start"
              >
                <Sparkles className="w-6 h-6 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-xl text-slate-900 leading-tight mb-0.5">
                    Turnkey OS&E Providers With B2B/B2C Offerings
                  </h3>
                  <p className="text-sm text-slate-500">
                    Operating across the GCC & Africa region.
                  </p>
                </div>
              </motion.div>

              <p>
                Our local production facility, expedited export to the GCC
                Region, and commitment to client satisfaction make us a reliable
                one-stop solution. At Neom, we prioritize quality, innovation,
                and long-term partnerships.
              </p>
            </div>

            {/* Stats Grid */}
            <div
              ref={statsRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 pt-4 border-t border-slate-200"
            >
              {statsData.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 + 0.4 }}
                  className="text-center"
                >
                  <AnimatedCounter
                    target={stat.target}
                    suffix="+"
                    label={stat.label}
                    startCounting={statsVisible}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Image Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative z-10 rounded-xl overflow-hidden shadow-xl border-2 border-white">
              <motion.img
                src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop"
                alt="Luxury resort pool"
                className="w-full h-auto object-cover aspect-[4/3]"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.7 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
            </div>
            <motion.div
              initial={{ rotate: 0 }}
              whileInView={{ rotate: 2 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="absolute -bottom-3 -right-3 w-full h-full bg-indigo-100 rounded-xl z-0"
            ></motion.div>
          </motion.div>
        </div>
      </section>
    </main>
  );
};

export default About;