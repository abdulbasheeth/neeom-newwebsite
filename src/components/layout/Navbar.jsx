import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../Ui/button";
import { Menu, X, ChevronDown, FileText } from "lucide-react";
import neomLogo from "../../assets/Neom-logo.jpg";

const navLinks = [
  { label: "Home", path: "/", isHash: false },
  { label: "About", path: "/about", isHash: true, elementId: "about" },
  { label: "Products", path: "/products", isHash: false },
  { label: "Contact", path: "/contact", isHash: true, elementId: "contact" },
];

// 🔽 Define your PDFs here – add or remove items as needed
const pdfItems = [
  {
    id: "profile",
    label: "Company Profile PDF",
    url: "/neom-profile.pdf",
    fileName: "Neom_Hospitality_Profile.pdf",
  },
  {
    id: "catalog",
    label: "Product Catalog PDF",
    url: "/product-catalog.pdf",
    fileName: "Neom_Product_Catalog.pdf",
  },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [desktopDownloadsOpen, setDesktopDownloadsOpen] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [mobileMenuTop, setMobileMenuTop] = useState(80);

  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const isScrollingRef = useRef(false);
  const originalBodyOverflow = useRef("");

  // Responsive Logo Height Calculation
  const getLogoHeight = useCallback(() => {
    if (window.innerWidth < 640) {
      return scrolled ? "30px" : "40px"; // mobile
    }
    if (window.innerWidth < 1024) {
      return scrolled ? "40px" : "50px"; // tablet
    }
    return scrolled ? "60px" : "80px"; // desktop
  }, [scrolled]);

  const getHeaderHeight = useCallback(() => {
    return headerRef.current?.offsetHeight || 72;
  }, []);

  const updateMobileMenuTop = useCallback(() => {
    if (mobileOpen) {
      setMobileMenuTop(getHeaderHeight() + 8);
    }
  }, [mobileOpen, getHeaderHeight]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      updateMobileMenuTop();
      originalBodyOverflow.current = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      window.addEventListener("scroll", updateMobileMenuTop);
      window.addEventListener("resize", updateMobileMenuTop);
      return () => {
        document.body.style.overflow = originalBodyOverflow.current;
        window.removeEventListener("scroll", updateMobileMenuTop);
        window.removeEventListener("resize", updateMobileMenuTop);
      };
    } else {
      document.body.style.overflow = originalBodyOverflow.current;
    }
  }, [mobileOpen, updateMobileMenuTop]);

  // Close mobile menu when resizing above xl breakpoint (1280px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1280 && mobileOpen) {
        setMobileOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [mobileOpen]);

  const waitForElement = useCallback(
    (elementId, maxAttempts = 20, interval = 100) => {
      return new Promise((resolve) => {
        let attempts = 0;
        const checkExist = setInterval(() => {
          const element = document.getElementById(elementId);
          if (element) {
            clearInterval(checkExist);
            resolve(element);
          } else if (attempts >= maxAttempts) {
            clearInterval(checkExist);
            resolve(null);
          }
          attempts++;
        }, interval);
      });
    },
    []
  );

  const scrollToElement = useCallback(
    async (elementId) => {
      if (isScrollingRef.current) return;
      isScrollingRef.current = true;

      try {
        let element = document.getElementById(elementId);
        if (!element) {
          element = await waitForElement(elementId);
        }

        if (element) {
          await new Promise(requestAnimationFrame);
          await new Promise((resolve) => setTimeout(resolve, 50));

          const headerHeight = getHeaderHeight();
          const elementPosition =
            element.getBoundingClientRect().top + window.scrollY;
          const offsetPosition = elementPosition - headerHeight - 20;

          window.scrollTo({
            top: offsetPosition,
            behavior: "smooth",
          });
        }
      } finally {
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
      }
    },
    [getHeaderHeight, waitForElement]
  );

  useEffect(() => {
    const sections = ["about", "contact"];
    const observers = [];

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: `-${getHeaderHeight() + 20}px 0px -20% 0px`,
      threshold: 0.3,
    };

    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        const observer = new IntersectionObserver(
          observerCallback,
          observerOptions
        );
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [getHeaderHeight]);

  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.slice(1);
      if (elementId === "about" || elementId === "contact") {
        setTimeout(() => {
          scrollToElement(elementId);
          setActiveSection(elementId);
        }, 150);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const generateBubbles = useCallback(() => {
    const bubbleCount = window.innerWidth < 640 ? 15 : 30;
    const newBubbles = [];
    for (let i = 0; i < bubbleCount; i++) {
      const size = Math.random() * 24 + 6;
      const left = Math.random() * 100;
      const bottom = Math.random() * 50;
      const duration = Math.random() * 10 + 8;
      const delay = Math.random() * -10;
      const opacity = Math.random() * 0.4 + 0.1;
      newBubbles.push(
        <div
          key={i}
          className="bubble"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left: `${left}%`,
            bottom: `${bottom}%`,
            animation: `rise ${duration}s ease-in infinite ${delay}s, sway ${Math.random() * 3 + 2}s ease-in-out infinite alternate`,
            opacity: opacity,
            background: `radial-gradient(circle at 25% 25%, rgba(14, 165, 233, 0.8), rgba(14, 165, 233, 0.1))`,
            boxShadow: `inset 0 0 10px rgba(14, 165, 233, 0.4), 0 4px 10px rgba(14, 165, 233, 0.1)`,
            border: `1px solid rgba(14, 165, 233, 0.3)`,
          }}
        />
      );
    }
    setBubbles(newBubbles);
  }, []);

  useEffect(() => {
    generateBubbles();
    const handleResize = () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(generateBubbles, 200);
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(window.resizeTimer);
    };
  }, [generateBubbles]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        desktopDropdownRef.current &&
        !desktopDropdownRef.current.contains(event.target)
      ) {
        setDesktopDownloadsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [mobileOpen]);

  const handleNavClick = useCallback(
    async (e, link) => {
      e.preventDefault();
      setMobileOpen(false);
      setMobileDropdownOpen(false);
      setDesktopDownloadsOpen(false);

      if (!link.isHash) {
        navigate(link.path);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection(null);
        return;
      }

      if (location.pathname !== "/") {
        navigate(`/#${link.elementId}`);
        setTimeout(() => {
          scrollToElement(link.elementId);
          setActiveSection(link.elementId);
        }, 200);
      } else {
        await scrollToElement(link.elementId);
        setActiveSection(link.elementId);
        if (window.location.hash !== `#${link.elementId}`) {
          history.pushState(null, null, `#${link.elementId}`);
        }
      }
    },
    [location.pathname, navigate, scrollToElement]
  );

  const isActive = useCallback(
    (link) => {
      if (link.isHash) {
        return activeSection === link.elementId;
      }
      if (link.path === "/") {
        return location.pathname === "/" && !activeSection;
      }
      return location.pathname === link.path;
    },
    [location.pathname, activeSection]
  );

  // 🔽 Generic PDF download handler
  const handleDownloadPDF = async (item) => {
    try {
      const response = await fetch(item.url);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = item.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
    setMobileDropdownOpen(false);
    setMobileOpen(false);
    setDesktopDownloadsOpen(false);
  };

  const handleQuoteClick = useCallback(
    (e) => {
      e.preventDefault();
      setMobileOpen(false);
      setMobileDropdownOpen(false);
      setDesktopDownloadsOpen(false);

      if (location.pathname !== "/") {
        navigate("/#contact");
        setTimeout(() => {
          scrollToElement("contact");
          setActiveSection("contact");
        }, 200);
      } else {
        scrollToElement("contact");
        setActiveSection("contact");
        if (window.location.hash !== "#contact") {
          history.pushState(null, null, "#contact");
        }
      }
    },
    [location.pathname, navigate, scrollToElement]
  );

  return (
    <>
      <style>{`
        @keyframes rise {
          0% { transform: translateY(0) scale(0.8); opacity: 0; }
          10% { opacity: 0.6; transform: translateY(-20px) scale(1); }
          50% { transform: translateY(-60px) scale(1.05); opacity: 0.4; }
          100% { transform: translateY(-150px) scale(1.2); opacity: 0; }
        }
        @keyframes sway {
          from { margin-left: -20px; }
          to { margin-left: 20px; }
        }
        .bubble {
          position: absolute;
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.9));
          border-radius: 50%;
          pointer-events: none;
          will-change: transform, opacity;
          box-shadow: inset 0 0 10px rgba(255,255,255,0.8), 0 4px 10px rgba(0,0,0,0.05);
          backdrop-filter: blur(2px);
          border: 1px solid rgba(255,255,255,0.6);
          z-index: 0;
        }
        .bubbles-container {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          border-radius: inherit;
          pointer-events: none;
          z-index: 0;
          mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
          -webkit-mask-image: linear-gradient(to bottom, transparent, black 10%, black 90%, transparent);
        }
        .mobile-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .mobile-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .mobile-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0,0,0,0.1);
          border-radius: 20px;
        }
      `}</style>

      {/* Backdrop overlay – visible only below xl */}
      <div
        className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-300 ${
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } xl:hidden`}
        onClick={() => setMobileOpen(false)}
      />

      <nav
        ref={headerRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-300
          ${
            scrolled
              ? "top-2 mx-auto w-[95%] lg:max-w-7xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl rounded-[3rem]"
              : "top-0 bg-white border-b border-gray-100"
          }`}
      >
        <div className="bubbles-container">{bubbles}</div>

        <div className="px-4 sm:px-6 lg:px-8 relative z-10">
          <div
            className={`flex items-center justify-between transition-all duration-300 ${
              scrolled ? "py-2 lg:py-3" : "py-3 lg:py-4"
            }`}
          >
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 md:gap-4 group flex-shrink-0 p-1 -ml-2 sm:ml-0"
            >
              <img
                src={neomLogo}
                alt="NEOM Hospitality Supplies"
                className="transition-all duration-500 h-auto object-contain"
                style={{ height: getLogoHeight() }}
              />
            </Link>

            {/* Desktop Navigation – visible only from xl upwards */}
            <div className="hidden xl:flex items-center flex-1 justify-end gap-1 lg:gap-2 uppercase">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.isHash ? `/#${link.elementId}` : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                    ${
                      isActive(link)
                        ? "bg-sky-600 text-white"
                        : "text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                    }`}
                >
                  {link.label}
                </a>
              ))}

              {/* Downloads Dropdown */}
              <div className="relative" ref={desktopDropdownRef}>
                <Button
                  variant="outline"
                  className="rounded-full border-sky-600 text-sky-700 flex items-center gap-1 hover:bg-sky-50"
                  onClick={() =>
                    setDesktopDownloadsOpen(!desktopDownloadsOpen)
                  }
                >
                  Downloads
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      desktopDownloadsOpen ? "rotate-180" : ""
                    }`}
                  />
                </Button>
                {desktopDownloadsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
                    {pdfItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleDownloadPDF(item)}
                        className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors text-left"
                      >
                        <FileText className="w-4 h-4" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                asChild
                className="rounded-full bg-sky-600 hover:bg-sky-700 shadow-md shadow-sky-200 transition-all ml-2"
              >
                <a href="/#contact" onClick={handleQuoteClick}>
                  Request Quote
                </a>
              </Button>
            </div>

            {/* Mobile Toggle – hidden on xl and above */}
            <button
              className="xl:hidden p-2 -mr-2 rounded-lg hover:bg-sky-50 active:bg-sky-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-6 h-6 text-sky-700" />
              ) : (
                <Menu className="w-6 h-6 text-sky-700" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer – only visible below xl */}
      <div
        className={`fixed left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ease-in-out origin-top
          ${
            mobileOpen
              ? "opacity-100 scale-y-100"
              : "opacity-0 scale-y-95 pointer-events-none"
          } xl:hidden`}
        style={{
          top: `${mobileMenuTop}px`,
          width: "92%",
          maxWidth: "450px",
          maxHeight: `calc(100vh - ${mobileMenuTop + 16}px)`,
        }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden flex flex-col h-full">
          <div className="p-5 overflow-y-auto mobile-scroll pb-8">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.isHash ? `/#${link.elementId}` : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`flex items-center justify-between px-4 py-3.5 rounded-2xl uppercase text-sm font-semibold transition-all
                    ${
                      isActive(link)
                        ? "bg-sky-100 text-sky-700"
                        : "text-gray-700 hover:bg-sky-50 hover:text-sky-700"
                    }`}
                >
                  {link.label}
                  {isActive(link) && (
                    <div className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
                  )}
                </a>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-5 pt-4">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-2xl uppercase text-sm font-semibold text-gray-700 hover:bg-sky-50 transition-colors"
              >
                Downloads
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    mobileDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  mobileDropdownOpen
                    ? "max-h-40 opacity-100 mt-1"
                    : "max-h-0 opacity-0"
                }`}
              >
                {pdfItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => handleDownloadPDF(item)}
                    className="w-full flex items-center gap-3 px-6 py-3.5 rounded-xl text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                  >
                    <FileText className="w-4 h-4 text-sky-500" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="outline"
                asChild
                className="rounded-xl border-sky-600 text-sky-700 h-12 uppercase text-xs font-bold tracking-wide hover:bg-sky-50"
              >
                <Link to="/products">Products</Link>
              </Button>
              <Button
                asChild
                className="rounded-xl bg-sky-600 hover:bg-sky-700 h-12 uppercase text-xs font-bold tracking-wide shadow-lg shadow-sky-200"
              >
                <a href="/#contact" onClick={handleQuoteClick}>
                  Request Quote
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;