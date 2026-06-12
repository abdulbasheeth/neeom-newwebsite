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

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [desktopDownloadsOpen, setDesktopDownloadsOpen] = useState(false);
  const [bubbles, setBubbles] = useState([]);
  const [activeSection, setActiveSection] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();
  const headerRef = useRef(null);
  const desktopDropdownRef = useRef(null);
  const isScrollingRef = useRef(false);

  const getHeaderHeight = useCallback(() => {
    return headerRef.current?.offsetHeight || 72;
  }, []);

  // Wait for an element to exist in DOM (with retries)
  const waitForElement = useCallback((elementId, maxAttempts = 20, interval = 100) => {
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
  }, []);

  // Reliable scroll to element
  const scrollToElement = useCallback(async (elementId) => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    try {
      let element = document.getElementById(elementId);
      if (!element) {
        element = await waitForElement(elementId);
      }

      if (element) {
        // Wait for next frame to ensure layout is complete
        await new Promise(requestAnimationFrame);
        // Small extra delay for any dynamic content (images, fonts)
        await new Promise(resolve => setTimeout(resolve, 50));

        const headerHeight = getHeaderHeight();
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - headerHeight - 20;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    } finally {
      // Reset scrolling flag after scroll completes (smooth scroll takes time)
      setTimeout(() => {
        isScrollingRef.current = false;
      }, 500);
    }
  }, [getHeaderHeight, waitForElement]);

  // Intersection Observer for active section highlight (DO NOT update URL hash)
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
        const observer = new IntersectionObserver(observerCallback, observerOptions);
        observer.observe(element);
        observers.push(observer);
      }
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [getHeaderHeight]);

  // Handle initial hash on page load (only once)
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.slice(1);
      if (elementId === "about" || elementId === "contact") {
        // Delay to ensure page is fully painted
        setTimeout(() => {
          scrollToElement(elementId);
          setActiveSection(elementId);
        }, 150);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  // Floating bubbles (unchanged)
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
      if (desktopDropdownRef.current && !desktopDropdownRef.current.contains(event.target)) {
        setDesktopDownloadsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // MAIN NAVIGATION HANDLER - everything goes through here
  const handleNavClick = useCallback(
    async (e, link) => {
      e.preventDefault();
      // Close all menus
      setMobileOpen(false);
      setMobileDropdownOpen(false);
      setDesktopDownloadsOpen(false);

      // For Home or Products (non-hash links)
      if (!link.isHash) {
        navigate(link.path);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setActiveSection(null);
        return;
      }

      // For About / Contact (hash links)
      if (location.pathname !== "/") {
        // Navigate to home page with hash
        navigate(`/#${link.elementId}`);
        // Wait for navigation to complete, then scroll
        setTimeout(() => {
          scrollToElement(link.elementId);
          setActiveSection(link.elementId);
        }, 200);
      } else {
        // Already on home page, just scroll
        await scrollToElement(link.elementId);
        setActiveSection(link.elementId);
        // Optionally update hash without triggering a scroll again
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

  const handleDownloadPDF = async () => {
    const pdfUrl = "/neom-profile.pdf";
    try {
      const response = await fetch(pdfUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Neom_Hospitality_Profile.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
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
          background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9), rgba(255,255,255,0.4));
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
      `}</style>

      <nav
        ref={headerRef}
        className={`fixed left-0 right-0 z-50 transition-all duration-300
          ${scrolled
            ? "top-2 mx-auto w-[95%] lg:max-w-7xl bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl rounded-[3rem]"
            : "top-0 bg-white border-b border-gray-100"
          }`}
      >
        <div className="bubbles-container">{bubbles}</div>
        <div className="px-3 sm:px-5 lg:px-8 relative z-10">
          <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? "py-2" : "py-3"}`}>
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 md:gap-4 group flex-shrink-0 p-1">
              <img
                src={neomLogo}
                alt="NEOM Hospitality Supplies"
                className="transition-all duration-500 h-auto object-contain"
                style={{ height: scrolled ? "60px" : "80px" }}
              />
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-2 uppercase">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.isHash ? `/#${link.elementId}` : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all
                    ${isActive(link)
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
                  className="rounded-full border-sky-600 text-sky-700 flex items-center gap-1"
                  onClick={() => setDesktopDownloadsOpen(!desktopDownloadsOpen)}
                >
                  Downloads
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${desktopDownloadsOpen ? "rotate-180" : ""}`} />
                </Button>
                {desktopDownloadsOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-10">
                    <button
                      onClick={handleDownloadPDF}
                      className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition-colors"
                    >
                      <FileText className="w-4 h-4" />
                      Company Profile PDF
                    </button>
                  </div>
                )}
              </div>

              <Button asChild className="rounded-full bg-sky-600 hover:bg-sky-700">
                <a href="/#contact" onClick={handleQuoteClick}>Request Quote</a>
              </Button>
            </div>

            {/* Mobile Menu Toggle */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-sky-50" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-6 h-6 text-sky-700" /> : <Menu className="w-6 h-6 text-sky-700" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer */}
      <div
        className={`lg:hidden fixed z-40 transition-all duration-300
          ${mobileOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}
        style={{
          top: `${getHeaderHeight() + 8}px`,
          left: "50%",
          transform: mobileOpen ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-10px)",
          width: "94%",
          maxHeight: "calc(100vh - 100px)",
        }}
      >
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl border border-white/50 shadow-2xl overflow-hidden">
          <div className="p-4 overflow-y-auto">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.path}
                  href={link.isHash ? `/#${link.elementId}` : link.path}
                  onClick={(e) => handleNavClick(e, link)}
                  className={`flex items-center justify-between px-4 py-3 rounded-2xl uppercase text-sm font-semibold transition-all
                    ${isActive(link) ? "bg-sky-100 text-sky-700" : "text-gray-700 hover:bg-sky-50 hover:text-sky-700"}`}
                >
                  {link.label}
                  {isActive(link) && <div className="w-2 h-2 rounded-full bg-sky-600" />}
                </a>
              ))}
            </div>

            <div className="border-t border-gray-100 mt-4 pt-4">
              <button
                onClick={() => setMobileDropdownOpen(!mobileDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 rounded-2xl uppercase text-sm font-semibold text-gray-700 hover:bg-sky-50"
              >
                Downloads
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${mobileDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${mobileDropdownOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"}`}>
                <button
                  onClick={handleDownloadPDF}
                  className="w-full flex items-center gap-2 px-6 py-3 rounded-xl text-sm text-gray-600 hover:bg-sky-50 hover:text-sky-700"
                >
                  <FileText className="w-4 h-4" />
                  Company Profile PDF
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-5 pt-5 border-t border-gray-100">
              <Button variant="outline" asChild className="rounded-xl border-sky-600 text-sky-700 h-11 uppercase text-xs">
                <Link to="/products">Products</Link>
              </Button>
              <Button asChild className="rounded-xl bg-sky-600 hover:bg-sky-700 h-11 uppercase text-xs">
                <a href="/#contact" onClick={handleQuoteClick}>Request Quote</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;