import { useState, useRef, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import { DollarSign, Users, TrendingUp, Zap, ArrowRight, Mail, ChevronLeft, ChevronRight, Rocket, Terminal, Activity } from "lucide-react";
import { FaXTwitter, FaDiscord, FaMedium } from "react-icons/fa6";
import move1 from "@/assets/move-1.png";
import move2 from "@/assets/move-2.png";
import move3 from "@/assets/move-3.png";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#a8c3f0]/25`} />;
};

const Investors = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const faqRef = useRef(null);
  const faqInView = useInView(faqRef, { once: true, margin: "-80px" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentPair, setCurrentPair] = useState(0);

  const highlights = [
    { id:"MKT-001", icon:DollarSign, title:"$1B+ Market Opportunity", desc:"Addressing payments, voting, and supply chain across global markets." },
    { id:"TAM-002", icon:Users, title:"Massive TAM", desc:"Small businesses to Fortune 500, local to national governments, millions of voters." },
    { id:"FMA-003", icon:TrendingUp, title:"First-Mover Advantage", desc:"Addressing payments, voting, and supply chain across global markets." },
    { id:"REV-004", icon:Zap, title:"Multiple Revenue Streams", desc:"Transaction fees, token creation fees, enterprise licensing, government contracts." },
  ];
  const totalPairs = Math.ceil(highlights.length/2);

  const goTo = useCallback((pair:number) => {
    if (!scrollRef.current) return;
    const card = scrollRef.current.querySelector(`[data-index="${pair*2}"]`) as HTMLElement;
    if (card) { scrollRef.current.scrollTo({left:card.offsetLeft-12,behavior:"smooth"}); setCurrentPair(pair); }
  },[]);

  const faqs = [
    { q:"What is Arxon?", a:"Arxon is a privacy-focused blockchain built on its own Network, designed to address payments, voting, and supply chain management across global markets while maintaining complete privacy and security." },
    { q:"When does mining start?", a:"Mining starts in JAN 2026. Users will mine ARX-P (points) offchain to earn real ARX tokens. Mining can be done directly from your web browser." },
    { q:"What is the $ARX token used for?", a:"$ARX is the native token of the Arxon network, used for transactions, governance, and accessing features within the ecosystem. It powers payments, voting, and supply chain applications." },
    { q:"How does privacy work?", a:"All transactions and data are encrypted by choice, ensuring complete confidentiality based on user's consent while maintaining the security benefits of blockchain technology." },
    { q:"When is the private voting dApp coming?", a:"The private voting dApp is currently in development and will be released following the mining phase. Stay tuned to our community channels for updates." },
    { q:"Is Arxon open source?", a:"Yes, Arxon is committed to transparency and will be open source. The codebase will be available for community review and contribution as we progress through development." },
    { q:"Can I invest in the seed round?", a:"Yes, we're raising $2.5M in our pre-seed round. Email us at arxonchain@yahoo.com or apply directly through our investor form.", hasLink:true },
    { q:"How do I stay updated?", a:"Join our community on Discord, follow us on X (Twitter), and join our Telegram channel. You can also join the waitlist to receive direct updates." },
  ];

  return (
    <>
      <section id="invest" className="relative bg-[#09090b] py-24 md:py-32" ref={ref}>
        <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/10 to-transparent" />
        <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"80px 80px"}} />

        <div className="max-w-[1200px] mx-auto px-6">
          <motion.div initial={{opacity:0,y:24}} animate={inView?{opacity:1,y:0}:{}} className="text-center mb-14">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-6 bg-[#a8c3f0]/40" />
              <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">investor_portal.init</span>
              <div className="h-px w-6 bg-[#a8c3f0]/40" />
            </div>
            <h2 className="text-[clamp(28px,4vw,44px)] font-bold text-white mb-3">
              Join the privacy <span className="text-[#a8c3f0]">revolution</span>
            </h2>
            <p className="text-white/55 text-sm max-w-[520px] mx-auto">
              Arxon is driving the future of private transactions across industries. Be part of building the privacy infrastructure the world needs.
            </p>
          </motion.div>

          {/* Desktop highlights grid */}
          <div className="hidden md:grid grid-cols-4 gap-px bg-white/[0.04] rounded-xl overflow-hidden border border-white/[0.10] mb-12">
            {highlights.map((h,i) => (
              <motion.div key={i} initial={{opacity:0}} animate={inView?{opacity:1}:{}} transition={{delay:i*0.08}}
                className="relative bg-[#09090b] p-7 hover:bg-[#0c0c10] transition-colors group overflow-hidden">
                <Corner pos="tl"/>
                <div className="flex items-start justify-between mb-5">
                  <div className="w-9 h-9 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center group-hover:bg-[#a8c3f0]/14 transition-colors">
                    <h.icon size={16} className="text-[#a8c3f0]/60 group-hover:text-[#a8c3f0] transition-colors" />
                  </div>
                  <span className="font-mono text-[8px] text-white/55">{h.id}</span>
                </div>
                <h4 className="text-white text-[14px] font-bold mb-2">{h.title}</h4>
                <p className="text-white/55 text-[12px] leading-relaxed">{h.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Mobile carousel */}
          <div className="md:hidden mb-12">
            <div ref={scrollRef} className="flex gap-3 overflow-x-auto snap-x snap-mandatory scrollbar-hide px-1 pb-4">
              {highlights.map((h,i) => (
                <div key={i} data-index={i} className="flex-shrink-0 w-[calc(50%-6px)] snap-start relative bg-[#0a0a0d] border border-white/[0.10] rounded-xl p-5 group">
                  <div className="w-8 h-8 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/12 flex items-center justify-center mb-4">
                    <h.icon size={14} className="text-[#a8c3f0]/60" />
                  </div>
                  <h4 className="text-white text-[13px] font-bold mb-1">{h.title}</h4>
                  <p className="text-white/55 text-[11px] leading-relaxed">{h.desc}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={()=>goTo(Math.max(0,currentPair-1))} disabled={currentPair===0} className="w-8 h-8 rounded-lg border border-white/[0.10] flex items-center justify-center text-white/60 disabled:opacity-30"><ChevronLeft size={13}/></button>
              <div className="flex gap-1.5">{Array.from({length:totalPairs}).map((_,i)=><button key={i} onClick={()=>goTo(i)} className={`h-1 rounded-full transition-all ${i===currentPair?"w-5 bg-[#a8c3f0]":"w-1.5 bg-white/15"}`}/>)}</div>
              <button onClick={()=>goTo(Math.min(totalPairs-1,currentPair+1))} disabled={currentPair===totalPairs-1} className="w-8 h-8 rounded-lg border border-white/[0.10] flex items-center justify-center text-white/60 disabled:opacity-30"><ChevronRight size={13}/></button>
            </div>
          </div>

          {/* Investment CTA */}
          <motion.div initial={{opacity:0,y:28}} animate={inView?{opacity:1,y:0}:{}} transition={{delay:0.3}}
            className="relative bg-[#0a0a0d] border border-[#a8c3f0]/20 rounded-2xl overflow-hidden p-10 md:p-14 text-center max-w-[750px] mx-auto">
            <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
            <div className="absolute inset-0 pointer-events-none opacity-[0.02]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"32px 32px"}} />
            <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at center,rgba(124,147,195,0.06) 0%,transparent 65%)"}} />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-[#a8c3f0]/10 border border-[#a8c3f0]/20 flex items-center justify-center mx-auto mb-6">
                <Rocket size={24} className="text-[#a8c3f0]" />
              </div>
              <div className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest mb-3">INVESTOR_RELATIONS.open</div>
              <h3 className="text-white text-2xl md:text-3xl font-bold mb-3">Invest in the Future of Privacy</h3>
              <p className="text-white/55 text-sm leading-relaxed mb-4 max-w-lg mx-auto">
                Whether you're looking to partner with us, fund the building phase, or pre-seed any phase of the project, we want to hear from you.
              </p>
              <p className="text-[#a8c3f0]/50 text-xs leading-relaxed mb-8 max-w-md mx-auto italic">
                "Building privacy infrastructure for the world. Reach out and apply — let's shape the future together."
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <motion.button onClick={()=>window.location.href="/investor-form"}
                  whileHover={{scale:1.03,boxShadow:"0 0 40px rgba(124,147,195,0.3)"}} whileTap={{scale:0.97}}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b]"
                  style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
                  <span>Investors Form</span><ArrowRight size={14}/>
                </motion.button>
                <motion.a href="mailto:arxonchain@yahoo.com" whileHover={{scale:1.02}}
                  className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-mono text-sm text-[#a8c3f0] border border-[#a8c3f0]/25 hover:bg-[#a8c3f0]/5 transition-all">
                  <Mail size={14}/> arxonchain@yahoo.com
                </motion.a>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4">
                {[{href:"https://discord.gg/mGWg3mnkvZ",icon:FaDiscord},{href:"https://x.com/ARXONarx",icon:FaXTwitter},{href:"https://medium.com/@arxondigest",icon:FaMedium}].map(({href,icon:Icon})=>(
                  <motion.a key={href} href={href} target="_blank" rel="noopener noreferrer" whileHover={{scale:1.2}}
                    className="w-9 h-9 rounded-lg bg-white/[0.03] border border-white/[0.10] flex items-center justify-center text-white/50 hover:text-[#a8c3f0] hover:border-[#a8c3f0]/25 transition-all">
                    <Icon className="w-3.5 h-3.5"/>
                  </motion.a>
                ))}
              </div>
            </div>
          </motion.div>

      {/* FAQ */}
      <section className="relative bg-[#080810] py-24" ref={faqRef}>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/10 to-transparent" />
        <div className="max-w-[900px] mx-auto px-6">
          <motion.div initial={{opacity:0,y:24}} animate={faqInView?{opacity:1,y:0}:{}} className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px w-6 bg-[#a8c3f0]/40" />
              <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">faq.registry</span>
            </div>
            <h2 className="text-[clamp(24px,3.5vw,36px)] font-bold text-white">Frequently Asked <span className="text-[#a8c3f0]">Questions</span></h2>
          </motion.div>
          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq,i)=>(
              <motion.div key={i} initial={{opacity:0,y:8}} animate={faqInView?{opacity:1,y:0}:{}} transition={{delay:i*0.05}}>
                <AccordionItem value={`item-${i}`} className="border border-white/[0.10] rounded-xl px-5 bg-[#0a0a0d] overflow-hidden data-[state=open]:border-[#a8c3f0]/20">
                  <AccordionTrigger className="text-left text-sm font-semibold text-white/75 hover:text-white py-4 hover:no-underline">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-[8px] text-[#a8c3f0]/35 shrink-0">{String(i+1).padStart(2,"0")}</span>
                      {faq.q}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-white/60 text-sm leading-relaxed pb-4 pl-8">
                    {faq.a}
                    {faq.hasLink && <a href="/investor-form" className="text-[#a8c3f0]/70 hover:text-[#a8c3f0] underline ml-1">Apply here →</a>}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>
    </>
  );
};
export default Investors;
