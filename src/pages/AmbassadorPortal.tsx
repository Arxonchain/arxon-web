import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2, Award, AlertCircle, Link2, ArrowLeft, Plus,
  MessageSquare, Users, Globe, Video, Hash, ArrowRight,
  Terminal, Activity, Shield, Database,
  Cpu, Lock, Server, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type PortalData = { application: any; submissions: any[] };

/* ─── Shared UI ─── */
const Grid = ({ size = 60, opacity = 0.022 }) => (
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
  const v = {
    blue: "text-[#a8c3f0] bg-[#a8c3f0]/12 border-[#a8c3f0]/30",
    green: "text-emerald-300 bg-emerald-400/12 border-emerald-400/30",
    amber: "text-amber-300 bg-amber-400/12 border-amber-400/30",
    red: "text-red-300 bg-red-400/12 border-red-400/30",
  }[variant];
  const dot = { blue: "bg-[#a8c3f0]", green: "bg-emerald-400", amber: "bg-amber-400", red: "bg-red-400" }[variant];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-semibold tracking-wider ${v}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`} />
      {label}
    </span>
  );
};

const inputCls = "w-full bg-white/[0.05] border border-[#a8c3f0]/20 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder:text-white/50 focus:outline-none focus:border-[#a8c3f0]/50 focus:bg-[#a8c3f0]/[0.06] transition-all";

/* ─── Stat card ─── */
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

/* ─── Requirement row ─── */
const ReqRow = ({ icon: Icon, label, met, bonus }: { icon: any; label: string; met: boolean; bonus?: boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${met ? "border-emerald-400/25 bg-emerald-400/[0.06]" : "border-white/[0.08] bg-white/[0.03]"}`}>
    <CheckCircle2 size={14} className={met ? "text-emerald-400 shrink-0" : "text-white/65 shrink-0"} />
    <div className="w-6 h-6 rounded-md bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 flex items-center justify-center shrink-0">
      <Icon size={11} className="text-[#a8c3f0]" />
    </div>
    <span className={`text-sm flex-1 ${met ? "text-white/90" : "text-white/55"}`}>{label}</span>
    {bonus && <span className="font-mono text-[8px] text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">BONUS</span>}
  </div>
);

