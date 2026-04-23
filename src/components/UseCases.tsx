import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Wallet, Sparkles, Vote, Package, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type UseCase = {
  icon: React.ElementType;
  title: string;
  year: string;
  description: string;
  features: string[];
};

const useCases: UseCase[] = [
  {
    icon: Wallet,
    title: "Private Payments",
    year: "2026",
    description: "Handle as low as $5 to $1B+ transactions with complete privacy. Perfect for businesses, corporations, and individuals.",
    features: ["QR code payments like Venmo", "Digital receipts (ZKP-based)", "Real-time dashboards", "Dispute resolution system"],
  },
  {
    icon: Sparkles,
    title: "Token & NFTs Creation",
    year: "2026",
    description: "Launch memecoins, NFTs and custom tokens with anonymous sales tracking to prevent rug pulls.",
    features: ["One-click token creation", "Anonymous sales monitoring", "Market panic prevention", "Public trend dashboards"],
  },
  {
    icon: Vote,
    title: "Onchain Voting",
    year: "2026",
    description: "Enable individual, organisations, local to national elections with complete voter's privacy and one-vote-per-person verification.",
    features: ["Hashed ID verification", "Anonymous vote casting", "Tamper-proof results", "Audit-ready receipts"],
  },
  {
    icon: Package,
    title: "Supply Chain",
    year: "2026",
    description: "Track private shipments worth billions, sharing data only with authorized parties.",
    features: ["End-to-end tracking", "Selective data sharing", "Multi-billion $ capacity", "Enterprise integration"],
  },
];

const UseCaseCard = ({ uc, i, inView }: { uc: UseCase; i: number; inView: boolean }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={inView ? { opacity: 1 } : {}}
    transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
    className="bg-[#09090b] p-8 md:p-10 hover:bg-[#0f0f13] transition-colors duration-300 group"
  >
    <div className="flex items-start justify-between mb-6">
      <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center group-hover:border-[#7c93c3]/20 transition-colors">
        <uc.icon size={18} strokeWidth={1.5} className="text-[#52525b] group-hover:text-[#7c93c3] transition-colors" />
      </div>
      <span className="text-[#3f3f46] text-[11px] tracking-wide font-bold">{uc.year}</span>
    </div>
    <h3 className="text-white text-lg md:text-xl font-bold mb-2 flex items-center gap-2">
      {uc.title}
      <ArrowUpRight size={14} className="text-[#3f3f46] group-hover:text-[#7c93c3] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
    </h3>
    <p className="text-[#52525b] text-[13px] leading-relaxed mb-6 font-light">{uc.description}</p>
    <ul className="space-y-1.5">
      {uc.features.map((f, j) => (
        <li key={j} className="text-[#3f3f46] text-[12px] flex items-center gap-2 group-hover:text-[#52525b] transition-colors font-medium">
          <span className="w-1 h-1 rounded-full bg-[#3f3f46] group-hover:bg-[#7c93c3]/50 transition-colors" />
          {f}
        </li>
      ))}
    </ul>
  </motion.div>
);

const MobileUseCaseCarousel = ({ inView }: { inView: boolean }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(useCases.length / 2);

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
    <div className="md:hidden relative">
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {useCases.map((uc, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.4, delay: i * 0.03 }}
            className="flex-shrink-0 w-[calc(50%-6px)] snap-start rounded-xl border border-white/[0.06] bg-[#0f0f13] p-5 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-8 h-8 rounded-lg bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <uc.icon size={14} strokeWidth={1.5} className="text-[#7c93c3]" />
              </div>
              <span className="text-[#3f3f46] text-[10px] tracking-wide font-bold">{uc.year}</span>
            </div>
            <h3 className="text-white text-[14px] font-bold mb-1.5">{uc.title}</h3>
            <p className="text-[#52525b] text-[11px] leading-relaxed mb-3 font-light line-clamp-3">{uc.description}</p>
            <ul className="space-y-1">
              {uc.features.slice(0, 3).map((f, j) => (
                <li key={j} className="text-[#3f3f46] text-[10px] flex items-center gap-1.5 font-medium">
                  <span className="w-1 h-1 rounded-full bg-[#7c93c3]/50" />
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 mt-4">
        <button
          onClick={() => goTo(-1)}
          disabled={activeIndex === 0}
          className="w-9 h-9 rounded-full border border-white/[0.08] flex items-center justify-center text-white/60 hover:text-white hover:border-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="flex gap-1.5">
          {Array.from({ length: totalPages }).map((_, i) => (
            <div
              key={i}
              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-[#7c93c3] w-4" : "bg-white/20"}`}
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
  );
};

const UseCases = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative bg-[#09090b] py-24 md:py-32" ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-[44px] leading-[1.1] tracking-[-0.03em] text-white font-extralight">
            Everything in{" "}
            <span className="text-[#7c93c3] font-bold">your control</span>
          </h2>
          <p className="mt-5 text-[#71717a] text-base max-w-[520px] mx-auto font-light">
            All the features you need to transact privately, create tokens, vote securely,
            and manage supply chains, without the friction.
          </p>
        </motion.div>

        {/* Desktop: 2-column grid */}
        <div className="hidden md:grid grid-cols-2 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06]">
          {useCases.map((uc, i) => (
            <UseCaseCard key={i} uc={uc} i={i} inView={inView} />
          ))}
        </div>

        {/* Mobile: horizontal carousel */}
        <MobileUseCaseCarousel inView={inView} />
      </div>
    </section>
  );
};

export default UseCases;
