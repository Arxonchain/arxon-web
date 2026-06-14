import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  CheckCircle2, Award, AlertCircle, Link2, ArrowLeft, Plus, X,
  MessageSquare, Users, Globe, Video, Hash, ArrowRight,
  Terminal, Activity, Shield, Database,
  Cpu, Lock, Server, ChevronRight, Twitter, ExternalLink, Send, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type PortalData = { application: any; submissions: any[] };

/* ══════════════════════════════════════════════════
   MODULE-LEVEL UI — never defined inside a component
══════════════════════════════════════════════════ */
const Grid = ({ size = 60, opacity = 0.022 }: { size?: number; opacity?: number }) => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: `linear-gradient(rgba(168,184,216,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(168,184,216,0.6) 1px,transparent 1px)`,
    backgroundSize: `${size}px ${size}px`, opacity,
  }} />
);
const Corner = ({ pos }: { pos: "tl"|"tr"|"bl"|"br" }) => {
  const cls = { tl:"top-0 left-0", tr:"top-0 right-0", bl:"bottom-0 left-0", br:"bottom-0 right-0" }[pos];
  const bord = { tl:"border-t border-l", tr:"border-t border-r", bl:"border-b border-l", br:"border-b border-r" }[pos];
  return <div className={`absolute ${cls} w-4 h-4 ${bord} border-[#a8c3f0]/40`} />;
};
const Pill = ({ label, variant="blue" }: { label:string; variant?:"blue"|"green"|"amber"|"red" }) => {
  const v = { blue:"text-[#a8c3f0] bg-[#a8c3f0]/12 border-[#a8c3f0]/30", green:"text-emerald-300 bg-emerald-400/12 border-emerald-400/30", amber:"text-amber-300 bg-amber-400/12 border-amber-400/30", red:"text-red-300 bg-red-400/12 border-red-400/30" }[variant];
  const dot = { blue:"bg-[#a8c3f0]", green:"bg-emerald-400", amber:"bg-amber-400", red:"bg-red-400" }[variant];
  return <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border font-mono text-[9px] font-semibold tracking-wider ${v}`}><span className={`w-1.5 h-1.5 rounded-full ${dot} animate-pulse`}/>{label}</span>;
};
const StatCard = ({ icon:Icon, label, value, target, met }: { icon:any; label:string; value:any; target:string; met:boolean }) => (
  <div className={`relative bg-[#101018] border rounded-xl p-4 overflow-hidden transition-colors ${met?"border-emerald-400/35":"border-white/[0.1]"}`}>
    <div className="flex items-center justify-between mb-3">
      <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${met?"bg-emerald-400/15":"bg-[#a8c3f0]/12"}`}>
        <Icon size={13} className={met?"text-emerald-300":"text-[#a8c3f0]"}/>
      </div>
      {met && <div className="w-2 h-2 rounded-full bg-emerald-400"/>}
    </div>
    <div className={`font-mono text-xl font-bold mb-0.5 ${met?"text-emerald-300":"text-white"}`}>{value}</div>
    <div className="font-mono text-[9px] text-white/65">{label}</div>
    <div className="font-mono text-[9px] text-white/50 mt-0.5">TARGET: {target}</div>
  </div>
);
const ReqRow = ({ icon:Icon, label, met, bonus }: { icon:any; label:string; met:boolean; bonus?:boolean }) => (
  <div className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${met?"border-emerald-400/25 bg-emerald-400/[0.06]":"border-white/[0.08] bg-white/[0.03]"}`}>
    <CheckCircle2 size={14} className={met?"text-emerald-400 shrink-0":"text-white/30 shrink-0"}/>
    <div className="w-6 h-6 rounded-md bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 flex items-center justify-center shrink-0"><Icon size={11} className="text-[#a8c3f0]"/></div>
    <span className={`text-sm flex-1 ${met?"text-white/90":"text-white/55"}`}>{label}</span>
    {bonus && <span className="font-mono text-[8px] text-amber-300 bg-amber-400/15 border border-amber-400/30 px-2 py-0.5 rounded">BONUS</span>}
  </div>
);
const PageWrap = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#0a0a0e] overflow-hidden">
    <div className="absolute inset-0"><Grid size={64} opacity={0.025}/></div>
    <div className="absolute inset-0 pointer-events-none" style={{ background:"radial-gradient(ellipse at 50% 30%,rgba(168,195,240,0.07) 0%,transparent 60%)" }}/>
    <div className="relative z-10"><Navbar/><div className="pt-28 pb-20 px-6">{children}</div><Footer/></div>
  </div>
);

