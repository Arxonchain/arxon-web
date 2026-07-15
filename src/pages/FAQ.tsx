import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Terminal, ChevronDown, ChevronUp, ArrowLeft } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { useNavigate } from "react-router-dom";

const faqs = [
  { q:"What is Arxon?", a:"Arxon is a privacy-first Layer-1 blockchain that lets you send money, vote, and create tokens all with one-tap privacy. It's fast (instant), cheap (less than $0.01), and built for real people." },
  { q:"When does mining start?", a:"Mining is live now. Use the web app in your browser or download the Android app from Google Play. iOS mining is coming soon." },
  { q:"What is the $ARX token used for?", a:"$ARX powers everything: pay fees (or earn them via staking), vote in governance, create memecoins/NFTs, and earn rewards via mining/staking." },
  { q:"How does privacy work?", a:"Every transaction has a privacy toggle. Turn it on → amount hidden from public, only you + receiver see details, wallet balance fully shielded, auto-receipt attached (uneditable)." },
  { q:"When is the private voting dApp coming?", a:"The voting dApp is in development, launching after the mining phase. Follow community channels for updates." },
  { q:"Is Arxon open source?", a:"Yes. Arxon is committed to transparency and the codebase will be open for community review and contribution." },
  { q:"When is TGE?", a:"TGE timeline will be announced as we progress through the mining phase. Ambassador program members and community followers will be first to know." },
  { q:"How do I stay updated?", a:"Join our Telegram channel, Discord, and follow us on X for the latest announcements and mining updates." },
];

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-3 h-3 border-[#a8c3f0]/25`} />;
};

const FAQ = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState<number|null>(null);

  return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      <PageMeta title="FAQ | ARXON" description="Frequently asked questions about Arxon mining, privacy, and the ambassador program." />
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 50% 20%,rgba(124,147,195,0.04) 0%,transparent 60%)"}} />
      <Navbar />
      <div className="relative z-10 pt-28 pb-20 px-6 max-w-[860px] mx-auto">
        <motion.button onClick={()=>navigate(-1)} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
          className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/60 hover:text-[#a8c3f0] mb-10 transition-colors">
          <ArrowLeft size={12}/>BACK
        </motion.button>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#a8c3f0]/40"/>
            <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">faq.registry · {faqs.length} ENTRIES</span>
          </div>
          <h1 className="text-[clamp(28px,4vw,44px)] font-bold text-white">Frequently Asked <span className="text-[#a8c3f0]">Questions</span></h1>
        </motion.div>

        <div className="space-y-2">
          {faqs.map((faq,i)=>(
            <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:i*0.04}}>
              <div className={`relative bg-[#0a0a0d] border rounded-xl overflow-hidden transition-all duration-300 ${open===i?"border-[#a8c3f0]/25":"border-white/[0.10] hover:border-[#a8c3f0]/15"}`}>
                <Corner pos="tl"/>
                <button onClick={()=>setOpen(open===i?null:i)} className="w-full flex items-center gap-4 px-5 py-4 text-left">
                  <span className="font-mono text-[9px] text-[#a8c3f0]/35 shrink-0">{String(i+1).padStart(2,"0")}</span>
                  <span className={`flex-1 text-sm font-semibold transition-colors ${open===i?"text-white":"text-white/60"}`}>{faq.q}</span>
                  <div className={`shrink-0 w-6 h-6 rounded-md border flex items-center justify-center transition-all ${open===i?"border-[#a8c3f0]/30 bg-[#a8c3f0]/10 text-[#a8c3f0]":"border-white/[0.10] text-white/65"}`}>
                    {open===i?<ChevronUp size={11}/>:<ChevronDown size={11}/>}
                  </div>
                </button>
                {open===i&&(
                  <motion.div initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}
                    className="px-5 pb-5 pl-[52px]">
                    <p className="text-white/60 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default FAQ;
