import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Terminal, ArrowLeft } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturesGrid from "@/components/FeaturesGrid";
import UseCases from "@/components/UseCases";
import TechnicalDocs from "@/components/TechnicalDocs";

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#a8c3f0]/30`} />;
};

const LearnMore = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <motion.div initial={{opacity:0,y:40,filter:"blur(8px)"}} animate={{opacity:1,y:0,filter:"blur(0px)"}} transition={{duration:0.7}}>
        {/* Page header */}
        <div className="relative pt-28 pb-4 px-6 max-w-[1200px] mx-auto">
          <motion.button onClick={()=>navigate(-1)} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
            className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/60 hover:text-[#a8c3f0] mb-8 transition-colors">
            <ArrowLeft size={12}/>BACK
          </motion.button>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-px w-6 bg-[#a8c3f0]/40"/>
            <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">ARXON / PROTOCOL DOCS</span>
          </div>
          <h1 className="text-[clamp(28px,4vw,48px)] font-bold text-white mb-2">What Arxon is <span className="text-[#a8c3f0]">Building</span></h1>
          <p className="text-white/55 text-sm max-w-[480px]">The full technical picture, features, use cases, roadmap, and consensus architecture.</p>
        </div>

        <FeaturesGrid />
        <UseCases />
        <TechnicalDocs />

        {/* Partner CTA */}
        <section className="relative bg-[#09090b] py-24 md:py-32 overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a8c3f0]/10 to-transparent" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.015]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"80px 80px"}} />
          <div className="absolute inset-0" style={{background:"radial-gradient(ellipse at center,rgba(124,147,195,0.05) 0%,transparent 65%)"}} />
          <div className="max-w-[900px] mx-auto px-6">
            <motion.div initial={{opacity:0,y:28}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
              className="relative bg-[#0a0a0d] border border-[#a8c3f0]/20 rounded-2xl overflow-hidden p-12 text-center">
              <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
              <div className="absolute inset-0 pointer-events-none opacity-[0.025]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"32px 32px"}} />
              <div className="relative z-10">
                <div className="flex items-center justify-center gap-4 mb-6">
                  <div className="h-px w-12 bg-[#a8c3f0]/25"/>
                  <span className="font-mono text-[9px] text-[#a8c3f0]/45 tracking-widest">PARTNERSHIP CHANNEL.open</span>
                  <div className="h-px w-12 bg-[#a8c3f0]/25"/>
                </div>
                <h2 className="text-[clamp(24px,3.5vw,40px)] font-bold text-white mb-4">
                  Want to <span className="text-[#a8c3f0]">Build With Us?</span>
                </h2>
                <p className="text-white/55 text-sm leading-relaxed max-w-[500px] mx-auto mb-8">
                  We're looking for strategic partners, enterprise clients, and mission-aligned builders to shape the future of private transactions.
                </p>
                <motion.button onClick={()=>navigate("/partners")}
                  whileHover={{scale:1.03,boxShadow:"0 0 40px rgba(124,147,195,0.25)"}} whileTap={{scale:0.97}}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b]"
                  style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
                  <span>BECOME A PARTNER</span><ArrowRight size={14}/>
                </motion.button>
              </div>
            </motion.div>
          </div>
        </section>
        <Footer />
      </motion.div>
    </div>
  );
};
export default LearnMore;
