import { motion } from "framer-motion";
import { Download, Shield, Globe, Vote, Code, Coins, FileText, ArrowRight, Users, Lock, Eye, Zap, Terminal, Database, CheckCircle2, Clock, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import arxonLogo from "@/assets/arxon-logo-wide.svg";
import { useNavigate } from "react-router-dom";

const sv = { hidden:{opacity:0,y:24}, visible:{opacity:1,y:0,transition:{duration:0.6}} };

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#a8c3f0]/30`}/>;
};

const SectionHead = ({ icon:Icon, id, label, title }: { icon:any; id:string; label:string; title:string }) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="w-9 h-9 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/15 flex items-center justify-center shrink-0">
      <Icon size={16} className="text-[#a8c3f0]"/>
    </div>
    <div>
      <div className="font-mono text-[8px] text-[#a8c3f0]/40 tracking-widest mb-0.5">{id}</div>
      <h2 className="text-xl font-bold text-white">{title}</h2>
    </div>
  </div>
);

const Card = ({ children, className="" }: { children:React.ReactNode; className?:string }) => (
  <div className={`relative p-5 rounded-xl bg-[#0a0a0d] border border-white/[0.10] overflow-hidden hover:border-[#a8c3f0]/18 transition-colors ${className}`}>
    <Corner pos="tl"/>
    {children}
  </div>
);

