import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  CheckCircle2, Award, AlertCircle, Link2, ArrowLeft, Plus,
  User, FileText, MessageSquare, Users, Globe, Video, Hash, ArrowRight, Wifi, WifiOff
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type PortalData = {
  application: any;
  submissions: any[];
};

const AmbassadorPortal = () => {
  const navigate = useNavigate();
  const [arxonId, setArxonId] = useState("");
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [submissionUrls, setSubmissionUrls] = useState<string[]>(Array(8).fill(""));
  const [submissionNotes, setSubmissionNotes] = useState<string[]>(Array(8).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [miningConnected, setMiningConnected] = useState(false);
  const [connectingMining, setConnectingMining] = useState(false);
  const [referralCount, setReferralCount] = useState(0);

  const lookupPortal = async () => {
    if (!arxonId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setPortalData(null);

    const { data: app } = await supabase
      .from("ambassador_applications")
      .select("*")
      .eq("arxon_account_id", arxonId.trim())
      .maybeSingle();

    if (!app) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    const { data: subs } = await supabase
      .from("ambassador_submissions")
      .select("*")
      .eq("arxon_account_id", arxonId.trim())
      .order("created_at", { ascending: true });

    setPortalData({ application: app, submissions: subs || [] });

    if (subs && subs.length > 0) {
      const urls = subs.map(s => s.submission_url);
      const notes = subs.map(s => s.notes || "");
      // Pad to minimum 8
      while (urls.length < 8) { urls.push(""); notes.push(""); }
      setSubmissionUrls(urls);
      setSubmissionNotes(notes);
    }

    setLoading(false);
  };

  const addMoreFields = () => {
    setSubmissionUrls(prev => [...prev, ""]);
    setSubmissionNotes(prev => [...prev, ""]);
  };

  const handleConnectMining = async () => {
    setConnectingMining(true);
    // Simulate connecting to Arxon mining app API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setMiningConnected(true);
    // Simulate fetching referral count from the mining account
    const simulatedReferrals = Math.floor(Math.random() * 150) + 10;
    setReferralCount(simulatedReferrals);
    setConnectingMining(false);
    toast.success("Mining account connected! Referral data synced.");
  };

  const handleDisconnectMining = () => {
    setMiningConnected(false);
    setReferralCount(0);
    toast.info("Mining account disconnected.");
  };

  const handleSubmitLinks = async () => {
    const filledUrls = submissionUrls.filter(u => u.trim());
    if (filledUrls.length === 0) {
      toast.error("Please add at least one link");
      return;
    }

    setSubmitting(true);

    // Delete old submissions first, then re-insert
    await supabase
      .from("ambassador_submissions")
      .delete()
      .eq("arxon_account_id", arxonId.trim());

    const newSubmissions = submissionUrls
      .map((url, i) => ({ url: url.trim(), note: submissionNotes[i]?.trim() || "" }))
      .filter(s => s.url);

    const { error } = await supabase.from("ambassador_submissions").insert(
      newSubmissions.map(s => ({
        arxon_account_id: arxonId.trim(),
        submission_url: s.url,
        submission_type: s.url.toLowerCase().includes("space") ? "space" : "post",
        notes: s.note || null,
      }))
    );

    if (error) {
      toast.error("Failed to submit links. Please try again.");
    } else {
      toast.success("Links submitted successfully!");
      lookupPortal();
    }
    setSubmitting(false);
  };

  const inputClass = "w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/40 transition-colors";

  const postCount = portalData?.submissions.filter((s: any) => s.submission_type === "post").length || 0;
  const spaceCount = portalData?.submissions.filter((s: any) => s.submission_type === "space").length || 0;

  return (
    <div className="min-h-screen bg-[#09090b] relative overflow-hidden">
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="absolute top-[20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#7c93c3]/[0.04] blur-[120px]" />
        <div className="absolute top-[60%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#5a7bbf]/[0.03] blur-[100px]" />
        <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full bg-[#7c93c3]/[0.025] blur-[80px]" />
      </div>
      <div className="relative z-10">
        <Navbar />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-[800px] mx-auto">
            <motion.button
              onClick={() => navigate("/ambassadors")}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-[#7c93c3] text-sm font-semibold mb-8 hover:gap-3 transition-all"
            >
              <ArrowLeft size={16} /> Back to Ambassador Program
            </motion.button>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-10"
            >
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3">
                Ambassador Trial <span className="text-[#7c93c3]">Portal</span>
              </h1>
              <p className="text-[#a1a1aa] text-sm">
                Access your personal dashboard to track progress and submit content
              </p>
            </motion.div>

            <AnimatePresence mode="wait">
              {!portalData && !notFound && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="max-w-[500px] mx-auto"
                >
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8 text-center">
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-16 h-16 rounded-2xl bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center mx-auto mb-6"
                    >
                      <User size={28} className="text-[#7c93c3]" />
                    </motion.div>
                    <h3 className="text-white font-semibold text-lg mb-2">Enter Your Arxon Account ID</h3>
                    <p className="text-[#a1a1aa] text-xs mb-6">
                      Only users who have applied for the ambassador program can access this portal.
                      Haven't applied yet? <button onClick={() => navigate("/ambassadors/apply")} className="text-[#7c93c3] font-semibold hover:underline">Apply here</button>
                    </p>
                    <div className="flex gap-3">
                      <input
                        className={inputClass}
                        placeholder="Enter your Arxon Account ID"
                        value={arxonId}
                        onChange={e => setArxonId(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && lookupPortal()}
                      />
                      <motion.button
                        onClick={lookupPortal}
                        disabled={loading}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        className="bg-[#7c93c3] text-white font-bold px-6 py-3 rounded-xl text-sm shrink-0 disabled:opacity-50"
                      >
                        {loading ? "..." : "Access"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}

              {notFound && (
                <motion.div
                  key="notfound"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="max-w-[500px] mx-auto text-center"
                >
                  <div className="bg-white/[0.02] border border-white/[0.06] rounded-2xl p-8">
                    <AlertCircle size={48} className="text-[#52525b] mx-auto mb-4" />
                    <p className="text-white font-semibold mb-2">No Application Found</p>
                    <p className="text-[#a1a1aa] text-sm mb-6">
                      You haven't submitted an ambassador application yet. Apply first to access the portal.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <motion.button
                        onClick={() => navigate("/ambassadors/apply")}
                        whileHover={{ scale: 1.03 }}
                        className="bg-[#7c93c3] text-white font-bold px-6 py-3 rounded-xl text-sm flex items-center justify-center gap-2"
                      >
                        Apply Now <ArrowRight size={14} />
                      </motion.button>
                      <button onClick={() => { setNotFound(false); setArxonId(""); }} className="text-[#7c93c3] text-sm font-semibold py-3">
                        Try Again
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {portalData && (
                <motion.div
                  key="portal"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Profile Header */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 md:p-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#7c93c3]/30 to-[#5a7bbf]/20 border border-[#7c93c3]/20 flex items-center justify-center text-2xl font-bold text-[#7c93c3]">
                        {portalData.application.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-xl">{portalData.application.full_name}</h3>
                        <p className="text-[#a1a1aa] text-sm">{portalData.application.x_handle}</p>
                        <p className="text-[#52525b] text-xs mt-1">ID: {portalData.application.arxon_account_id}</p>
                      </div>
                      <span className="px-4 py-1.5 rounded-full text-xs font-bold border capitalize text-[#7c93c3] bg-[#7c93c3]/10 border-[#7c93c3]/20">
                        Active Trial
                      </span>
                    </div>

                    {portalData.application.status === "approved" && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-green-400/5 border border-green-400/15 rounded-xl p-4 mb-6"
                      >
                        <div className="flex items-start gap-3">
                          <Award size={18} className="text-green-400 mt-0.5" />
                          <div>
                            <p className="text-green-400 text-sm font-semibold">🎉 Congratulations! You are an Official Arxon Ambassador!</p>
                            <p className="text-green-400/70 text-xs mt-1">You'll receive your share of the reward pool at TGE.</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Connect Mining App */}
                    <div className="bg-white/[0.02] border border-white/[0.06] rounded-xl p-4 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {miningConnected ? (
                            <Wifi size={18} className="text-green-400" />
                          ) : (
                            <WifiOff size={18} className="text-[#52525b]" />
                          )}
                          <div>
                            <p className="text-white text-sm font-semibold">Arxon Mining App</p>
                            <p className="text-[#52525b] text-xs">
                              {miningConnected 
                                ? `Connected, ${referralCount} referrals synced` 
                                : "Connect to sync referral data automatically"}
                            </p>
                          </div>
                        </div>
                        {miningConnected ? (
                          <button
                            onClick={handleDisconnectMining}
                            className="px-4 py-2 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold hover:bg-red-400/20 transition-colors"
                          >
                            Disconnect
                          </button>
                        ) : (
                          <motion.button
                            onClick={handleConnectMining}
                            disabled={connectingMining}
                            whileHover={{ scale: 1.03 }}
                            className="relative overflow-hidden px-4 py-2 rounded-lg bg-[#7c93c3]/15 text-[#7c93c3] text-xs font-semibold hover:bg-[#7c93c3]/25 transition-colors disabled:opacity-50"
                          >
                            {connectingMining ? "Connecting..." : "Connect App"}
                          </motion.button>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: "Posts", value: postCount, target: "8+", icon: MessageSquare },
                        { label: "Spaces", value: spaceCount, target: "2+", icon: Users },
                        { label: "Referrals", value: miningConnected ? referralCount : "N/A", target: "100+", icon: Globe },
                        { label: "Total Submissions", value: portalData.submissions.length, target: "8", icon: FileText },
                      ].map((stat, i) => (
                        <motion.div
                          key={stat.label}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 text-center"
                        >
                          <stat.icon size={16} className="text-[#7c93c3] mx-auto mb-2" />
                          <p className="text-white font-bold text-lg">{stat.value}</p>
                          <p className="text-[#52525b] text-xs">{stat.label} (goal: {stat.target})</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Requirements Checklist */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#7c93c3]" />
                      Requirements Checklist
                    </h4>
                    <div className="space-y-3">
                      {[
                        { label: "8+ quality tweets/threads posted", check: postCount >= 8, icon: MessageSquare },
                        { label: "2+ Twitter Spaces hosted", check: spaceCount >= 2, icon: Users },
                        { label: "100+ referrals via your link", check: miningConnected && referralCount >= 100, icon: Globe },
                        { label: "#ArxonAmbassador hashtag usage", check: portalData.submissions.length > 0, icon: Hash },
                        { label: "1-2 video content (bonus)", check: false, icon: Video },
                      ].map((req, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className={`flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                            req.check ? "bg-green-400/5 border-green-400/10" : "bg-white/[0.01] border-white/[0.04]"
                          }`}
                        >
                          <CheckCircle2 size={16} className={req.check ? "text-green-400" : "text-[#3f3f46]"} />
                          <req.icon size={14} className={req.check ? "text-green-400/60" : "text-[#52525b]"} />
                          <span className={`text-sm ${req.check ? "text-white/80" : "text-[#52525b]"}`}>{req.label}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Submission Links */}
                  <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6">
                    <h4 className="text-white font-semibold mb-1">Submit Your Best Content</h4>
                    <p className="text-[#a1a1aa] text-xs mb-5">Add your post or Spaces links (include "space" in notes for Spaces). Click "Add More" to add extra fields.</p>
                    
                    <div className="space-y-3">
                      {submissionUrls.map((url, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.02 }}
                          className="flex gap-2"
                        >
                          <div className="flex items-center justify-center w-7 text-[#52525b] text-xs shrink-0 font-mono">{i + 1}</div>
                          <input
                            className={`${inputClass} flex-1`}
                            placeholder={`Post/Space URL ${i + 1}`}
                            value={url}
                            onChange={e => {
                              const arr = [...submissionUrls];
                              arr[i] = e.target.value;
                              setSubmissionUrls(arr);
                            }}
                          />
                          <input
                            className={`${inputClass} w-24 sm:w-32`}
                            placeholder="Notes"
                            value={submissionNotes[i]}
                            onChange={e => {
                              const arr = [...submissionNotes];
                              arr[i] = e.target.value;
                              setSubmissionNotes(arr);
                            }}
                          />
                        </motion.div>
                      ))}
                    </div>

                    <motion.button
                      onClick={addMoreFields}
                      whileHover={{ scale: 1.02 }}
                      className="mt-3 flex items-center gap-2 text-[#7c93c3] text-xs font-semibold hover:text-[#a8b8d8] transition-colors"
                    >
                      <Plus size={14} /> Add More Fields
                    </motion.button>

                    <motion.button
                      onClick={handleSubmitLinks}
                      disabled={submitting}
                      whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(124,147,195,0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      className="mt-5 w-full relative overflow-hidden bg-[#7c93c3] text-white font-bold py-3 rounded-xl text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent"
                        animate={{ x: ["-200%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }}
                      />
                      <span className="relative z-10 flex items-center gap-2">
                        {submitting ? "Submitting..." : <>Submit Links <Link2 size={14} /></>}
                      </span>
                    </motion.button>
                  </div>

                  <button onClick={() => { setPortalData(null); setArxonId(""); }} className="text-[#7c93c3] text-sm font-semibold flex items-center gap-2">
                    <ArrowLeft size={14} /> Sign out of Portal
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AmbassadorPortal;
