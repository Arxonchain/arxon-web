import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Smartphone, ArrowRight, Download, ArrowLeft, Zap, Shield, Clock, CheckCircle2 } from "lucide-react";
import arxonLogoWide from "@/assets/arxon-logo-wide.svg";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.523 15.341 14.63 10.5l2.893-4.841a.5.5 0 0 0-.863-.505L13.77 9.993a5.978 5.978 0 0 0-3.54 0L7.34 5.154a.5.5 0 0 0-.863.505L9.37 10.5l-2.893 4.841a.5.5 0 0 0 .863.505l2.517-4.196A6.012 6.012 0 0 0 12 12a6.012 6.012 0 0 0 2.143-.35l2.517 4.196a.5.5 0 0 0 .863-.505zM12 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </svg>
);

const steps = [
  { num:"01", cmd:"DOWNLOAD_APK", title:"Download the APK", desc:"Tap the download button and save the file to your Android device." },
  { num:"02", cmd:"ALLOW_SOURCES", title:"Allow Unknown Sources", desc:'Go to Settings → Security → enable "Install from Unknown Sources" or "Install Unknown Apps".' },
  { num:"03", cmd:"INSTALL_APP", title:"Open & Install", desc:"Open the downloaded APK from your notifications or file manager and tap Install." },
  { num:"04", cmd:"CREATE_ACCOUNT", title:"Create Your Account", desc:"Launch the Arxon app, create your account and start earning ARX tokens immediately." },
];

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c={tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#a8c3f0]/30`} />;
};

const MiningChoice = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]" style={{backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",backgroundSize:"64px 64px"}} />
      <div className="absolute inset-0 pointer-events-none" style={{background:"radial-gradient(ellipse at 50% 0%,rgba(124,147,195,0.06) 0%,transparent 60%)"}} />
      <Navbar />

      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <motion.button onClick={()=>navigate(-1)} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
            className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/60 hover:text-[#a8c3f0] mb-10 transition-colors">
            <ArrowLeft size={12}/>BACK
          </motion.button>

          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-6 bg-[#a8c3f0]/40"/>
              <span className="font-mono text-[9px] text-[#a8c3f0]/50 tracking-widest">MINING_BOOTSTRAP.init</span>
              <div className="h-px w-6 bg-[#a8c3f0]/40"/>
            </div>
            <h1 className="text-[clamp(28px,4vw,52px)] font-bold text-white mb-3">
              Start Mining <span className="text-[#a8c3f0]">$ARX</span>
            </h1>
            <p className="text-white/55 text-sm max-w-[480px] mx-auto">Mine ARX points from your phone or browser. No expensive hardware required.</p>
          </motion.div>

          {/* Two options */}
          <div className="grid md:grid-cols-2 gap-5 mb-16">
            {/* APK Download */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.1}}
              className="relative bg-[#0a0a0d] border border-white/[0.10] rounded-2xl overflow-hidden hover:border-[#a8c3f0]/25 transition-all duration-500 group">
              <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
              <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.09]">
                <AndroidIcon />
                <span className="font-mono text-[9px] text-white/65 tracking-widest ml-1">ANDROID_APK</span>
                <div className="flex-1"/>
                <span className="font-mono text-[8px] text-emerald-400/60 bg-emerald-400/8 border border-emerald-400/15 px-2 py-0.5 rounded">AVAILABLE</span>
              </div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-[#a8c3f0]/8 border border-[#a8c3f0]/15 flex items-center justify-center mb-6 group-hover:bg-[#a8c3f0]/14 transition-colors">
                  <Smartphone size={24} className="text-[#a8c3f0]"/>
                </div>
                <h2 className="text-white text-xl font-bold mb-2">Android App</h2>
                <p className="text-white/60 text-sm mb-6">Download the official Arxon mining app for Android. Mine ARX-P points directly from your mobile device.</p>
                <motion.a href="/Arxon-Mining-App.apk" download
                  whileHover={{scale:1.02,boxShadow:"0 0 30px rgba(124,147,195,0.25)"}} whileTap={{scale:0.97}}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b] mb-4"
                  style={{background:"linear-gradient(135deg,#a8c3f0,#a8b8d8)"}}>
                  <Download size={14}/> DOWNLOAD APK
                </motion.a>
                <div className="flex items-start gap-2 px-3 py-2.5 bg-amber-400/[0.04] border border-amber-400/12 rounded-lg">
                  <Shield size={11} className="text-amber-400/60 shrink-0 mt-0.5"/>
                  <p className="font-mono text-[9px] text-amber-400/50 leading-relaxed">Direct APK — allow unknown sources in settings to install</p>
                </div>
              </div>
            </motion.div>

            {/* Web / iOS */}
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:0.15}}
              className="relative bg-[#0a0a0d] border border-white/[0.10] rounded-2xl overflow-hidden group">
              <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
              <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.09]">
                <Globe size={12} className="text-white/50"/>
                <span className="font-mono text-[9px] text-white/65 tracking-widest ml-1">WEB_&_IOS</span>
                <div className="flex-1"/>
                <span className="font-mono text-[8px] text-[#a8c3f0]/60 bg-[#a8c3f0]/8 border border-[#a8c3f0]/15 px-2 py-0.5 rounded">COMING_SOON</span>
              </div>
              <div className="p-8">
                <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/[0.10] flex items-center justify-center mb-6">
                  <Globe size={24} className="text-white/65"/>
                </div>
                <h2 className="text-white text-xl font-bold mb-2">Web & iOS</h2>
                <p className="text-white/60 text-sm mb-6">Mine directly from any web browser or iOS device. Full cross-platform support launching soon.</p>
                <div className="w-full py-3.5 rounded-xl font-mono text-sm font-bold text-white/60 border border-white/[0.10] flex items-center justify-center gap-2 cursor-not-allowed mb-4">
                  <Clock size={14}/> COMING JAN 2026
                </div>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#a8c3f0]/[0.04] border border-[#a8c3f0]/12 rounded-lg">
                  <Zap size={11} className="text-[#a8c3f0]/60 shrink-0"/>
                  <p className="font-mono text-[9px] text-[#a8c3f0]/50">Join the waitlist to be first notified</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Install guide */}
          <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
            className="relative bg-[#0a0a0d] border border-white/[0.10] rounded-2xl overflow-hidden">
            <Corner pos="tl"/><Corner pos="tr"/>
            <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.09]">
              <span className="font-mono text-[9px] text-white/60 tracking-widest">INSTALL_GUIDE.sh</span>
            </div>
            <div className="p-8 grid md:grid-cols-4 gap-5">
              {steps.map((s,i)=>(
                <div key={i} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#a8c3f0]/8 border border-[#a8c3f0]/15 flex items-center justify-center font-mono text-xs font-bold text-[#a8c3f0]">{s.num}</div>
                    <div className="flex-1 h-px bg-[#a8c3f0]/10" />
                  </div>
                  <div className="font-mono text-[8px] text-white/38 mb-1.5 tracking-widest">{s.cmd}</div>
                  <h4 className="text-white text-sm font-bold mb-1.5">{s.title}</h4>
                  <p className="text-white/55 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
};
export default MiningChoice;
