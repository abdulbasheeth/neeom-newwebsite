import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShirt } from '@fortawesome/free-solid-svg-icons';
import bins from '../../assets/bins.svg';

// --- MOCK DATA (FIXED: all icons now centered) ---
const categories = [
  { id: "amenities", label: "Guest Amenities & Equipments", icon: <span className="block text-base md:text-lg leading-none">🧴</span> },
  { id: "linens", label: "Bed & Bath Linens", icon: <span className="block text-base md:text-lg leading-none">🛏️</span> },
  { id: "chemicals", label: "Laundry Chemicals & Accessories", icon: <span className="block text-base md:text-lg leading-none">🫙</span> },
  { id: "eco-bags", label: "Eco-Friendly Sustainable Bags", icon: <span className="block text-base md:text-lg leading-none">♻️</span> },
  { id: "non-woven", label: "Non Woven Bags & Covers", icon: <span className="block text-base md:text-lg leading-none">🛍️</span> },
  { id: "ppe", label: "Non woven Disposable Essentials PPE", icon: <FontAwesomeIcon icon={faShirt} className="w-4 h-4 md:w-5 md:h-5 block text-sky-500 group-hover:text-white" /> },
  { id: "promotions", label: "Corporate Gifts & Giveaways", icon: <span className="block text-base md:text-lg leading-none">🎁</span> },
  { id: "cleaning", label: "Cleaning Equipments & Accessories", icon: <span className="block text-base md:text-lg leading-none">🧹</span> },
  {
    id: "bins",
    label: "Bins & Trolleys",
    icon: <img src={bins} alt="trolley" className="w-5 h-5 md:w-6 md:h-6 object-contain block mx-auto" />,
  },
  { id: "fuel", label: "Chafing Fuel & Charcoals", icon: <span className="block text-base md:text-lg leading-none">🔥</span> },
];

