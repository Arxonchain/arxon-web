import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import BackButton from "@/components/BackButton";
import Investors from "@/components/Investors";
import Footer from "@/components/Footer";

const Partners = () => {
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 60, filter: "blur(12px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] as const }}
      >
        <Investors />
        <Footer />
      </motion.div>
    </div>
  );
};

export default Partners;
