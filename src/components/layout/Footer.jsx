import React, { useState } from 'react';
import { Link, useLocation } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowUp, Hotel, UtensilsCrossed, Sparkles, Leaf,ChevronDown, ChevronUp } from "lucide-react";
import { FaFacebook, FaInstagram, FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { motion, AnimatePresence } from "framer-motion";
import neomLogo from "../../assets/Neom-logo.jpg";

const footerLinks = [
  { label: "Home", path: "/", isHash: false },
  { label: "About", path: "/", isHash: true, elementId: "about" },
  { label: "Products", path: "/products", isHash: false },
  { label: "Contact", path: "/", isHash: true, elementId: "contact" },
];

const categoryLinks = [
  { to: "/products?category=amenities", label: "Guest Amenities & Equipments", icon: Sparkles },
  { to: "/products?category=linens", label: "Bed & Bath Linens", icon: Hotel },
  { to: "/products?category=chemicals", label: "Laundry Chemicals & Accessories", icon: UtensilsCrossed },
  { to: "/products?category=eco-bags", label: "Eco-Friendly Sustainable Bags", icon: Leaf },
  { to: "/products?category=non-woven", label: "Non Woven Bags & Covers", icon: Leaf },
  { to: "/products?category=ppe", label: "Non woven Disposable Essentials PPE", icon: Leaf },
  { to: "/products?category=promotions", label: "Promotional Give Always", icon: Sparkles },
  { to: "/products?category=cleaning", label: "Cleaning Equipments & Accessories", icon: UtensilsCrossed },
  { to: "/products?category=bins", label: "Bins & Trolleys", icon: Hotel },
  { to: "/products?category=fuel", label: "Chafing Fuel & Charcoals", icon: UtensilsCrossed },
];

// First 5 categories always visible
const initialCategories = categoryLinks.slice(0, 5);
// Remaining 5 categories
const additionalCategories = categoryLinks.slice(5, 10);

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const socialLinks = [
  {
    icon: FaFacebook,
    href: "https://www.facebook.com/people/NEOM-Hospitality-Supplies-LLC/61573944491691/?mibextid=wwXIfr&rdid=MMkn9og0fYjFn1pT&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F1QazximNZ9%2F%3Fmibextid%3DwwXIfr",
    label: "Facebook",
  },
  {
    icon: FaInstagram,
    href: "https://www.instagram.com/neomhospitalitysuppliesllc/profilecard/?igsh=MXU5dm1yb2tjb2ozNw%3D%3D",
    label: "Instagram",
  },
  {
    icon: FaLinkedin,
    href: "https://www.linkedin.com/in/neom-hospitality-supplies-llc-45809240a/",
    label: "LinkedIn",
  },
  {
    icon: FaXTwitter,
    href: "https://x.com/neomdxb?s=11 ",
    label: "Twitter",
  },
];

const Footer = () => {
  const location = useLocation();
  const [showAllCategories, setShowAllCategories] = useState(false);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNavClick = (link, e) => {
    if (!link.isHash) return;

    if (location.pathname !== "/") {
      return;
    } 
    e.preventDefault();
    
    setTimeout(() => {
      const el = document.getElementById(link.elementId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
        window.history.pushState(null, '', `#${link.elementId}`);
      }
    }, 100);
  };

  const buildHref = (link) => {
    if (link.isHash && link.path === "/") {
      return `/#${link.elementId}`;
    }
    return link.isHash ? `${link.path}#${link.elementId}` : link.path;
  };

  return (
    <footer className="relative overflow-hidden bg-slate-900">

      {/* Top Wave Divider */}
      <div className="absolute top-0 w-full h-20 -translate-y-full">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-full" preserveAspectRatio="none">
          <path
            d="M0 120C480 0 960 0 1440 120V0H0V120Z"
            className="fill-slate-900"
          />
        </svg>
      </div>

      {/* Main Footer Content */}
      <div className="relative z-10 border-t border-slate-800">

        {/* Decorative Glows */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-[#00B8DB]/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-[#00B8DB]/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-6 md:px-12 lg:px-20 py-16">
          <motion.div
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16"
          >

            {/* 1. Brand Column */}
            <motion.div variants={fadeUp} className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-5">
                <div className="bg-white p-1.5 rounded-lg shadow-md border border-slate-700">
                  <img
                    src={neomLogo}
                    alt="NEOM Logo"
                    className="h-12 w-auto object-contain"
                  />
                </div>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 pr-4">
                Crafting excellence in hospitality. Premium amenities and supplies for luxury hotels, resorts, and healthcare facilities.
              </p>
            </motion.div>

            {/* 2. Quick Links */}
            <motion.div variants={fadeUp} className="lg:pl-4">
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest relative">
                Navigation
                <span className="absolute bottom-[-8px] left-0 w-8 h-0.5 bg-[#00B8DB] rounded-full" />
              </h4>
              <ul className="space-y-3.5">
                {footerLinks.map((link) => (
                  <li key={buildHref(link)}>
                    <Link
                      to={buildHref(link)}
                      onClick={(e) => handleNavClick(link, e)}
                      className="group flex items-center text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      <span className="w-0 group-hover:w-3 h-[1.5px] bg-[#00B8DB] mr-0 group-hover:mr-2 transition-all duration-300" />
                      <span className="text-sm font-medium">{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* 3. Categories - Show first 5, then show more */}
            <motion.div variants={fadeUp}>
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest relative">
                Categories
                <span className="absolute bottom-[-8px] left-0 w-8 h-0.5 bg-[#00B8DB] rounded-full" />
              </h4>
              
              {/* First 5 Categories - Always visible */}
              <ul className="space-y-3.5 mb-3">
                {initialCategories.map((cat) => (
                  <li key={cat.to}>
                    <Link
                      to={cat.to}
                      className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors duration-300"
                    >
                      {cat.icon && (
                        <cat.icon className="h-3.5 w-3.5 text-[#00B8DB] group-hover:text-white transition-colors duration-300" />
                      )}
                      <span className="text-sm font-medium">{cat.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* Additional Categories - Animated reveal */}
              <AnimatePresence>
                {showAllCategories && (
                  <motion.ul
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="space-y-3.5 mb-3 overflow-hidden"
                  >
                    {additionalCategories.map((cat) => (
                      <motion.li
                        key={cat.to}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link
                          to={cat.to}
                          className="group flex items-center gap-3 text-slate-400 hover:text-white transition-colors duration-300"
                        >
                          {cat.icon && (
                            <cat.icon className="h-3.5 w-3.5 text-[#00B8DB] group-hover:text-white transition-colors duration-300" />
                          )}
                          <span className="text-sm font-medium">{cat.label}</span>
                        </Link>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>

              {/* Show More / Show Less Button */}
              <button
                onClick={() => setShowAllCategories(!showAllCategories)}
                className="group flex items-center gap-2 mt-2 text-xs font-medium text-[#00B8DB] hover:text-[#00B8DB]/80 transition-colors duration-300"
              >
                {showAllCategories ? (
                  <>
                    <ChevronUp className="h-3.5 w-3.5" />
                    <span>Show Less</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-3.5 w-3.5" />
                    <span>Show More Categories</span>
                  </>
                )}
              </button>
            </motion.div>

            {/* 4. Contact Info */}
            <motion.div variants={fadeUp}>
              <h4 className="text-sm font-bold text-white mb-6 uppercase tracking-widest relative">
                Contact Us
                <span className="absolute bottom-[-8px] left-0 w-8 h-0.5 bg-white/50 rounded-full" />
              </h4>
              <ul className="space-y-4">
                <li>
                  <a href="tel:+971527087748" className="group flex items-center gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-[#00B8DB] group-hover:bg-[#00B8DB] group-hover:border-[#00B8DB] group-hover:text-white transition-all duration-300 shadow-sm">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-medium">Call Us</span>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors">+971 52 708 7748</span>
                    </div>
                  </a>
                </li>
                <li>
                  <a href="mailto:neomhospitalitydxb@gmail.com" className="group flex items-center gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-[#00B8DB] group-hover:bg-[#00B8DB] group-hover:border-[#00B8DB] group-hover:text-white transition-all duration-300 shadow-sm">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-medium">Email Us</span>
                      <span className="text-sm text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">info@neomhotelsupplies.com</span>
                       <span className="text-sm text-slate-300 group-hover:text-white transition-colors whitespace-nowrap">neomhospitalitydxb@gmail.com</span>

                    
                    </div>
                  </a>
                </li>
                <li>
                  <div className="group flex items-start gap-4">
                    <span className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 text-[#00B8DB] transition-all duration-300 shadow-sm">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-500 font-medium">Location</span>
                      <span className="text-sm text-slate-300">Dubai, United Arab Emirates</span>
                    </div>
                  </div>
                </li>
              </ul>
            </motion.div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
              <p className="text-xs text-slate-500 font-medium text-center md:text-left">
                © 2024 Neom Hospitality Supplies LLC. All rights reserved.
              </p>

              {/* Social Icons */}
              <div className="flex items-center gap-3">
                {socialLinks.map(({ icon: Icon, href, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[#00B8DB] hover:text-white hover:bg-slate-700 hover:border-slate-600 transition-all duration-300"
                  >
                    <Icon className="h-3.5 w-3.5" />
                  </a>
                ))}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="group flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-[#00B8DB] hover:border-[#00B8DB] transition-all duration-300"
            >
              <span className="text-xs font-semibold text-slate-400 group-hover:text-white transition-colors">Back to Top</span>
              <ArrowUp className="h-3.5 w-3.5 text-[#00B8DB] group-hover:text-white group-hover:-translate-y-0.5 transition-all duration-300" />
            </button>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;