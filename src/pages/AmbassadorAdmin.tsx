import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users, CheckCircle2, XCircle, Clock, Search,
  ExternalLink, ChevronDown, ChevronUp, Shield, ArrowLeft,
  MessageSquare, Globe, Twitter, Link2, Settings, Save, Plus,
  Video, Activity, ChevronRight, ChevronLeft, Copy, Check,
  RefreshCw, Hash, Award, AlertCircle, X as XIcon
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { verifyApprovedAdminAccess } from "@/lib/adminAccess";

/* ─── Static helpers ─── */
const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/40 transition-colors font-mono";

const InfoBlock = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-[#52525b] text-xs font-semibold uppercase mb-1">{label}</p>
    <p className="text-[#a1a1aa] text-sm break-all">{String(value)}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
    status === "approved" ? "text-green-400 bg-green-400/10 border-green-400/20" :
    status === "rejected" ? "text-red-400 bg-red-400/10 border-red-400/20" :
    "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
  }`}>{status}</span>
);

const TypeTag = ({ type }: { type: string }) => {
  const map: Record<string, string> = {
    post: "text-[#7c93c3] bg-[#7c93c3]/10 border-[#7c93c3]/20",
    space: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    video: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };
  return (
    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${map[type] || "text-white/40 bg-white/[0.04] border-white/[0.08]"}`}>
      {type}
    </span>
  );
};

/* ════════════════════════════════════════
   COPY BUTTON
════════════════════════════════════════ */
const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button onClick={copy} className="shrink-0 w-6 h-6 rounded flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors" title="Copy link">
      {copied ? <Check size={10} className="text-green-400" /> : <Copy size={10} className="text-white/40" />}
    </button>
  );
};

