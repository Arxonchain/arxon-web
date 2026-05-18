import { Link } from "react-router-dom";
import arxonLogoWide from "@/assets/arxon-logo-wide.svg";
import { FaXTwitter, FaDiscord, FaMedium } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="bg-[#09090b] border-t border-white/[0.06]">
      <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <img src={arxonLogoWide} alt="ARXON" className="h-6 opacity-40" />
        <div className="flex items-center gap-5">
          <Link to="/privacy-policy" className="text-[#3f3f46] hover:text-[#a1a1aa] transition-colors text-[11px] font-medium">
            Privacy Policy
          </Link>
          {[
            { href: "https://discord.gg/mGWg3mnkvZ", icon: FaDiscord },
            { href: "https://x.com/ARXONarx", icon: FaXTwitter },
            { href: "https://medium.com/@arxondigest", icon: FaMedium },
          ].map(({ href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3f3f46] hover:text-[#a1a1aa] transition-colors"
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          ))}
        </div>
        <p className="text-[#3f3f46] text-[11px] font-medium">© 2025 ARXON. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
