import React, { useState } from "react";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";

// Images
import client1 from "../../assets/client/clients1.jpg";
import client2 from "../../assets/client/clients2.jpg";
import client3 from "../../assets/client/clients3.jpg";
import client4 from "../../assets/client/clients4.jpg";
import client5 from "../../assets/client/clients5.jpg";
import client6 from "../../assets/client/clients6.jpg";
import client7 from "../../assets/client/clients7.jpg";
import client8 from "../../assets/client/clients8.jpg";
import client10 from "../../assets/client/clients10.jpg";
import client11 from "../../assets/client/clients11.jpg";
import client12 from "../../assets/client/clients12.jpg";
import client13 from "../../assets/client/clients13.jpg";

import dirham from "../../assets/dirham-logo.svg"

const clientImages = [client1, client2, client3, client4, client5, client6, client7,
  client8, client10, client11, client12, client13];

// Animation Variants
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 120,
      damping: 18,
    },
  },
};

// Image Loader
const OptimizedImage = ({ src, alt }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 to-slate-200 animate-pulse rounded-xl" />
      )}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-contain transition-all duration-700 ease-out ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        loading="lazy"
      />
    </div>
  );
};



// Card Component
const ClientCard = ({ src, index }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useTransform(y, [-40, 40], [8, -8]);
  const rotateY = useTransform(x, [-40, 40], [-8, 8]);

  const smoothX = useSpring(rotateX, { stiffness: 250, damping: 22 });
  const smoothY = useSpring(rotateY, { stiffness: 250, damping: 22 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
  };

  return (
    <motion.div
      variants={itemVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{
        rotateX: smoothX,
        rotateY: smoothY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className="group"
    >
      <div
        className="h-32 w-full flex items-center justify-center p-2 rounded-xl
                   bg-white/80 backdrop-blur-sm border border-slate-100 
                   shadow-sm transition-all duration-400
                   hover:shadow-lg hover:-translate-y-0.5 hover:bg-white
                   hover:border-violet-200 cursor-pointer"
      >
        <OptimizedImage
          src={src}
          alt={`Client ${index + 1}`}
        />
      </div>
    </motion.div>
  );
};

const ClientsSection = () => {
  return (
    <section className="relative py-3 bg-gradient-to-b from-white via-slate-50 to-slate-100 overflow-hidden">
      {/* Animated backgrounds (unchanged) */}
      <motion.div className="absolute top-0 left-0 w-[600px] h-[600px] bg-violet-400/10 rounded-full blur-3xl" animate={{ x: [0, 70, 0], y: [0, 40, 0] }} transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-400/10 rounded-full blur-3xl" animate={{ x: [0, -70, 0], y: [0, -40, 0] }} transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-amber-400/5 rounded-full blur-3xl" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 container mx-auto px-4  md:px-6">
        {/* Header (unchanged) */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-5 tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            <span className="block text-slate-500">Powerful Partnerships</span>
            <span className="block bg-gradient-to-r from-slate-500 via-blue-600 to-amber-500 bg-clip-text text-transparent pb-5">Driving Innovation Forward</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">We collaborate with top companies worldwide to deliver outstanding digital solutions that transform businesses.</p>
        </motion.div>

        {/* Clients grid (unchanged) */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 md:gap-5 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {clientImages.map((src, i) => (<ClientCard key={i} src={src} index={i} />))}
        </motion.div>

        {/* ========== STATS SECTION - 2 COLUMNS ON MOBILE, ROW ON DESKTOP ========== */}
        <motion.div
          className="mt-10 mb-10 grid grid-cols-2 md:flex md:flex-row justify-center items-center gap-6 md:gap-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {[
         {
    number: "Proudly Made in UAE",
    icon: (
      <div className="w-10 h-10 flex items-center justify-center">
        <svg viewBox="0 0 900 600" className="w-8 h-8">
          <rect width="200" height="600" fill="#FF0000" />
          <rect x="200" width="700" height="200" fill="#00732F" />
          <rect x="200" y="200" width="700" height="200" fill="#FFFFFF" />
          <rect x="200" y="400" width="700" height="200" fill="#000000" />
        </svg>
      </div>
    ),
  },
  {
    number: "No MOQ",
    icon: <span className="text-2xl leading-none">📦</span>,
  },
  {
  number: "Competitive Pricing",
    icon: (
      <img
        src={dirham}
        alt="icon"
        className="w-8 h-8 object-contain"
      />
    ),
  },
  {
    number: "24/7 Virtual Assistance",
    icon: <span className="text-2xl leading-none">⏰</span>,
  },
          ].map((item, i, arr) => (
            <div key={i} className="text-center group relative flex flex-col items-center">
              <div className="text-2xl mb-1 opacity-70 group-hover:opacity-100 transition-opacity">
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold bg-gradient-to-r from-slate-700 to-slate-800 bg-clip-text text-transparent whitespace-nowrap">
                {item.number}
              </h3>
              {/* Optional divider: only on desktop between items */}
              {i !== arr.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -translate-y-1/2 -right-5 w-px h-6 bg-slate-200" />
              )}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default ClientsSection;