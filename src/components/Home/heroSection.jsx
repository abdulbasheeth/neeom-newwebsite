import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "../Ui/button";
import { ArrowRight } from "lucide-react";
import herovideo from "../../assets/hero-video.mp4"
import { motion } from "framer-motion";

const HeroSection = () => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(e => console.log("Autoplay prevented:", e));
    }
  }, []);

  const scrollToAbout = () => {
    const aboutSection = document.getElementById("about");
    if (aboutSection) {
      const headerHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-total-height')) || 0;
      const elementPosition = aboutSection.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: elementPosition - headerHeight, behavior: "smooth" });
    }
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (i = 1) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }
    })
  };

  return (
    <section
      id="home"
      className="relative w-full flex items-center justify-center overflow-hidden bg-slate-900 mt-10"
      style={{
        boxSizing: 'border-box',
        minHeight: '100vh',
        paddingTop: "var(--header-total-height, 0px)"
      }}
    >
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <video
          ref={videoRef}
          src={herovideo}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Gradient Overlay - ensures text is readable */}
      <div className="absolute inset-0 z-10 one" />

      {/* Main Content */}
      <div className="relative z-20 container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-4 sm:space-y-5 md:space-y-6">
          
          {/* Badge */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={0}
            className="inline-flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-md text-white/90 text-[11px] sm:text-xs font-bold tracking-widest uppercase whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse"></span>
            Trusted Hospitality Partner
          </motion.div>

          {/* Heading */}
          <motion.h1
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={1}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white drop-shadow-lg px-2 leading-tight break-words"
          >
            Premium Supplies for
            <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-200 via-sky-300 to-sky-500">
              World Class Hospitality
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={2}
            className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed font-light px-4"
          >
            From luxury guest amenities to eco-friendly packaging — everything your hotel, resort, or restaurant needs to deliver an exceptional guest experience.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            custom={3}
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 w-full px-4 sm:w-auto"
          >
            <Button 
              size="lg" 
              asChild 
              className="bg-sky-600 hover:bg-sky-500 font-bold px-8 py-6 rounded-full w-full sm:w-auto text-base shadow-lg shadow-sky-900/50 transition-all"
            >
              <Link to="/#contact">Request a Quote</Link>
            </Button>
            <Button 
              size="lg" 
              asChild 
              variant="ghost" 
              className="text-white border border-white/30 hover:bg-white/10 hover:text-white font-medium px-8 py-6 rounded-full backdrop-blur-sm w-full sm:w-auto text-base transition-all"
            >
              <Link to="/products">View Products</Link>
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - now reliably at the bottom edge of the screen */}
      <div
        className="absolute bottom-10 sm:bottom-12 left-1/2 -translate-x-1/2 cursor-pointer z-20 group pb-2 px-4"
        onClick={scrollToAbout}
        aria-label="Scroll to next section"
      >
        <div className="flex flex-col items-center gap-2 animate-move-up-down">
          <span className="text-white/60 text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Scroll
          </span>
          <ArrowRight className="w-6 h-6 text-white/80 group-hover:text-sky-300 transition-colors" style={{ transform: 'rotate(90deg)' }} />
        </div>
      </div>

      {/* Inline Styles for Keyframes */}
      <style>{`
        @keyframes moveUpDown {
          0% { transform: translateY(0); }
          50% { transform: translateY(10px); }
          100% { transform: translateY(0); }
        }
        .animate-move-up-down {
          animation: moveUpDown 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default HeroSection;