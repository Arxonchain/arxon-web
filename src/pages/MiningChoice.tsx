import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Globe,
  Smartphone,
  ArrowRight,
  Download,
  ArrowLeft,
  Zap,
  Shield,
  Clock,
  CheckCircle2,
  Apple,
} from "lucide-react";
import arxonLogoWide from "@/assets/arxon-logo-wide.png";

// Custom Android / Google Play icon as SVG
const AndroidIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M17.523 15.341 14.63 10.5l2.893-4.841a.5.5 0 0 0-.863-.505L13.77 9.993a5.978 5.978 0 0 0-3.54 0L7.34 5.154a.5.5 0 0 0-.863.505L9.37 10.5l-2.893 4.841a.5.5 0 0 0 .863.505l2.517-4.196A6.012 6.012 0 0 0 12 12a6.012 6.012 0 0 0 2.143-.35l2.517 4.196a.5.5 0 0 0 .863-.505zM12 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2zm-3 0a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
  </svg>
);

const steps = [
  {
    num: "01",
    title: "Download the APK",
    desc: "Tap the download button above and save the file to your Android device.",
  },
  {
    num: "02",
    title: "Allow Unknown Sources",
    desc: 'Go to Settings → Security → enable "Install from Unknown Sources" or "Install Unknown Apps".',
  },
  {
    num: "03",
    title: "Open & Install",
    desc: "Open the downloaded APK file from your notifications or file manager and tap Install.",
  },
  {
    num: "04",
    title: "Create Your Account",
    desc: "Launch the Arxon app, create your account and start earning ARX tokens immediately.",
  },
];

