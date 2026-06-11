import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Terminal, GitBranch, Database, Cpu, Activity, ChevronRight } from "lucide-react";

const Corner = ({ pos }: { pos: "tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-3 h-3 border-[#7c93c3]/25`} />;
};

const roadmapItems = [
  { date:"JAN 2026", cmd:"DEPLOY_MINING_APP", title:"Mining Web App Launch", desc:"Mine ARX-P via web app on mobile & desktop. Early adopters accumulate points for token airdrop.", status:"confirmed" },
  { date:"ONGOING", cmd:"RUN_MARKETING_OPS", title:"Marketing & Growth", desc:"Adding exciting mining features. Community expansion across global markets.", status:"active" },
  { date:"TBD", cmd:"SHIP_WALLET_V1", title:"Private wallet v1 & Voting dApp", desc:"Mobile & web wallet with one-tap privacy. dApp for voting by organisations, communities and governments.", status:"pipeline" },
  { date:"TBD", cmd:"LAUNCH_TESTNET", title:"Testnet Launch", desc:"Users earn more tokens through participating and testing with us.", status:"pipeline" },
  { date:"TBD", cmd:"VOTING_LIVE", title:"Voting dApp Live", desc:"First national, organisations election integrated.", status:"pipeline" },
  { date:"TBD", cmd:"GLOBAL_ADOPTION", title:"Global Adoption", desc:"100+ countries, Billions in TVL.", status:"pipeline" },
];

const consensusItems = [
  { phase:"01", timeline:"Pre-TGE", mechanism:"Points Mining", cmd:"PROOF_OF_ACTIVITY", purpose:"Mine ARX-P via web app on mobile & desktop. Early adopters accumulate points for token airdrop." },
  { phase:"02", timeline:"At TGE", mechanism:"Proof of Stake", cmd:"PROOF_OF_STAKE", purpose:"Stake ARX tokens for APY rewards. Secure the network and earn passive yield." },
  { phase:"03", timeline:"Post-TGE", mechanism:"Deflationary Model", cmd:"SUPPLY_CAP_REACHED", purpose:"Fixed supply cap reached. Value accrues to long-term holders." },
];

const TechnicalDocs = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [tab, setTab] = useState<"roadmap"|"consensus"|"tokenomics">("roadmap");

  const tabs = [
    { key:"roadmap" as const, label:"ROADMAP", icon:GitBranch },
    { key:"consensus" as const, label:"CONSENSUS", icon:Cpu },
    { key:"tokenomics" as const, label:"TOKENOMICS", icon:Database },
  ];

  return (
    <section id="roadmap" className="relative bg-[#09090b] py-24 md:py-32" ref={ref}>
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#7c93c3]/10 to-transparent" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"80px 80px"}} />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} className="mb-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#7c93c3]/40" />
            <span className="font-mono text-[9px] text-[#7c93c3]/50 tracking-widest">technical_docs.config</span>
          </div>
          <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-2">
            From mining to <span className="text-[#7c93c3]">global adoption</span>
          </h2>
          <p className="text-white/35 text-sm max-w-[500px]">Our path to scarcity. Every phase designed to maximize fairness, security, and long-term value.</p>
        </motion.div>

        <motion.div initial={{opacity:0,y:32}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.15}}
          className="relative rounded-xl border border-white/[0.06] overflow-hidden bg-[#0a0a0d]">
          <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>

          {/* Tab bar */}
          <div className="flex items-center border-b border-white/[0.06] bg-white/[0.01]">
            <div className="flex items-center gap-1.5 px-4 py-3 border-r border-white/[0.05]">
              <Terminal size={10} className="text-[#7c93c3]/40" />
              <span className="font-mono text-[8px] text-white/20">docs.sh</span>
            </div>
            <div className="flex">
              {tabs.map(t=>(
                <button key={t.key} onClick={()=>setTab(t.key)}
                  className={`relative flex items-center gap-2 px-5 py-3.5 font-mono text-[10px] tracking-widest font-semibold transition-colors ${tab===t.key?"text-white":"text-white/25 hover:text-white/50"}`}>
                  <t.icon size={10} />
                  {t.label}
                  {tab===t.key&&<motion.div layoutId="tab-ind" className="absolute bottom-0 inset-x-0 h-px bg-[#7c93c3]" transition={{duration:0.2}} />}
                </button>
              ))}
            </div>
            <div className="flex-1" />
            <div className="px-4 flex items-center gap-1.5">
              <Activity size={9} className="text-[#7c93c3]/40 animate-pulse" />
              <span className="font-mono text-[8px] text-white/15">LIVE</span>
            </div>
          </div>

          <div className="p-6 md:p-8">
            <AnimatePresence mode="wait">
              {tab==="roadmap" && (
                <motion.div key="roadmap" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}>
                  <div className="mb-8 flex items-center gap-3">
                    <span className="font-mono text-[9px] text-emerald-400/60 tracking-widest">CONFIRMED_LAUNCH</span>
                    <div className="flex-1 h-px bg-white/[0.05]" />
                    <span className="font-mono text-[8px] text-white/15">{roadmapItems.length} ITEMS</span>
                  </div>
                  <div className="space-y-0">
                    {roadmapItems.map((item,i)=>(
                      <motion.div key={i} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} transition={{delay:i*0.06}}
                        className="flex items-start gap-5 py-4 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] -mx-2 px-2 rounded transition-colors group">
                        <div className="shrink-0 w-20 pt-0.5">
                          <span className={`font-mono text-[10px] font-bold ${item.status==="confirmed"?"text-emerald-400":item.status==="active"?"text-[#7c93c3]":"text-white/20"}`}>{item.date}</span>
                        </div>
                        <div className="w-px bg-white/[0.05] self-stretch shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="font-mono text-[8px] text-white/20 mb-1 tracking-widest">{item.cmd}</div>
                          <h4 className="text-white text-sm font-bold mb-1 group-hover:text-[#7c93c3]/90 transition-colors">{item.title}</h4>
                          <p className="text-white/35 text-xs leading-relaxed">{item.desc}</p>
                        </div>
                        <div className="shrink-0">
                          {item.status==="confirmed"&&<span className="font-mono text-[8px] text-emerald-400/70 bg-emerald-400/8 border border-emerald-400/15 px-2 py-0.5 rounded">CONFIRMED</span>}
                          {item.status==="active"&&<span className="font-mono text-[8px] text-[#7c93c3]/70 bg-[#7c93c3]/8 border border-[#7c93c3]/15 px-2 py-0.5 rounded">ACTIVE</span>}
                          {item.status==="pipeline"&&<span className="font-mono text-[8px] text-white/20 bg-white/[0.03] border border-white/[0.06] px-2 py-0.5 rounded">PIPELINE</span>}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {tab==="consensus" && (
                <motion.div key="consensus" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}} className="space-y-0">
                  {consensusItems.map((row,i)=>(
                    <div key={i} className="py-5 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] -mx-2 px-2 rounded transition-colors group">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="font-mono text-[9px] font-bold text-[#7c93c3]">PHASE_{row.phase}</span>
                        <span className="text-white/15">·</span>
                        <span className="font-mono text-[9px] text-white/25">{row.timeline}</span>
                        <span className="text-white/15">·</span>
                        <span className="font-mono text-[8px] text-white/15 tracking-widest">{row.cmd}</span>
                      </div>
                      <p className="text-white text-[15px] font-bold mb-2">{row.mechanism}</p>
                      <p className="text-white/40 text-[13px] leading-relaxed">{row.purpose}</p>
                    </div>
                  ))}
                </motion.div>
              )}

              {tab==="tokenomics" && (
                <motion.div key="tokenomics" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:0.2}}
                  className="py-16 text-center">
                  <div className="w-16 h-16 rounded-xl bg-[#7c93c3]/8 border border-[#7c93c3]/15 flex items-center justify-center mx-auto mb-6">
                    <Database size={24} className="text-[#7c93c3]/50" />
                  </div>
                  <p className="font-mono text-[9px] text-[#7c93c3]/50 tracking-widest mb-3">TOKENOMICS_MODULE</p>
                  <h3 className="text-white text-3xl md:text-5xl font-bold tracking-tight mb-5">Coming Soon</h3>
                  <p className="text-white/30 text-sm max-w-md mx-auto leading-relaxed">
                    Revolutionary token distribution mechanics and economic models are being crafted for maximum fairness and sustainability.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
export default TechnicalDocs;
