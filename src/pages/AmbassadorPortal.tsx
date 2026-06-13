import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2, Award, AlertCircle, Link2, ArrowLeft, Plus, X,
  MessageSquare, Users, Globe, Video, Hash, ArrowRight,
  Terminal, Activity, Shield, Database,
  Cpu, Lock, Server, ChevronRight, Twitter, ExternalLink, Send
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type PortalData = { application: any; submissions: any[] };

/* ─── Static UI (outside component to prevent remounts) ─── */
const Grid = ({ size = 60, opacity = 0.022 }: { size?: number; opacity?: number }) => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: `linear-gradient(rgba(168,184,216,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(168,184,216,0.6) 1px,transparent 1px)`,
    backgroundSize: `${size}px ${size}px`, opacity,
  }} />
);

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const cls = { tl: "top-0 left-0", tr: "top-0 right-0", bl: "bottom-0 left-0", br: "bottom-0 right-0" }[pos];
  const bord = { tl: "border-t border-l", tr: "border-t border-r", bl: "border-b border-l", br: "border-b border-r" }[pos];
  return <div className={`absolute ${cls} w-4 h-4 ${bord} border-[#a8c3f0]/40`} />;
};

const Pill = ({ label, variant = "blue" }: { label: string; variant?: "blue" | "green" | "amber" | "red" }) => {
  const v = { blue: "text-[#a8c3f0] bg-[#a8c3f0]/12 border-[#a8c3f0]/30", green: "text-emerald-300 bg-emerald-400/12 border-emerald-400/30", amber: "text-amber-300 bg-amber-400/12 border-amber-400/30", red: "text-red-300 bg-red-400/12 border-red-400/30" }[variant];
  const dot = { blue: "bg-[#a8c3f0]", green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-red-400" }[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-semibold tracking-wider ${v}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />{label}
    </span>
  );
};

const inputCls = "flex-1 min-w-0 bg-white/[0.05] border border-[#a8c3f0]/20 rounded-lg px-4 py-2.5 text-white text-sm font-mono placeholder:text-white/40 focus:outline-none focus:border-[#a8c3f0]/50 focus:bg-[#a8c3f0]/[0.06] transition-all";

const StatCard = ({ icon: Icon, label, value, target, met }: { icon: any; label: string; value: any; target: string; met: boolean }) => (
  <div className={`relative bg-[#101018] border rounded-xl p-4 overflow-hidden transition-colors ${met ? "border-emerald-400/35" : "border-white/[0.1]"}`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${met ? "bg-emerald-400/15" : "bg-[#a8c3f0]/12"}`}>
        <Icon size={13} className={met ? "text-emerald-300" : "text-[#a8c3f0]"} />
      </div>
      {met && <div className="w-2 h-2 rounded-full bg-emerald-400" />}
    </div>
    <div className={`font-mono text-xl font-bold mb-0.5 ${met ? "text-emerald-300" : "text-white"}`}>{value}</div>
    <div className="font-mono text-[9px] text-white/65">{label}</div>
    <div className="font-mono text-[9px] text-white/50 mt-0.5">TARGET: {target}</div>
  </div>
);

const ReqRow = ({ icon: Icon, label, met, bonus }: { icon: any; label: string; met: boolean; bonus?: boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${met ? "border-emerald-400/25 bg-emerald-400/[0.06]" : "border-white/[0.08] bg-white/[0.03]"}`}>
    <CheckCircle2 size={14} className={met ? "text-emerald-400 shrink-0" : "text-white/30 shrink-0"} />
    <div className="w-6 h-6 rounded-md bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 flex items-center justify-center shrink-0">
      <Icon size={11} className="text-[#a8c3f0]" />
    </div>
    <span className={`text-sm flex-1 ${met ? "text-white/90" : "text-white/55"}`}>{label}</span>
    {bonus && <span className="font-mono text-[8px] text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">BONUS</span>}
  </div>
);