/* ════════════════════════════════════════
   ADMIN SETTINGS PANEL
════════════════════════════════════════ */
const SettingsPanel = ({ onClose }: { onClose: () => void }) => {
  const [post3, setPost3] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("ambassador_settings").select("value").eq("key", "retweet_post_3").maybeSingle()
      .then(({ data }) => { if (data?.value) setPost3(data.value); setLoaded(true); });
  }, []);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("ambassador_settings").upsert(
      { key: "retweet_post_3", value: post3.trim() },
      { onConflict: "key" }
    );
    if (error) toast.error("Failed to save"); else toast.success("Post 3 link saved — portal updated instantly");
    setSaving(false);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="bg-[#0f0f17] border border-[#7c93c3]/25 rounded-2xl overflow-hidden mb-6">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-white/[0.06] bg-[#7c93c3]/[0.04]">
        <Settings size={14} className="text-[#7c93c3]" />
        <span className="font-mono text-[10px] text-[#7c93c3]/80 tracking-widest">AMBASSADOR_SETTINGS · RETWEET_LINKS</span>
        <div className="flex-1" />
        <button onClick={onClose} className="font-mono text-[10px] text-white/40 hover:text-white/70 transition-colors">CLOSE ✕</button>
      </div>
      <div className="p-6 space-y-5">
        <div>
          <p className="font-mono text-[10px] text-[#7c93c3]/70 tracking-widest mb-1">RETWEET POST #1 <span className="text-white/25">(hardcoded)</span></p>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg">
            <Link2 size={11} className="text-white/30 shrink-0" />
            <span className="font-mono text-xs text-white/35 truncate">https://x.com/arxoninfra/status/2052324369775440352?s=20</span>
            <a href="https://x.com/arxoninfra/status/2052324369775440352?s=20" target="_blank" rel="noopener noreferrer" className="shrink-0">
              <ExternalLink size={10} className="text-[#7c93c3]/40 hover:text-[#7c93c3]" />
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] text-[#7c93c3]/70 tracking-widest mb-1">RETWEET POST #2 <span className="text-white/25">(hardcoded)</span></p>
          <div className="flex items-center gap-2 px-3 py-2.5 bg-white/[0.02] border border-white/[0.05] rounded-lg">
            <Link2 size={11} className="text-white/30 shrink-0" />
            <span className="font-mono text-xs text-white/35 truncate">https://x.com/arxoninfra/status/2041816286724796678?s=20</span>
            <a href="https://x.com/arxoninfra/status/2041816286724796678?s=20" target="_blank" rel="noopener noreferrer" className="shrink-0">
              <ExternalLink size={10} className="text-[#7c93c3]/40 hover:text-[#7c93c3]" />
            </a>
          </div>
        </div>
        <div>
          <p className="font-mono text-[10px] text-[#7c93c3] tracking-widest mb-2 flex items-center gap-2">
            RETWEET POST #3 <span className="text-[#7c93c3]/50">(admin-configurable · paste link below)</span>
            <span className="px-2 py-0.5 rounded bg-[#7c93c3]/15 border border-[#7c93c3]/25 text-[8px] text-[#7c93c3]">LIVE</span>
          </p>
          <div className="flex gap-2">
            <input className={`${inputCls} flex-1`}
              placeholder="https://x.com/arxoninfra/status/..."
              value={loaded ? post3 : "Loading..."}
              onChange={e => setPost3(e.target.value)}
              disabled={!loaded}
            />
            <motion.button onClick={save} disabled={saving || !post3.trim()}
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg font-mono text-xs font-bold text-[#09090b] disabled:opacity-40"
              style={{ background: "linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
              {saving ? <Activity size={12} className="animate-spin" /> : <Save size={12} />}
              SAVE
            </motion.button>
          </div>
          {post3.trim() && (
            <div className="mt-2 flex items-center gap-2">
              <CheckCircle2 size={10} className="text-emerald-400" />
              <span className="font-mono text-[9px] text-emerald-400/70">This link is live in the ambassador portal checklist</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   PORTAL SUBMISSION DETAIL VIEW
════════════════════════════════════════ */
const PortalDetailView = ({
  app,
  submissions,
  allApps,
  onClose,
  onStatusChange,
  onNavigate,
}: {
  app: any;
  submissions: any[];
  allApps: any[];
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onNavigate: (id: string) => void;
}) => {
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const [loadingReferrals, setLoadingReferrals] = useState(false);
  const [updating, setUpdating] = useState(false);

  const postSubs  = submissions.filter(s => s.submission_type === "post");
  const spaceSubs = submissions.filter(s => s.submission_type === "space");
  const videoSubs = submissions.filter(s => s.submission_type === "video");

  const currentIdx = allApps.findIndex(a => a.id === app.id);
  const prevApp = allApps[currentIdx - 1];
  const nextApp = allApps[currentIdx + 1];

  const syncReferrals = async () => {
    setLoadingReferrals(true);
    try {
      const res = await fetch(
        `https://knfpmzjghbjnlnarsivs.supabase.co/functions/v1/get-referral-count?account_id=${encodeURIComponent(app.arxon_account_id)}`,
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (res.ok) {
        const d = await res.json();
        setReferralCount(d.referral_count ?? 0);
      } else {
        setReferralCount(app.estimated_new_users ?? 0);
      }
    } catch {
      setReferralCount(app.estimated_new_users ?? 0);
    }
    setLoadingReferrals(false);
  };

  const handleStatus = async (status: string) => {
    setUpdating(true);
    await onStatusChange(app.id, status);
    setUpdating(false);
  };

  useEffect(() => { syncReferrals(); }, [app.id]);

  const SubSection = ({ label, items, color }: { label: string; items: any[]; color: string }) => (
    <div className="mb-4">
      <div className={`flex items-center gap-2 mb-2 font-mono text-[9px] tracking-widest ${color}`}>
        {label === "POSTS" && <MessageSquare size={10} />}
        {label === "SPACES" && <Users size={10} />}
        {label === "VIDEOS" && <Video size={10} />}
        {label} ({items.length})
      </div>
      {items.length === 0 ? (
        <div className="px-4 py-3 bg-white/[0.02] border border-white/[0.04] rounded-xl">
          <span className="font-mono text-[10px] text-white/25">No {label.toLowerCase()} submitted</span>
        </div>
      ) : (
        <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
          {items.map((sub: any, j: number) => (
            <div key={j} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors group">
              <span className="font-mono text-[9px] text-[#52525b] w-5 shrink-0">{j + 1}</span>
              <TypeTag type={sub.submission_type} />
              <a href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                className={`text-xs hover:underline truncate flex-1 ${
                  sub.submission_type === "space" ? "text-purple-400" :
                  sub.submission_type === "video" ? "text-amber-400" : "text-[#7c93c3]"
                }`}>
                {sub.submission_url}
              </a>
              <CopyBtn text={sub.submission_url} />
              <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                <ExternalLink size={11} className="text-white/40 hover:text-white" />
              </a>
              <span className="font-mono text-[9px] text-[#52525b] shrink-0 hidden sm:block">
                {new Date(sub.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 24 }}
      className="fixed inset-0 z-50 bg-[#09090b]/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="max-w-[880px] mx-auto px-4 py-8">

        {/* Top nav */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="flex items-center gap-2 text-[#7c93c3] text-sm font-semibold hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Back to Submissions
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => prevApp && onNavigate(prevApp.id)}
              disabled={!prevApp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] text-xs font-semibold disabled:opacity-30 hover:bg-white/[0.07] transition-colors"
            >
              <ChevronLeft size={13} /> Prev
            </button>
            <span className="font-mono text-[10px] text-[#52525b]">{currentIdx + 1} / {allApps.length}</span>
            <button
              onClick={() => nextApp && onNavigate(nextApp.id)}
              disabled={!nextApp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] text-xs font-semibold disabled:opacity-30 hover:bg-white/[0.07] transition-colors"
            >
              Next <ChevronRight size={13} />
            </button>
          </div>
        </div>

        {/* Profile header */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6 mb-4">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#7c93c3]/20 border border-[#7c93c3]/30 flex items-center justify-center font-mono text-xl font-bold text-[#7c93c3] shrink-0">
              {app.full_name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-1">
                <h2 className="text-white font-bold text-xl">{app.full_name}</h2>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-[#a1a1aa] text-sm font-mono mb-0.5">{app.x_handle}</p>
              <p className="text-[#52525b] font-mono text-xs">ID: {app.arxon_account_id} · {app.country || "—"} · Applied {new Date(app.created_at).toLocaleDateString()}</p>
              {/* Action buttons */}
              <div className="flex gap-2 mt-4 flex-wrap">
                {app.status !== "approved" && (
                  <button onClick={() => handleStatus("approved")} disabled={updating}
                    className="px-4 py-2 rounded-lg bg-green-400/10 text-green-400 text-xs font-semibold border border-green-400/20 hover:bg-green-400/20 transition-colors disabled:opacity-40">
                    ✓ Approve
                  </button>
                )}
                {app.status !== "rejected" && (
                  <button onClick={() => handleStatus("rejected")} disabled={updating}
                    className="px-4 py-2 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-40">
                    ✕ Reject
                  </button>
                )}
                {app.status !== "pending" && (
                  <button onClick={() => handleStatus("pending")} disabled={updating}
                    className="px-4 py-2 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-semibold border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors disabled:opacity-40">
                    ↺ Reset Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Referral + submission stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {/* Referrals */}
          <div className={`bg-white/[0.03] border rounded-xl p-4 ${(referralCount ?? 0) >= 40 ? "border-emerald-400/30" : "border-white/[0.08]"}`}>
            <div className="flex items-center justify-between mb-2">
              <Globe size={13} className={`${(referralCount ?? 0) >= 40 ? "text-emerald-400" : "text-[#7c93c3]"}`} />
              <button onClick={syncReferrals} disabled={loadingReferrals} title="Sync referrals"
                className="w-5 h-5 rounded flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors disabled:opacity-40">
                <RefreshCw size={9} className={`text-[#7c93c3] ${loadingReferrals ? "animate-spin" : ""}`} />
              </button>
            </div>
            <p className={`text-xl font-bold font-mono ${(referralCount ?? 0) >= 40 ? "text-emerald-400" : "text-white"}`}>
              {referralCount === null ? "—" : referralCount}
            </p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Referrals <span className="text-white/25">/ 40 target</span></p>
          </div>

          {/* Posts */}
          <div className={`bg-white/[0.03] border rounded-xl p-4 ${postSubs.length >= 8 ? "border-emerald-400/30" : "border-white/[0.08]"}`}>
            <MessageSquare size={13} className={`mb-2 ${postSubs.length >= 8 ? "text-emerald-400" : "text-[#7c93c3]"}`} />
            <p className={`text-xl font-bold font-mono ${postSubs.length >= 8 ? "text-emerald-400" : "text-white"}`}>{postSubs.length}</p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Posts <span className="text-white/25">/ 8 target</span></p>
          </div>

          {/* Spaces */}
          <div className={`bg-white/[0.03] border rounded-xl p-4 ${spaceSubs.length >= 2 ? "border-emerald-400/30" : "border-white/[0.08]"}`}>
            <Users size={13} className={`mb-2 ${spaceSubs.length >= 2 ? "text-emerald-400" : "text-purple-400"}`} />
            <p className={`text-xl font-bold font-mono ${spaceSubs.length >= 2 ? "text-emerald-400" : "text-white"}`}>{spaceSubs.length}</p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Spaces <span className="text-white/25">/ 2 target</span></p>
          </div>

          {/* Videos */}
          <div className={`bg-white/[0.03] border rounded-xl p-4 ${videoSubs.length >= 1 ? "border-emerald-400/30" : "border-white/[0.08]"}`}>
            <Video size={13} className={`mb-2 ${videoSubs.length >= 1 ? "text-emerald-400" : "text-amber-400"}`} />
            <p className={`text-xl font-bold font-mono ${videoSubs.length >= 1 ? "text-emerald-400" : "text-white"}`}>{videoSubs.length}</p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Videos <span className="text-white/25">bonus</span></p>
          </div>
        </div>

        {/* Requirements checklist */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
            <CheckCircle2 size={11} className="text-[#7c93c3]" />
            <span className="font-mono text-[9px] text-white/50 tracking-widest">REQUIREMENTS_CHECKLIST</span>
            <div className="flex-1" />
            <span className="font-mono text-[9px] text-white/30">
              {[
                !!app.followed_arxon,
                !!app.retweeted_posts,
                postSubs.length >= 8,
                spaceSubs.length >= 2,
                (referralCount ?? 0) >= 40,
                submissions.length > 0,
                videoSubs.length >= 1,
              ].filter(Boolean).length} / 7 met
            </span>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-2">
            {[
              { label: "Followed @arxoninfra", met: !!app.followed_arxon },
              { label: "Retweeted required posts", met: !!app.retweeted_posts },
              { label: `8+ posts submitted (${postSubs.length} done)`, met: postSubs.length >= 8 },
              { label: `2+ Spaces co-hosted (${spaceSubs.length} done)`, met: spaceSubs.length >= 2 },
              { label: `40+ referrals (${referralCount ?? "?"} counted)`, met: (referralCount ?? 0) >= 40 },
              { label: "#ArxonAmbassador hashtag used", met: submissions.length > 0 },
              { label: `1-2 videos (bonus · ${videoSubs.length} done)`, met: videoSubs.length >= 1, bonus: true },
            ].map((r, i) => (
              <div key={i} className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg border text-xs transition-colors ${r.met ? "border-emerald-400/25 bg-emerald-400/[0.05]" : "border-white/[0.06] bg-white/[0.02]"}`}>
                <CheckCircle2 size={12} className={r.met ? "text-emerald-400 shrink-0" : "text-white/20 shrink-0"} />
                <span className={r.met ? "text-white/80" : "text-white/40"}>{r.label}</span>
                {r.bonus && <span className="ml-auto font-mono text-[8px] text-amber-300 bg-amber-400/15 border border-amber-400/30 px-1.5 py-0.5 rounded">BONUS</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Submitted links by section */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
            <Link2 size={11} className="text-[#7c93c3]" />
            <span className="font-mono text-[9px] text-white/50 tracking-widest">SUBMITTED_LINKS · {submissions.length} TOTAL</span>
          </div>
          <div className="p-5">
            <SubSection label="POSTS" items={postSubs} color="text-[#7c93c3]/70" />
            <SubSection label="SPACES" items={spaceSubs} color="text-purple-400/70" />
            <SubSection label="VIDEOS" items={videoSubs} color="text-amber-400/70" />
          </div>
        </div>

        {/* Application content links */}
        {app.recent_post_links?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
            <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
              <Twitter size={11} className="text-[#7c93c3]" />
              <span className="font-mono text-[9px] text-white/50 tracking-widest">APPLICATION_CONTENT_LINKS ({app.recent_post_links.length})</span>
            </div>
            <div className="p-4 space-y-1.5">
              {app.recent_post_links.map((link: string, j: number) => (
                <div key={j} className="flex items-center gap-3 px-3 py-2 bg-white/[0.02] border border-white/[0.04] rounded-lg group">
                  <span className="font-mono text-[9px] text-[#52525b] w-4 shrink-0">{j + 1}</span>
                  <a href={link} target="_blank" rel="noopener noreferrer"
                    className="text-[#7c93c3] text-xs hover:underline truncate flex-1">{link}</a>
                  <CopyBtn text={link} />
                  <a href={link} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <ExternalLink size={10} className="text-white/40 hover:text-white" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal info */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.06]">
            <Shield size={11} className="text-[#7c93c3]" />
            <span className="font-mono text-[9px] text-white/50 tracking-widest">APPLICANT_PROFILE</span>
          </div>
          <div className="p-5 grid md:grid-cols-3 gap-4">
            <InfoBlock label="Full Name" value={app.full_name} />
            <InfoBlock label="X Handle" value={app.x_handle} />
            <InfoBlock label="Arxon ID" value={app.arxon_account_id} />
            <InfoBlock label="Country" value={app.country || "—"} />
            <InfoBlock label="Followers" value={(app.follower_count || 0).toLocaleString()} />
            <InfoBlock label="Est. New Users" value={app.estimated_new_users || 0} />
            <InfoBlock label="Applied" value={new Date(app.created_at).toLocaleDateString()} />
            {app.approved_at && <InfoBlock label="Approved" value={new Date(app.approved_at).toLocaleDateString()} />}
          </div>
          <div className="px-5 pb-5 space-y-3">
            <InfoBlock label="Motivation" value={app.motivation} />
            {app.previous_experience && <InfoBlock label="Previous Experience" value={app.previous_experience} />}
          </div>
        </div>

        {/* Social compliance */}
        <div className="flex gap-3 flex-wrap mb-6">
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold ${app.followed_arxon ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
            <Twitter size={11} /> {app.followed_arxon ? "Followed @arxoninfra ✓" : "Follow not confirmed"}
          </div>
          <div className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-mono font-semibold ${app.retweeted_posts ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
            <CheckCircle2 size={11} /> {app.retweeted_posts ? "Retweeted posts ✓" : "Retweet not confirmed"}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   PORTAL SUBMISSIONS TAB
════════════════════════════════════════ */
const PortalSubmissionsTab = ({
  applications,
  submissions,
  onUpdateStatus,
}: {
  applications: any[];
  submissions: any[];
  onUpdateStatus: (id: string, status: string) => Promise<void>;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [sortBy, setSortBy] = useState<"date" | "submissions" | "referrals">("submissions");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  const getSubsForApp = (arxonId: string) => submissions.filter(s => s.arxon_account_id === arxonId);

  const filteredApps = useMemo(() => {
    let f = filter === "all" ? applications : applications.filter(a => a.status === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter(a =>
        a.full_name?.toLowerCase().includes(q) ||
        a.x_handle?.toLowerCase().includes(q) ||
        a.arxon_account_id?.toLowerCase().includes(q) ||
        a.country?.toLowerCase().includes(q)
      );
    }
    return f.sort((a, b) => {
      if (sortBy === "submissions") return getSubsForApp(b.arxon_account_id).length - getSubsForApp(a.arxon_account_id).length;
      if (sortBy === "referrals") return (b.estimated_new_users || 0) - (a.estimated_new_users || 0);
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [applications, submissions, filter, searchQuery, sortBy]);

  const selectedApp = selectedAppId ? applications.find(a => a.id === selectedAppId) : null;
  const selectedSubs = selectedApp ? getSubsForApp(selectedApp.arxon_account_id) : [];

  const handleNavigate = (id: string) => setSelectedAppId(id);

  // Total links count across all ambassadors
  const totalLinks = submissions.length;
  const totalPosts = submissions.filter(s => s.submission_type === "post").length;
  const totalSpaces = submissions.filter(s => s.submission_type === "space").length;
  const totalVideos = submissions.filter(s => s.submission_type === "video").length;

  return (
    <div>
      {/* Portal stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Total Links", value: totalLinks, color: "text-[#7c93c3]" },
          { label: "Posts", value: totalPosts, color: "text-[#7c93c3]" },
          { label: "Spaces", value: totalSpaces, color: "text-purple-400" },
          { label: "Videos", value: totalVideos, color: "text-amber-400" },
        ].map((s, i) => (
          <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
            <p className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</p>
            <p className="text-[#52525b] text-xs mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
          <input
            className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/40 transition-colors"
            placeholder="Search ambassador name, handle, ID..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "pending", "approved", "rejected"] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-[#7c93c3] text-white" : "bg-white/[0.04] text-[#a1a1aa] hover:bg-white/[0.08]"}`}>
              {f}
            </button>
          ))}
        </div>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
          className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[#a1a1aa] text-xs focus:outline-none">
          <option value="submissions">Sort: Most Links</option>
          <option value="referrals">Sort: Referrals</option>
          <option value="date">Sort: Date</option>
        </select>
      </div>

      {/* Ambassador cards */}
      <div className="space-y-2">
        {filteredApps.map((app, i) => {
          const appSubs = getSubsForApp(app.arxon_account_id);
          const posts   = appSubs.filter(s => s.submission_type === "post").length;
          const spaces  = appSubs.filter(s => s.submission_type === "space").length;
          const videos  = appSubs.filter(s => s.submission_type === "video").length;
          const reqMet  = posts >= 8 && spaces >= 2;

          return (
            <motion.div
              key={app.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02 }}
              onClick={() => setSelectedAppId(app.id)}
              className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 md:p-5 cursor-pointer hover:bg-white/[0.05] hover:border-[#7c93c3]/20 transition-all group"
            >
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                {/* Avatar + name */}
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#7c93c3]/15 border border-[#7c93c3]/25 flex items-center justify-center font-mono text-sm font-bold text-[#7c93c3] shrink-0">
                    {app.full_name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-semibold text-sm">{app.full_name}</span>
                      <StatusBadge status={app.status} />
                    </div>
                    <p className="text-[#52525b] text-xs font-mono mt-0.5 truncate">
                      {app.x_handle} · {app.country || "—"}
                    </p>
                  </div>
                </div>

                {/* Link counts */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-center">
                    <p className={`font-mono font-bold text-sm ${posts >= 8 ? "text-emerald-400" : "text-white"}`}>{posts}</p>
                    <p className="font-mono text-[9px] text-[#52525b]">Posts</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-mono font-bold text-sm ${spaces >= 2 ? "text-emerald-400" : "text-purple-400"}`}>{spaces}</p>
                    <p className="font-mono text-[9px] text-[#52525b]">Spaces</p>
                  </div>
                  <div className="text-center">
                    <p className={`font-mono font-bold text-sm ${videos >= 1 ? "text-emerald-400" : "text-amber-400"}`}>{videos}</p>
                    <p className="font-mono text-[9px] text-[#52525b]">Videos</p>
                  </div>
                  <div className="text-center">
                    <p className="font-mono font-bold text-sm text-[#7c93c3]">{appSubs.length}</p>
                    <p className="font-mono text-[9px] text-[#52525b]">Total</p>
                  </div>
                  <ChevronRight size={14} className="text-[#52525b] group-hover:text-[#7c93c3] transition-colors ml-2" />
                </div>
              </div>

              {/* Mini progress — show first 6 links inline */}
              {appSubs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/[0.04] flex flex-wrap gap-1.5">
                  {appSubs.slice(0, 6).map((sub: any, j: number) => (
                    <a
                      key={j}
                      href={sub.submission_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-mono border hover:opacity-80 transition-opacity ${
                        sub.submission_type === "space" ? "bg-purple-400/[0.06] border-purple-400/15 text-purple-400/70" :
                        sub.submission_type === "video" ? "bg-amber-400/[0.06] border-amber-400/15 text-amber-400/70" :
                        "bg-[#7c93c3]/[0.06] border-[#7c93c3]/15 text-[#7c93c3]/70"
                      }`}
                    >
                      <ExternalLink size={8} />
                      {sub.submission_url.replace(/^https?:\/\//, "").slice(0, 28)}…
                    </a>
                  ))}
                  {appSubs.length > 6 && (
                    <span className="inline-flex items-center px-2 py-1 rounded text-[9px] font-mono bg-white/[0.03] border border-white/[0.06] text-white/30">
                      +{appSubs.length - 6} more
                    </span>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {filteredApps.length === 0 && (
        <div className="text-center py-16">
          <Users size={36} className="text-[#3f3f46] mx-auto mb-3" />
          <p className="text-[#52525b] text-sm">No ambassadors found</p>
        </div>
      )}

      {/* Detail view overlay */}
      <AnimatePresence>
        {selectedApp && (
          <PortalDetailView
            app={selectedApp}
            submissions={selectedSubs}
            allApps={filteredApps}
            onClose={() => setSelectedAppId(null)}
            onStatusChange={onUpdateStatus}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN ADMIN COMPONENT
════════════════════════════════════════ */
const AmbassadorAdmin = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [expandedApp, setExpandedApp] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name" | "followers" | "submissions">("date");
  const [showSettings, setShowSettings] = useState(false);
  const [activeTab, setActiveTab] = useState<"applications" | "portal">("applications");

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please sign in to access admin panel"); navigate("/auth"); return; }
    const access = await verifyApprovedAdminAccess(user.id);
    if (!access.allowed) {
      await supabase.auth.signOut();
      toast.error(access.reason ?? "Access denied. Admin privileges required.");
      navigate("/auth");
      return;
    }
    setIsAdmin(true);
    await loadData();
    setLoading(false);
  };

  const loadData = async () => {
    const [appsRes, subsRes] = await Promise.all([
      supabase.from("ambassador_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("ambassador_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    setApplications(appsRes.data || []);
    setSubmissions(subsRes.data || []);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("ambassador_applications").update({
      status, approved_at: status === "approved" ? new Date().toISOString() : null
    }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Application ${status}`);
    await loadData();
  };

  const getSubsForApp = (arxonId: string) => submissions.filter(s => s.arxon_account_id === arxonId);

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    totalSubs: submissions.length,
    totalFollowers: applications.reduce((s, a) => s + (a.follower_count || 0), 0),
  }), [applications, submissions]);

  const filteredApps = useMemo(() => {
    let f = filter === "all" ? applications : applications.filter(a => a.status === filter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      f = f.filter(a => a.full_name?.toLowerCase().includes(q) || a.x_handle?.toLowerCase().includes(q) || a.arxon_account_id?.toLowerCase().includes(q) || a.country?.toLowerCase().includes(q));
    }
    return f.sort((a, b) => {
      if (sortBy === "name") return (a.full_name || "").localeCompare(b.full_name || "");
      if (sortBy === "followers") return (b.follower_count || 0) - (a.follower_count || 0);
      if (sortBy === "submissions") return getSubsForApp(b.arxon_account_id).length - getSubsForApp(a.arxon_account_id).length;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [applications, filter, searchQuery, sortBy, submissions]);

  if (loading) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-[#7c93c3] border-t-transparent rounded-full" />
    </div>
  );
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.button onClick={() => navigate("/ambassadors")} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#7c93c3] text-sm font-semibold mb-6 hover:gap-3 transition-all">
            <ArrowLeft size={16} /> Back to Ambassador Program
          </motion.button>

          <div className="flex items-center justify-between gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <Shield size={24} className="text-[#7c93c3]" />
              <h1 className="text-2xl md:text-3xl font-bold text-white">Ambassador Admin</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={loadData}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] text-xs font-mono hover:bg-white/[0.07] transition-colors">
                <RefreshCw size={11} /> Refresh
              </button>
              <motion.button onClick={() => setShowSettings(s => !s)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors ${showSettings ? "bg-[#7c93c3]/20 border-[#7c93c3]/40 text-[#7c93c3]" : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white/90 hover:bg-white/[0.07]"}`}>
                <Settings size={13} /> RETWEET LINKS SETTINGS
              </motion.button>
            </div>
          </div>

          {/* Settings panel */}
          <AnimatePresence>
            {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
          </AnimatePresence>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
            {[
              { label: "Total", value: stats.total, color: "text-white" },
              { label: "Pending", value: stats.pending, color: "text-yellow-400" },
              { label: "Approved", value: stats.approved, color: "text-green-400" },
              { label: "Rejected", value: stats.rejected, color: "text-red-400" },
              { label: "Portal Links", value: stats.totalSubs, color: "text-[#7c93c3]" },
              { label: "Total Followers", value: stats.totalFollowers.toLocaleString(), color: "text-white" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[#52525b] text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 p-1 bg-white/[0.03] border border-white/[0.06] rounded-xl w-fit">
            <button
              onClick={() => setActiveTab("applications")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors ${activeTab === "applications" ? "bg-[#7c93c3] text-white" : "text-[#a1a1aa] hover:text-white"}`}
            >
              Applications
            </button>
            <button
              onClick={() => setActiveTab("portal")}
              className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2 ${activeTab === "portal" ? "bg-[#7c93c3] text-white" : "text-[#a1a1aa] hover:text-white"}`}
            >
              Portal Submissions
              {stats.totalSubs > 0 && (
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${activeTab === "portal" ? "bg-white/20 text-white" : "bg-[#7c93c3]/20 text-[#7c93c3]"}`}>
                  {stats.totalSubs}
                </span>
              )}
            </button>
          </div>

          {/* Applications tab (original) */}
          {activeTab === "applications" && (
            <>
              <div className="flex flex-col md:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                  <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/40 transition-colors"
                    placeholder="Search name, handle, ID, country..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "pending", "approved", "rejected"] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${filter === f ? "bg-[#7c93c3] text-white" : "bg-white/[0.04] text-[#a1a1aa] hover:bg-white/[0.08]"}`}>
                      {f}
                    </button>
                  ))}
                </div>
                <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
                  className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[#a1a1aa] text-xs focus:outline-none">
                  <option value="date">Sort: Date</option>
                  <option value="name">Sort: Name</option>
                  <option value="followers">Sort: Followers</option>
                  <option value="submissions">Sort: Submissions</option>
                </select>
              </div>

              <div className="space-y-3">
                {filteredApps.map((app, i) => {
                  const appSubs = getSubsForApp(app.arxon_account_id);
                  const postSubs = appSubs.filter(s => s.submission_type === "post");
                  const spaceSubs = appSubs.filter(s => s.submission_type === "space");
                  const videoSubs = appSubs.filter(s => s.submission_type === "video");
                  const isExpanded = expandedApp === app.id;

                  return (
                    <motion.div key={app.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}
                      className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden">
                      <div className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => setExpandedApp(isExpanded ? null : app.id)}>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-white font-semibold">{app.full_name}</h3>
                            <StatusBadge status={app.status} />
                            {app.country && <span className="font-mono text-[9px] text-white/35 bg-white/[0.04] px-2 py-0.5 rounded">{app.country}</span>}
                          </div>
                          <p className="text-[#a1a1aa] text-xs mt-1 flex flex-wrap gap-3">
                            <span>{app.x_handle}</span>
                            <span>ID: {app.arxon_account_id}</span>
                            <span>{(app.follower_count || 0).toLocaleString()} followers</span>
                            <span className="text-[#7c93c3]">{appSubs.length} portal links ({postSubs.length}P · {spaceSubs.length}S · {videoSubs.length}V)</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={e => { e.stopPropagation(); setActiveTab("portal"); }}
                            className="px-3 py-1.5 rounded-lg bg-[#7c93c3]/10 text-[#7c93c3] text-xs font-semibold border border-[#7c93c3]/20 hover:bg-[#7c93c3]/20 transition-colors"
                          >
                            View Portal →
                          </button>
                          {app.status === "pending" && (
                            <>
                              <button onClick={e => { e.stopPropagation(); updateStatus(app.id, "approved"); }}
                                className="px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 text-xs font-semibold hover:bg-green-400/20 transition-colors">Approve</button>
                              <button onClick={e => { e.stopPropagation(); updateStatus(app.id, "rejected"); }}
                                className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold hover:bg-red-400/20 transition-colors">Reject</button>
                            </>
                          )}
                          {isExpanded ? <ChevronUp size={16} className="text-[#52525b]" /> : <ChevronDown size={16} className="text-[#52525b]" />}
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                            className="border-t border-white/[0.06] overflow-hidden">
                            <div className="p-4 md:p-6 space-y-5">
                              <div className="grid md:grid-cols-3 gap-4">
                                <InfoBlock label="Full Name" value={app.full_name} />
                                <InfoBlock label="X Handle" value={app.x_handle} />
                                <InfoBlock label="Arxon ID" value={app.arxon_account_id} />
                                <InfoBlock label="Country" value={app.country || "—"} />
                                <InfoBlock label="Follower Count" value={(app.follower_count || 0).toLocaleString()} />
                                <InfoBlock label="Est. New Users" value={app.estimated_new_users || 0} />
                                <InfoBlock label="Applied" value={new Date(app.created_at).toLocaleDateString()} />
                                {app.approved_at && <InfoBlock label="Approved" value={new Date(app.approved_at).toLocaleDateString()} />}
                              </div>
                              <InfoBlock label="Motivation" value={app.motivation} />
                              {app.previous_experience && <InfoBlock label="Previous Experience" value={app.previous_experience} />}

                              <div>
                                <p className="text-[#52525b] text-xs font-semibold uppercase mb-2">Social Compliance</p>
                                <div className="flex gap-3 flex-wrap">
                                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${app.followed_arxon ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
                                    <Twitter size={11} /> {app.followed_arxon ? "Followed @arxoninfra ✓" : "Follow not confirmed"}
                                  </div>
                                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${app.retweeted_posts ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
                                    <CheckCircle2 size={11} /> {app.retweeted_posts ? "Retweeted posts ✓" : "Retweet not confirmed"}
                                  </div>
                                </div>
                              </div>

                              {app.recent_post_links?.length > 0 && (
                                <div>
                                  <p className="text-[#52525b] text-xs font-semibold uppercase mb-2">Application Content Links ({app.recent_post_links.length})</p>
                                  <div className="space-y-1.5">
                                    {app.recent_post_links.map((link: string, j: number) => (
                                      <a key={j} href={link} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-[#7c93c3] text-xs hover:underline break-all">
                                        <ExternalLink size={11} className="shrink-0" /> {link}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              )}

                              {appSubs.length > 0 && (
                                <div>
                                  <p className="text-[#52525b] text-xs font-semibold uppercase mb-3">Portal Submissions ({appSubs.length} total)</p>
                                  {postSubs.length > 0 && (
                                    <div className="mb-3">
                                      <p className="font-mono text-[9px] text-[#7c93c3]/60 tracking-widest mb-2 flex items-center gap-1.5">
                                        <MessageSquare size={10} /> POSTS ({postSubs.length})
                                      </p>
                                      <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
                                        {postSubs.map((sub: any, j: number) => (
                                          <div key={j} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                                            <span className="font-mono text-[9px] text-[#52525b] w-6 shrink-0">{j + 1}</span>
                                            <a href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                                              className="text-[#7c93c3] text-xs hover:underline truncate flex-1">{sub.submission_url}</a>
                                            <CopyBtn text={sub.submission_url} />
                                            <span className="font-mono text-[9px] text-[#52525b] shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {spaceSubs.length > 0 && (
                                    <div className="mb-3">
                                      <p className="font-mono text-[9px] text-purple-400/60 tracking-widest mb-2 flex items-center gap-1.5">
                                        <Users size={10} /> SPACES ({spaceSubs.length})
                                      </p>
                                      <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
                                        {spaceSubs.map((sub: any, j: number) => (
                                          <div key={j} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                                            <span className="font-mono text-[9px] text-[#52525b] w-6 shrink-0">{j + 1}</span>
                                            <a href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                                              className="text-purple-400 text-xs hover:underline truncate flex-1">{sub.submission_url}</a>
                                            <CopyBtn text={sub.submission_url} />
                                            <span className="font-mono text-[9px] text-[#52525b] shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  {videoSubs.length > 0 && (
                                    <div>
                                      <p className="font-mono text-[9px] text-amber-400/60 tracking-widest mb-2 flex items-center gap-1.5">
                                        <Video size={10} /> VIDEOS ({videoSubs.length})
                                      </p>
                                      <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
                                        {videoSubs.map((sub: any, j: number) => (
                                          <div key={j} className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02]">
                                            <span className="font-mono text-[9px] text-[#52525b] w-6 shrink-0">{j + 1}</span>
                                            <a href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                                              className="text-amber-400 text-xs hover:underline truncate flex-1">{sub.submission_url}</a>
                                            <CopyBtn text={sub.submission_url} />
                                            <span className="font-mono text-[9px] text-[#52525b] shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}

                              <div className="flex gap-2 pt-2 border-t border-white/[0.05] flex-wrap">
                                {app.status !== "approved" && (
                                  <button onClick={() => updateStatus(app.id, "approved")}
                                    className="px-4 py-2 rounded-lg bg-green-400/10 text-green-400 text-xs font-semibold hover:bg-green-400/20 transition-colors">
                                    ✓ Approve
                                  </button>
                                )}
                                {app.status !== "rejected" && (
                                  <button onClick={() => updateStatus(app.id, "rejected")}
                                    className="px-4 py-2 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold hover:bg-red-400/20 transition-colors">
                                    ✕ Reject
                                  </button>
                                )}
                                {app.status !== "pending" && (
                                  <button onClick={() => updateStatus(app.id, "pending")}
                                    className="px-4 py-2 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors">
                                    ↺ Reset to Pending
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>

              {filteredApps.length === 0 && (
                <div className="text-center py-20">
                  <Users size={40} className="text-[#3f3f46] mx-auto mb-3" />
                  <p className="text-[#52525b] text-sm">No applications found</p>
                </div>
              )}
            </>
          )}

          {/* Portal Submissions tab */}
          {activeTab === "portal" && (
            <PortalSubmissionsTab
              applications={applications}
              submissions={submissions}
              onUpdateStatus={updateStatus}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AmbassadorAdmin;