const Litepaper = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.016]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}}/>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-6 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 50% 30%,rgba(124,147,195,0.06) 0%,transparent 65%)"}}/>
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.button onClick={()=>navigate(-1)} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
            className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/60 hover:text-[#a8c3f0] mb-10 transition-colors">
            <ArrowLeft size={12}/>BACK
          </motion.button>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="text-center">
            <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} transition={{duration:0.5}}
              className="w-16 h-16 rounded-2xl bg-[#a8c3f0]/10 border border-[#a8c3f0]/20 flex items-center justify-center mx-auto mb-6">
              <img src={arxonLogo} alt="Arxon" className="w-10"/>
            </motion.div>
            <div className="flex items-center justify-center gap-2 mb-5">
              <div className="h-px w-8 bg-[#a8c3f0]/30"/>
              <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">LITEPAPER_2026 · INFORMATIONAL_ONLY</span>
              <div className="h-px w-8 bg-[#a8c3f0]/30"/>
            </div>
            <h1 className="text-[clamp(28px,5vw,52px)] font-bold text-white mb-4 leading-tight">
              Sovereign Privacy Blockchain<br/>
              <span className="text-[#a8c3f0]">for the Unbanked World</span>
            </h1>
            <p className="text-white/60 text-sm italic mb-8">"Financial sovereignty is not a privilege. It is a right."</p>
            <motion.a href="/Arxon_Litepaper_2026.pdf" download whileHover={{scale:1.02}} whileTap={{scale:0.97}}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-mono text-sm font-bold text-[#09090b]"
              style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
              <Download size={14}/> DOWNLOAD LITEPAPER
            </motion.a>
          </motion.div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/10 to-transparent"/>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-20">

        {/* The Problem */}
        <motion.section variants={sv} initial="hidden" whileInView="visible" viewport={{once:true}}>
          <SectionHead icon={Globe} id="SECTION_01" label="THE_PROBLEM" title="The Problem"/>
          <p className="text-white/65 leading-relaxed mb-6 text-sm">
            The global financial system was not built for everyone. Despite two generations of cryptocurrency innovation, over 1.4 billion adults worldwide remain without access to basic financial services. Blockchain promised to change this. In practice, the benefits have mostly flowed to those who were already financially included.
          </p>
          <div className="space-y-3">
            {[
              {icon:Users, id:"P-001", title:"Financial Exclusion", desc:"Hundreds of millions in Africa, Asia, and Latin America conduct their entire financial lives in cash. Without bank accounts, they cannot save securely, access credit, or participate in the digital economy."},
              {icon:Eye, id:"P-002", title:"Financial Surveillance", desc:"Public blockchains solve financial exclusion but introduce total transparency. Your wallet balance, every transaction, and every person you've ever paid is permanently visible to anyone on earth."},
              {icon:Coins, id:"P-003", title:"The Cost of Sending Money Home", desc:"The Nigerian diaspora alone sends over $20 billion home yearly. At current fees of 6-8%, over $1.5 billion is extracted from the world's poorest families every single year."},
            ].map((item,i)=>(
              <motion.div key={item.title} initial={{opacity:0,x:-16}} whileInView={{opacity:1,x:0}} viewport={{once:true}} transition={{delay:i*0.1}}>
                <Card>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-md bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center">
                      <item.icon size={13} className="text-[#a8c3f0]/70"/>
                    </div>
                    <span className="font-mono text-[8px] text-white/60">{item.id}</span>
                    <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed pl-9">{item.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What We've Built */}
        <motion.section variants={sv} initial="hidden" whileInView="visible" viewport={{once:true}}>
          <SectionHead icon={CheckCircle2} id="SECTION_02" label="WHAT_WE_BUILT" title="What We've Already Built"/>
          <div className="space-y-2">
            {[
              {id:"B-001", title:"A Live Sovereign Blockchain", desc:"Running BABE/GRANDPA consensus with a new block every six seconds in multi-node testnet configuration."},
              {id:"B-002", title:"Unique Chain ID & ARX Token", desc:"Fixed supply with its own unique identity, no inflation."},
              {id:"B-003", title:"Full Ethereum Compatibility", desc:"Any smart contract written for Ethereum deploys on Arxon without changes. MetaMask connects out of the box."},
              {id:"B-004", title:"Selective Privacy System", desc:"Four independent privacy flags working in any combination, eight distinct privacy modes."},
              {id:"B-005", title:"Private Transaction Receipts", desc:"Tamper-proof records with single-use disclosure codes for third-party verification."},
              {id:"B-006", title:"ARX-P Mining System", desc:"14k+ community of real miners earning points before mainnet, convertible to ARX tokens at launch."},
            ].map((item,i)=>(
              <motion.div key={i} initial={{opacity:0,y:8}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.06}}
                className="flex items-start gap-3 py-3.5 px-4 border border-white/[0.08] rounded-xl bg-[#0a0a0d] hover:border-[#a8c3f0]/15 transition-colors group">
                <div className="w-6 h-6 rounded-md bg-emerald-400/10 border border-emerald-400/15 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 size={11} className="text-emerald-400"/>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-mono text-[8px] text-white/38">{item.id}</span>
                    <h3 className="text-white font-semibold text-sm group-hover:text-[#a8c3f0]/90 transition-colors">{item.title}</h3>
                  </div>
                  <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* What We're Building */}
        <motion.section variants={sv} initial="hidden" whileInView="visible" viewport={{once:true}}>
          <SectionHead icon={Code} id="SECTION_03" label="WHAT_WE_BUILD" title="What We Are Building"/>
          <div className="space-y-4">
            {[
              {icon:Lock, title:"Zero-Knowledge Cryptographic Privacy", desc:"Halo2 zero-knowledge proofs make hidden information impossible to reveal, even with complete access to the blockchain's raw data. Halo2 requires no trusted setup — the security is mathematical, not ceremonial."},
              {icon:Vote, title:"On-Chain Private Voting", desc:"A voting system where coercion is cryptographically impossible. Voters prove eligibility without revealing identity. Results are tallied through Layer-2 ZK batch proofs — one billion votes across 10,000 batches settles on-chain in seconds."},
            ].map((item,i)=>(
              <Card key={i}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-md bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center">
                    <item.icon size={13} className="text-[#a8c3f0]"/>
                  </div>
                  <h3 className="text-white font-semibold text-sm">{item.title}</h3>
                </div>
                <p className="text-white/60 text-sm leading-relaxed pl-9">{item.desc}</p>
              </Card>
            ))}
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center">
                  <Code size={13} className="text-[#a8c3f0]"/>
                </div>
                <h3 className="text-white font-semibold text-sm">Developer Ecosystem</h3>
              </div>
              <ul className="pl-9 space-y-2">
                {["Privacy-preserving DeFi — trading, lending with confidential amounts","Private remittance applications for diaspora markets","Confidential payroll systems with private salary information","ZK voting applications for communities, DAOs, and governments","Private NFT marketplaces and confidential identity systems"].map((item,i)=>(
                  <li key={i} className="flex items-start gap-2 text-white/60 text-sm">
                    <span className="w-1 h-1 rounded-full bg-[#a8c3f0]/50 mt-2 shrink-0"/>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </motion.section>

        {/* Roadmap */}
        <motion.section variants={sv} initial="hidden" whileInView="visible" viewport={{once:true}}>
          <SectionHead icon={ArrowRight} id="SECTION_04" label="ROADMAP" title="Roadmap"/>
          <div className="space-y-4">
            {[
              { status:"COMPLETE", variant:"green", items:["Sovereign Layer-1 blockchain in multi-node testnet","ARX native token with fixed supply","Full EVM compatibility, MetaMask, Solidity, all Ethereum tooling","Selective privacy system, four independent per-transaction flags","Private Transaction Receipt system with disclosure codes","ARX-P mining system, 14k+ community","On-chain ARX claim pallet for unlimited miners"] },
              { status:"IN BUILDING PROCESS", variant:"amber", items:["Public testnet launch, anyone can connect and transact","Block explorer, browse all Arxon transactions publicly","Testnet faucet for developers","Validator expansion","Anti-rug protection registry","Developer documentation and SDK release","MetaMask official chain registration","Halo2 zero-knowledge proof integration","Cryptographic enforcement of all four privacy flags","ZK voting Phase 1 — private on-chain votes","Privacy-preserving DeFi primitives","Third-party ZK circuit security audit"] },
              { status:"AHEAD — ECOSYSTEM", variant:"blue", items:["ZK voting Phase 2, national-scale batch proof elections","Remittance corridor integrations for Nigeria and diaspora","Mobile wallet with built-in privacy controls","Cross-chain bridges to major ecosystems","Mainnet launch with ARX-P conversion"] },
            ].map((phase,i)=>{
              const v = {green:{border:"border-emerald-400/15",bg:"bg-emerald-400/[0.03]",text:"text-emerald-400",dot:"bg-emerald-400"},amber:{border:"border-amber-400/15",bg:"bg-amber-400/[0.03]",text:"text-amber-400",dot:"bg-amber-400"},blue:{border:"border-[#a8c3f0]/18",bg:"bg-[#a8c3f0]/[0.02]",text:"text-[#a8c3f0]",dot:"bg-[#a8c3f0]"}}[phase.variant];
              return (
                <motion.div key={i} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.1}}
                  className={`relative p-5 rounded-xl border ${v.border} ${v.bg} overflow-hidden`}>
                  <Corner pos="tl"/>
                  <span className={`font-mono text-[9px] font-bold ${v.text} tracking-widest`}>{phase.status}</span>
                  <ul className="mt-4 space-y-2">
                    {phase.items.map((item,j)=>(
                      <li key={j} className="text-white/60 text-sm flex items-start gap-2">
                        <span className={`mt-2 w-1 h-1 rounded-full shrink-0 ${v.dot}`}/>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </motion.section>

        {/* Why Arxon */}
        <motion.section variants={sv} initial="hidden" whileInView="visible" viewport={{once:true}}>
          <SectionHead icon={Shield} id="SECTION_05" label="WHY_ARXON" title="Why Arxon"/>
          <div className="space-y-3">
            {[
              {title:"The problem is real and the users are real", desc:"Financial exclusion affects hundreds of millions right now. The diaspora paying 7% fees to send money home is real. The voter who fears coercion is real. Arxon is built for these people."},
              {title:"The technology is original", desc:"Selective transaction privacy does not exist on any other production blockchain. This is not an incremental improvement — it is a new capability."},
            ].map((item,i)=>(
              <Card key={i}>
                <h3 className="text-white font-semibold text-sm mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
              </Card>
            ))}
          </div>
        </motion.section>

        {/* Closing */}
        <motion.section variants={sv} initial="hidden" whileInView="visible" viewport={{once:true}}
          className="relative bg-[#0a0a0d] border border-[#a8c3f0]/18 rounded-2xl overflow-hidden p-12 text-center">
          <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
          <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at center,rgba(124,147,195,0.04) 0%,transparent 65%)"}}/>
          <div className="relative z-10">
            <p className="text-white/65 leading-relaxed mb-5 text-sm max-w-xl mx-auto">
              Bitcoin proved money without banks was possible. Ethereum proved programmable money was possible. Arxon is proving that private, accessible, fair money is possible — and building it for the people who need it most.
            </p>
            <p className="text-[#a8c3f0] font-semibold text-lg mb-8 italic">"Arxon is Built For the World."</p>
            <motion.a href="/Arxon_Litepaper_2026.pdf" download whileHover={{scale:1.02,boxShadow:"0 0 30px rgba(124,147,195,0.2)"}} whileTap={{scale:0.97}}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b]"
              style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
              <Download size={15}/> DOWNLOAD FULL LITEPAPER
            </motion.a>
            <p className="text-white/60 text-xs mt-8 max-w-md mx-auto font-mono">
              DISCLAIMER: This litepaper is for informational purposes only. It does not constitute financial advice or an offer of any kind. Arxon is in active development.
            </p>
          </div>
        </motion.section>
      </div>
      <Footer />
    </div>
  );
};
export default Litepaper;