/* ════════════════════════════════════════
   FIELD ROW with cancel + per-field submit
════════════════════════════════════════ */
const FieldRow = ({
  index, value, onChange, onRemove, onSubmitSingle, placeholder, submittingIndex,
}: {
  index: number; value: string; onChange: (v: string) => void; onRemove: () => void;
  onSubmitSingle: () => void; placeholder: string; submittingIndex: boolean;
}) => (
  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -10 }}
    className="flex items-center gap-2">
    <span className="font-mono text-[9px] text-white/50 w-6 shrink-0 text-right">{String(index + 1).padStart(2, "0")}</span>
    <input
      className={inputCls}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
    />
    {/* Submit single */}
    <button type="button" onClick={onSubmitSingle} disabled={!value.trim() || submittingIndex}
      title="Submit this link"
      className="shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-lg font-mono text-[10px] font-bold bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 text-[#a8c3f0] hover:bg-[#a8c3f0]/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
      {submittingIndex ? <Activity size={10} className="animate-spin" /> : <Send size={10} />}
    </button>
    {/* Cancel / remove */}
    <button type="button" onClick={onRemove} title="Remove this field"
      className="shrink-0 flex items-center justify-center w-8 h-9 rounded-lg bg-red-400/[0.06] border border-red-400/20 text-red-400/60 hover:bg-red-400/12 hover:text-red-400 transition-colors">
      <X size={12} />
    </button>
  </motion.div>
);

