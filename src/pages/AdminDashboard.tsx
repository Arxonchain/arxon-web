import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield, Users, Settings, Link2, Save, ExternalLink,
  Activity, ChevronRight, Database, Globe,
  MessageSquare, Video, CheckCircle2, Clock,
  Search, ChevronDown, ChevronUp, RefreshCw,
  Twitter, BarChart3, Award, ArrowLeft,
  ChevronLeft, Copy, Check, X as XIcon
} from "lucide-react";
import { toast } from "sonner";
import { verifyApprovedAdminAccess } from "@/lib/adminAccess";

/* ─── Shared UI ─── */
const inputCls = "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm font-mono placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/50 transition-colors";

const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden ${className}`}>{children}</div>
);

const CardHeader = ({ icon: Icon, title, subtitle, action }: { icon: any; title: string; subtitle?: string; action?: React.ReactNode }) => (
  <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06] bg-white/[0.02]">
    <div className="w-8 h-8 rounded-lg bg-[#7c93c3]/12 border border-[#7c93c3]/20 flex items-center justify-center shrink-0">
      <Icon size={14} className="text-[#7c93c3]" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="text-white font-semibold text-sm">{title}</div>
      {subtitle && <div className="font-mono text-[9px] text-white/35 mt-0.5">{subtitle}</div>}
    </div>
    {action}
  </div>
);

const StatBox = ({ label, value, color = "text-white" }: { label: string; value: any; color?: string }) => (
  <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
    <p className="text-[#52525b] text-xs mt-1 font-mono">{label}</p>
  </div>
);

const StatusBadge = ({ status }: { status: string }) => (
  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
    status === "approved" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
    status === "rejected"  ? "text-red-400 bg-red-400/10 border-red-400/20" :
    "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
  }`}>{status}</span>
);

