import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Terminal, Send, CheckCircle2, ArrowLeft, Cpu,
  Activity, AlertCircle, ChevronRight, Globe
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/* ─── Grid ─── */
const Grid = ({ size = 60, opacity = 0.025 }) => (
  <div className="absolute inset-0 pointer-events-none" style={{
    backgroundImage: `linear-gradient(rgba(168,195,240,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(168,195,240,0.6) 1px,transparent 1px)`,
    backgroundSize: `${size}px ${size}px`, opacity,
  }} />
);

const Corner = ({ pos }: { pos: "tl" | "tr" | "bl" | "br" }) => {
  const cls = { tl: "top-0 left-0", tr: "top-0 right-0", bl: "bottom-0 left-0", br: "bottom-0 right-0" }[pos];
  const bord = { tl: "border-t border-l", tr: "border-t border-r", bl: "border-b border-l", br: "border-b border-r" }[pos];
  return <div className={`absolute ${cls} w-4 h-4 ${bord} border-[#a8c3f0]/40`} />;
};

/* ─── Field wrapper ─── */
const Field = ({ label, id, note, required, children }: { label: string; id: string; note?: string; required?: boolean; children: React.ReactNode }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label htmlFor={id} className="font-mono text-[10px] text-[#a8c3f0] tracking-widest uppercase font-semibold">
        {label}{required && <span className="text-[#c8d8f8] ml-1">*</span>}
      </label>
      {note && <span className="font-mono text-[9px] text-white/60">{note}</span>}
    </div>
    {children}
  </div>
);

/* ─── Input — bright light-blue, well contrasted ─── */
const inputCls = "w-full bg-[#a8c3f0]/[0.07] border border-[#a8c3f0]/30 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder:text-white/55 focus:outline-none focus:border-[#a8c3f0]/70 focus:bg-[#a8c3f0]/[0.12] transition-all";
const selectCls = "w-full bg-[#a8c3f0]/[0.07] border border-[#a8c3f0]/30 rounded-lg px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#a8c3f0]/70 focus:bg-[#a8c3f0]/[0.12] transition-all appearance-none cursor-pointer";

const COUNTRIES = [
  "Nigeria","United States","United Kingdom","Canada","Germany","France","India","Brazil","South Africa","Kenya",
  "Ghana","Egypt","Philippines","Indonesia","Vietnam","Pakistan","Bangladesh","Mexico","Argentina","Colombia",
  "UAE","Saudi Arabia","Turkey","Russia","China","Japan","South Korea","Australia","Spain","Italy",
  "Netherlands","Poland","Ukraine","Ethiopia","Tanzania","Uganda","Morocco","Algeria","Cameroon","Senegal",
  "Other"
];