const MiningChoice = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] overflow-x-hidden">
      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-[radial-gradient(ellipse_at_top,hsl(220_50%_20%/0.18)_0%,transparent_65%)]" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-[radial-gradient(ellipse_at_bottom_right,hsl(220_50%_15%/0.12)_0%,transparent_70%)]" />
      </div>

      {/* Nav */}
      <nav className="relative z-10 max-w-[1200px] mx-auto px-6 py-6 flex items-center justify-between">
        <a href="/" onClick={(e) => { e.preventDefault(); navigate("/"); }}>
          <img src={arxonLogoWide} alt="ARXON" className="h-7" />
        </a>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[#52525b] hover:text-white transition-colors text-sm"
        >
          <ArrowLeft size={15} />
          Back
        </button>
      </nav>

      <div className="relative z-10 max-w-[1200px] mx-auto px-6 pb-24 pt-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#7c93c3]/20 bg-[#7c93c3]/5 mb-6">
            <Zap size={11} className="text-[#7c93c3]" />
            <span className="text-[#7c93c3] text-[11px] font-black uppercase tracking-[0.15em]">Start Mining ARX</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-[-0.03em] leading-[1.05] mb-4">
            Choose how you<br />
            <span className="text-[#7c93c3]">want to mine</span>
          </h1>
          <p className="text-[#52525b] text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Mine ARX tokens from your browser or take it mobile — same rewards, your choice.
          </p>
        </motion.div>

        {/* Choice cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-16">

          {/* ── Web Browser Mining ─────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="group relative rounded-2xl border border-white/[0.06] bg-[#0f0f13] p-8 flex flex-col hover:border-[#7c93c3]/25 transition-all duration-300 hover:shadow-[0_0_60px_rgba(124,147,195,0.06)] cursor-pointer"
            onClick={() => window.open("https://arxonchain.xyz", "_blank")}
          >
            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center mb-6">
              <Globe size={26} className="text-[#7c93c3]" />
            </div>

            <h2 className="text-white text-2xl font-bold tracking-tight mb-2">
              Web Browser Mining
            </h2>
            <p className="text-[#52525b] text-sm leading-relaxed mb-8">
              No download required. Open your browser, log in and start earning ARX tokens instantly from any device.
            </p>

            <div className="space-y-2.5 mb-10 flex-1">
              {[
                "No installation needed",
                "Works on any device",
                "Instant access, mine right now",
                "Full dashboard & earnings tracker",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2.5">
                  <CheckCircle2 size={14} className="text-[#7c93c3] flex-shrink-0" />
                  <span className="text-[#a1a1aa] text-[13px]">{f}</span>
                </div>
              ))}
            </div>

            <motion.div
              className="btn-shimmer flex items-center justify-center gap-2 w-full bg-[#7c93c3] text-white text-sm font-bold py-3.5 rounded-xl hover:bg-[#6b82b2] transition-all shadow-[0_0_30px_rgba(124,147,195,0.2)]"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
            >
              Open Mining App
              <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </motion.div>
            <p className="text-center text-[#3f3f46] text-[11px] mt-3 font-medium tracking-wide">
              arxonchain.xyz
            </p>
          </motion.div>

          {/* ── Mobile App Mining ──────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative rounded-2xl border border-white/[0.06] bg-[#0f0f13] p-8 flex flex-col hover:border-[#7c93c3]/25 transition-all duration-300 hover:shadow-[0_0_60px_rgba(124,147,195,0.06)]"
          >
            {/* Badge */}
            <div className="absolute top-4 right-4 bg-[#7c93c3]/15 border border-[#7c93c3]/25 text-[#7c93c3] text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full">
              New
            </div>

            {/* Icon */}
            <div className="w-14 h-14 rounded-xl bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center mb-6">
              <Smartphone size={26} className="text-[#7c93c3]" />
            </div>

            <h2 className="text-white text-2xl font-bold tracking-tight mb-2">
              Mobile App Mining
            </h2>
            <p className="text-[#52525b] text-sm leading-relaxed mb-8">
              Mine on the go with our dedicated mobile app. Better performance, push notifications, and a native experience.
            </p>

            <div className="space-y-3 flex-1">

              {/* APK Download — LIVE */}
              <motion.a
               href="/Arxon-Mining-App.apk"
                download="Arxon-Mining-App.apk"
                onClick={(e) => e.stopPropagation()}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="btn-shimmer group flex items-center gap-3 w-full bg-[#7c93c3] text-white px-5 py-3.5 rounded-xl hover:bg-[#6b82b2] transition-all shadow-[0_0_30px_rgba(124,147,195,0.2)]"
              >
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                  <AndroidIcon />
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] text-white/60 font-medium leading-none mb-0.5">Download APK</div>
                  <div className="text-sm font-bold leading-none">Android App</div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/10 rounded-lg px-2.5 py-1.5 flex-shrink-0">
                  <Download size={12} />
                  <span className="text-[11px] font-bold">17 MB</span>
                </div>
              </motion.a>

              {/* Google Play — Coming Soon */}
              <div className="flex items-center gap-3 w-full border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 rounded-xl opacity-50 cursor-not-allowed select-none">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white/50" fill="currentColor">
                    <path d="M3.18 23.76c.3.17.65.19.97.07l11.65-6.73-2.5-2.5-10.12 9.16zM.44 1.05C.17 1.37 0 1.83 0 2.42v19.16c0 .59.17 1.05.44 1.37l.07.07 10.73-10.73v-.25L.51.98l-.07.07zM20.8 10.37l-2.9-1.68-2.8 2.8 2.8 2.8 2.93-1.69c.84-.48.84-1.27-.03-1.75v.52zM3.18.24l11.65 6.73-2.5 2.5L2.21.31c.3-.19.67-.19.97-.07z" />
                  </svg>
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] text-white/30 font-medium leading-none mb-0.5">Get it on</div>
                  <div className="text-sm font-bold text-white/40 leading-none">Google Play</div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 flex-shrink-0">
                  <Clock size={11} className="text-white/30" />
                  <span className="text-[11px] font-semibold text-white/30">Soon</span>
                </div>
              </div>

              {/* iOS — Coming Soon */}
              <div className="flex items-center gap-3 w-full border border-white/[0.06] bg-white/[0.02] px-5 py-3.5 rounded-xl opacity-50 cursor-not-allowed select-none">
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                  <Apple size={20} className="text-white/50" />
                </div>
                <div className="text-left flex-1">
                  <div className="text-[10px] text-white/30 font-medium leading-none mb-0.5">Download on the</div>
                  <div className="text-sm font-bold text-white/40 leading-none">App Store</div>
                </div>
                <div className="flex items-center gap-1.5 bg-white/5 rounded-lg px-2.5 py-1.5 flex-shrink-0">
                  <Clock size={11} className="text-white/30" />
                  <span className="text-[11px] font-semibold text-white/30">Soon</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* APK Installation Guide */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="rounded-2xl border border-white/[0.06] bg-[#0f0f13] p-8 md:p-10"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-9 h-9 rounded-lg bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center">
              <Shield size={16} className="text-[#7c93c3]" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg tracking-tight">How to Install the Android APK</h3>
              <p className="text-[#52525b] text-xs mt-0.5">Step-by-step guide for Android users</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.08 }}
                className="relative"
              >
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-5 left-[calc(100%+10px)] w-[calc(100%-20px)] h-px bg-gradient-to-r from-[#7c93c3]/20 to-transparent" />
                )}
                <div className="text-[#7c93c3]/40 text-[11px] font-black tracking-[0.15em] mb-3">{step.num}</div>
                <h4 className="text-white text-sm font-bold mb-2 leading-snug">{step.title}</h4>
                <p className="text-[#52525b] text-[13px] leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Security note */}
          <div className="mt-8 pt-6 border-t border-white/[0.04] flex items-start gap-3">
            <Shield size={14} className="text-[#7c93c3] flex-shrink-0 mt-0.5" />
            <p className="text-[#3f3f46] text-[12px] leading-relaxed">
              <span className="text-[#52525b] font-semibold">Safe to install.</span> The Arxon APK is signed and verified. Android shows a warning for all APKs installed outside the Play Store — this is normal. The file is hosted directly on arxon.io.
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default MiningChoice;
