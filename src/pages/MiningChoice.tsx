import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Smartphone, ArrowRight, Download, ArrowLeft, Zap, Shield, Clock, Apple } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.523 15.341 14.63 10.5l2.893-4.841a.5.5 0 0 0-.863-.505L13.77 9.993a5.978 5.978 0 0 0-3.54 0L7.34 5.154a.5.5 0 0 0-.863.505L9.37 10.5l-2.893 4.841a.5.5 0 0 0 .863.505l2.517-4.196A6.012 6.012 0 0 0 12 12a6.012 6.012 0 0 0 2.143-.35l2.517 4.196a.5.5 0 0 0 .863-.505zM12 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </svg>
);

const steps = [
  { num:"01", cmd:"DOWNLOAD_APK",   title:"Download the APK",       desc:"Tap the download button and save the file to your Android device." },
  { num:"02", cmd:"ALLOW_SOURCES",  title:"Allow Unknown Sources",   desc:'Go to Settings → Security → enable "Install from Unknown Sources" or "Install Unknown Apps".' },
  { num:"03", cmd:"INSTALL_APP",    title:"Open & Install",          desc:"Open the downloaded APK from your notifications or file manager and tap Install." },
  { num:"04", cmd:"CREATE_ACCOUNT", title:"Create Your Account",     desc:"Launch the Arxon app, create your account and start earning ARX tokens immediately." },
];

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c = {tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#7c93c3]/30`} />;
};

