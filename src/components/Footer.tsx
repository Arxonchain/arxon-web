import { Link } from "react-router-dom";
import { ARXON_X_URL, ARXON_DISCORD_URL, ARXON_MEDIUM_URL, ARXON_TELEGRAM_URL } from "@/lib/social";
import arxonLogoWide from "@/assets/arxon-logo-wide.svg";
import { FaXTwitter, FaDiscord, FaMedium, FaTelegram } from "react-icons/fa6";
import { motion } from "framer-motion";

const Footer = () => (
  <footer className="relative bg-[#09090b] border-t border-[#a8c3f0]/10 overflow-hidden">
    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/20 to-transparent" />
    <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{
      backgroundImage: "linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",
      backgroundSize: "60px 60px",
    }} />
    <div className="relative max-w-[1200px] mx-auto px-6 py-7 flex flex-col md:flex-row items-center justify-between gap-4">
      <motion.a href={ARXON_X_URL} target="_blank" rel="noopener noreferrer" whileHover={{ opacity: 0.7 }} className="opacity-35 transition-opacity">
        <img src={arxonLogoWide} alt="ARXON" className="h-6" />
      </motion.a>

      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px]">
        <Link to="/faq" className="text-white/60 hover:text-[#a8c3f0]/60 transition-colors tracking-wider">FAQ</Link>
        <Link to="/litepaper" className="text-white/60 hover:text-[#a8c3f0]/60 transition-colors tracking-wider">LITEPAPER</Link>
        <Link to="/ambassadors" className="text-white/60 hover:text-[#a8c3f0]/60 transition-colors tracking-wider">AMBASSADORS</Link>
        <Link to="/privacy-policy" className="text-white/60 hover:text-[#a8c3f0]/60 transition-colors tracking-wider">PRIVACY</Link>
      </div>

      <div className="flex items-center gap-1 font-mono text-[9px] text-white/55">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span className="tracking-widest">NETWORK ONLINE</span>
      </div>

      <div className="flex items-center gap-5">
        {[
          { href: ARXON_TELEGRAM_URL, icon: FaTelegram, label: "Telegram" },
          { href: ARXON_DISCORD_URL, icon: FaDiscord, label: "Discord" },
          { href: ARXON_X_URL, icon: FaXTwitter, label: "X" },
          { href: ARXON_MEDIUM_URL, icon: FaMedium, label: "Medium" },
        ].map(({ href, icon: Icon, label }) => (
          <motion.a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
            whileHover={{ scale: 1.2, color: "#a8c3f0" }}
            className="text-white/60 transition-colors">
            <Icon className="w-3.5 h-3.5" />
          </motion.a>
        ))}
        <p className="font-mono text-[10px] text-white/55 tracking-wider">© 2026 ARXON</p>
      </div>
    </div>
  </footer>
);

export default Footer;