/* ══════════════════════════════════════════════════
   UNCONTROLLED INPUT ROW
   Uses defaultValue+ref — no re-render while typing.
   onBlur syncs value to parent state.
   Send button reads ref directly so always current.
══════════════════════════════════════════════════ */
const InputRow = ({
  index, defaultValue, placeholder, onBlur, onRemove, onSubmitSingle, submitting, accentAmber=false,
}: {
  index:number; defaultValue:string; placeholder:string;
  onBlur:(v:string)=>void; onRemove:()=>void;
  onSubmitSingle:(v:string)=>void; submitting:boolean; accentAmber?:boolean;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (ref.current && document.activeElement !== ref.current && ref.current.value !== defaultValue) {
      ref.current.value = defaultValue;
    }
  }, [defaultValue]);
  return (
    <div className="flex items-center gap-2">
      <span className={`font-mono text-[9px] w-6 shrink-0 text-right ${accentAmber?"text-amber-400/40":"text-white/50"}`}>{String(index+1).padStart(2,"0")}</span>
      <input
        ref={ref}
        defaultValue={defaultValue}
        placeholder={placeholder}
        onBlur={e => onBlur(e.target.value)}
        className={`flex-1 min-w-0 bg-white/[0.05] border rounded-lg px-4 py-2.5 text-white text-sm font-mono placeholder:text-white/40 focus:outline-none transition-all ${
          accentAmber ? "border-amber-400/20 focus:border-amber-400/45 focus:bg-amber-400/[0.06]"
                      : "border-[#a8c3f0]/20 focus:border-[#a8c3f0]/50 focus:bg-[#a8c3f0]/[0.06]"
        }`}
      />
      <button type="button" title="Save this link"
        onClick={() => { const v = ref.current?.value?.trim(); if (v) onSubmitSingle(v); else toast.error("Field is empty"); }}
        disabled={submitting}
        className={`shrink-0 flex items-center gap-1 px-3 py-2.5 rounded-lg font-mono text-[10px] font-bold border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
          accentAmber ? "bg-amber-400/12 border-amber-400/25 text-amber-300 hover:bg-amber-400/22"
                      : "bg-[#a8c3f0]/12 border-[#a8c3f0]/25 text-[#a8c3f0] hover:bg-[#a8c3f0]/22"
        }`}>
        {submitting ? <Activity size={10} className="animate-spin"/> : <Send size={10}/>}
      </button>
      <button type="button" title="Remove field" onClick={onRemove}
        className="shrink-0 flex items-center justify-center w-8 h-9 rounded-lg bg-red-400/[0.06] border border-red-400/20 text-red-400/60 hover:bg-red-400/12 hover:text-red-400 transition-colors">
        <X size={12}/>
      </button>
    </div>
  );
};

