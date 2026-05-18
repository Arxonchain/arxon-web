import { motion } from "framer-motion";
import arxonHeaderText from "@/assets/arxon-header-text.svg";
import EarthPrivacyVisual from "@/components/EarthPrivacyVisual";

const Hero = () => {
  return (
    <section className="relative min-h-[85vh] bg-[#09090b] overflow-hidden flex items-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#09090b] via-[#0c0c10] to-[#09090b]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1400px] h-[600px] bg-[radial-gradient(ellipse_at_bottom,hsl(220_50%_20%/0.12)_0%,transparent_70%)]" />
        <div className="absolute bottom-[30%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[hsl(220_50%_40%/0.08)] to-transparent" />
      </div>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 w-full pt-28 pb-20 md:pt-40 md:pb-32 flex flex-col md:flex-row items-center gap-8 md:gap-12">
        {/* Text content */}
        <div className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <img src={arxonHeaderText} alt="ARXON" className="h-16 md:h-24 lg:h-28" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.15 }}
            className="text-[clamp(40px,7vw,88px)] leading-[1.02] tracking-[-0.04em] text-white font-extralight max-w-[800px]"
          >
            Privacy chain
            <br />
            <span className="font-bold text-[#7D93C4]">for the people</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-muted-foreground text-base md:text-[17px] leading-relaxed max-w-[440px]"
          >
            The future of private, fast, and secure transactions. Deliver
            payments with complete privacy at scale.
          </motion.p>
        </div>

        {/* Earth Privacy Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-shrink-0"
        >
          <EarthPrivacyVisual />
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#09090b] to-transparent" />
    </section>
  );
};

export default Hero;
