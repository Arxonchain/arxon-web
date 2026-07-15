import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Smartphone, Globe, ArrowRight, Terminal } from "lucide-react";
import PageMeta from "@/components/PageMeta";
import { ARXON_GOOGLE_PLAY_URL, ARXON_WEB_MINING_URL } from "@/lib/social";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center px-6">
      <PageMeta title="Your Profile | ARXON" description="Manage your Arxon account in the mining app." />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-[#0a0a0d] border border-white/[0.10] rounded-2xl p-8 text-center">
        <Terminal size={20} className="text-[#a8c3f0] mx-auto mb-4" />
        <h1 className="text-xl font-bold text-white mb-2">Profile lives in the mining app</h1>
        <p className="text-white/55 text-sm mb-6 leading-relaxed">
          Your miner profile, stats, and referrals are managed inside the Arxon mining app — not on this marketing site.
        </p>
        <div className="space-y-3">
          <a href={ARXON_WEB_MINING_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-sm font-bold text-[#09090b]"
            style={{ background: "linear-gradient(135deg,#a8c3f0,#a8b8d8)" }}>
            <Globe size={14} /> Open Web App <ArrowRight size={14} />
          </a>
          <a href={ARXON_GOOGLE_PLAY_URL} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono text-sm font-semibold text-[#a8c3f0] border border-[#a8c3f0]/25">
            <Smartphone size={14} /> Get Android App
          </a>
          <button onClick={() => navigate("/")} className="font-mono text-[10px] text-white/45 hover:text-white/70 transition-colors">
            Back to home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