/* ══════════════════════════════════════════════════
   SUBMISSION SECTION
══════════════════════════════════════════════════ */
const SubmissionSection = ({
  title, subtitle, icon:Icon, type, urls,
  onUpdateUrl, onRemoveUrl, onAdd, onSubmitSingle, onSubmitAll,
  submittingIdx, submittingAll, accentAmber=false,
}: {
  title:string; subtitle:string; icon:any; type:string; urls:string[];
  onUpdateUrl:(i:number,v:string)=>void; onRemoveUrl:(i:number)=>void; onAdd:()=>void;
  onSubmitSingle:(i:number,val:string)=>void; onSubmitAll:()=>void;
  submittingIdx:number|null; submittingAll:boolean; accentAmber?:boolean;
}) => (
  <div className={`relative bg-[#101018] border rounded-xl overflow-hidden ${accentAmber?"border-amber-400/20":"border-white/[0.08]"}`}>
    <div className={`flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.08] ${accentAmber?"bg-amber-400/[0.03]":"bg-white/[0.02]"}`}>
      <div className={`w-7 h-7 rounded-md flex items-center justify-center ${accentAmber?"bg-amber-400/12 border border-amber-400/25":"bg-[#a8c3f0]/12 border border-[#a8c3f0]/25"}`}>
        <Icon size={12} className={accentAmber?"text-amber-300":"text-[#a8c3f0]"}/>
      </div>
      <div>
        <div className={`font-mono text-[10px] font-semibold tracking-widest ${accentAmber?"text-amber-300/80":"text-[#a8c3f0]/80"}`}>{title}</div>
        <div className="font-mono text-[9px] text-white/45">{subtitle}</div>
      </div>
    </div>
    <div className="p-5 space-y-2">
      {urls.map((url,i) => (
        <InputRow key={`${type}-${i}`} index={i} defaultValue={url} placeholder={`${title.replace(/_SUBMISSIONS$/,"").replace(/_/g," ")} URL ${i+1}`}
          onBlur={v => onUpdateUrl(i,v)} onRemove={() => onRemoveUrl(i)}
          onSubmitSingle={val => onSubmitSingle(i,val)}
          submitting={submittingIdx===i} accentAmber={accentAmber}/>
      ))}
      <div className="flex items-center justify-between pt-2">
        <button type="button" onClick={onAdd}
          className={`flex items-center gap-1.5 font-mono text-[10px] transition-colors ${accentAmber?"text-amber-300/60 hover:text-amber-300/90":"text-[#a8c3f0]/60 hover:text-[#a8c3f0]"}`}>
          <Plus size={11}/> ADD FIELD
        </button>
        <button type="button" onClick={onSubmitAll} disabled={submittingAll || !urls.some(u=>u.trim())}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold border transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
            accentAmber ? "bg-amber-400/12 border-amber-400/25 text-amber-300 hover:bg-amber-400/22"
                        : "bg-[#a8c3f0]/12 border-[#a8c3f0]/25 text-[#a8c3f0] hover:bg-[#a8c3f0]/22"
          }`}>
          {submittingAll ? <><Activity size={10} className="animate-spin"/> SAVING...</> : <><Send size={10}/> SUBMIT SECTION</>}
        </button>
      </div>
    </div>
  </div>
);

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const AmbassadorPortal = () => {
  const navigate = useNavigate();
  const [arxonId, setArxonId]   = useState("");
  const [portalData, setPortalData] = useState<PortalData|null>(null);
  const [loading, setLoading]   = useState(false);
  const [notFound, setNotFound] = useState(false);

  /* Submission state */
  const [postUrls,  setPostUrls]  = useState<string[]>(["","",""]);
  const [spaceUrls, setSpaceUrls] = useState<string[]>(["",""]);
  const [videoUrls, setVideoUrls] = useState<string[]>(["",""]);

  /* Referral */
  const [actualReferrals, setActualReferrals] = useState<number>(0);
  const [syncingReferrals, setSyncingReferrals] = useState(false);

  /* Submit state */
  const [submittingAll,         setSubmittingAll]         = useState(false);
  const [submittingPostIdx,     setSubmittingPostIdx]     = useState<number|null>(null);
  const [submittingSpaceIdx,    setSubmittingSpaceIdx]    = useState<number|null>(null);
  const [submittingVideoIdx,    setSubmittingVideoIdx]    = useState<number|null>(null);
  const [submittingPostSection, setSubmittingPostSection] = useState(false);
  const [submittingSpaceSection,setSubmittingSpaceSection]= useState(false);
  const [submittingVideoSection,setSubmittingVideoSection]= useState(false);

  const [adminPost3, setAdminPost3] = useState<string|null>(null);
  const REFERRAL_TARGET = 40;

  useEffect(() => {
    supabase.from("ambassador_settings").select("value").eq("key","retweet_post_3").maybeSingle()
      .then(({ data }) => { if (data?.value) setAdminPost3(data.value); });
  }, []);

  /* ── Fetch submissions only (no URL reset) ── */
  const refreshSubmissions = useCallback(async (uid: string) => {
    const { data: subs } = await supabase
      .from("ambassador_submissions").select("*")
      .eq("arxon_account_id", uid).order("created_at", { ascending: true });
    setPortalData(prev => prev ? { ...prev, submissions: subs || [] } : prev);
    return subs || [];
  }, []);

  /* ── Full portal lookup (on login) ── */
  const lookupPortal = useCallback(async () => {
    const uid = arxonId.trim();
    if (!uid) return;
    setLoading(true); setNotFound(false); setPortalData(null);
    const { data: app } = await supabase.from("ambassador_applications").select("*").eq("arxon_account_id", uid).maybeSingle();
    if (!app) { setNotFound(true); setLoading(false); return; }
    const { data: subs } = await supabase.from("ambassador_submissions").select("*").eq("arxon_account_id", uid).order("created_at", { ascending: true });
    setPortalData({ application: app, submissions: subs || [] });

    /* Referral count — fetch from mining app via Edge Function */
    try {
      const refRes = await fetch(
        `https://knfpmzjghbjnlnarsivs.supabase.co/functions/v1/get-referral-count?account_id=${encodeURIComponent(uid)}`,
        {
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (refRes.ok) {
        const refData = await refRes.json();
        setActualReferrals(refData.referral_count ?? 0);
      } else {
        setActualReferrals(app.estimated_new_users ?? 0);
      }
    } catch {
      setActualReferrals(app.estimated_new_users ?? 0);
    }

    /* Pre-populate URL fields from saved submissions */
    if (subs && subs.length > 0) {
      const posts  = subs.filter((s:any) => s.submission_type==="post").map((s:any) => s.submission_url);
      const spaces = subs.filter((s:any) => s.submission_type==="space").map((s:any) => s.submission_url);
      const videos = subs.filter((s:any) => s.submission_type==="video").map((s:any) => s.submission_url);
      while (posts.length  < 3) posts.push("");
      while (spaces.length < 2) spaces.push("");
      while (videos.length < 2) videos.push("");
      setPostUrls(posts); setSpaceUrls(spaces); setVideoUrls(videos);
    }
    setLoading(false);
  }, [arxonId]);

  /* ── Sync referrals — calls Edge Function bridging to mining app Supabase ── */
  const syncReferrals = useCallback(async () => {
    const uid = arxonId.trim();
    if (!uid) return;
    setSyncingReferrals(true);
    try {
      const res = await fetch(
        `https://knfpmzjghbjnlnarsivs.supabase.co/functions/v1/get-referral-count?account_id=${encodeURIComponent(uid)}`,
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      const total = data.referral_count ?? 0;
      setActualReferrals(total);
      toast.success(`Referrals synced: ${total} total referral${total !== 1 ? "s" : ""} found`);
    } catch (err: any) {
      toast.error("Sync failed — " + (err?.message ?? "unknown error"));
    }
    setSyncingReferrals(false);
  }, [arxonId]);

  /* ── Save a single link without touching URL state ── */
  const saveSingleLink = useCallback(async (type: string, url: string): Promise<boolean> => {
    const uid = arxonId.trim();
    if (!url.trim() || !uid) return false;
    /* Check duplicate */
    const { data: existing } = await supabase.from("ambassador_submissions").select("id")
      .eq("arxon_account_id", uid).eq("submission_url", url.trim()).maybeSingle();
    if (existing) { toast.success("Link already saved"); return true; }
    const { error } = await supabase.from("ambassador_submissions").insert({
      arxon_account_id: uid, submission_url: url.trim(), submission_type: type, notes: null,
    });
    if (error) { toast.error("Failed to save — " + error.message); return false; }
    toast.success("Link saved!");
    return true;
  }, [arxonId]);

  /* ── Single field submit — only refreshes submission count, NOT urls ── */
  const handleSubmitSingle = useCallback(async (
    type: string, url: string, index: number, setIdx: (n:number|null)=>void
  ) => {
    if (!url.trim()) { toast.error("Field is empty"); return; }
    setIdx(index);
    const ok = await saveSingleLink(type, url);
    if (ok) await refreshSubmissions(arxonId.trim());
    setIdx(null);
  }, [saveSingleLink, refreshSubmissions, arxonId]);

  /* ── Submit full section (replaces type) ── */
  const submitSection = useCallback(async (
    type: string, urls: string[], setFlag: (b:boolean)=>void
  ) => {
    const uid = arxonId.trim();
    const filtered = urls.filter(u => u.trim());
    if (!filtered.length) { toast.error("Add at least one link"); return; }
    setFlag(true);
    await supabase.from("ambassador_submissions").delete().eq("arxon_account_id", uid).eq("submission_type", type);
    const rows = filtered.map(url => ({ arxon_account_id:uid, submission_url:url.trim(), submission_type:type, notes:null }));
    const { error } = await supabase.from("ambassador_submissions").insert(rows);
    if (error) toast.error("Section submit failed — " + error.message);
    else toast.success(`${type} links saved!`);
    await refreshSubmissions(uid);
    setFlag(false);
  }, [arxonId, refreshSubmissions]);

  /* ── Submit ALL ── */
  const handleSubmitAll = useCallback(async () => {
    const uid = arxonId.trim();
    const allFilled = [...postUrls,...spaceUrls,...videoUrls].filter(u => u.trim());
    if (!allFilled.length) { toast.error("Add at least one link"); return; }
    setSubmittingAll(true);
    await supabase.from("ambassador_submissions").delete().eq("arxon_account_id", uid);
    const rows = [
      ...postUrls.filter(u=>u.trim()).map(url => ({ arxon_account_id:uid, submission_url:url.trim(), submission_type:"post", notes:null })),
      ...spaceUrls.filter(u=>u.trim()).map(url => ({ arxon_account_id:uid, submission_url:url.trim(), submission_type:"space", notes:null })),
      ...videoUrls.filter(u=>u.trim()).map(url => ({ arxon_account_id:uid, submission_url:url.trim(), submission_type:"video", notes:null })),
    ];
    const { error } = await supabase.from("ambassador_submissions").insert(rows);
    if (error) toast.error("Submit failed — " + error.message);
    else toast.success("All links submitted successfully!");
    await refreshSubmissions(uid);
    setSubmittingAll(false);
  }, [postUrls, spaceUrls, videoUrls, arxonId, refreshSubmissions]);

  /* ── Stable URL helpers ── */
  const updateUrl = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (i:number, v:string) => setter(prev => { const a=[...prev]; a[i]=v; return a; });
  const removeUrl = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    (i:number) => setter(prev => prev.filter((_,idx) => idx!==i));
  const addUrl = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    () => setter(prev => [...prev,""]);

  const postCount  = portalData?.submissions.filter((s:any) => s.submission_type==="post").length  || 0;
  const spaceCount = portalData?.submissions.filter((s:any) => s.submission_type==="space").length || 0;
  const videoCount = portalData?.submissions.filter((s:any) => s.submission_type==="video").length || 0;

  /* ════ LOGIN SCREEN ════ */
  if (!portalData) return (
    <PageWrap>
      <div className="max-w-[820px] mx-auto">
        <motion.button onClick={() => navigate("/ambassadors")} initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
          className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0] mb-10 transition-colors">
          <ArrowLeft size={12}/> BACK TO AMBASSADOR PROGRAM
        </motion.button>
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-6 bg-[#a8c3f0]/50"/>
            <span className="font-mono text-[9px] text-[#a8c3f0] tracking-widest">PORTAL_ACCESS.auth</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Ambassador Portal</h1>
          <p className="text-white/55 font-mono text-xs">Track progress · submit content · manage your ambassador node</p>
        </motion.div>
        <div className="grid md:grid-cols-[1fr_320px] gap-5 items-start">
          <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
            className="relative bg-[#101018] border border-white/[0.1] rounded-2xl overflow-hidden">
            <Corner pos="tl"/><Corner pos="tr"/><Corner pos="bl"/><Corner pos="br"/>
            <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.08]">
              <Lock size={11} className="text-[#a8c3f0]"/>
              <span className="font-mono text-[9px] text-white/50">portal.auth</span>
              <div className="flex-1"/><Pill label="SECURE" variant="blue"/>
            </div>
            <div className="p-8">
              <div className="w-12 h-12 rounded-xl bg-[#a8c3f0]/15 border border-[#a8c3f0]/30 flex items-center justify-center mb-6">
                <Database size={20} className="text-[#a8c3f0]"/>
              </div>
              <h3 className="text-white font-bold text-lg mb-1">Access Your Node</h3>
              <p className="text-white/55 text-sm mb-6">
                Enter your Arxon Account ID to access your ambassador dashboard.{" "}
                <button onClick={() => navigate("/ambassador-apply")} className="text-[#a8c3f0] hover:text-white transition-colors underline">Haven't applied?</button>
              </p>
              <div className="flex gap-3 mb-4">
                <input
                  className="flex-1 bg-white/[0.05] border border-[#a8c3f0]/20 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder:text-white/50 focus:outline-none focus:border-[#a8c3f0]/50 transition-all"
                  placeholder="ARXON_ACCOUNT_ID" value={arxonId}
                  onChange={e => setArxonId(e.target.value)}
                  onKeyDown={e => e.key==="Enter" && lookupPortal()}
                />
                <motion.button onClick={lookupPortal} disabled={loading||!arxonId.trim()} whileHover={{ scale:1.03 }} whileTap={{ scale:0.97 }}
                  className="px-5 py-3 rounded-lg font-mono text-sm font-bold text-[#09090b] disabled:opacity-40 shrink-0"
                  style={{ background:"linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
                  {loading ? <Activity size={14} className="animate-spin"/> : <ChevronRight size={14}/>}
                </motion.button>
              </div>
              <AnimatePresence>
                {notFound && (
                  <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
                    className="flex items-center gap-2.5 px-4 py-3 bg-red-400/[0.08] border border-red-400/25 rounded-lg">
                    <AlertCircle size={13} className="text-red-300 shrink-0"/>
                    <p className="font-mono text-[10px] text-red-300/90">No application found for this ID.{" "}
                      <button onClick={() => navigate("/ambassador-apply")} className="text-red-200 hover:text-white underline">Apply now →</button>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
          <motion.div initial={{ opacity:0, x:16 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.2 }} className="space-y-3">
            {[
              { icon:Shield,  title:"Secure Access", desc:"Accessed via your Account ID only." },
              { icon:Server,  title:"Track Progress", desc:"Live referral count, submissions, requirements." },
              { icon:Award,   title:"Submit Content", desc:"Posts, Spaces, and bonus videos per section." },
            ].map((item,i) => (
              <div key={i} className="relative bg-[#101018] border border-white/[0.08] rounded-xl p-4 overflow-hidden">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 flex items-center justify-center shrink-0 mt-0.5">
                    <item.icon size={14} className="text-[#a8c3f0]"/>
                  </div>
                  <div><div className="text-white/90 font-semibold text-sm mb-0.5">{item.title}</div><div className="text-white/50 text-xs">{item.desc}</div></div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </PageWrap>
  );

  /* ════ DASHBOARD ════ */
  const isApproved = portalData.application.status==="approved";
  const RETWEET_POSTS_PORTAL = [
    { label:"Arxon Official Post #1", url:"https://x.com/arxoninfra/status/2052324369775440352?s=20" },
    { label:"Arxon Official Post #2", url:"https://x.com/arxoninfra/status/2041816286724796678?s=20" },
    ...(adminPost3 ? [{ label:"Arxon Official Post #3", url:adminPost3 }] : []),
  ];

  return (
    <PageWrap>
      <div className="max-w-[860px] mx-auto">
        <motion.button onClick={() => { setPortalData(null); setArxonId(""); setActualReferrals(0); setPostUrls(["","",""]); setSpaceUrls(["",""]); setVideoUrls(["",""]); }}
          initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0] mb-8 transition-colors">
          <ArrowLeft size={12}/> SIGN OUT OF PORTAL
        </motion.button>

        {/* System bar */}
        <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#101018] border border-white/[0.08] rounded-lg mb-6 font-mono text-[9px]">
          <Terminal size={10} className="text-[#a8c3f0]"/>
          <span className="text-white/60">ARXON://AMBASSADOR_PORTAL</span>
          <span className="text-[#a8c3f0]/50">/</span>
          <span className="text-[#a8c3f0]">{portalData.application.arxon_account_id}</span>
          <div className="flex-1"/>
          <Pill label={isApproved?"AMBASSADOR":"ACTIVE_TRIAL"} variant={isApproved?"green":"blue"}/>
        </motion.div>

        <AnimatePresence>
          {isApproved && (
            <motion.div initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
              className="flex items-center gap-3 px-5 py-4 bg-emerald-400/[0.08] border border-emerald-400/25 rounded-xl mb-5">
              <Award size={16} className="text-emerald-400 shrink-0"/>
              <div>
                <div className="text-emerald-300 font-semibold text-sm">Congratulations — Official Arxon Ambassador</div>
                <div className="text-emerald-300/70 font-mono text-[10px] mt-0.5">ARX reward allocation confirmed · vest starts at TGE</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Profile */}
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }}
          className="relative bg-[#101018] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <Corner pos="tl"/><Corner pos="tr"/>
          <div className="flex items-center gap-2 px-5 py-3 border-b border-white/[0.10] bg-white/[0.015]">
            <Cpu size={10} className="text-[#a8c3f0]"/>
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

        {/* Stats — referral card has sync button */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <StatCard icon={MessageSquare} label="POSTS"    value={postCount}        target="8+"                    met={postCount>=8}/>
          <StatCard icon={Users}         label="SPACES"   value={spaceCount}       target="2+"                    met={spaceCount>=2}/>
          {/* Referral card with sync button */}
          <div className={`relative bg-[#101018] border rounded-xl p-4 overflow-hidden transition-colors ${actualReferrals>=REFERRAL_TARGET?"border-emerald-400/35":"border-white/[0.1]"}`}>
            <div className="flex items-center justify-between mb-3">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${actualReferrals>=REFERRAL_TARGET?"bg-emerald-400/15":"bg-[#a8c3f0]/12"}`}>
                <Globe size={13} className={actualReferrals>=REFERRAL_TARGET?"text-emerald-300":"text-[#a8c3f0]"}/>
              </div>
              <button onClick={syncReferrals} disabled={syncingReferrals} title="Sync referral count from mining app"
                className="w-6 h-6 rounded-md bg-[#a8c3f0]/10 border border-[#a8c3f0]/20 flex items-center justify-center hover:bg-[#a8c3f0]/20 transition-colors disabled:opacity-40">
                <RefreshCw size={10} className={`text-[#a8c3f0] ${syncingReferrals?"animate-spin":""}`}/>
              </button>
            </div>
            <div className={`font-mono text-xl font-bold mb-0.5 ${actualReferrals>=REFERRAL_TARGET?"text-emerald-300":"text-white"}`}>{actualReferrals}</div>
            <div className="font-mono text-[9px] text-white/65">REFERRALS</div>
            <div className="font-mono text-[9px] text-white/50 mt-0.5">TARGET: {REFERRAL_TARGET}+</div>
          </div>
          <StatCard icon={Video} label="VIDEOS" value={videoCount} target="1-2" met={videoCount>=1}/>
        </motion.div>

        {/* Sync referral info banner */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.12 }}
          className="flex items-center gap-3 px-4 py-3 bg-[#a8c3f0]/[0.04] border border-[#a8c3f0]/15 rounded-xl mb-4">
          <RefreshCw size={12} className="text-[#a8c3f0]/60 shrink-0"/>
          <p className="font-mono text-[9px] text-white/45 flex-1">
            Referral count syncs from your Arxon mining account in real time. Click the <span className="text-[#a8c3f0]/70">↻</span> icon on the referrals card to refresh.
          </p>
          <button onClick={syncReferrals} disabled={syncingReferrals}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[10px] font-bold bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 text-[#a8c3f0] hover:bg-[#a8c3f0]/20 transition-colors disabled:opacity-40 shrink-0">
            {syncingReferrals ? <><Activity size={10} className="animate-spin"/> SYNCING...</> : <><RefreshCw size={10}/> SYNC REFERRALS</>}
          </button>
        </motion.div>

        {/* Requirements */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
          className="relative bg-[#101018] border border-white/[0.08] rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.10]">
            <CheckCircle2 size={11} className="text-[#a8c3f0]"/>
            <span className="font-mono text-[9px] text-white/60">REQUIREMENTS_CHECKLIST</span>
            <div className="flex-1"/>
            <span className="font-mono text-[9px] text-white/45">
              {[postCount>=8, spaceCount>=2, actualReferrals>=REFERRAL_TARGET, portalData.submissions.length>0, videoCount>=1].filter(Boolean).length} / 5 MET
            </span>
          </div>
          <div className="p-5 space-y-2">
            <ReqRow icon={Twitter}       label="Followed @arxoninfra on X (Twitter)"              met={!!portalData.application.followed_arxon}/>
            <ReqRow icon={Twitter}       label="Retweeted required Arxon posts"                    met={!!portalData.application.retweeted_posts}/>
            <ReqRow icon={MessageSquare} label="8+ quality posts submitted (any platform)"         met={postCount>=8}/>
            <ReqRow icon={Users}         label="2+ Twitter Spaces co-hosted"                       met={spaceCount>=2}/>
            <ReqRow icon={Globe}         label={`${REFERRAL_TARGET}+ verified new users referred`} met={actualReferrals>=REFERRAL_TARGET}/>
            <ReqRow icon={Hash}          label="#ArxonAmbassador hashtag on all content"           met={portalData.submissions.length>0}/>
            <ReqRow icon={Video}         label="1-2 video pieces (priority scoring weight)"        met={videoCount>=1} bonus/>
          </div>
        </motion.div>

        {/* Social tasks */}
        <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.18 }}
          className="relative bg-[#101018] border border-[#a8c3f0]/15 rounded-xl overflow-hidden mb-4">
          <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/[0.08] bg-[#a8c3f0]/[0.03]">
            <Twitter size={11} className="text-[#a8c3f0]"/>
            <span className="font-mono text-[9px] text-[#a8c3f0]/70 tracking-widest">SOCIAL_TASKS · FOLLOW & RETWEET</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center justify-between gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-lg flex-wrap">
              <div>
                <div className="text-white/80 text-sm font-semibold">Follow @arxoninfra on X</div>
                <div className="font-mono text-[9px] text-white/40 mt-0.5">Required · visit the official Arxon account</div>
              </div>
              <a href="https://x.com/arxoninfra" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold text-white bg-[#a8c3f0]/15 border border-[#a8c3f0]/30 hover:bg-[#a8c3f0]/25 transition-colors shrink-0">
                <Twitter size={11}/> FOLLOW @arxoninfra
              </a>
            </div>
            {RETWEET_POSTS_PORTAL.map((post,i) => (
              <div key={i} className="flex items-center justify-between gap-3 p-3 bg-white/[0.03] border border-white/[0.07] rounded-lg flex-wrap">
                <div>
                  <div className="text-white/80 text-sm font-semibold">{post.label}</div>
                  <a href={post.url} target="_blank" rel="noopener noreferrer"
                    className="font-mono text-[9px] text-[#a8c3f0]/50 hover:text-[#a8c3f0] transition-colors flex items-center gap-1 mt-0.5">
                    <ExternalLink size={8}/> {post.url.slice(0,52)}...
                  </a>
                </div>
                <a href={post.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold text-white bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 hover:bg-[#a8c3f0]/20 transition-colors shrink-0">
                  <ExternalLink size={11}/> OPEN & RETWEET
                </a>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Submission sections */}
        <div className="space-y-4 mb-6">
          <SubmissionSection
            title="POST_SUBMISSIONS" subtitle="X/Twitter, YouTube, Facebook, Medium, blogs, TikTok — any platform · target 8+"
            icon={MessageSquare} type="post" urls={postUrls}
            onUpdateUrl={updateUrl(setPostUrls)} onRemoveUrl={removeUrl(setPostUrls)} onAdd={addUrl(setPostUrls)}
            onSubmitSingle={(i,val) => handleSubmitSingle("post",val,i,setSubmittingPostIdx)}
            onSubmitAll={() => submitSection("post",postUrls,setSubmittingPostSection)}
            submittingIdx={submittingPostIdx} submittingAll={submittingPostSection}/>
          <SubmissionSection
            title="SPACES_SUBMISSIONS" subtitle="Twitter (X) Space recordings or event links · target 2+"
            icon={Users} type="space" urls={spaceUrls}
            onUpdateUrl={updateUrl(setSpaceUrls)} onRemoveUrl={removeUrl(setSpaceUrls)} onAdd={addUrl(setSpaceUrls)}
            onSubmitSingle={(i,val) => handleSubmitSingle("space",val,i,setSubmittingSpaceIdx)}
            onSubmitAll={() => submitSection("space",spaceUrls,setSubmittingSpaceSection)}
            submittingIdx={submittingSpaceIdx} submittingAll={submittingSpaceSection}/>
          <SubmissionSection
            title="VIDEO_SUBMISSIONS" subtitle="YouTube, TikTok, Twitter video, Loom · priority scoring bonus"
            icon={Video} type="video" urls={videoUrls}
            onUpdateUrl={updateUrl(setVideoUrls)} onRemoveUrl={removeUrl(setVideoUrls)} onAdd={addUrl(setVideoUrls)}
            onSubmitSingle={(i,val) => handleSubmitSingle("video",val,i,setSubmittingVideoIdx)}
            onSubmitAll={() => submitSection("video",videoUrls,setSubmittingVideoSection)}
            submittingIdx={submittingVideoIdx} submittingAll={submittingVideoSection} accentAmber/>
        </div>

        {/* Submit ALL */}
        <motion.button onClick={handleSubmitAll} disabled={submittingAll}
          whileHover={{ scale:1.01, boxShadow:"0 0 30px rgba(168,195,240,0.35)" }} whileTap={{ scale:0.98 }}
          className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-xl font-mono text-sm font-bold text-[#09090b] disabled:opacity-50"
          style={{ background:"linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
          <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
            animate={{ x:["-200%","200%"] }} transition={{ duration:2.5, repeat:Infinity, ease:"linear", repeatDelay:1.5 }}/>
          <span className="relative z-10 flex items-center gap-2">
            {submittingAll ? <><Activity size={13} className="animate-spin"/> SUBMITTING ALL...</> : <><Link2 size={13}/> SUBMIT ALL LINKS <ArrowRight size={13}/></>}
          </span>
        </motion.button>
      </div>
    </PageWrap>
  );
};

export default AmbassadorPortal;
