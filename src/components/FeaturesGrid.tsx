import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Shield, Zap, Globe, Lock, Eye, Layers, Fingerprint, Server, ShieldCheck, ChevronLeft, ChevronRight, Terminal } from "lucide-react";

const features = [
  { id:"ZKP-001", icon: Shield, title: "Zero-knowledge proofs", desc: "Complete transaction privacy using ZK-SNARKs. No one sees your data unless you choose to share it.", tag:"CRYPTOGRAPHIC" },
  { id:"TXN-002", icon: Zap, title: "Lightning fast", desc: "Process transactions with sub-second finality and instant confirmation at scale.", tag:"PERFORMANCE" },
  { id:"NET-003", icon: Globe, title: "Global reach", desc: "Send payments anywhere in the world. No borders, no intermediaries, no restrictions.", tag:"INFRASTRUCTURE" },
  { id:"PRV-004", icon: Lock, title: "One-tap privacy", desc: "Toggle privacy on or off for any transaction. Your choice, your control, every time.", tag:"UX_LAYER" },
  { id:"RCP-005", icon: Eye, title: "Tamper-proof receipts", desc: "Every transaction generates a cryptographic receipt. Verifiable, immutable, and private.", tag:"CRYPTOGRAPHIC" },
  { id:"L1-006", icon: Layers, title: "Layer One chain", desc: "Purpose-built blockchain, not a fork. Native privacy from the ground up.", tag:"ARCHITECTURE" },
  { id:"IDN-007", icon: Fingerprint, title: "Identity protection", desc: "Your identity stays yours. Transact without revealing personal information to anyone.", tag:"SECURITY" },
  { id:"ENT-008", icon: Server, title: "Enterprise ready", desc: "Built to handle $1B+ in transaction capacity. Scalable architecture for any organization.", tag:"INFRASTRUCTURE" },
  { id:"CPL-009", icon: ShieldCheck, title: "Regulatory compliant", desc: "Privacy by choice means you can prove compliance when needed while staying private by default.", tag:"COMPLIANCE" },
];

const Corner = ({ pos }: { pos: "tl"|"tr"|"bl"|"br" }) => {
  const cls={tl:"top-0 left-0",tr:"top-0 right-0",bl:"bottom-0 left-0",br:"bottom-0 right-0"}[pos];
  const b={tl:"border-t border-l",tr:"border-t border-r",bl:"border-b border-l",br:"border-b border-r"}[pos];
  return <div className={`absolute ${cls} w-3 h-3 ${b} border-[#7c93c3]/25`} />;
};

const FeaturesGrid = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(features.length / 2);

  const goTo = (dir: -1|1) => {
    const next = Math.max(0,Math.min(totalPages-1,activeIndex+dir));
    setActiveIndex(next);
    const card = scrollRef.current?.children[next*2] as HTMLElement;
    card?.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"start" });
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const w = (scrollRef.current.children[0] as HTMLElement)?.offsetWidth||1;
    setActiveIndex(Math.round(scrollRef.current.scrollLeft/((w+12)*2)));
  };

  return (
    <section id="features" className="relative bg-[#09090b] py-24 md:py-32" ref={ref}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#7c93c3]/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#7c93c3]/40" />
            <span className="font-mono text-[9px] text-[#7c93c3]/50 tracking-widest">PROTOCOL_FEATURES.index</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,44px)] leading-tight tracking-tight text-white font-bold">
            Reach users, not <span className="text-[#7c93c3]">middlemen</span>
          </h2>
        </motion.div>

        {/* Desktop 3-col grid */}
        <div className="hidden md:grid grid-cols-3 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.06]">
          {features.map((f,i) => (
            <motion.div key={i} initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:i*0.05}}
              className="relative bg-[#09090b] p-7 hover:bg-[#0c0c10] transition-colors duration-300 group overflow-hidden">
              <Corner pos="tl" />
              <div className="flex items-start justify-between mb-5">
                <div className="w-9 h-9 rounded-lg bg-[#7c93c3]/8 border border-[#7c93c3]/12 flex items-center justify-center group-hover:bg-[#7c93c3]/14 transition-colors">
                  <f.icon size={16} className="text-[#7c93c3]/60 group-hover:text-[#7c93c3] transition-colors" />
                </div>
                <span className="font-mono text-[8px] text-white/15 tracking-widest">{f.id}</span>
              </div>
              <h4 className="text-white text-[14px] font-bold mb-2">{f.title}</h4>
              <p className="text-white/35 text-[12px] leading-relaxed mb-4">{f.desc}</p>
              <span className="font-mono text-[8px] text-[#7c93c3]/30 bg-[#7c93c3]/5 border border-[#7c93c3]/10 px-2 py-0.5 rounded tracking-wider">{f.tag}</span>
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div ref={scrollRef} onScroll={handleScroll}
            className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4">
            {features.map((f,i) => (
              <div key={i} className="snap-start shrink-0 w-[calc(50vw-24px)] relative bg-[#0a0a0d] border border-white/[0.06] rounded-xl p-5">
                <div className="w-8 h-8 rounded-lg bg-[#7c93c3]/8 border border-[#7c93c3]/12 flex items-center justify-center mb-4">
                  <f.icon size={14} className="text-[#7c93c3]/60" />
                </div>
                <h4 className="text-white text-xs font-bold mb-1.5">{f.title}</h4>
                <p className="text-white/35 text-[11px] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 justify-center">
            <button onClick={()=>goTo(-1)} className="w-8 h-8 rounded-lg border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 hover:border-[#7c93c3]/25 transition-all"><ChevronLeft size={14}/></button>
            <div className="flex gap-1.5">
              {Array.from({length:totalPages}).map((_,i)=>(<div key={i} className={`h-1 rounded-full transition-all ${i===activeIndex?"w-6 bg-[#7c93c3]":"w-1.5 bg-white/15"}`}/>))}
            </div>
            <button onClick={()=>goTo(1)} className="w-8 h-8 rounded-lg border border-white/[0.06] flex items-center justify-center text-white/40 hover:text-white/80 hover:border-[#7c93c3]/25 transition-all"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default FeaturesGrid;
