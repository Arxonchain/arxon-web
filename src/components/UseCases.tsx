import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Wallet, Sparkles, Vote, Package, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";

type UseCase = { icon: React.ElementType; id: string; title: string; year: string; description: string; features: string[] };

const useCases: UseCase[] = [
  { id:"UC-001", icon:Wallet, title:"Private Payments", year:"2026", description:"Handle as low as $5 to $1B+ transactions with complete privacy. Perfect for businesses, corporations, and individuals.", features:["QR code payments like Venmo","Digital receipts (ZKP-based)","Real-time dashboards","Dispute resolution system"] },
  { id:"UC-002", icon:Sparkles, title:"Token & NFTs Creation", year:"2026", description:"Launch memecoins, NFTs and custom tokens with anonymous sales tracking to prevent rug pulls.", features:["One-click token creation","Anonymous sales monitoring","Market panic prevention","Public trend dashboards"] },
  { id:"UC-003", icon:Vote, title:"Onchain Voting", year:"2026", description:"Enable individual, organisations, local to national elections with complete voter's privacy and one-vote-per-person verification.", features:["Hashed ID verification","Anonymous vote casting","Tamper-proof results","Audit-ready receipts"] },
  { id:"UC-004", icon:Package, title:"Supply Chain", year:"2026", description:"Track private shipments worth billions, sharing data only with authorized parties.", features:["End-to-end tracking","Selective data sharing","Multi-billion $ capacity","Enterprise integration"] },
];

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-3 h-3 border-[#a8c3f0]/25`} />;
};

const UseCases = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  const goTo = (dir: -1|1) => {
    const next = Math.max(0,Math.min(useCases.length-1,activeIndex+dir));
    setActiveIndex(next);
    const card = scrollRef.current?.children[next] as HTMLElement;
    card?.scrollIntoView({ behavior:"smooth", block:"nearest", inline:"center" });
  };

  return (
    <section className="relative bg-[#080810] py-24 md:py-32" ref={ref}>
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/8 to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"80px 80px"}} />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#a8c3f0]/40" />
            <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">use_cases.registry</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-2">
            Built for <span className="text-[#a8c3f0]">real-world scale</span>
          </h2>
          <p className="font-mono text-xs text-white/65">4 modules · all shipping 2026</p>
        </motion.div>

        {/* Desktop 4-col grid */}
        <div className="hidden md:grid grid-cols-4 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.10]">
          {useCases.map((uc,i) => (
            <motion.div key={i} initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:0.1+i*0.08}}
              className="relative bg-[#09090b] p-8 hover:bg-[#0c0c10] transition-colors duration-300 group overflow-hidden">
              <Corner pos="tl"/>
              <div className="flex items-start justify-between mb-6">
                <div className="w-9 h-9 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center group-hover:bg-[#a8c3f0]/14 transition-colors">
                  <uc.icon size={16} className="text-[#a8c3f0]/60 group-hover:text-[#a8c3f0] transition-colors" />
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono text-[8px] text-white/55">{uc.id}</span>
                  <span className="font-mono text-[8px] text-[#a8c3f0]/40">{uc.year}</span>
                </div>
              </div>
              <h3 className="text-white text-[15px] font-bold mb-2 flex items-center gap-1">
                {uc.title}
                <ArrowUpRight size={12} className="text-white/60 group-hover:text-[#a8c3f0] transition-colors" />
              </h3>
              <p className="text-white/55 text-[12px] leading-relaxed mb-5">{uc.description}</p>
              <ul className="space-y-1.5">
                {uc.features.map((f,j) => (
                  <li key={j} className="text-white/65 text-[11px] flex items-center gap-2 group-hover:text-white/60 transition-colors">
                    <span className="w-1 h-1 rounded-full bg-[#a8c3f0]/30 shrink-0" />{f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Mobile carousel */}
        <div className="md:hidden">
          <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 -mx-4 px-4">
            {useCases.map((uc,i) => (
              <div key={i} className="snap-center shrink-0 w-[calc(85vw-32px)] relative bg-[#0a0a0d] border border-white/[0.10] rounded-xl p-6">
                <Corner pos="tl"/>
                <div className="w-9 h-9 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center mb-5">
                  <uc.icon size={16} className="text-[#a8c3f0]/60" />
                </div>
                <div className="font-mono text-[8px] text-[#a8c3f0]/40 mb-1">{uc.id}</div>
                <h3 className="text-white font-bold mb-2">{uc.title}</h3>
                <p className="text-white/55 text-xs leading-relaxed mb-4">{uc.description}</p>
                <ul className="space-y-1">
                  {uc.features.map((f,j)=><li key={j} className="text-white/65 text-[11px] flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-[#a8c3f0]/30" />{f}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-3 mt-4 justify-center">
            <button onClick={()=>goTo(-1)} className="w-8 h-8 rounded-lg border border-white/[0.10] flex items-center justify-center text-white/60 hover:text-white/80 transition-all"><ChevronLeft size={14}/></button>
            <div className="flex gap-1.5">
              {useCases.map((_,i)=><div key={i} className={`h-1 rounded-full transition-all ${i===activeIndex?"w-6 bg-[#a8c3f0]":"w-1.5 bg-white/15"}`}/>)}
            </div>
            <button onClick={()=>goTo(1)} className="w-8 h-8 rounded-lg border border-white/[0.10] flex items-center justify-center text-white/60 hover:text-white/80 transition-all"><ChevronRight size={14}/></button>
          </div>
        </div>
      </div>
    </section>
  );
};
export default UseCases;
