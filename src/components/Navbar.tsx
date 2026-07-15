import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import arxonLogoWide from "@/assets/arxon-logo-wide.svg";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const links = [
    { label: "What Arxon is Building", href: "/learn-more" },
    { label: "Roadmap", href: "/learn-more#roadmap" },
    { label: "Global Mining Network", href: "/global-mining" },
    { label: "Ambassadors", href: "/ambassadors" },
    { label: "Investors", href: "/partners" },
    { label: "FAQ", href: "/faq" },
    { label: "Litepaper", href: "/litepaper" },
  ];

  const handleLinkClick = (href: string) => {
    setOpen(false);
    if (href.startsWith("/")) {
      if (href.includes("#")) {
        const [path, hash] = href.split("#");
        if (location.pathname === path) {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
        } else {
          navigate(path);
          setTimeout(() => {
            document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
          }, 600);
        }
      } else {
        navigate(href);
      }
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-[#09090b]/85 backdrop-blur-xl border-b border-white/[0.10] shadow-[0_4px_30px_rgba(0,0,0,0.4)]"
          : "bg-transparent"
      }`}
    >
      {/* Animated top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[1px] overflow-hidden">
        <motion.div
          className="h-full w-full bg-gradient-to-r from-transparent via-[#a8c3f0]/40 to-transparent"
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between h-16">
        <motion.a
          href="/"
          onClick={(e) => { e.preventDefault(); navigate("/"); }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="relative"
        >
          <img src={arxonLogoWide} alt="ARXON" className="h-7 md:h-8" />
          <motion.div
            className="absolute -inset-2 rounded-lg bg-[#a8c3f0]/0"
            whileHover={{ backgroundColor: "rgba(124,147,195,0.06)" }}
            transition={{ duration: 0.3 }}
          />
        </motion.a>

        <div className="hidden md:flex items-center gap-0.5 relative">
          {links.map((l) => (
            <motion.button
              key={l.label}
              onClick={() => handleLinkClick(l.href)}
              onMouseEnter={() => setHoveredLink(l.label)}
              onMouseLeave={() => setHoveredLink(null)}
              className="relative text-[#a1a1aa] text-[13px] font-medium px-3.5 py-2 transition-colors rounded-lg"
              whileHover={{ color: "#ffffff" }}
              whileTap={{ scale: 0.96 }}
            >
              {hoveredLink === l.label && (
                <motion.div
                  layoutId="navHover"
                  className="absolute inset-0 bg-white/[0.05] rounded-lg border border-white/[0.10]"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{l.label}</span>
            </motion.button>
          ))}
        </div>

        {/* Desktop Start Mining button → goes to /mining-choice */}
        <div className="hidden md:flex items-center gap-3">
          <motion.button
            onClick={() => navigate("/mining-choice")}
            whileHover={{ scale: 1.03, boxShadow: "0 0 30px rgba(124,147,195,0.3)" }}
            whileTap={{ scale: 0.96 }}
            className="btn-shimmer relative bg-[#a8c3f0] text-white text-[13px] font-bold px-5 py-2 rounded-lg transition-colors flex items-center gap-2 overflow-hidden"
          >
            <Sparkles size={12} className="opacity-70" />
            Start Mining
            <ArrowRight size={13} />
          </motion.button>
        </div>

        <motion.button
          onClick={() => setOpen(!open)}
          className="md:hidden text-white/70 p-1"
          whileTap={{ scale: 0.9, rotate: 90 }}
          transition={{ duration: 0.2 }}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </motion.button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-[#09090b]/95 backdrop-blur-xl border-t border-white/[0.10]"
          >
            <div className="px-6 py-4 flex flex-col gap-1">
              {links.map((l, i) => (
                <motion.button
                  key={l.label}
                  onClick={() => handleLinkClick(l.href)}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="text-[#a1a1aa] hover:text-white text-sm font-medium py-2.5 transition-colors text-left flex items-center gap-2"
                >
                  <motion.span
                    className="w-1 h-1 rounded-full bg-[#a8c3f0]/50"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                  />
                  {l.label}
                </motion.button>
              ))}

              {/* Mobile Start Mining button → goes to /mining-choice */}
              <motion.button
                onClick={() => { setOpen(false); navigate("/mining-choice"); }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="btn-shimmer mt-3 bg-[#a8c3f0] text-white text-sm font-bold px-4 py-2.5 rounded-lg text-center flex items-center justify-center gap-2"
              >
                <Sparkles size={13} className="opacity-70" />
                Start Mining
                <ArrowRight size={14} />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