/* ─── Submission section ─── */
const SubmissionSection = ({
  title, subtitle, icon: Icon, type, urls, notes, onUpdateUrl, onUpdateNote, onAdd, placeholder,
}: {
  title: string; subtitle: string; icon: any; type: string;
  urls: string[]; notes: string[];
  onUpdateUrl: (i: number, v: string) => void; onUpdateNote: (i: number, v: string) => void;
  onAdd: () => void; placeholder: string;
}) => (
  <div className="relative bg-[#101018] border border-white/[0.08] rounded-xl overflow-hidden">
    <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.10]">
      <div className="w-7 h-7 rounded-md bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 flex items-center justify-center">
        <Icon size={12} className="text-[#a8c3f0]" />
      </div>
      <div>
        <div className="font-mono text-[10px] text-white font-semibold tracking-widest">{title}</div>
        <div className="font-mono text-[9px] text-white/60">{subtitle}</div>
      </div>
    </div>
    <div className="p-5 space-y-2">
      {urls.map((url, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.025 }}
          className="flex items-center gap-2">
          <span className="font-mono text-[9px] text-white/55 w-6 shrink-0 text-right">{String(i + 1).padStart(2, "0")}</span>
          <input className={`${inputCls} flex-1`} placeholder={`${placeholder} ${i + 1}`}
            value={url} onChange={e => onUpdateUrl(i, e.target.value)} />
          <input className={`${inputCls} w-24 shrink-0`} placeholder="Notes"
            value={notes[i]} onChange={e => onUpdateNote(i, e.target.value)} />
        </motion.div>
      ))}
      <button onClick={onAdd}
        className="flex items-center gap-1.5 font-mono text-[10px] text-[#a8c3f0]/80 hover:text-[#a8c3f0] transition-colors pt-1">
        <Plus size={11} /> ADD MORE FIELDS
      </button>
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const AmbassadorPortal = () => {
  const navigate = useNavigate();
  const [arxonId, setArxonId] = useState("");
  const [portalData, setPortalData] = useState<PortalData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Three separate sections: posts, spaces, videos
  const [postUrls, setPostUrls] = useState<string[]>(Array(8).fill(""));
  const [postNotes, setPostNotes] = useState<string[]>(Array(8).fill(""));
  const [spaceUrls, setSpaceUrls] = useState<string[]>(Array(2).fill(""));
  const [spaceNotes, setSpaceNotes] = useState<string[]>(Array(2).fill(""));
  const [videoUrls, setVideoUrls] = useState<string[]>(Array(2).fill(""));
  const [videoNotes, setVideoNotes] = useState<string[]>(Array(2).fill(""));

  const REFERRAL_TARGET = 40;

  const lookupPortal = async () => {
    if (!arxonId.trim()) return;
    setLoading(true);
    setNotFound(false);
    setPortalData(null);
    const { data: app } = await supabase.from("ambassador_applications").select("*").eq("arxon_account_id", arxonId.trim()).maybeSingle();
    if (!app) { setNotFound(true); setLoading(false); return; }
    const { data: subs } = await supabase.from("ambassador_submissions").select("*").eq("arxon_account_id", arxonId.trim()).order("created_at", { ascending: true });
    setPortalData({ application: app, submissions: subs || [] });

    if (subs && subs.length > 0) {
      const posts = subs.filter((s: any) => s.submission_type === "post");
      const spaces = subs.filter((s: any) => s.submission_type === "space");
      const videos = subs.filter((s: any) => s.submission_type === "video");

      const fillArr = (arr: any[], size: number) => {
        const urls = arr.map((s: any) => s.submission_url);
        const notes = arr.map((s: any) => s.notes || "");
        while (urls.length < size) { urls.push(""); notes.push(""); }
        return { urls, notes };
      };

      const p = fillArr(posts, 8);
      const s = fillArr(spaces, 2);
      const v = fillArr(videos, 2);
      setPostUrls(p.urls); setPostNotes(p.notes);
      setSpaceUrls(s.urls); setSpaceNotes(s.notes);
      setVideoUrls(v.urls); setVideoNotes(v.notes);
    }
    setLoading(false);
  };

  const handleSubmitLinks = async () => {
    const allFilled = [...postUrls, ...spaceUrls, ...videoUrls].filter(u => u.trim());
    if (!allFilled.length) { toast.error("Add at least one link"); return; }
    setSubmitting(true);
    await supabase.from("ambassador_submissions").delete().eq("arxon_account_id", arxonId.trim());

    const buildRows = (urls: string[], notes: string[], type: string) =>
      urls.map((url, i) => ({ url: url.trim(), note: notes[i]?.trim() || "" }))
        .filter(s => s.url)
        .map(s => ({
          arxon_account_id: arxonId.trim(),
          submission_url: s.url,
          submission_type: type,
          notes: s.note || null,
        }));

    const rows = [
      ...buildRows(postUrls, postNotes, "post"),
      ...buildRows(spaceUrls, spaceNotes, "space"),
      ...buildRows(videoUrls, videoNotes, "video"),
    ];

    const { error } = await supabase.from("ambassador_submissions").insert(rows);
    if (error) toast.error("Submission failed. Try again.");
    else { toast.success("Links submitted."); lookupPortal(); }
    setSubmitting(false);
  };

  const postCount = portalData?.submissions.filter((s: any) => s.submission_type === "post").length || 0;
  const spaceCount = portalData?.submissions.filter((s: any) => s.submission_type === "space").length || 0;
  const videoCount = portalData?.submissions.filter((s: any) => s.submission_type === "video").length || 0;
  const referralCount = portalData?.application?.estimated_new_users || 0;

  /* ── Layout wrapper ── */
  const Wrap = ({ children }: { children: React.ReactNode }) => (
    <div className="min-h-screen bg-[#0a0a0e] overflow-hidden">
      <div className="absolute inset-0"><Grid size={64} opacity={0.025} /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 50% 30%,rgba(168,195,240,0.07) 0%,transparent 60%)" }} />
      <div className="relative z-10">
        <Navbar />
        <div className="pt-28 pb-20 px-6">{children}</div>
        <Footer />
      </div>
    </div>
  );

  /* ── LOGIN SCREEN ── */
  if (!portalData) return (
    <Wrap>
      <div className="max-w-[820px] mx-auto">
        <motion.button onClick={() => navigate("/ambassadors")}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
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
          {/* Login card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="relative bg-[#101018] border border-white/[0.1] rounded-2xl overflow-hidden">
            <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
            <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.08]">
              <Lock size={11} className="text-[#a8c3f0]" />
              <span className="font-mono text-[9px] text-white/50">portal.auth</span>
              <div className="flex-1" />
              <Pill label="SECURE" variant="blue" />
            </div>
            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-[#a8c3f0]/15 border border-[#a8c3f0]/30 flex items-center justify-center mb-6">
                <Database size={20} className="text-[#a8c3f0]" />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Access Your Node</h3>
              <p className="text-white/55 text-sm mb-6">
                Enter your Arxon Account ID to access your personal ambassador dashboard.{" "}
                <button onClick={() => navigate("/ambassador-apply")} className="text-[#a8c3f0] hover:text-white transition-colors underline">Haven't applied?</button>
              </p>

              <div className="flex gap-3 mb-4">
                <input className={`${inputCls} flex-1`} placeholder="ARXON_ACCOUNT_ID"
                  value={arxonId} onChange={e => setArxonId(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && lookupPortal()} />
                <motion.button onClick={lookupPortal} disabled={loading || !arxonId.trim()}
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="relative overflow-hidden px-5 py-3 rounded-lg font-mono text-sm font-bold text-[#09090b] disabled:opacity-40 disabled:pointer-events-none shrink-0"
                  style={{ background: "linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
                  <span className="relative z-10 flex items-center gap-1.5">
                    {loading ? <Activity size={14} className="animate-spin" /> : <><ChevronRight size={14} /> GO</>}
                  </span>
                </motion.button>
              </div>

              <AnimatePresence>
                {notFound && (
                  <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                    className="flex items-center gap-2.5 px-4 py-3 bg-red-400/[0.08] border border-red-400/25 rounded-lg">
                    <AlertCircle size={13} className="text-red-300 shrink-0" />
                    <p className="font-mono text-[10px] text-red-300/90">
                      No application found for this ID.{" "}
                      <button onClick={() => navigate("/ambassador-apply")} className="text-red-200 hover:text-white underline">Apply now →</button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Info sidebar */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-3">
            {[
              { icon: Shield, title: "Secure Access", desc: "Read-only with your Account ID. No password required." },
              { icon: Server, title: "Track Progress", desc: "View submissions, referral count, and requirements status." },
              { icon: Award, title: "Submit Content", desc: "Push posts, Spaces, and bonus videos for evaluation." },
            ].map((item, i) => (
              <div key={i} className="relative bg-[#101018] border border-white/[0.08] rounded-xl p-4 overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={14} className="text-[#a8c3f0]" />
                  </div>
                  <div>
                    <div className="text-white/90 font-semibold text-sm mb-0.5">{item.title}</div>
                    <div className="text-white/50 text-xs">{item.desc}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </Wrap>
  );

  /* ── PORTAL DASHBOARD ── */
  const isApproved = portalData.application.status === "approved";

  return (
    <Wrap>
      <div className="max-w-[860px] mx-auto">
        <motion.button onClick={() => { setPortalData(null); setArxonId(""); }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
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

        {/* Approved banner */}
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

        {/* Profile card */}
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

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard icon={MessageSquare} label="POSTS" value={postCount} target="8+" met={postCount >= 8} />
          <StatCard icon={Users} label="SPACES" value={spaceCount} target="2+" met={spaceCount >= 2} />
          <StatCard icon={Globe} label="REFERRALS" value={referralCount} target={`${REFERRAL_TARGET}+`} met={referralCount >= REFERRAL_TARGET} />
          <StatCard icon={Video} label="VIDEOS" value={videoCount} target="1-2" met={videoCount >= 1} />
        </motion.div>

        {/* Requirements */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="relative bg-[#101018] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.10]">
            <CheckCircle2 size={11} className="text-[#a8c3f0]" />
            <span className="font-mono text-[9px] text-white/60">REQUIREMENTS_CHECKLIST</span>
            <div className="flex-1" />
            <span className="font-mono text-[9px] text-white/55">
              {[postCount >= 8, spaceCount >= 2, referralCount >= REFERRAL_TARGET, portalData.submissions.length > 0].filter(Boolean).length} / 4 MET
            </span>
          </div>
          <div className="p-5 space-y-2">
            <ReqRow icon={MessageSquare} label="8+ quality tweets / threads posted" met={postCount >= 8} />
            <ReqRow icon={Users} label="2+ Twitter Spaces co-hosted" met={spaceCount >= 2} />
            <ReqRow icon={Globe} label={`${REFERRAL_TARGET}+ verified new users referred`} met={referralCount >= REFERRAL_TARGET} />
            <ReqRow icon={Hash} label="#ArxonAmbassador hashtag on all content" met={portalData.submissions.length > 0} />
            <ReqRow icon={Video} label="1-2 video pieces (priority scoring weight)" met={videoCount >= 1} bonus />
          </div>
        </motion.div>

        {/* Submission sections — split into 3 */}
        <div className="space-y-4 mb-4">
          <SubmissionSection
            title="POST_SUBMISSIONS" subtitle="Tweets / threads · target 8+"
            icon={MessageSquare} type="post"
            urls={postUrls} notes={postNotes}
            onUpdateUrl={(i, v) => { const a = [...postUrls]; a[i] = v; setPostUrls(a); }}
            onUpdateNote={(i, v) => { const a = [...postNotes]; a[i] = v; setPostNotes(a); }}
            onAdd={() => { setPostUrls(p => [...p, ""]); setPostNotes(p => [...p, ""]); }}
            placeholder="Post / thread URL"
          />
          <SubmissionSection
            title="SPACES_SUBMISSIONS" subtitle="Twitter (X) Spaces · target 2+"
            icon={Users} type="space"
            urls={spaceUrls} notes={spaceNotes}
            onUpdateUrl={(i, v) => { const a = [...spaceUrls]; a[i] = v; setSpaceUrls(a); }}
            onUpdateNote={(i, v) => { const a = [...spaceNotes]; a[i] = v; setSpaceNotes(a); }}
            onAdd={() => { setSpaceUrls(p => [...p, ""]); setSpaceNotes(p => [...p, ""]); }}
            placeholder="Space recording / link"
          />
          <SubmissionSection
            title="VIDEO_SUBMISSIONS" subtitle="Bonus content · 1-2 videos · priority scoring"
            icon={Video} type="video"
            urls={videoUrls} notes={videoNotes}
            onUpdateUrl={(i, v) => { const a = [...videoUrls]; a[i] = v; setVideoUrls(a); }}
            onUpdateNote={(i, v) => { const a = [...videoNotes]; a[i] = v; setVideoNotes(a); }}
            onAdd={() => { setVideoUrls(p => [...p, ""]); setVideoNotes(p => [...p, ""]); }}
            placeholder="Video URL"
          />
        </div>

        {/* Submit button */}
        <motion.button onClick={handleSubmitLinks} disabled={submitting}
          whileHover={{ scale: 1.01, boxShadow: "0 0 30px rgba(168,195,240,0.35)" }}
          whileTap={{ scale: 0.98 }}
          className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-lg font-mono text-sm font-bold text-[#09090b] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1.5 }} />
          <span className="relative z-10 flex items-center gap-2">
            {submitting ? <><Activity size={13} className="animate-spin" /> SUBMITTING...</> : <><Link2 size={13} /> SUBMIT ALL LINKS <ArrowRight size={13} /></>}
          </span>
        </motion.button>
      </div>
    </Wrap>
  );
};

export default AmbassadorPortal;