const TypeTag = ({ type }: { type: string }) => {
  const map: Record<string, string> = {
    post:  "text-[#7c93c3] bg-[#7c93c3]/10 border-[#7c93c3]/20",
    space: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    video: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };
  return <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${map[type] || "text-white/40 bg-white/[0.04] border-white/[0.08]"}`}>{type}</span>;
};

const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  };
  return (
    <button onClick={copy} className="shrink-0 w-6 h-6 rounded flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors" title="Copy link">
      {copied ? <Check size={10} className="text-emerald-400" /> : <Copy size={10} className="text-white/40" />}
    </button>
  );
};

/* ════════════════════════════════════════
   RETWEET SETTINGS
════════════════════════════════════════ */
const RetweetSettings = () => {
  const [post3, setPost3] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase.from("ambassador_settings").select("value").eq("key", "retweet_post_3").maybeSingle()
      .then(({ data }) => { if (data?.value) setPost3(data.value); setLoaded(true); });
  }, []);

  const save = async () => {
    if (!post3.trim()) { toast.error("Paste a valid X post URL"); return; }
    setSaving(true);
    const { error } = await supabase.from("ambassador_settings")
      .upsert({ key: "retweet_post_3", value: post3.trim() }, { onConflict: "key" });
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Post #3 link saved — live in ambassador portal immediately");
    setSaving(false);
  };

  const FIXED_POSTS = [
    { n: 1, url: "https://x.com/arxoninfra/status/2052324369775440352?s=20" },
    { n: 2, url: "https://x.com/arxoninfra/status/2041816286724796678?s=20" },
  ];

  return (
    <Card>
      <CardHeader icon={Twitter} title="Retweet Post Links" subtitle="Posts ambassadors must retweet during application" />
      <div className="p-5 space-y-4">
        {FIXED_POSTS.map(p => (
          <div key={p.n} className="flex items-center gap-3 p-3 bg-white/[0.02] border border-white/[0.05] rounded-lg">
            <span className="font-mono text-[9px] text-white/30 shrink-0">POST #{p.n}</span>
            <span className="font-mono text-xs text-white/30 truncate flex-1">{p.url}</span>
            <span className="font-mono text-[8px] text-white/20 border border-white/[0.06] px-2 py-0.5 rounded shrink-0">HARDCODED</span>
            <a href={p.url} target="_blank" rel="noopener noreferrer"><ExternalLink size={11} className="text-[#7c93c3]/40 hover:text-[#7c93c3]" /></a>
          </div>
        ))}
        <div className="p-4 bg-[#7c93c3]/[0.04] border border-[#7c93c3]/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#7c93c3] font-semibold tracking-widest">POST #3 — CONFIGURABLE</span>
            <span className="font-mono text-[8px] text-[#7c93c3]/60 bg-[#7c93c3]/10 border border-[#7c93c3]/20 px-2 py-0.5 rounded">LIVE IN PORTAL</span>
          </div>
          <div className="flex gap-2">
            <input className={`${inputCls} flex-1`}
              placeholder="https://x.com/arxoninfra/status/..."
              value={loaded ? post3 : "Loading..."}
              onChange={e => setPost3(e.target.value)}
              disabled={!loaded}
            />
            <motion.button onClick={save} disabled={saving || !post3.trim() || !loaded}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold text-[#09090b] disabled:opacity-40 shrink-0"
              style={{ background: "linear-gradient(135deg,#7c93c3,#a8b8d8)" }}>
              {saving ? <Activity size={12} className="animate-spin" /> : <Save size={12} />}
              SAVE
            </motion.button>
          </div>
          {post3.trim() && (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={10} className="text-emerald-400" />
              <span className="font-mono text-[9px] text-emerald-400/70 flex-1">Active — showing in ambassador portal</span>
              <a href={post3} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-mono text-[9px] text-[#7c93c3]/60 hover:text-[#7c93c3]">
                <ExternalLink size={9} /> Preview
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════
   PORTAL SUBMISSION FULL DETAIL OVERLAY
════════════════════════════════════════ */
const PortalDetailOverlay = ({
  app, submissions, allApps, onClose, onStatusChange, onNavigate,
}: {
  app: any; submissions: any[]; allApps: any[];
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
  onNavigate: (id: string) => void;
}) => {
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const [loadingRefs, setLoadingRefs]     = useState(false);
  const [updating, setUpdating]           = useState(false);

  const postSubs  = submissions.filter(s => s.submission_type === "post");
  const spaceSubs = submissions.filter(s => s.submission_type === "space");
  const videoSubs = submissions.filter(s => s.submission_type === "video");

  const idx     = allApps.findIndex(a => a.id === app.id);
  const prevApp = allApps[idx - 1];
  const nextApp = allApps[idx + 1];

  const syncRefs = async () => {
    setLoadingRefs(true);
    try {
      const res = await fetch(
        `https://knfpmzjghbjnlnarsivs.supabase.co/functions/v1/get-referral-count?account_id=${encodeURIComponent(app.arxon_account_id)}`,
        { headers: { "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`, "Content-Type": "application/json" } }
      );
      const d = res.ok ? await res.json() : null;
      setReferralCount(d?.referral_count ?? app.estimated_new_users ?? 0);
    } catch { setReferralCount(app.estimated_new_users ?? 0); }
    setLoadingRefs(false);
  };

  useEffect(() => { syncRefs(); }, [app.id]);

  const handleStatus = async (status: string) => {
    setUpdating(true);
    await onStatusChange(app.id, status);
    setUpdating(false);
  };

  const LinkList = ({ items, color }: { items: any[]; color: string }) => (
    items.length === 0
      ? <p className="font-mono text-[10px] text-white/20 px-3 py-2">No links submitted</p>
      : <div className="bg-white/[0.02] border border-white/[0.04] rounded-lg overflow-hidden">
          {items.map((sub: any, j: number) => (
            <div key={j} className="flex items-center gap-2 px-3 py-2.5 border-b border-white/[0.03] last:border-0 hover:bg-white/[0.02] transition-colors group">
              <span className="font-mono text-[9px] text-[#52525b] w-4 shrink-0">{j + 1}</span>
              <TypeTag type={sub.submission_type} />
              <a href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                className={`text-xs hover:underline truncate flex-1 ${color}`}>
                {sub.submission_url}
              </a>
              <CopyBtn text={sub.submission_url} />
              <a href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                <ExternalLink size={10} className="text-white/30 hover:text-white" />
              </a>
              <span className="font-mono text-[9px] text-[#52525b] shrink-0 hidden sm:block">
                {new Date(sub.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
        </div>
  );

  const reqsMet = [
    !!app.followed_arxon, !!app.retweeted_posts,
    postSubs.length >= 8, spaceSubs.length >= 2,
    (referralCount ?? 0) >= 40, submissions.length > 0, videoSubs.length >= 1,
  ].filter(Boolean).length;

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-[#09090b]/95 backdrop-blur-sm overflow-y-auto"
    >
      <div className="max-w-[820px] mx-auto px-4 py-8">

        {/* Top bar */}
        <div className="flex items-center justify-between mb-6">
          <button onClick={onClose} className="flex items-center gap-2 text-[#7c93c3] text-sm font-semibold hover:gap-3 transition-all">
            <ArrowLeft size={15} /> Back to Portal Submissions
          </button>
          <div className="flex items-center gap-2">
            <button onClick={() => prevApp && onNavigate(prevApp.id)} disabled={!prevApp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] text-xs font-semibold disabled:opacity-30 hover:bg-white/[0.07] transition-colors">
              <ChevronLeft size={12} /> Prev
            </button>
            <span className="font-mono text-[10px] text-[#52525b]">{idx + 1} / {allApps.length}</span>
            <button onClick={() => nextApp && onNavigate(nextApp.id)} disabled={!nextApp}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#a1a1aa] text-xs font-semibold disabled:opacity-30 hover:bg-white/[0.07] transition-colors">
              Next <ChevronRight size={12} />
            </button>
          </div>
        </div>

        {/* Profile card */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl p-5 mb-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#7c93c3]/15 border border-[#7c93c3]/25 flex items-center justify-center font-mono text-lg font-bold text-[#7c93c3] shrink-0">
              {app.full_name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h2 className="text-white font-bold text-lg">{app.full_name}</h2>
                <StatusBadge status={app.status} />
              </div>
              <p className="text-[#a1a1aa] text-xs font-mono">{app.x_handle} · ID: {app.arxon_account_id} · {app.country || "—"}</p>
              <p className="text-[#52525b] text-xs mt-0.5">Applied {new Date(app.created_at).toLocaleDateString()} · {(app.follower_count || 0).toLocaleString()} followers</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {app.status !== "approved" && (
                  <button onClick={() => handleStatus("approved")} disabled={updating}
                    className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs font-semibold border border-emerald-400/20 hover:bg-emerald-400/20 transition-colors disabled:opacity-40">
                    ✓ Approve
                  </button>
                )}
                {app.status !== "rejected" && (
                  <button onClick={() => handleStatus("rejected")} disabled={updating}
                    className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold border border-red-400/20 hover:bg-red-400/20 transition-colors disabled:opacity-40">
                    ✕ Reject
                  </button>
                )}
                {app.status !== "pending" && (
                  <button onClick={() => handleStatus("pending")} disabled={updating}
                    className="px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-semibold border border-yellow-400/20 hover:bg-yellow-400/20 transition-colors disabled:opacity-40">
                    ↺ Reset Pending
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {/* Referrals */}
          <div className={`bg-white/[0.03] border rounded-xl p-3 ${(referralCount ?? 0) >= 40 ? "border-emerald-400/25" : "border-white/[0.08]"}`}>
            <div className="flex items-center justify-between mb-2">
              <Globe size={12} className={(referralCount ?? 0) >= 40 ? "text-emerald-400" : "text-[#7c93c3]"} />
              <button onClick={syncRefs} disabled={loadingRefs} className="w-5 h-5 rounded flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors disabled:opacity-40">
                <RefreshCw size={9} className={`text-[#7c93c3] ${loadingRefs ? "animate-spin" : ""}`} />
              </button>
            </div>
            <p className={`text-lg font-bold font-mono ${(referralCount ?? 0) >= 40 ? "text-emerald-400" : "text-white"}`}>{referralCount === null ? "…" : referralCount}</p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Referrals <span className="text-white/20">/ 40</span></p>
          </div>
          {/* Posts */}
          <div className={`bg-white/[0.03] border rounded-xl p-3 ${postSubs.length >= 8 ? "border-emerald-400/25" : "border-white/[0.08]"}`}>
            <MessageSquare size={12} className={`mb-2 ${postSubs.length >= 8 ? "text-emerald-400" : "text-[#7c93c3]"}`} />
            <p className={`text-lg font-bold font-mono ${postSubs.length >= 8 ? "text-emerald-400" : "text-white"}`}>{postSubs.length}</p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Posts <span className="text-white/20">/ 8</span></p>
          </div>
          {/* Spaces */}
          <div className={`bg-white/[0.03] border rounded-xl p-3 ${spaceSubs.length >= 2 ? "border-emerald-400/25" : "border-white/[0.08]"}`}>
            <Users size={12} className={`mb-2 ${spaceSubs.length >= 2 ? "text-emerald-400" : "text-purple-400"}`} />
            <p className={`text-lg font-bold font-mono ${spaceSubs.length >= 2 ? "text-emerald-400" : "text-white"}`}>{spaceSubs.length}</p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Spaces <span className="text-white/20">/ 2</span></p>
          </div>
          {/* Videos */}
          <div className={`bg-white/[0.03] border rounded-xl p-3 ${videoSubs.length >= 1 ? "border-emerald-400/25" : "border-white/[0.08]"}`}>
            <Video size={12} className={`mb-2 ${videoSubs.length >= 1 ? "text-emerald-400" : "text-amber-400"}`} />
            <p className={`text-lg font-bold font-mono ${videoSubs.length >= 1 ? "text-emerald-400" : "text-white"}`}>{videoSubs.length}</p>
            <p className="text-[#52525b] text-[10px] mt-0.5">Videos <span className="text-white/20">bonus</span></p>
          </div>
        </div>

        {/* Requirements checklist */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            <CheckCircle2 size={11} className="text-[#7c93c3]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest">REQUIREMENTS CHECKLIST</span>
            <div className="flex-1" />
            <span className="font-mono text-[9px] text-white/30">{reqsMet} / 7 met</span>
          </div>
          <div className="p-4 grid sm:grid-cols-2 gap-2">
            {[
              { label: "Followed @arxoninfra", met: !!app.followed_arxon },
              { label: "Retweeted required posts", met: !!app.retweeted_posts },
              { label: `8+ posts (${postSubs.length} submitted)`, met: postSubs.length >= 8 },
              { label: `2+ Spaces (${spaceSubs.length} submitted)`, met: spaceSubs.length >= 2 },
              { label: `40+ referrals (${referralCount ?? "?"} counted)`, met: (referralCount ?? 0) >= 40 },
              { label: "#ArxonAmbassador hashtag used", met: submissions.length > 0 },
              { label: `1-2 videos — bonus (${videoSubs.length} done)`, met: videoSubs.length >= 1, bonus: true },
            ].map((r, i) => (
              <div key={i} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs ${r.met ? "border-emerald-400/20 bg-emerald-400/[0.04]" : "border-white/[0.06] bg-white/[0.02]"}`}>
                <CheckCircle2 size={11} className={r.met ? "text-emerald-400 shrink-0" : "text-white/20 shrink-0"} />
                <span className={r.met ? "text-white/80" : "text-white/40"}>{r.label}</span>
                {r.bonus && <span className="ml-auto font-mono text-[8px] text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">BONUS</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Portal submitted links — by section */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            <Link2 size={11} className="text-[#7c93c3]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest">PORTAL SUBMITTED LINKS</span>
            <span className="ml-2 font-mono text-[9px] text-[#7c93c3]/60 bg-[#7c93c3]/10 px-2 py-0.5 rounded">{submissions.length} total</span>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <p className="font-mono text-[9px] text-[#7c93c3]/60 tracking-widest mb-2 flex items-center gap-1.5">
                <MessageSquare size={9} /> POSTS ({postSubs.length})
              </p>
              <LinkList items={postSubs} color="text-[#7c93c3]" />
            </div>
            <div>
              <p className="font-mono text-[9px] text-purple-400/60 tracking-widest mb-2 flex items-center gap-1.5">
                <Users size={9} /> SPACES ({spaceSubs.length})
              </p>
              <LinkList items={spaceSubs} color="text-purple-400" />
            </div>
            <div>
              <p className="font-mono text-[9px] text-amber-400/60 tracking-widest mb-2 flex items-center gap-1.5">
                <Video size={9} /> VIDEOS ({videoSubs.length})
              </p>
              <LinkList items={videoSubs} color="text-amber-400" />
            </div>
          </div>
        </div>

        {/* Application content links */}
        {app.recent_post_links?.length > 0 && (
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
              <Twitter size={11} className="text-[#7c93c3]" />
              <span className="font-mono text-[9px] text-white/40 tracking-widest">APPLICATION CONTENT LINKS ({app.recent_post_links.length})</span>
            </div>
            <div className="p-4 space-y-1.5">
              {app.recent_post_links.map((link: string, j: number) => (
                <div key={j} className="flex items-center gap-2 px-3 py-2 bg-white/[0.02] border border-white/[0.04] rounded-lg group">
                  <span className="font-mono text-[9px] text-[#52525b] w-4 shrink-0">{j + 1}</span>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-[#7c93c3] text-xs hover:underline truncate flex-1">{link}</a>
                  <CopyBtn text={link} />
                  <a href={link} target="_blank" rel="noopener noreferrer" className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <ExternalLink size={10} className="text-white/30 hover:text-white" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Personal info */}
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/[0.06]">
            <Shield size={11} className="text-[#7c93c3]" />
            <span className="font-mono text-[9px] text-white/40 tracking-widest">APPLICANT PROFILE</span>
          </div>
          <div className="p-4 grid sm:grid-cols-3 gap-3 text-xs">
            {[
              ["Full Name", app.full_name], ["X Handle", app.x_handle],
              ["Arxon ID", app.arxon_account_id], ["Country", app.country || "—"],
              ["Followers", (app.follower_count || 0).toLocaleString()],
              ["Est. Referrals", app.estimated_new_users || 0],
              ["Applied", new Date(app.created_at).toLocaleDateString()],
              ["Experience", app.previous_experience || "None"],
            ].map(([l, v]) => (
              <div key={l}>
                <p className="text-[#52525b] font-mono text-[9px] uppercase mb-0.5">{l}</p>
                <p className="text-white/70">{String(v)}</p>
              </div>
            ))}
          </div>
          <div className="px-4 pb-4">
            <p className="text-[#52525b] font-mono text-[9px] uppercase mb-1">Motivation</p>
            <p className="text-white/60 text-xs leading-relaxed">{app.motivation}</p>
          </div>
        </div>

        {/* Social compliance */}
        <div className="flex gap-3 flex-wrap">
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono ${app.followed_arxon ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
            <Twitter size={11} /> {app.followed_arxon ? "Followed @arxoninfra ✓" : "Follow not confirmed"}
          </div>
          <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-mono ${app.retweeted_posts ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
            <CheckCircle2 size={11} /> {app.retweeted_posts ? "Retweeted posts ✓" : "Retweet not confirmed"}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

/* ════════════════════════════════════════
   AMBASSADOR SECTION — two clear sub-tabs
════════════════════════════════════════ */
const AmbassadorSection = () => {
  const [apps, setApps]       = useState<any[]>([]);
  const [subs, setSubs]       = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subTab, setSubTab]   = useState<"applications" | "portal">("applications");

  /* Applications tab state */
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<"all"|"pending"|"approved"|"rejected">("all");
  const [search, setSearch]     = useState("");

  /* Portal tab state */
  const [portalFilter, setPortalFilter]   = useState<"all"|"pending"|"approved"|"rejected">("all");
  const [portalSearch, setPortalSearch]   = useState("");
  const [portalSort, setPortalSort]       = useState<"submissions"|"date">("submissions");
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const [a, s] = await Promise.all([
      supabase.from("ambassador_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("ambassador_submissions").select("*").order("created_at", { ascending: false }),
    ]);
    setApps(a.data || []); setSubs(s.data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("ambassador_applications")
      .update({ status, approved_at: status === "approved" ? new Date().toISOString() : null }).eq("id", id);
    if (error) toast.error("Failed"); else { toast.success(`Application ${status}`); load(); }
  };

  const getSubsFor = (aid: string) => subs.filter(s => s.arxon_account_id === aid);

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
    totalLinks: subs.length,
    posts: subs.filter(s => s.submission_type === "post").length,
    spaces: subs.filter(s => s.submission_type === "space").length,
    videos: subs.filter(s => s.submission_type === "video").length,
  };

  /* Filtered lists */
  const filteredApps = apps
    .filter(a => filter === "all" || a.status === filter)
    .filter(a => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return a.full_name?.toLowerCase().includes(q) || a.x_handle?.toLowerCase().includes(q) ||
        a.arxon_account_id?.toLowerCase().includes(q) || a.country?.toLowerCase().includes(q);
    });

  const filteredPortal = apps
    .filter(a => portalFilter === "all" || a.status === portalFilter)
    .filter(a => {
      if (!portalSearch.trim()) return true;
      const q = portalSearch.toLowerCase();
      return a.full_name?.toLowerCase().includes(q) || a.x_handle?.toLowerCase().includes(q) ||
        a.arxon_account_id?.toLowerCase().includes(q) || a.country?.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (portalSort === "submissions") return getSubsFor(b.arxon_account_id).length - getSubsFor(a.arxon_account_id).length;
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const selectedApp  = selectedAppId ? apps.find(a => a.id === selectedAppId) : null;
  const selectedSubs = selectedApp ? getSubsFor(selectedApp.arxon_account_id) : [];

  return (
    <>
      <Card>
        <CardHeader
          icon={Users}
          title="Ambassador Management"
          subtitle={`${stats.total} total · ${stats.pending} pending`}
          action={
            <button onClick={load} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors">
              <RefreshCw size={11} className="text-white/50" />
            </button>
          }
        />

        {/* Sub-tabs */}
        <div className="flex gap-1 p-3 border-b border-white/[0.06] bg-white/[0.01]">
          <button
            onClick={() => setSubTab("applications")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${subTab === "applications" ? "bg-[#7c93c3] text-white" : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"}`}
          >
            <Users size={12} /> Application Submissions
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${subTab === "applications" ? "bg-white/20" : "bg-white/[0.06] text-white/30"}`}>{stats.total}</span>
          </button>
          <button
            onClick={() => setSubTab("portal")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${subTab === "portal" ? "bg-[#7c93c3] text-white" : "text-white/40 hover:text-white/70 hover:bg-white/[0.05]"}`}
          >
            <Link2 size={12} /> Portal Submissions
            <span className={`font-mono text-[9px] px-1.5 py-0.5 rounded ${subTab === "portal" ? "bg-white/20" : "bg-[#7c93c3]/20 text-[#7c93c3]"}`}>{stats.totalLinks}</span>
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Activity size={20} className="text-[#7c93c3] animate-spin" />
          </div>
        ) : (
          <>
            {/* ── APPLICATION SUBMISSIONS TAB ── */}
            {subTab === "applications" && (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-4 border-b border-white/[0.05]">
                  {[
                    { label: "TOTAL", value: stats.total, color: "text-white" },
                    { label: "PENDING", value: stats.pending, color: "text-yellow-400" },
                    { label: "APPROVED", value: stats.approved, color: "text-emerald-400" },
                    { label: "REJECTED", value: stats.rejected, color: "text-red-400" },
                    { label: "PORTAL LINKS", value: stats.totalLinks, color: "text-[#7c93c3]" },
                  ].map(s => (
                    <div key={s.label} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 text-center">
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="font-mono text-[8px] text-white/30 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Search + filter */}
                <div className="flex gap-2 p-4 border-b border-white/[0.05] flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                    <input className={`${inputCls} pl-8 py-2`} placeholder="Search name, handle, ID, country..."
                      value={search} onChange={e => setSearch(e.target.value)} />
                  </div>
                  <div className="flex gap-1.5">
                    {(["all","pending","approved","rejected"] as const).map(f => (
                      <button key={f} onClick={() => setFilter(f)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${filter===f?"bg-[#7c93c3] text-white":"bg-white/[0.04] text-[#a1a1aa] hover:bg-white/[0.08]"}`}>
                        {f}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Application list */}
                <div className="divide-y divide-white/[0.04] max-h-[600px] overflow-y-auto">
                  {filteredApps.length === 0 ? (
                    <div className="py-12 text-center text-[#52525b] text-sm">No applications found</div>
                  ) : filteredApps.map(app => {
                    const appSubs = getSubsFor(app.arxon_account_id);
                    const isExp   = expanded === app.id;
                    return (
                      <div key={app.id}>
                        <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                          onClick={() => setExpanded(isExp ? null : app.id)}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white text-sm font-semibold">{app.full_name}</span>
                              <StatusBadge status={app.status} />
                              {app.country && <span className="font-mono text-[9px] text-white/25 bg-white/[0.03] px-2 py-0.5 rounded">{app.country}</span>}
                            </div>
                            <p className="text-[#52525b] text-xs mt-0.5 font-mono">
                              {app.x_handle} · {app.arxon_account_id} · {(app.follower_count||0).toLocaleString()} followers · {appSubs.length} portal links
                            </p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {app.status === "pending" && <>
                              <button onClick={e => { e.stopPropagation(); updateStatus(app.id,"approved"); }}
                                className="px-2.5 py-1 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-400/20 transition-colors">✓</button>
                              <button onClick={e => { e.stopPropagation(); updateStatus(app.id,"rejected"); }}
                                className="px-2.5 py-1 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold hover:bg-red-400/20 transition-colors">✕</button>
                            </>}
                            {isExp ? <ChevronUp size={14} className="text-[#52525b]" /> : <ChevronDown size={14} className="text-[#52525b]" />}
                          </div>
                        </div>

                        <AnimatePresence>
                          {isExp && (
                            <motion.div initial={{ height:0, opacity:0 }} animate={{ height:"auto", opacity:1 }} exit={{ height:0, opacity:0 }}
                              className="overflow-hidden border-t border-white/[0.04] bg-white/[0.01]">
                              <div className="px-5 py-4 space-y-4">
                                <div className="grid sm:grid-cols-3 gap-3 text-xs">
                                  {[
                                    ["Full Name", app.full_name], ["X Handle", app.x_handle],
                                    ["Arxon ID", app.arxon_account_id], ["Country", app.country||"—"],
                                    ["Followers", (app.follower_count||0).toLocaleString()],
                                    ["Est. Referrals", app.estimated_new_users||0],
                                    ["Applied", new Date(app.created_at).toLocaleDateString()],
                                    ["Prev. Experience", app.previous_experience||"None"],
                                  ].map(([l,v]) => (
                                    <div key={l}><p className="text-[#52525b] font-mono text-[9px] uppercase mb-0.5">{l}</p><p className="text-white/70">{String(v)}</p></div>
                                  ))}
                                </div>

                                <div><p className="text-[#52525b] font-mono text-[9px] uppercase mb-1">Motivation</p><p className="text-white/60 text-xs leading-relaxed">{app.motivation}</p></div>

                                {/* Social compliance */}
                                <div className="flex gap-2 flex-wrap">
                                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${app.followed_arxon ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
                                    <Twitter size={10} /> {app.followed_arxon ? "Followed ✓" : "Follow not confirmed"}
                                  </div>
                                  <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-mono ${app.retweeted_posts ? "bg-emerald-400/10 border-emerald-400/20 text-emerald-400" : "bg-white/[0.03] border-white/[0.08] text-white/40"}`}>
                                    <CheckCircle2 size={10} /> {app.retweeted_posts ? "Retweeted ✓" : "Retweet not confirmed"}
                                  </div>
                                </div>

                                {/* Application links */}
                                {app.recent_post_links?.length > 0 && (
                                  <div>
                                    <p className="text-[#52525b] font-mono text-[9px] uppercase mb-2">Application Content Links</p>
                                    <div className="space-y-1">
                                      {app.recent_post_links.map((link: string, j: number) => (
                                        <a key={j} href={link} target="_blank" rel="noopener noreferrer"
                                          className="flex items-center gap-2 text-[#7c93c3] text-xs hover:underline break-all">
                                          <ExternalLink size={10} className="shrink-0" />{link}
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Action buttons */}
                                <div className="flex gap-2 pt-1 flex-wrap">
                                  {app.status !== "approved" && <button onClick={() => updateStatus(app.id,"approved")} className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-400/20 transition-colors">✓ Approve</button>}
                                  {app.status !== "rejected" && <button onClick={() => updateStatus(app.id,"rejected")} className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold hover:bg-red-400/20 transition-colors">✕ Reject</button>}
                                  {app.status !== "pending" && <button onClick={() => updateStatus(app.id,"pending")} className="px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors">↺ Reset to Pending</button>}
                                  <button onClick={() => { setSubTab("portal"); setSelectedAppId(app.id); }}
                                    className="px-3 py-1.5 rounded-lg bg-[#7c93c3]/10 text-[#7c93c3] text-xs font-semibold border border-[#7c93c3]/20 hover:bg-[#7c93c3]/20 transition-colors">
                                    View Portal Submissions →
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>
              </>
            )}

            {/* ── PORTAL SUBMISSIONS TAB ── */}
            {subTab === "portal" && (
              <>
                {/* Portal stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-4 border-b border-white/[0.05]">
                  {[
                    { label: "TOTAL LINKS", value: stats.totalLinks, color: "text-[#7c93c3]" },
                    { label: "POSTS", value: stats.posts, color: "text-[#7c93c3]" },
                    { label: "SPACES", value: stats.spaces, color: "text-purple-400" },
                    { label: "VIDEOS", value: stats.videos, color: "text-amber-400" },
                  ].map(s => (
                    <div key={s.label} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 text-center">
                      <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                      <p className="font-mono text-[8px] text-white/30 mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Search + filter */}
                <div className="flex gap-2 p-4 border-b border-white/[0.05] flex-wrap">
                  <div className="relative flex-1 min-w-[180px]">
                    <Search size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
                    <input className={`${inputCls} pl-8 py-2`} placeholder="Search ambassador..."
                      value={portalSearch} onChange={e => setPortalSearch(e.target.value)} />
                  </div>
                  <div className="flex gap-1.5 flex-wrap">
                    {(["all","pending","approved","rejected"] as const).map(f => (
                      <button key={f} onClick={() => setPortalFilter(f)}
                        className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${portalFilter===f?"bg-[#7c93c3] text-white":"bg-white/[0.04] text-[#a1a1aa] hover:bg-white/[0.08]"}`}>
                        {f}
                      </button>
                    ))}
                    <select value={portalSort} onChange={e => setPortalSort(e.target.value as any)}
                      className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[#a1a1aa] text-xs focus:outline-none">
                      <option value="submissions">Most Links</option>
                      <option value="date">Recent</option>
                    </select>
                  </div>
                </div>

                {/* Ambassador cards */}
                <div className="divide-y divide-white/[0.04] max-h-[600px] overflow-y-auto">
                  {filteredPortal.length === 0 ? (
                    <div className="py-12 text-center text-[#52525b] text-sm">No ambassadors found</div>
                  ) : filteredPortal.map(app => {
                    const appSubs = getSubsFor(app.arxon_account_id);
                    const posts   = appSubs.filter(s => s.submission_type === "post").length;
                    const spaces  = appSubs.filter(s => s.submission_type === "space").length;
                    const videos  = appSubs.filter(s => s.submission_type === "video").length;

                    return (
                      <div key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className="flex items-center gap-3 px-5 py-4 hover:bg-white/[0.02] cursor-pointer transition-colors group"
                      >
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-lg bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center font-mono text-sm font-bold text-[#7c93c3] shrink-0">
                          {app.full_name?.charAt(0)?.toUpperCase()}
                        </div>

                        {/* Name + meta */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-white text-sm font-semibold">{app.full_name}</span>
                            <StatusBadge status={app.status} />
                            {app.country && <span className="font-mono text-[9px] text-white/25 bg-white/[0.03] px-2 py-0.5 rounded">{app.country}</span>}
                          </div>
                          <p className="text-[#52525b] text-xs mt-0.5 font-mono truncate">
                            {app.x_handle} · {app.arxon_account_id}
                          </p>
                          {/* Inline link previews */}
                          {appSubs.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1.5">
                              {appSubs.slice(0, 4).map((sub: any, j: number) => (
                                <a key={j} href={sub.submission_url} target="_blank" rel="noopener noreferrer"
                                  onClick={e => e.stopPropagation()}
                                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono border hover:opacity-80 transition-opacity ${
                                    sub.submission_type === "space" ? "bg-purple-400/[0.06] border-purple-400/15 text-purple-400/70" :
                                    sub.submission_type === "video" ? "bg-amber-400/[0.06] border-amber-400/15 text-amber-400/70" :
                                    "bg-[#7c93c3]/[0.06] border-[#7c93c3]/15 text-[#7c93c3]/70"
                                  }`}>
                                  <ExternalLink size={8} />
                                  {sub.submission_url.replace(/^https?:\/\//, "").slice(0, 30)}…
                                </a>
                              ))}
                              {appSubs.length > 4 && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[9px] font-mono bg-white/[0.03] border border-white/[0.06] text-white/30">
                                  +{appSubs.length - 4} more
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Counts */}
                        <div className="flex items-center gap-3 shrink-0 text-center">
                          <div>
                            <p className={`font-mono font-bold text-sm ${posts >= 8 ? "text-emerald-400" : "text-white"}`}>{posts}</p>
                            <p className="font-mono text-[9px] text-[#52525b]">Posts</p>
                          </div>
                          <div>
                            <p className={`font-mono font-bold text-sm ${spaces >= 2 ? "text-emerald-400" : "text-purple-400"}`}>{spaces}</p>
                            <p className="font-mono text-[9px] text-[#52525b]">Spaces</p>
                          </div>
                          <div>
                            <p className={`font-mono font-bold text-sm ${videos >= 1 ? "text-emerald-400" : "text-amber-400"}`}>{videos}</p>
                            <p className="font-mono text-[9px] text-[#52525b]">Videos</p>
                          </div>
                          <div className="pl-2 border-l border-white/[0.06]">
                            <p className="font-mono font-bold text-sm text-[#7c93c3]">{appSubs.length}</p>
                            <p className="font-mono text-[9px] text-[#52525b]">Total</p>
                          </div>
                          <ChevronRight size={13} className="text-[#52525b] group-hover:text-[#7c93c3] transition-colors ml-1" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </>
        )}
      </Card>

      {/* Full detail overlay */}
      <AnimatePresence>
        {selectedApp && (
          <PortalDetailOverlay
            app={selectedApp}
            submissions={selectedSubs}
            allApps={filteredPortal}
            onClose={() => setSelectedAppId(null)}
            onStatusChange={updateStatus}
            onNavigate={setSelectedAppId}
          />
        )}
      </AnimatePresence>
    </>
  );
};

/* ════════════════════════════════════════
   SITE STATS
════════════════════════════════════════ */
const SiteStats = () => {
  const [stats, setStats] = useState({ users: 0, ambassadors: 0, submissions: 0, waitlist: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("ambassador_applications").select("*", { count:"exact", head:true }),
      supabase.from("ambassador_applications").select("*", { count:"exact", head:true }).eq("status","approved"),
      supabase.from("ambassador_submissions").select("*", { count:"exact", head:true }),
      supabase.from("waitlist_entries").select("*", { count:"exact", head:true }),
    ]).then(([apps, approved, subs, waitlist]) => {
      setStats({
        users: apps.count || 0,
        ambassadors: approved.count || 0,
        submissions: subs.count || 0,
        waitlist: waitlist.count || 0,
      });
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <CardHeader icon={BarChart3} title="Site Overview" subtitle="Live counts from database" />
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {loading ? (
          <div className="col-span-4 py-8 flex items-center justify-center"><Activity size={18} className="text-[#7c93c3] animate-spin" /></div>
        ) : <>
          <StatBox label="AMBASSADOR APPS" value={stats.users} color="text-white" />
          <StatBox label="APPROVED AMBASSADORS" value={stats.ambassadors} color="text-emerald-400" />
          <StatBox label="PORTAL LINK SUBMISSIONS" value={stats.submissions} color="text-[#7c93c3]" />
          <StatBox label="WAITLIST ENTRIES" value={stats.waitlist} color="text-amber-400" />
        </>}
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════
   NAV + MAIN
════════════════════════════════════════ */
const NAV = [
  { id:"overview",    icon:BarChart3, label:"Overview" },
  { id:"ambassadors", icon:Users,     label:"Ambassadors" },
  { id:"settings",    icon:Settings,  label:"Settings & Links" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin]     = useState(false);
  const [checking, setChecking]   = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Sign in required"); navigate("/auth"); return; }
      const access = await verifyApprovedAdminAccess(user.id);
      if (!access.allowed) {
        await supabase.auth.signOut();
        toast.error(access.reason ?? "Admin access required");
        navigate("/auth");
        return;
      }
      setIsAdmin(true); setChecking(false);
    };
    check();
  }, []);

  if (checking) return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <motion.div animate={{ rotate:360 }} transition={{ duration:1, repeat:Infinity, ease:"linear" }}
        className="w-8 h-8 border-2 border-[#7c93c3] border-t-transparent rounded-full" />
    </div>
  );
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)", backgroundSize:"64px 64px" }} />
      <Navbar />
      <div className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-[1280px] mx-auto">

          <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }} className="flex items-center gap-4 mb-8 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7c93c3]/15 border border-[#7c93c3]/25 flex items-center justify-center">
                <Shield size={18} className="text-[#7c93c3]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Arxon Admin</h1>
                <p className="font-mono text-[9px] text-white/35">CONTROL_CENTER · PRODUCTION</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400/[0.06] border border-emerald-400/20 rounded-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-[9px] text-emerald-400/80">SYSTEM ONLINE</span>
            </div>
          </motion.div>

          <div className="flex gap-5 items-start">
            {/* Sidebar */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              className="w-48 shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden sticky top-24">
              {NAV.map(item => (
                <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-white/[0.04] last:border-0 ${
                    activeSection===item.id ? "bg-[#7c93c3]/10 text-white" : "text-white/45 hover:text-white/70 hover:bg-white/[0.03]"
                  }`}>
                  <item.icon size={14} className={activeSection===item.id?"text-[#7c93c3]":"text-current"} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {activeSection===item.id && <ChevronRight size={12} className="text-[#7c93c3] ml-auto" />}
                </button>
              ))}
              <div className="p-3 border-t border-white/[0.06] space-y-1.5 mt-1">
                <p className="font-mono text-[8px] text-white/20 px-1 mb-2">QUICK LINKS</p>
                {[
                  { label:"Ambassador Page", path:"/ambassadors" },
                  { label:"Portal",          path:"/ambassador-portal" },
                  { label:"Site Home",       path:"/" },
                ].map(l => (
                  <button key={l.path} onClick={() => navigate(l.path)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] text-white/35 hover:text-white/60 hover:bg-white/[0.04] transition-colors text-left">
                    <ExternalLink size={9} /> {l.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Content */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="flex-1 min-w-0 space-y-5">
              {activeSection === "overview"    && <SiteStats />}
              {activeSection === "ambassadors" && <AmbassadorSection />}
              {activeSection === "settings"    && <RetweetSettings />}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
