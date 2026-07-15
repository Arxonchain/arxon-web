import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Globe, Smartphone, ArrowRight, ArrowLeft, Zap, Shield, Clock } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageMeta from "@/components/PageMeta";
import { ARXON_GOOGLE_PLAY_URL, ARXON_WEB_MINING_URL, ARXON_X_MENTION } from "@/lib/social";

const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.523 15.341 14.63 10.5l2.893-4.841a.5.5 0 0 0-.863-.505L13.77 9.993a5.978 5.978 0 0 0-3.54 0L7.34 5.154a.5.5 0 0 0-.863.505L9.37 10.5l-2.893 4.841a.5.5 0 0 0 .863.505l2.517-4.196A6.012 6.012 0 0 0 12 12a6.012 6.012 0 0 0 2.143-.35l2.517 4.196a.5.5 0 0 0 .863-.505zM12 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
  </svg>
);

const AppleIcon = ({ size = 24, className = "" }: { size?: number; className?: string }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} className={className} fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);

const playSteps = [
  { num: "01", cmd: "OPEN_PLAY_STORE", title: "Get the App", desc: "Tap Get on Google Play to install the official Arxon mining app on your Android device." },
  { num: "02", cmd: "INSTALL", title: "Install & Open", desc: "Download from Google Play, open the app, and sign in with your Arxon account." },
  { num: "03", cmd: "CREATE_ACCOUNT", title: "Start Mining", desc: "Create your account if needed and start earning ARX-P points immediately." },
];

const Corner = ({ pos }: { pos:"tl"|"tr"|"bl"|"br" }) => {
  const c = {tl:"top-0 left-0 border-t border-l",tr:"top-0 right-0 border-t border-r",bl:"bottom-0 left-0 border-b border-l",br:"bottom-0 right-0 border-b border-r"}[pos];
  return <div className={`absolute ${c} w-4 h-4 border-[#7c93c3]/30`} />;
};

const MiningChoice = () => {
  const navigate = useNavigate();

  const cards = [
    {
      id: "android",
      header: { icon: <AndroidIcon />, label: "GOOGLE_PLAY", badge: "AVAILABLE", badgeCls: "text-emerald-400/70 bg-emerald-400/8 border-emerald-400/20" },
      icon: <Smartphone size={24} className="text-[#7c93c3]" />,
      iconBg: "bg-[#7c93c3]/8 border-[#7c93c3]/15 group-hover:bg-[#7c93c3]/14",
      title: "Android App",
      desc: "Download the official Arxon mining app from Google Play. Mine ARX-P points directly from your Android device.",
      cta: (
        <motion.a href={ARXON_GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer"
          whileHover={{ scale:1.02, boxShadow:"0 0 30px rgba(124,147,195,0.25)" }} whileTap={{ scale:0.97 }}
          className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-mono text-sm font-bold text-[#09090b] mb-4"
          style={{ background:"linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
          <AndroidIcon /> GET ON GOOGLE PLAY <ArrowRight size={13}/>
        </motion.a>
      ),
      note: { icon: <Shield size={11} className="text-emerald-400/60 shrink-0 mt-0.5"/>, text: "Official app on Google Play — safe install, automatic updates", cls: "bg-emerald-400/[0.04] border-emerald-400/12 text-emerald-400/50" },
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
        <motion.a href={ARXON_WEB_MINING_URL} target="_blank" rel="noopener noreferrer"
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
      header: { icon: <AppleIcon size={12} className="text-white/30"/>, label: "iOS_APP", badge: "COMING_SOON", badgeCls: "text-white/30 bg-white/[0.04] border-white/[0.08]" },
      icon: <AppleIcon size={24} className="text-white/25"/>,
      iconBg: "bg-white/[0.03] border-white/[0.06]",
      title: "iOS App",
      desc: "Mining on iPhone and iPad is in development. Follow us on X and Telegram to be notified when the iOS app launches.",
      cta: (
        <div className="w-full py-3.5 rounded-xl font-mono text-sm font-bold text-white/20 border border-white/[0.06] flex items-center justify-center gap-2 cursor-not-allowed mb-4">
          <Clock size={14}/> COMING SOON
        </div>
      ),
      note: { icon: <AppleIcon size={11} className="text-white/25"/>, text: `iOS mining not available yet — follow ${ARXON_X_MENTION} for updates`, cls: "bg-white/[0.02] border-white/[0.05] text-white/25" },
      hover: "",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090b] overflow-hidden">
      <PageMeta title="Start Mining $ARX | ARXON" description="Mine ARX on Android via Google Play, in your browser, or wait for iOS — coming soon." />
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
            <p className="text-white/35 text-sm max-w-[480px] mx-auto">Google Play on Android, web app on any browser. iOS mining coming soon.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-5 mb-16">
            {cards.map((card, i) => (
              <motion.div key={card.id} initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ delay: 0.08 * i }}
                className={`relative bg-[#0a0a0d] border border-white/[0.06] rounded-2xl overflow-hidden transition-all duration-500 group ${card.hover}`}>
                <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
                <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.05]">
                  {card.header.icon}
                  <span className="font-mono text-[9px] text-white/25 tracking-widest ml-1">{card.header.label}</span>
                  <div className="flex-1"/>
                  <span className={`font-mono text-[8px] border px-2 py-0.5 rounded ${card.header.badgeCls}`}>{card.header.badge}</span>
                </div>
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

          <motion.div initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            className="relative bg-[#0a0a0d] border border-white/[0.06] rounded-2xl overflow-hidden">
            <Corner pos="tl"/><Corner pos="tr"/>
            <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.05]">
              <AndroidIcon />
              <span className="font-mono text-[9px] text-white/20 tracking-widest ml-1">ANDROID_GOOGLE_PLAY_GUIDE</span>
            </div>
            <div className="p-8 grid md:grid-cols-3 gap-5">
              {playSteps.map((s, i) => (
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
