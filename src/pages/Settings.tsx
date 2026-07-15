import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Globe, Smartphone, ArrowRight } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { ARXON_GOOGLE_PLAY_URL, ARXON_WEB_MINING_URL, ARXON_TELEGRAM_URL, ARXON_DISCORD_URL } from "@/lib/social";

const Settings = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6 py-10">
      <PageMeta title="Settings | ARXON" description="App settings are managed in the Arxon mining app." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0a0a0d] border border-white/[0.10] rounded-2xl p-8">
        <div className="flex items-center gap-3 mb-4">
          <SettingsIcon size={18} className="text-[#a8c3f0]" />
          <h1 className="text-xl font-bold text-white">App settings</h1>
        </div>
        <p className="text-white/55 text-sm mb-6 leading-relaxed">
          Notifications, security, and mining preferences are configured inside the Arxon mining app.
        </p>
        <div className="space-y-3 mb-6">
          <a href={ARXON_WEB_MINING_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-sm font-bold text-[#09090b]"
            style={{ background: "linear-gradient(135deg,#a8c3f0,#a8b8d8)" }}>
            <Globe size={14} /> Open Web App <ArrowRight size={14} />
          </a>
          <a href={ARXON_GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-sm font-semibold text-[#a8c3f0] border border-[#a8c3f0]/25">
            <Smartphone size={14} /> Get Android App
          </a>
        </div>
        <div className="pt-5 border-t border-white/[0.08] space-y-2">
          <p className="font-mono text-[9px] text-white/40 tracking-widest mb-2">COMMUNITY</p>
          <a href={ARXON_TELEGRAM_URL} target="_blank" rel="noopener noreferrer"
            className="block font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0]">Telegram →</a>
          <a href={ARXON_DISCORD_URL} target="_blank" rel="noopener noreferrer"
            className="block font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0]">Discord →</a>
        </div>
        <button onClick={() => navigate("/")} className="mt-6 font-mono text-[10px] text-white/45 hover:text-white/70 transition-colors">
          Back to home
        </button>
      </motion.div>
    </div>
  );
};

export default Settings;
