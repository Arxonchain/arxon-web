import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Shield, Zap, Globe, Lock, Eye, Layers, Fingerprint, Server, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";

const features = [
  { icon: Shield, title: "Zero-knowledge proofs", desc: "Complete transaction privacy using ZK-SNARKs. No one sees your data unless you choose to share it." },
  { icon: Zap, title: "Lightning fast", desc: "Process transactions with sub-second finality and instant confirmation at scale." },
  { icon: Globe, title: "Global reach", desc: "Send payments anywhere in the world. No borders, no intermediaries, no restrictions." },
  { icon: Lock, title: "One-tap privacy", desc: "Toggle privacy on or off for any transaction. Your choice, your control, every time." },
  { icon: Eye, title: "Tamper-proof receipts", desc: "Every transaction generates a cryptographic receipt. Verifiable, immutable, and private." },
  { icon: Layers, title: "Layer One chain", desc: "Purpose-built blockchain, not a fork. Native privacy from the ground up." },
  { icon: Fingerprint, title: "Identity protection", desc: "Your identity stays yours. Transact without revealing personal information to anyone." },
  { icon: Server, title: "Enterprise ready", desc: "Built to handle $1B+ in transaction capacity. Scalable architecture for any organization." },
  { icon: ShieldCheck, title: "Regulatory compliant", desc: "Privacy by choice means you can prove compliance when needed while staying private by default." },
];

const FeaturesGrid = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const totalPages = Math.ceil(features.length / 2);

  const goTo = (dir: -1 | 1) => {
    const next = Math.max(0, Math.min(totalPages - 1, activeIndex + dir));
    setActiveIndex(next);
    if (scrollRef.current) {
      const card = scrollRef.current.children[next * 2] as HTMLElement;
      card?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const scrollLeft = container.scrollLeft;
    const cardWidth = (container.children[0] as HTMLElement)?.offsetWidth || 1;
    const gap = 12;
    setActiveIndex(Math.round(scrollLeft / ((cardWidth + gap) * 2)));
  };

  return (
    <section id="features" className="relative bg-[#09090b] py-24 md:py-32" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-[44px] leading-[1.1] tracking-[-0.03em] text-white font-extralight">
            Reach users, not{" "}
            <span className="text-[#7c93c3] font-bold">middlemen</span>
          </h2>
        </motion.div>

        {/* Desktop: 3-column grid (unchanged) */}
        <div className="hidden md:grid grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06]">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="bg-[#09090b] p-7 md:p-8 hover:bg-[#0f0f13] transition-colors duration-300 group"
            >
              <f.icon
                size={18}
                strokeWidth={1.5}
                className="text-[#52525b] group-hover:text-[#7c93c3] transition-colors mb-4"
              />
              <h4 className="text-white text-[15px] font-bold mb-2">{f.title}</h4>
              <p className="text-[#52525b] text-[13px] leading-relaxed font-light">{f.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Mobile: horizontal scroll carousel */}
        <div className="md:hidden relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: i * 0.03 }}
                className="flex-shrink-0 w-[calc(50%-6px)] snap-start rounded-xl border border-white/[0.06] bg-[#0f0f13] p-5"
              >
                <f.icon
                  size={18}
                  strokeWidth={1.5}
                  className="text-[#7c93c3] mb-4"
                />
                <h4 className="text-white text-[15px] font-bold mb-2">{f.title}</h4>
                <p className="text-[#52525b] text-[13px] leading-relaxed font-light">{f.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Arrow buttons */}
          <div className="flex items-center justify-center gap-4 mt-4">
            <button
              onClick={() => goTo(-1)}
              disabled={activeIndex === 0}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </button>

            {/* Dots */}
            <div className="flex gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <div
                  key={i}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === activeIndex ? "bg-[#7c93c3] w-4" : "bg-white/20"
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => goTo(1)}
              disabled={activeIndex === totalPages - 1}
              className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
