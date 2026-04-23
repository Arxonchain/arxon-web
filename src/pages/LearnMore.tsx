import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import FeaturesGrid from "@/components/FeaturesGrid";
import UseCases from "@/components/UseCases";
import TechnicalDocs from "@/components/TechnicalDocs";
import Footer from "@/components/Footer";

const LearnMore = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <FeaturesGrid />
        <UseCases />
        <TechnicalDocs />

        {/* Be a Partner CTA */}
        <section className="relative bg-[#09090b] py-24 md:py-36 overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          
          {/* Animated background elements */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.15, 0.08] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,hsl(220_50%_40%/0.15)_0%,transparent_60%)]"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[radial-gradient(ellipse,hsl(220_50%_30%/0.1)_0%,transparent_70%)]"
            />
            {/* Floating particles */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 rounded-full bg-[#7c93c3]/30"
                style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
                animate={{
                  y: [0, -20, 0],
                  opacity: [0.2, 0.6, 0.2],
                }}
                transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              />
            ))}
          </div>

          <div className="max-w-[1200px] mx-auto px-6 text-center relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-[#52525b] text-sm md:text-base font-light mb-6 tracking-wide"
            >
              Ready to build the future of privacy?
            </motion.p>
            <motion.button
              onClick={() => navigate("/partners")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              whileHover={{ scale: 1.04, boxShadow: "0 0 60px rgba(124,147,195,0.4)" }}
              whileTap={{ scale: 0.97 }}
              className="btn-shimmer group relative inline-flex items-center gap-3 bg-[#7c93c3] hover:bg-[#8da3d3] text-[#09090b] text-lg md:text-xl font-bold px-12 md:px-16 py-5 md:py-6 rounded-2xl transition-all shadow-[0_0_40px_rgba(124,147,195,0.25)]"
            >
              <motion.span
                className="absolute inset-0 rounded-2xl border-2 border-[#7c93c3]/30"
                animate={{ scale: [1, 1.06, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              Be a Partner / Investor of Arxon
              <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform duration-300" />
            </motion.button>
          </div>
        </section>
      </motion.div>
      <Footer />
    </div>
  );
};

export default LearnMore;