// --- MOCK UI COMPONENTS ---
const ScrollReveal = ({ children, className }) => {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => setIsVisible(entry.isIntersecting));
    }, { threshold: 0.1 });
    
    const currentElement = domRef.current;
    if (currentElement) observer.observe(currentElement);
    return () => {
      if (currentElement) observer.unobserve(currentElement);
    };
  }, []);

  return (
    <div
      ref={domRef}
      className={`transition-all duration-1000 ease-out transform ${className} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}
    >
      {children}
    </div>
  );
};

const StaggerContainer = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

const StaggerItem = ({ children, delay }) => {
  return (
    <div 
      className="h-full opacity-0 animate-stagger-item"
      style={{ animationDelay: `${delay}s`, animationFillMode: 'forwards' }}
    >
      {children}
    </div>
  );
};

// Inject keyframes for stagger animation
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = `
    html { scroll-behavior: smooth; }
    .animate-stagger-item {
      animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
      opacity: 0;
      transform: translateY(20px);
    }
    @keyframes fadeInUp {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(styleSheet);
}
// --- END MOCKS ---

const BubbleBackground = () => {
  const bubbles = Array.from({ length: 20 }).map((_, i) => {
    const random = () => {
      const seed = i * 123 + 456;
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    const size = 40 + random() * 80;
    const duration = 10 + random() * 10;
    const delay = random() * -15;
    const isLeftToRight = Math.random() > 0.5;
    const left = isLeftToRight ? -15 : 115;
    const xDrift = isLeftToRight ? "135vw" : "-135vw";

    return (
      <div
        key={i}
        className="bubble"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
          "--x-drift": xDrift,
        }}
      />
    );
  });

  return (
    <div className="absolute inset-0 z-[1] overflow-hidden pointer-events-none transition-opacity duration-1000">
      {bubbles}
    </div>
  );
};

const CategoriesSection = () => {
  const [isPageLoaded, setIsPageLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section 
      className={`relative pt-8 pb-16 md:pt-12 md:pb-24 bg-[#F0F4FA] overflow-hidden mt-16 transition-all duration-1000 ease-out transform ${
        isPageLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      <style>{`
        .bubble {
          position: absolute;
          bottom: -150px;
          border-radius: 50%;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.2);
          backdrop-filter: blur(2px);
          animation-name: floatBubble;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes floatBubble {
          0% {
            transform: translateY(0) translateX(0) scale(0.5);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-110vh) translateX(var(--x-drift)) scale(1);
            opacity: 0;
          }
        }
      `}</style>

      {/* Background layers */}
      <div className="absolute inset-0 pointer-events-none">
        <BubbleBackground />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #0F2B46 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-[#0F2B46] rounded-full blur-[160px] opacity-[0.04] transition-opacity duration-1000" />
        <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-[#3B82F6] rounded-full blur-[160px] opacity-[0.05] transition-opacity duration-1000" />
      </div>

      <div className="container relative z-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <ScrollReveal className="mb-12 md:mb-14">
          <div className="relative rounded-3xl overflow-hidden px-6 py-6 md:px-12 md:py-5 text-center shadow-lg transition-shadow duration-500 hover:shadow-xl">
            <div className="absolute inset-0 bg-[#0F2B46]" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: "radial-gradient(circle, #3B82F6 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
            <div className="absolute top-0 right-0 w-[340px] h-[340px] bg-[#3B82F6] rounded-full blur-[120px] opacity-[0.12] animate-pulse" />
            <div className="absolute bottom-0 left-0 w-[260px] h-[260px] bg-[#1E4D8C] rounded-full blur-[100px] opacity-[0.25] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute inset-0 rounded-3xl border border-[#3B82F6]/20 pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full border border-[#3B82F6]/25 bg-[#3B82F6]/10 mb-5 backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-ping" />
                <span className="text-[#60A5FA] font-semibold text-[11px] uppercase tracking-[0.2em]">
                  Our Categories
                </span>
              </div>
              <h2 className="text-white text-3xl sm:text-4xl md:text-[3.25rem] font-bold tracking-tight leading-[1.08]">
                Explore by{" "}
                <span className="relative inline-block text-[#60A5FA] transition-transform duration-300 hover:scale-105 inline-block">
                  Category
                  <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 10" fill="none">
                    <path d="M1 7C45 2 85 1 100 3.5C115 6 155 7 199 2" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" opacity="0.35" />
                  </svg>
                </span>
              </h2>
              <p className="text-white/65 mt-4 max-w-lg mx-auto text-base md:text-[1.05rem] leading-relaxed transition-opacity duration-500 hover:opacity-100">
                Discover premium products curated for the hospitality industry, from guest essentials to elegant decor.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Category Grid */}
        <StaggerContainer
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4"
        >
          {categories.map((cat, index) => (
            <StaggerItem key={cat.id} delay={index * 0.08}>
              <Link
                to={`/products?category=${cat.id}`}
                className="group relative flex flex-col items-center justify-center text-center w-full h-[100px] sm:h-[135px] md:h-[125px] rounded-xl bg-white border border-sky-50 p-2.5 transition-all duration-500 ease-[cubic-bezier(0.25,0.46,0.45,0.94)] shadow-[0_0_12px_rgba(14,165,233,0.12)] hover:shadow-[0_10px_30px_rgba(14,165,233,0.25)] hover:border-sky-200 hover:-translate-y-1.5"
              >
                {/* Top Hover Line */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent group-hover:w-full transition-all duration-500 ease-out" />
                
                {/* Icon Container - perfect centering on all screens */}
                <div className="relative mb-2 flex items-center justify-center w-7 h-7 md:w-8 md:h-8 rounded-lg bg-sky-50 border border-sky-100 transition-all duration-500 group-hover:bg-sky-500 group-hover:scale-110 group-hover:border-sky-500 group-hover:shadow-lg">
                  <span className="transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 text-sky-500 group-hover:text-white filter drop-shadow-sm flex items-center justify-center w-full h-full">
                    {cat.icon}
                  </span>
                </div>
                
                {/* Text */}
                <h3 className="text-slate-700 font-semibold text-[11px] md:text-[12px] leading-snug tracking-tight transition-colors duration-300 group-hover:text-sky-700">
                  {cat.label}
                </h3>
                
                {/* Arrow */}
                <div className="mt-1.5 flex items-center justify-center w-4 h-4 rounded-full border border-sky-200 opacity-0 translate-y-1 scale-75 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 group-hover:border-sky-400 group-hover:bg-sky-50 transition-all duration-500 ease-out">
                  <svg className="w-2 h-2 text-sky-600 transition-transform duration-300 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>

                {/* Bottom Hover Line */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[2px] w-0 bg-gradient-to-r from-transparent via-sky-400 to-transparent group-hover:w-full transition-all duration-500 delay-75 ease-out" />
              </Link>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
};

export default CategoriesSection;