const AmbassadorApply = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    full_name: "", x_handle: "", arxon_account_id: "", country: "",
    follower_count: "", post_link_1: "", post_link_2: "",
    post_link_3: "", post_link_4: "", post_link_5: "",
    motivation: "", estimated_new_users: "", previous_experience: "",
  });

  const upd = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name || !form.x_handle || !form.arxon_account_id || !form.motivation || !form.country) {
      toast.error("Please fill in all required fields, including country");
      return;
    }
    const links = [form.post_link_1, form.post_link_2, form.post_link_3, form.post_link_4, form.post_link_5].filter(Boolean);
    if (links.length < 3) { toast.error("Minimum 3 post links required"); return; }

    setLoading(true);
    try {
      const { error } = await supabase.from("ambassador_applications").insert({
        full_name: form.full_name.trim(),
        x_handle: form.x_handle.trim(),
        arxon_account_id: form.arxon_account_id.trim(),
        country: form.country,
        follower_count: parseInt(form.follower_count) || 0,
        recent_post_links: links,
        motivation: form.motivation.trim(),
        estimated_new_users: parseInt(form.estimated_new_users) || 0,
        previous_experience: form.previous_experience.trim() || null,
      });
      if (error) {
        toast.error(error.code === "23505" ? "Application with this Account ID already exists" : "Submission failed. Try again.");
        return;
      }
      setSubmitted(true);
    } catch { toast.error("Something went wrong."); }
    finally { setLoading(false); }
  };

  /* ── Success screen ── */
  if (submitted) return (
    <div className="min-h-screen bg-[#0a0a0e] overflow-hidden">
      <div className="absolute inset-0"><Grid size={64} opacity={0.025} /></div>
      <Navbar />
      <div className="relative z-10 flex items-center justify-center min-h-screen px-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="relative max-w-[520px] w-full bg-[#101018] border border-[#a8c3f0]/30 rounded-2xl overflow-hidden p-10 text-center">
          <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
          <Grid size={32} opacity={0.04} />
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
            className="relative z-10 w-16 h-16 rounded-xl bg-emerald-400/15 border border-emerald-400/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={28} className="text-emerald-400" />
          </motion.div>
          <div className="relative z-10">
            <div className="font-mono text-[9px] text-emerald-300 tracking-widest mb-3">APPLICATION_SUBMITTED</div>
            <h2 className="text-2xl font-bold text-white mb-3">Node Registered</h2>
            <p className="text-white/60 text-sm leading-relaxed mb-8">
              Your application has been queued for review. Access your portal using your Arxon Account ID to submit content links during the 30-day challenge.
            </p>
            <div className="flex flex-col gap-3">
              <motion.button onClick={() => navigate("/ambassador-portal")}
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-mono text-sm font-bold text-[#09090b]"
                style={{ background: "linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
                <Terminal size={13} /> ACCESS MY PORTAL
              </motion.button>
              <button onClick={() => navigate("/ambassadors")} className="font-mono text-xs text-white/50 hover:text-white/80 transition-colors">
                ← BACK TO PROGRAM
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0e] overflow-hidden">
      <div className="absolute inset-0">
        <Grid size={64} opacity={0.025} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse,rgba(168,195,240,0.08) 0%,transparent 65%)" }} />
      </div>
      <div className="relative z-10">
        <Navbar />
        <div className="pt-28 pb-20 px-6">
          <div className="max-w-[740px] mx-auto">

            {/* Back */}
            <motion.button onClick={() => navigate("/ambassadors")}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0] mb-10 transition-colors">
              <ArrowLeft size={13} /> BACK TO AMBASSADOR PROGRAM
            </motion.button>

            {/* Page header */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-6 bg-[#a8c3f0]/50" />
                <span className="font-mono text-[9px] text-[#a8c3f0] tracking-widest">APPLICATION_FORM.init</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Deploy Application
              </h1>
              <p className="text-white/55 font-mono text-xs">Fill all required fields · minimum 3 post links · processing 24-48h</p>
            </motion.div>

            {/* Form card */}
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="relative bg-[#101018] border border-white/[0.1] rounded-2xl overflow-hidden">
              <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />

              {/* Form header bar */}
              <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.08] bg-white/[0.03]">
                <Terminal size={11} className="text-[#a8c3f0]" />
                <span className="font-mono text-[9px] text-white/50">ambassador_application.form</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8c3f0] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#a8c3f0]">ACCEPTING</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
                {/* Section: Identity */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">01 / IDENTITY</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" id="full_name" required>
                      <input id="full_name" className={inputCls} placeholder="Your full name" value={form.full_name} onChange={e => upd("full_name", e.target.value)} />
                    </Field>
                    <Field label="X (Twitter) Handle" id="x_handle" required>
                      <input id="x_handle" className={inputCls} placeholder="@yourhandle" value={form.x_handle} onChange={e => upd("x_handle", e.target.value)} />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <Field label="Country" id="country" required note="Where you're based">
                      <div className="relative">
                        <select id="country" className={selectCls} value={form.country} onChange={e => upd("country", e.target.value)}>
                          <option value="" disabled className="bg-[#101018] text-white/60">Select your country</option>
                          {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#101018] text-white">{c}</option>)}
                        </select>
                        <Globe size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a8c3f0] pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Follower Count" id="followers">
                      <input id="followers" className={inputCls} type="number" placeholder="e.g. 5000" value={form.follower_count} onChange={e => upd("follower_count", e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* Section: Arxon Account */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">02 / CREDENTIALS</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <Field label="Arxon Account ID" id="arxon_id" required note="From mining app">
                    <input id="arxon_id" className={inputCls} placeholder="Your Arxon account ID" value={form.arxon_account_id} onChange={e => upd("arxon_account_id", e.target.value)} />
                  </Field>
                </div>

                {/* Section: Content Links */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">03 / PREVIOUS WORK PROOF(CONTENT LINKS)</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                    <span className="font-mono text-[9px] text-white/55">MIN 3 REQUIRED</span>
                  </div>
                  <div className="space-y-3">
                    {[1,2,3,4,5].map(n => (
                      <div key={n} className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-white/60 w-5 shrink-0">{String(n).padStart(2,"0")}</span>
                        <input className={`${inputCls} flex-1`}
                          placeholder={`Post / thread URL ${n <= 3 ? "(required)" : "(optional)"}`}
                          value={(form as any)[`post_link_${n}`]}
                          onChange={e => upd(`post_link_${n}`, e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Motivation */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">04 / MOTIVATION</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <Field label="Why do you want to become an Arxon Ambassador?" id="motivation" required>
                    <textarea id="motivation" className={`${inputCls} min-h-[100px] resize-none`}
                      placeholder="Describe your motivations, your audience, and how you'll drive impact..."
                      value={form.motivation} onChange={e => upd("motivation", e.target.value)} />
                  </Field>
                </div>

                {/* Section: Projections */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">05 / PROJECTIONS</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Estimated New Users" id="est_users" note="Referrals target: 40+">
                      <input id="est_users" className={inputCls} type="number" placeholder="e.g. 60" value={form.estimated_new_users} onChange={e => upd("estimated_new_users", e.target.value)} />
                    </Field>
                    <Field label="Previous Experience" id="prev_exp" note="Optional">
                      <input id="prev_exp" className={inputCls} placeholder="Other ambassador roles..." value={form.previous_experience} onChange={e => upd("previous_experience", e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 px-4 py-3.5 bg-[#a8c3f0]/[0.08] border border-[#a8c3f0]/25 rounded-lg">
                  <AlertCircle size={12} className="text-[#a8c3f0] shrink-0 mt-0.5" />
                  <p className="font-mono text-[9px] text-white/65 leading-relaxed">
                    By submitting, you confirm content will be original and compliant with Arxon guidelines. Reward allocation is merit-based. Vest period: 12 months post-TGE.
                  </p>
                </div>

                {/* Submit */}
                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.015, boxShadow: "0 0 40px rgba(168,195,240,0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-xl font-mono text-sm font-bold text-[#09090b] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                    animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }} />
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? (
                      <><Activity size={14} className="animate-spin" /> SUBMITTING...</>
                    ) : (
                      <><Send size={14} /> SUBMIT APPLICATION <ChevronRight size={14} /></>
                    )}
                  </span>
                </motion.button>
              </form>
            </motion.div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default AmbassadorApply;
