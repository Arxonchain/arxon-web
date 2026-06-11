import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Crown } from "lucide-react";
import trophyImg from "@/assets/trophy-3d.png";
import diamondImg from "@/assets/diamond-3d.png";

const AmbassadorCTA = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const navigate = useNavigate();

  return (
    <section ref={ref} className="py-16 px-6">
      <div className="max-w-[1000px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          onClick={() => navigate("/ambassadors")}
          className="relative cursor-pointer group rounded-2xl overflow-hidden transition-all duration-500"
          style={{
            background: "linear-gradient(135deg, rgba(124,147,195,0.08) 0%, rgba(90,123,191,0.04) 50%, rgba(124,147,195,0.06) 100%)",
            border: "1px solid rgba(124,147,195,0.15)",
          }}
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{
              background: "linear-gradient(135deg, rgba(124,147,195,0.12), transparent, rgba(124,147,195,0.08))",
              boxShadow: "inset 0 0 60px rgba(124,147,195,0.06), 0 0 40px rgba(124,147,195,0.08)",
            }}
          />

          {/* Sweeping light beam */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-[#a8c3f0]/[0.1] to-transparent skew-x-[-20deg]"
            animate={{ x: ["-150%", "250%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
          />

          {/* Subtle grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: "linear-gradient(rgba(124,147,195,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(124,147,195,0.3) 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />

          {/* Floating 3D elements */}
          <motion.img
            src={trophyImg}
            alt=""
            className="absolute right-6 top-1/2 -translate-y-1/2 w-24 md:w-32 opacity-[0.1] group-hover:opacity-[0.18] transition-opacity duration-500 pointer-events-none drop-shadow-[0_0_20px_rgba(124,147,195,0.2)]"
            animate={{ y: [-8, 8, -8], rotate: [-2, 2, -2] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.img
            src={diamondImg}
            alt=""
            className="absolute right-32 md:right-44 bottom-3 w-10 md:w-14 opacity-[0.07] group-hover:opacity-[0.14] transition-opacity duration-500 pointer-events-none"
            animate={{ y: [4, -4, 4], rotate: [3, -3, 3] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corner accent dots */}
          <div className="absolute top-3 left-3 w-1 h-1 rounded-full bg-[#a8c3f0]/30" />
          <div className="absolute top-3 right-3 w-1 h-1 rounded-full bg-[#a8c3f0]/30" />
          <div className="absolute bottom-3 left-3 w-1 h-1 rounded-full bg-[#a8c3f0]/20" />

          {/* Floating particles */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-[#a8c3f0]/25"
              style={{ left: `${15 + i * 18}%`, top: `${25 + (i % 3) * 25}%` }}
              animate={{ y: [-8, 8, -8], opacity: [0.15, 0.4, 0.15] }}
              transition={{ duration: 2.5 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
            />
          ))}

          <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
            {/* Icon with glow ring */}
            <motion.div
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative w-16 h-16 shrink-0"
            >
              <motion.div
                className="absolute inset-0 rounded-2xl border border-[#a8c3f0]/20"
                animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 2.5, repeat: Infinity }}
              />
              <div className="w-16 h-16 rounded-2xl bg-[#a8c3f0]/10 border border-[#a8c3f0]/20 flex items-center justify-center group-hover:bg-[#a8c3f0]/20 transition-colors overflow-hidden">
                <img src={trophyImg} alt="" className="w-10 h-10 object-contain" />
              </div>
            </motion.div>

            {/* Text */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
                  <Sparkles size={14} className="text-[#a8c3f0]" />
                </motion.span>
                <span className="text-[#a8c3f0] text-xs font-bold uppercase tracking-widest">Now Open</span>
              </div>
              <h3 className="text-white text-xl md:text-2xl font-bold mb-2">
                Ambassador Program, <span className="bg-gradient-to-r from-[#a8c3f0] to-[#a8b8d8] bg-clip-text text-transparent">$100,000 Rewards</span>
              </h3>
              <p className="text-[#a1a1aa] text-sm">
                Join the 30-day challenge. Promote Arxon, prove yourself, and earn your share of the reward pool at TGE.
              </p>
            </div>

            {/* CTA button */}
            <motion.div
              className="relative overflow-hidden flex items-center gap-2 bg-[#a8c3f0] text-white font-bold px-6 py-3 rounded-xl text-sm shrink-0 group-hover:shadow-[0_0_40px_rgba(124,147,195,0.35)] transition-all duration-500"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ["-200%", "200%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
              />
              <span className="relative z-10 flex items-center gap-2">
                Apply Now
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                  <ArrowRight size={16} />
                </motion.span>
              </span>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AmbassadorCTA;