/* ════════════════════════════════════════
   SUBMISSION SECTION COMPONENT
════════════════════════════════════════ */
const SubmissionSection = ({
  title, subtitle, icon: Icon, type, urls, onUpdateUrl, onRemoveUrl, onAdd,
  onSubmitSingle, onSubmitAll, submittingIdx, submittingAll, accent = "blue",
}: {
  title: string; subtitle: string; icon: any; type: string;
  urls: string[];
  onUpdateUrl: (i: number, v: string) => void;
  onRemoveUrl: (i: number) => void;
  onAdd: () => void;
  onSubmitSingle: (i: number) => void;
  onSubmitAll: () => void;
  submittingIdx: number | null;
  submittingAll: boolean;
  accent?: "blue" | "amber";
}) => {
  const accentCls = accent === "amber"
    ? { border: "border-amber-400/25", header: "bg-amber-400/[0.04]", icon: "bg-amber-400/12 border-amber-400/25", iconText: "text-amber-300", title: "text-amber-300/80", dot: "bg-amber-400", btn: "bg-amber-400/12 border-amber-400/25 text-amber-300 hover:bg-amber-400/20" }
    : { border: "border-white/[0.08]", header: "bg-white/[0.02]", icon: "bg-[#a8c3f0]/12 border-[#a8c3f0]/25", iconText: "text-[#a8c3f0]", title: "text-[#a8c3f0]/80", dot: "bg-[#a8c3f0]", btn: "bg-[#a8c3f0]/12 border-[#a8c3f0]/25 text-[#a8c3f0] hover:bg-[#a8c3f0]/20" };

  return (
    <div className={`relative bg-[#101018] border ${accentCls.border} rounded-xl overflow-hidden`}>
      <div className={`flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.08] ${accentCls.header}`}>
        <div className={`w-7 h-7 rounded-md ${accentCls.icon} flex items-center justify-center`}>
          <Icon size={12} className={accentCls.iconText} />
        </div>
        <div>
          <div className={`font-mono text-[10px] font-semibold tracking-widest ${accentCls.title}`}>{title}</div>
          <div className="font-mono text-[9px] text-white/50">{subtitle}</div>
        </div>
      </div>
      <div className="p-5 space-y-2">
        <AnimatePresence>
          {urls.map((url, i) => (
            <FieldRow
              key={`field-${type}-${i}`}
              index={i}
              value={url}
              onChange={v => onUpdateUrl(i, v)}
              onRemove={() => onRemoveUrl(i)}
              onSubmitSingle={() => onSubmitSingle(i)}
              placeholder={`${title.replace("_SUBMISSIONS", "").replace("_", " ")} URL ${i + 1}`}
              submittingIndex={submittingIdx === i}
            />
          ))}
        </AnimatePresence>
        <div className="flex items-center justify-between pt-2">
          <button type="button" onClick={onAdd}
            className="flex items-center gap-1.5 font-mono text-[10px] text-[#a8c3f0]/70 hover:text-[#a8c3f0] transition-colors">
            <Plus size={11} /> ADD FIELD
          </button>
          <button type="button" onClick={onSubmitAll} disabled={submittingAll || !urls.some(u => u.trim())}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${accentCls.btn}`}>
            {submittingAll ? <><Activity size={10} className="animate-spin" /> SAVING...</> : <><Send size={10} /> SUBMIT SECTION</>}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const AmbassadorPortal = () => {
  const navigate = useNavigate();
  const [arxonId, setArxonId] = useState("");
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [submittingAll, setSubmittingAll] = useState(false);
  const [submittingPostIdx, setSubmittingPostIdx] = useState<number | null>(null);
  const [submittingSpaceIdx, setSubmittingSpaceIdx] = useState<number | null>(null);
  const [submittingVideoIdx, setSubmittingVideoIdx] = useState<number | null>(null);
  const [submittingPostSection, setSubmittingPostSection] = useState(false);
  const [submittingSpaceSection, setSubmittingSpaceSection] = useState(false);
  const [submittingVideoSection, setSubmittingVideoSection] = useState(false);

  /* Dynamic post 3 URL from admin settings */
  const [adminPost3, setAdminPost3] = useState<string | null>(null);

  const [postUrls, setPostUrls] = useState<string[]>(["", "", ""]);
  const [spaceUrls, setSpaceUrls] = useState<string[]>(["", ""]);
  const [videoUrls, setVideoUrls] = useState<string[]>(["", ""]);

  /* Actual referral count from Supabase */
  const [actualReferrals, setActualReferrals] = useState<number>(0);

  const REFERRAL_TARGET = 40;

  /* Load admin-configured post 3 */
  useEffect(() => {
    supabase.from("ambassador_settings").select("value").eq("key", "retweet_post_3").maybeSingle()
      .then(({ data }) => { if (data?.value) setAdminPost3(data.value); });
  }, []);

  const lookupPortal = useCallback(async () => {
    if (!arxonId.trim()) return;
    setLoading(true); setNotFound(false); setPortalData(null);
    const { data: app } = await supabase.from("ambassador_applications").select("*").eq("arxon_account_id", arxonId.trim()).maybeSingle();
    if (!app) { setNotFound(true); setLoading(false); return; }
    const { data: subs } = await supabase.from("ambassador_submissions").select("*").eq("arxon_account_id", arxonId.trim()).order("created_at", { ascending: true });
    setPortalData({ application: app, submissions: subs || [] });

    /* Fetch actual referral count */
    const { count } = await supabase.from("referrals").select("*", { count: "exact", head: true }).eq("referrer_id", arxonId.trim());
    setActualReferrals(count ?? app.estimated_new_users ?? 0);

    if (subs && subs.length > 0) {
      const posts = subs.filter((s: any) => s.submission_type === "post").map((s: any) => s.submission_url);
      const spaces = subs.filter((s: any) => s.submission_type === "space").map((s: any) => s.submission_url);
      const videos = subs.filter((s: any) => s.submission_type === "video").map((s: any) => s.submission_url);
      if (posts.length < 3) while (posts.length < 3) posts.push("");
      if (spaces.length < 2) while (spaces.length < 2) spaces.push("");
      if (videos.length < 2) while (videos.length < 2) videos.push("");
      setPostUrls(posts); setSpaceUrls(spaces); setVideoUrls(videos);
    }
    setLoading(false);
  }, [arxonId]);

  /* ── Single field submit ── */
  const submitSingle = useCallback(async (type: string, url: string) => {
    if (!url.trim()) return;
    const row = { arxon_account_id: arxonId.trim(), submission_url: url.trim(), submission_type: type, notes: null };
    const { error } = await supabase.from("ambassador_submissions").upsert(row, { onConflict: "arxon_account_id,submission_url" });
    if (error) toast.error("Failed to save link"); else toast.success("Link saved!");
    await lookupPortal();
  }, [arxonId, lookupPortal]);

  /* ── Submit entire section ── */
  const submitSection = useCallback(async (type: string, urls: string[], setFlag: (b: boolean) => void) => {
    const filtered = urls.filter(u => u.trim());
    if (!filtered.length) { toast.error("Add at least one link"); return; }
    setFlag(true);
    await supabase.from("ambassador_submissions").delete().eq("arxon_account_id", arxonId.trim()).eq("submission_type", type);
    const rows = filtered.map(url => ({ arxon_account_id: arxonId.trim(), submission_url: url.trim(), submission_type: type, notes: null }));
    const { error } = await supabase.from("ambassador_submissions").insert(rows);
    if (error) toast.error("Section submit failed"); else toast.success(`${type} links saved!`);
    await lookupPortal();
    setFlag(false);
  }, [arxonId, lookupPortal]);

  /* ── Submit ALL ── */
  const handleSubmitAll = useCallback(async () => {
    const allUrls = [...postUrls, ...spaceUrls, ...videoUrls].filter(u => u.trim());
    if (!allUrls.length) { toast.error("Add at least one link across any section"); return; }
    setSubmittingAll(true);
    await supabase.from("ambassador_submissions").delete().eq("arxon_account_id", arxonId.trim());
    const rows = [
      ...postUrls.filter(u => u.trim()).map(url => ({ arxon_account_id: arxonId.trim(), submission_url: url.trim(), submission_type: "post", notes: null })),
      ...spaceUrls.filter(u => u.trim()).map(url => ({ arxon_account_id: arxonId.trim(), submission_url: url.trim(), submission_type: "space", notes: null })),
      ...videoUrls.filter(u => u.trim()).map(url => ({ arxon_account_id: arxonId.trim(), submission_url: url.trim(), submission_type: "video", notes: null })),
    ];
    const { error } = await supabase.from("ambassador_submissions").insert(rows);
    if (error) toast.error("Submission failed. Try again."); else toast.success("All links submitted successfully!");
    await lookupPortal();
    setSubmittingAll(false);
  }, [postUrls, spaceUrls, videoUrls, arxonId, lookupPortal]);

  /* ── URL array helpers ── */
  const updateUrl = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (i: number, v: string) =>
    setter(prev => { const a = [...prev]; a[i] = v; return a; });
  const removeUrl = (setter: React.Dispatch<React.SetStateAction<string[]>>) => (i: number) =>
    setter(prev => prev.filter((_, idx) => idx !== i));
  const addUrl = (setter: React.Dispatch<React.SetStateAction<string[]>>) => () =>
    setter(prev => [...prev, ""]);

  const postCount = portalData?.submissions.filter((s: any) => s.submission_type === "post").length || 0;
  const spaceCount = portalData?.submissions.filter((s: any) => s.submission_type === "space").length || 0;
  const videoCount = portalData?.submissions.filter((s: any) => s.submission_type === "video").length || 0;

  /* ── Layout wrapper ── */
  const Wrap = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#0a0a0e] overflow-hidden">
      <div className="absolute inset-0"><Grid size={64} opacity={0.025} /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%,rgba(168,195,240,0.07) 0%,transparent 60%)" }} />
      <div className="relative z-10"><Navbar /><div className="pt-28 pb-20 px-6">{children}</div><Footer /></div>
    </div>
  );

  /* ── LOGIN SCREEN ── */
  if (!portalData) return (
    <Wrap>
      <div className="max-w-[820px] mx-auto">
        <motion.button onClick={() => navigate("/ambassadors")} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0] mb-10 transition-colors">
          <ArrowLeft size={12} /> BACK TO AMBASSADOR PROGRAM
        </motion.button>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#a8c3f0]/50" />
            <span className="font-mono text-[9px] text-[#a8c3f0] tracking-widest">PORTAL_ACCESS.auth</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Ambassador Portal</h1>
          <p className="text-white/55 font-mono text-xs">Track progress · submit content · manage your ambassador node</p>
        </motion.div>
        <div className="grid md:grid-cols-[1fr_320px] gap-5 items-start">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative bg-[#101018] border border-white/[0.1] rounded-2xl overflow-hidden">
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
            <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.08]">
              <Lock size={11} className="text-[#a8c3f0]" />
              <span className="font-mono text-[9px] text-white/50">portal.auth</span>
              <div className="flex-1" /><Pill label="SECURE" variant="blue" />
            </div>
            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-[#a8c3f0]/15 border border-[#a8c3f0]/30 flex items-center justify-center mb-6">
                <Database size={20} className="text-[#a8c3f0]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Access Your Node</h3>
              <p className="text-white/55 text-sm mb-6">
                Enter your Arxon Account ID to access your ambassador dashboard.{" "}
                <button onClick={() => navigate("/ambassador-apply")} className="text-[#a8c3f0] hover:text-white transition-colors underline">Haven't applied?</button>
              </p>
              <div className="flex gap-3 mb-4">
                <input className="flex-1 bg-white/[0.05] border border-[#a8c3f0]/20 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder:text-white/50 focus:outline-none focus:border-[#a8c3f0]/50 transition-all"
                  placeholder="ARXON_ACCOUNT_ID" value={arxonId} onChange={e => setArxonId(e.target.value)} onKeyDown={e => e.key === "Enter" && lookupPortal()} />
                <motion.button onClick={lookupPortal} disabled={loading || !arxonId.trim()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="px-5 py-3 rounded-lg font-mono text-sm font-bold text-[#09090b] disabled:opacity-40 shrink-0"
                  style={{ background: "linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
                  {loading ? <Activity size={14} className="animate-spin" /> : <><ChevronRight size={14} /></>}
                </motion.button>
              </div>
              <AnimatePresence>
                {notFound && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 px-4 py-3 bg-red-400/[0.08] border border-red-400/25 rounded-lg">
                    <AlertCircle size={13} className="text-red-300 shrink-0" />
                    <p className="font-mono text-[10px] text-red-300/90">No application found.{" "}
                      <button onClick={() => navigate("/ambassador-apply")} className="text-red-200 hover:text-white underline">Apply now →</button></p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
            {[
              { icon: Shield, title: "Secure Access", desc: "Accessed via your Account ID only." },
              { icon: Server, title: "Track Progress", desc: "Live referral count, submissions, requirements." },
              { icon: Award, title: "Submit Content", desc: "Posts, Spaces, and bonus videos per section." },
            ].map((item, i) => (
              <div key={i} className="relative bg-[#101018] border border-white/[0.08] rounded-xl p-4 overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={14} className="text-[#a8c3f0]" />
                  </div>
                  <div><div className="text-white/90 font-semibold text-sm mb-0.5">{item.title}</div><div className="text-white/50 text-xs">{item.desc}</div></div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Wrap>
  );

  /* ── DASHBOARD ── */
  const isApproved = portalData.application.status === "approved";
  const RETWEET_POSTS_PORTAL = [
    { label: "Arxon Official Post #1", url: "https://x.com/arxoninfra/status/2052324369775440352?s=20" },
    { label: "Arxon Official Post #2", url: "https://x.com/arxoninfra/status/2041816286724796678?s=20" },
    ...(adminPost3 ? [{ label: "Arxon Official Post #3", url: adminPost3 }] : []),
  ];

  return (
    <Wrap>
      <div className="max-w-[860px] mx-auto">
        <motion.button onClick={() => { setPortalData(null); setArxonId(""); setActualReferrals(0); }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0] mb-8 transition-colors">
          <ArrowLeft size={12} /> SIGN OUT OF PORTAL
        </motion.button>

        {/* System bar */}
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#101018] border border-white/[0.08] rounded-lg mb-6 font-mono text-[9px]">
          <Terminal size={10} className="text-[#a8c3f0]" />
          <span className="text-white/60">ARXON://AMBASSADOR_PORTAL</span>
          <span className="text-[#a8c3f0]/50">/</span>
          <span className="text-[#a8c3f0]">{portalData.application.arxon_account_id}</span>
          <div className="flex-1" />
          <Pill label={isApproved ? "AMBASSADOR" : "ACTIVE_TRIAL"} variant={isApproved ? "green" : "blue"} />
        </motion.div>

        <AnimatePresence>
          {isApproved && (
            <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 px-5 py-4 bg-emerald-400/[0.08] border border-emerald-400/25 rounded-xl mb-5">
              <Award size={16} className="text-emerald-400 shrink-0" />
              <div>
                <div className="text-emerald-300 font-semibold text-sm">Congratulations — Official Arxon Ambassador</div>
                <div className="text-emerald-300/70 font-mono text-[10px] mt-0.5">ARX reward allocation confirmed · vest starts at TGE</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="relative bg-[#101018] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <Corner pos="tl" /><Corner pos="tr" />
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.10] bg-white/[0.015]">
            <Cpu size={10} className="text-[#a8c3f0]" />
            <span className="font-mono text-[9px] text-white/60">NODE_IDENTITY</span>
          </div>
          <div className="p-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-[#a8c3f0]/15 border border-[#a8c3f0]/30 flex items-center justify-center font-mono text-lg font-bold text-[#a8c3f0] shrink-0">
              {portalData.application.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base">{portalData.application.full_name}</h3>
              <p className="text-[#a8c3f0] font-mono text-xs">{portalData.application.x_handle}</p>
              <p className="text-white/55 font-mono text-[9px] mt-0.5">ID: {portalData.application.arxon_account_id}</p>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard icon={MessageSquare} label="POSTS" value={postCount} target="8+" met={postCount >= 8} />
          <StatCard icon={Users} label="SPACES" value={spaceCount} target="2+" met={spaceCount >= 2} />
          <StatCard icon={Globe} label="REFERRALS" value={actualReferrals} target={`${REFERRAL_TARGET}+`} met={actualReferrals >= REFERRAL_TARGET} />
          <StatCard icon={Video} label="VIDEOS" value={videoCount} target="1-2" met={videoCount >= 1} />
        </motion.div>

        {/* Requirements checklist */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="relative bg-[#101018] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.10]">
            <CheckCircle2 size={11} className="text-[#a8c3f0]" />
            <span className="font-mono text-[9px] text-white/60">REQUIREMENTS_CHECKLIST</span>
            <div className="flex-1" />
          </div>
          <div className="p-5 space-y-2">
            <ReqRow icon={Twitter} label="Followed @arxoninfra on X (Twitter)" met={!!portalData.application.followed_arxon} />
            <ReqRow icon={Twitter} label="Retweeted required Arxon posts" met={!!portalData.application.retweeted_posts} />
            <ReqRow icon={MessageSquare} label="8+ quality posts submitted (any platform)" met={postCount >= 8} />
            <ReqRow icon={Users} label="2+ Twitter Spaces co-hosted" met={spaceCount >= 2} />
            <ReqRow icon={Globe} label={`${REFERRAL_TARGET}+ verified new users referred`} met={actualReferrals >= REFERRAL_TARGET} />
            <ReqRow icon={Hash} label="#ArxonAmbassador hashtag on all content" met={portalData.submissions.length > 0} />
            <ReqRow icon={Video} label="1-2 video pieces (priority scoring weight)" met={videoCount >= 1} bonus />
          </div>
        </motion.div>

        {/* Follow & Retweet tasks */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="relative bg-[#101018] border border-[#a8c3f0]/15 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.08] bg-[#a8c3f0]/[0.03]">
            <Twitter size={11} className="text-[#a8c3f0]" />
            <span className="font-mono text-[9px] text-[#a8c3f0]/70 tracking-widest">SOCIAL_TASKS · FOLLOW & RETWEET</span>
          </div>
          <div className="p-5 space-y-3">
            {/* Follow */}
            <div className="flex items-center justify-between gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-lg flex-wrap">
              <div>
                <div className="text-white/80 text-sm font-semibold">Follow @arxoninfra on X</div>
                <div className="font-mono text-[9px] text-white/40 mt-0.5">Official Arxon account — required task</div>
              </div>
              <a href="https://x.com/arxoninfra" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold text-white bg-[#a8c3f0]/15 border border-[#a8c3f0]/30 hover:bg-[#a8c3f0]/25 transition-colors shrink-0">
                <Twitter size={11} /> FOLLOW @arxoninfra
              </a>
            </div>
            {/* Retweet posts */}
            {RETWEET_POSTS_PORTAL.map((post, i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-lg flex-wrap">
                <div>
                  <div className="text-white/80 text-sm font-semibold">{post.label}</div>
                  <a href={post.url} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[9px] text-[#a8c3f0]/50 hover:text-[#a8c3f0] transition-colors flex items-center gap-1 mt-0.5">
                    <ExternalLink size={8} /> {post.url.slice(0, 50)}...
                  </a>
                </div>
                <a href={post.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold text-white bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 hover:bg-[#a8c3f0]/20 transition-colors shrink-0">
                  <ExternalLink size={11} /> OPEN & RETWEET
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Submission sections */}
        <div className="space-y-4 mb-6">
          <SubmissionSection
            title="POST_SUBMISSIONS" subtitle="Posts: X/Twitter, YouTube, Facebook, Medium, blogs, etc. · target 8+"
            icon={MessageSquare} type="post" urls={postUrls}
            onUpdateUrl={updateUrl(setPostUrls)} onRemoveUrl={removeUrl(setPostUrls)} onAdd={addUrl(setPostUrls)}
            onSubmitSingle={(i) => { setSubmittingPostIdx(i); submitSingle("post", postUrls[i]).finally(() => setSubmittingPostIdx(null)); }}
            onSubmitAll={() => submitSection("post", postUrls, setSubmittingPostSection)}
            submittingIdx={submittingPostIdx} submittingAll={submittingPostSection}
          />
          <SubmissionSection
            title="SPACES_SUBMISSIONS" subtitle="Twitter (X) Spaces recordings or links · target 2+"
            icon={Users} type="space" urls={spaceUrls}
            onUpdateUrl={updateUrl(setSpaceUrls)} onRemoveUrl={removeUrl(setSpaceUrls)} onAdd={addUrl(setSpaceUrls)}
            onSubmitSingle={(i) => { setSubmittingSpaceIdx(i); submitSingle("space", spaceUrls[i]).finally(() => setSubmittingSpaceIdx(null)); }}
            onSubmitAll={() => submitSection("space", spaceUrls, setSubmittingSpaceSection)}
            submittingIdx={submittingSpaceIdx} submittingAll={submittingSpaceSection}
          />
          <SubmissionSection
            title="VIDEO_SUBMISSIONS" subtitle="Bonus: YouTube, TikTok, Twitter video, Loom · priority scoring"
            icon={Video} type="video" urls={videoUrls}
            onUpdateUrl={updateUrl(setVideoUrls)} onRemoveUrl={removeUrl(setVideoUrls)} onAdd={addUrl(setVideoUrls)}
            onSubmitSingle={(i) => { setSubmittingVideoIdx(i); submitSingle("video", videoUrls[i]).finally(() => setSubmittingVideoIdx(null)); }}
            onSubmitAll={() => submitSection("video", videoUrls, setSubmittingVideoSection)}
            submittingIdx={submittingVideoIdx} submittingAll={submittingVideoSection}
            accent="amber"
          />
        </div>

        {/* Submit ALL */}
        <motion.button onClick={handleSubmitAll} disabled={submittingAll}
          whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(168,195,240,0.35)" }} whileTap={{ scale: 0.98 }}
          className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-xl font-mono text-sm font-bold text-[#09090b] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }} />
          <span className="relative z-10 flex items-center gap-2">
            {submittingAll ? <><Activity size={13} className="animate-spin" /> SUBMITTING ALL...</> : <><Link2 size={13} /> SUBMIT ALL LINKS <ArrowRight size={13} /></>}
          </span>
        </motion.button>
      </div>
    </Wrap>
  );
};

export default AmbassadorPortal;