const MiningChoice = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: "apk",
      header: { icon: <AndroidIcon />, label: "ANDROID_APK", badge: "AVAILABLE", badgeCls: "text-emerald-400/70 bg-emerald-400/8 border-emerald-400/20" },
      icon: <Smartphone size={24} className="text-[#7c93c3]" />,
      iconBg: "bg-[#7c93c3]/8 border-[#7c93c3]/15 group-hover:bg-[#7c93c3]/14",
      title: "Android App",
      desc: "Download the official Arxon mining app for Android. Mine ARX-P points directly from your mobile device.",
      cta: (
        <motion.a href="/Arxon-Mining-App.apk" download
          whileHover={{ scale:1.02, boxShadow:"0 0 30px rgba(124,147,195,0.25)" }} whileTap={{ scale:0.97 }}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b] mb-4"
          style={{ background:"linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
          <Download size={14}/> DOWNLOAD APK
        </motion.a>
      ),
      note: { icon: <Shield size={11} className="text-amber-400/60 shrink-0 mt-0.5"/>, text: "Direct APK — allow unknown sources in settings to install", cls: "bg-amber-400/[0.04] border-amber-400/12 text-amber-400/50" },
      hover: "hover:border-[#7c93c3]/25",
    },
    {
      id: "web",
      header: { icon: <Globe size={12} className="text-[#7c93c3]/60"/>, label: "WEB_APP", badge: "LIVE", badgeCls: "text-emerald-400/70 bg-emerald-400/8 border-emerald-400/20" },
      icon: <Globe size={24} className="text-[#7c93c3]" />,
      iconBg: "bg-[#7c93c3]/8 border-[#7c93c3]/15 group-hover:bg-[#7c93c3]/14",
      title: "Web App",
      desc: "Mine directly from your browser — no download required. Works on any device with a modern web browser.",
      cta: (
        <motion.a href="https://arxonchain.xyz/" target="_blank" rel="noopener noreferrer"
          whileHover={{ scale:1.02, boxShadow:"0 0 30px rgba(124,147,195,0.25)" }} whileTap={{ scale:0.97 }}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b] mb-4"
          style={{ background:"linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
          <Globe size={14}/> OPEN WEB APP <ArrowRight size={13}/>
        </motion.a>
      ),
      note: { icon: <Zap size={11} className="text-[#7c93c3]/60 shrink-0"/>, text: "Opens arxonchain.xyz — start mining instantly in your browser", cls: "bg-[#7c93c3]/[0.04] border-[#7c93c3]/12 text-[#7c93c3]/50" },
      hover: "hover:border-[#7c93c3]/25",
    },
    {
      id: "ios",
      header: { icon: <Apple size={12} className="text-white/30"/>, label: "iOS_APP", badge: "COMING_SOON", badgeCls: "text-white/30 bg-white/[0.04] border-white/[0.08]" },
      icon: <Apple size={24} className="text-white/25" />,
      iconBg: "bg-white/[0.03] border-white/[0.06]",
      title: "iOS App",
      desc: "The Arxon mining app for iPhone and iPad is in development. Follow us on X to be notified the moment it launches.",
      cta: (
        <div className="w-full py-3.5 rounded-xl font-mono text-sm font-bold text-white/20 border border-white/[0.06] flex items-center justify-center gap-2 cursor-not-allowed mb-4">
          <Clock size={14}/> COMING SOON
        </div>
      ),
      note: { icon: <Apple size={11} className="text-white/25 shrink-0"/>, text: "No release date set — follow @arxoninfra on X for updates", cls: "bg-white/[0.02] border-white/[0.05] text-white/25" },
      hover: "",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{ backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)", backgroundSize:"64px 64px" }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background:"radial-gradient(ellipse at 50% 0%,rgba(124,147,195,0.06) 0%,transparent 60%)" }} />
      <Navbar />

      <div className="relative z-10 pt-28 pb-20 px-6">
        <div className="max-w-[1100px] mx-auto">
          <motion.button onClick={() => navigate(-1)} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            className="flex items-center gap-2 font-mono text-xs text-[#7c93c3]/60 hover:text-[#7c93c3] mb-10 transition-colors">
            <ArrowLeft size={12}/> BACK
          </motion.button>

          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-6 bg-[#7c93c3]/40"/>
              <span className="font-mono text-[9px] text-[#7c93c3]/50 tracking-widest">MINING_BOOTSTRAP.init</span>
              <div className="h-px w-6 bg-[#7c93c3]/40"/>
            </div>
            <h1 className="text-[clamp(28px,4vw,52px)] font-bold text-white mb-3">
              Start Mining <span className="text-[#7c93c3]">$ARX</span>
            </h1>
            <p className="text-white/35 text-sm max-w-[480px] mx-auto">Mine ARX points from your phone or browser. No expensive hardware required.</p>
          </motion.div>

          {/* Three option cards */}
          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {cards.map((card, i) => (
              <motion.div key={card.id} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.08 * i }}
                className={`relative bg-[#0a0a0d] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-500 group ${card.hover}`}>
                <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
                {/* Header bar */}
                <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.05]">
                  {card.header.icon}
                  <span className="font-mono text-[9px] text-white/25 tracking-widest ml-1">{card.header.label}</span>
                  <div className="flex-1"/>
                  <span className={`font-mono text-[8px] border px-2 py-0.5 rounded ${card.header.badgeCls}`}>{card.header.badge}</span>
                </div>
                {/* Body */}
                <div className="p-7">
                  <div className={`w-14 h-14 rounded-xl border flex items-center justify-center mb-6 transition-colors ${card.iconBg}`}>
                    {card.icon}
                  </div>
                  <h2 className="text-white text-xl font-bold mb-2">{card.title}</h2>
                  <p className="text-white/40 text-sm mb-6 leading-relaxed">{card.desc}</p>
                  {card.cta}
                  <div className={`flex items-start gap-2 px-3 py-2.5 border rounded-lg ${card.note.cls}`}>
                    {card.note.icon}
                    <p className="font-mono text-[9px] leading-relaxed">{card.note.text}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Install guide (Android only) */}
          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="relative bg-[#0a0a0d] border border-white/[0.06] rounded-2xl overflow-hidden">
            <Corner pos="tl"/><Corner pos="tr"/>
            <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.05]">
              <AndroidIcon />
              <span className="font-mono text-[9px] text-white/20 tracking-widest ml-1">ANDROID_INSTALL_GUIDE.sh</span>
            </div>
            <div className="p-8 grid md:grid-cols-4 gap-5">
              {steps.map((s, i) => (
                <div key={i} className="group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-[#7c93c3]/8 border border-[#7c93c3]/15 flex items-center justify-center font-mono text-xs font-bold text-[#7c93c3]">{s.num}</div>
                    <div className="flex-1 h-px bg-[#7c93c3]/10" />
                  </div>
                  <div className="font-mono text-[8px] text-white/18 mb-1.5 tracking-widest">{s.cmd}</div>
                  <h4 className="text-white text-sm font-bold mb-1.5">{s.title}</h4>
                  <p className="text-white/35 text-xs leading-relaxed">{s.desc}</p>
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
