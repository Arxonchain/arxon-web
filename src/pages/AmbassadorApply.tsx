import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Terminal, Send, CheckCircle2, ArrowLeft,
  Activity, AlertCircle, ChevronRight, Globe, Twitter, ExternalLink, RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

/* ─── Static UI helpers (defined OUTSIDE component to prevent remount) ─── */
const Grid = ({ size = 60, opacity = 0.025 }: { size?: number; opacity?: number }) => (
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

const COUNTRIES = [
  "Nigeria","United States","United Kingdom","Canada","Germany","France","India","Brazil","South Africa","Kenya",
  "Ghana","Egypt","Philippines","Indonesia","Vietnam","Pakistan","Bangladesh","Mexico","Argentina","Colombia",
  "UAE","Saudi Arabia","Turkey","Russia","China","Japan","South Korea","Australia","Spain","Italy",
  "Netherlands","Poland","Ukraine","Ethiopia","Tanzania","Uganda","Morocco","Algeria","Cameroon","Senegal",
  "Other"
];

const inputCls = "w-full bg-[#a8c3f0]/[0.07] border border-[#a8c3f0]/30 rounded-lg px-4 py-3 text-white text-sm font-mono placeholder:text-white/55 focus:outline-none focus:border-[#a8c3f0]/70 focus:bg-[#a8c3f0]/[0.12] transition-all";
const selectCls = "w-full bg-[#a8c3f0]/[0.07] border border-[#a8c3f0]/30 rounded-lg px-4 py-3 text-white text-sm font-mono focus:outline-none focus:border-[#a8c3f0]/70 focus:bg-[#a8c3f0]/[0.12] transition-all appearance-none cursor-pointer";

/* Retweet posts to verify */
const RETWEET_POSTS = [
  { id: 1, url: "https://x.com/arxoninfra/status/2052324369775440352?s=20", label: "Arxon Official Post #1" },
  { id: 2, url: "https://x.com/arxoninfra/status/2041816286724796678?s=20", label: "Arxon Official Post #2" },
];

/* ─── Field label wrapper ─── */
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

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const AmbassadorApply = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  /* ── Form state — all top-level, no inline objects ── */
  const [fullName, setFullName] = useState("");
  const [xHandle, setXHandle] = useState("");
  const [arxonId, setArxonId] = useState("");
  const [country, setCountry] = useState("");
  const [followerCount, setFollowerCount] = useState("");
  const [postLink1, setPostLink1] = useState("");
  const [postLink2, setPostLink2] = useState("");
  const [postLink3, setPostLink3] = useState("");
  const [postLink4, setPostLink4] = useState("");
  const [postLink5, setPostLink5] = useState("");
  const [motivation, setMotivation] = useState("");
  const [estimatedUsers, setEstimatedUsers] = useState("");
  const [prevExperience, setPrevExperience] = useState("");

  /* ── Follow/retweet confirmations ── */
  const [followed, setFollowed] = useState(false);
  const [retweeted, setRetweeted] = useState<boolean[]>(RETWEET_POSTS.map(() => false));

  const toggleRetweet = useCallback((i: number) => {
    setRetweeted(prev => { const next = [...prev]; next[i] = !next[i]; return next; });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !xHandle || !arxonId || !motivation || !country) {
      toast.error("Please fill in all required fields"); return;
    }
    if (!followed) { toast.error("Please follow @arxoninfra on X before submitting"); return; }
    if (!retweeted.every(Boolean)) { toast.error("Please retweet all required Arxon posts before submitting"); return; }

    const links = [postLink1, postLink2, postLink3, postLink4, postLink5].filter(Boolean);
    if (links.length < 3) { toast.error("Minimum 3 content links required"); return; }

    setLoading(true);
    try {
      const { error } = await supabase.from("ambassador_applications").insert({
        full_name: fullName.trim(),
        x_handle: xHandle.trim(),
        arxon_account_id: arxonId.trim(),
        country,
        follower_count: parseInt(followerCount) || 0,
        recent_post_links: links,
        motivation: motivation.trim(),
        estimated_new_users: parseInt(estimatedUsers) || 0,
        previous_experience: prevExperience.trim() || null,
      });
      if (error) {
        toast.error(error.code === "23505" ? "Application with this Account ID already exists" : "Submission failed. Try again.");
        return;
      }
      setSubmitted(true);
    } catch { toast.error("Something went wrong."); }
    finally { setLoading(false); }
  };

  /* ── Success ── */
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
              <motion.button onClick={() => navigate("/ambassador-portal")} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
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
            <motion.button onClick={() => navigate("/ambassadors")} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 font-mono text-xs text-[#a8c3f0]/80 hover:text-[#a8c3f0] mb-10 transition-colors">
              <ArrowLeft size={13} /> BACK TO AMBASSADOR PROGRAM
            </motion.button>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px w-6 bg-[#a8c3f0]/50" />
                <span className="font-mono text-[9px] text-[#a8c3f0] tracking-widest">APPLICATION_FORM.init</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Deploy Application</h1>
              <p className="text-white/55 font-mono text-xs">Fill all required fields · follow + retweet required · min 3 content links · processing 24–48h</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="relative bg-[#101018] border border-white/[0.1] rounded-2xl overflow-hidden">
              <Corner pos="tl" /><Corner pos="tr" /><Corner pos="bl" /><Corner pos="br" />
              <div className="flex items-center gap-2 px-6 py-3.5 border-b border-white/[0.08] bg-white/[0.03]">
                <Terminal size={11} className="text-[#a8c3f0]" />
                <span className="font-mono text-[9px] text-white/50">ambassador_application.form</span>
                <div className="flex-1" />
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#a8c3f0] animate-pulse" />
                  <span className="font-mono text-[9px] text-[#a8c3f0]">ACCEPTING</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-8">

                {/* ── 01: FOLLOW & RETWEET ── */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-[#a8c3f0] tracking-widest font-semibold">01 / FOLLOW & RETWEET</span>
                    <div className="flex-1 h-px bg-[#a8c3f0]/15" />
                    <span className="font-mono text-[9px] text-red-400/70">REQUIRED</span>
                  </div>

                  {/* Follow block */}
                  <div className="mb-4 p-4 bg-[#a8c3f0]/[0.05] border border-[#a8c3f0]/20 rounded-xl">
                    <div className="flex items-center justify-between gap-4 flex-wrap">
                      <div>
                        <div className="text-white/90 font-semibold text-sm mb-0.5 flex items-center gap-2">
                          <Twitter size={14} className="text-[#a8c3f0]" />
                          Follow @arxoninfra on X (Twitter)
                        </div>
                        <p className="font-mono text-[10px] text-white/45">Required before applying · we verify your follow</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <a href="https://x.com/arxoninfra" target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold text-white bg-[#a8c3f0]/15 border border-[#a8c3f0]/30 hover:bg-[#a8c3f0]/25 transition-colors">
                          <ExternalLink size={11} /> FOLLOW NOW
                        </a>
                        <button type="button" onClick={() => setFollowed(f => !f)}
                          className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-mono text-xs font-bold transition-colors ${followed ? "bg-emerald-400/15 border border-emerald-400/30 text-emerald-300" : "bg-white/[0.04] border border-white/[0.12] text-white/55 hover:text-white/80"}`}>
                          {followed ? <><CheckCircle2 size={11} /> FOLLOWED</> : "MARK AS FOLLOWED"}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Retweet posts */}
                  <div className="space-y-3">
                    <p className="font-mono text-[10px] text-[#a8c3f0]/70 tracking-widest mb-2">RETWEET REQUIRED POSTS — click to open each post, retweet it, then mark done:</p>
                    {RETWEET_POSTS.map((post, i) => (
                      <div key={post.id} className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-xl">
                        <div className="flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <div className="text-white/80 font-semibold text-sm mb-0.5">{post.label}</div>
                            <a href={post.url} target="_blank" rel="noopener noreferrer"
                              className="font-mono text-[10px] text-[#a8c3f0]/60 hover:text-[#a8c3f0] transition-colors flex items-center gap-1">
                              <ExternalLink size={9} /> {post.url.slice(0, 55)}...
                            </a>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <a href={post.url} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] font-bold text-white bg-[#a8c3f0]/12 border border-[#a8c3f0]/25 hover:bg-[#a8c3f0]/20 transition-colors">
                              <RefreshCw size={10} /> RETWEET
                            </a>
                            <button type="button" onClick={() => toggleRetweet(i)}
                              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-mono text-[10px] font-bold transition-colors ${retweeted[i] ? "bg-emerald-400/15 border border-emerald-400/30 text-emerald-300" : "bg-white/[0.04] border border-white/[0.12] text-white/55 hover:text-white/80"}`}>
                              {retweeted[i] ? <><CheckCircle2 size={10} /> DONE</> : "MARK DONE"}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Status summary */}
                  <div className={`mt-3 flex items-center gap-2 px-4 py-2.5 rounded-lg border font-mono text-[10px] ${followed && retweeted.every(Boolean) ? "border-emerald-400/25 bg-emerald-400/[0.05] text-emerald-300" : "border-amber-400/20 bg-amber-400/[0.04] text-amber-400/70"}`}>
                    {followed && retweeted.every(Boolean)
                      ? <><CheckCircle2 size={11} /> Follow & retweet requirements completed</>
                      : <><AlertCircle size={11} /> {!followed ? "Follow @arxoninfra" : "Retweet all posts above"} to proceed</>}
                  </div>
                </div>

                {/* ── 02: IDENTITY ── */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">02 / IDENTITY</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Full Name" id="full_name" required>
                      <input id="full_name" className={inputCls} placeholder="Your full name" value={fullName} onChange={e => setFullName(e.target.value)} />
                    </Field>
                    <Field label="X (Twitter) Handle" id="x_handle" required>
                      <input id="x_handle" className={inputCls} placeholder="@yourhandle" value={xHandle} onChange={e => setXHandle(e.target.value)} />
                    </Field>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4 mt-4">
                    <Field label="Country" id="country" required note="Where you're based">
                      <div className="relative">
                        <select id="country" className={selectCls} value={country} onChange={e => setCountry(e.target.value)}>
                          <option value="" disabled className="bg-[#101018] text-white/60">Select your country</option>
                          {COUNTRIES.map(c => <option key={c} value={c} className="bg-[#101018] text-white">{c}</option>)}
                        </select>
                        <Globe size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#a8c3f0] pointer-events-none" />
                      </div>
                    </Field>
                    <Field label="Follower Count" id="followers">
                      <input id="followers" className={inputCls} type="number" placeholder="e.g. 5000" value={followerCount} onChange={e => setFollowerCount(e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* ── 03: CREDENTIALS ── */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">03 / CREDENTIALS</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <Field label="Arxon Account ID" id="arxon_id" required note="From mining app">
                    <input id="arxon_id" className={inputCls} placeholder="Your Arxon account ID" value={arxonId} onChange={e => setArxonId(e.target.value)} />
                  </Field>
                </div>

                {/* ── 04: CONTENT LINKS ── */}
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">04 / PREVIOUS WORK PROOF (CONTENT LINKS)</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                    <span className="font-mono text-[9px] text-white/55">MIN 3</span>
                  </div>
                  <p className="font-mono text-[9px] text-[#a8c3f0]/55 mb-4">Any platform accepted — X/Twitter, YouTube, Facebook, Medium, blogs, TikTok, etc.</p>
                  <div className="space-y-3">
                    {[
                      { n: 1, val: postLink1, set: setPostLink1 },
                      { n: 2, val: postLink2, set: setPostLink2 },
                      { n: 3, val: postLink3, set: setPostLink3 },
                      { n: 4, val: postLink4, set: setPostLink4 },
                      { n: 5, val: postLink5, set: setPostLink5 },
                    ].map(({ n, val, set }) => (
                      <div key={n} className="flex items-center gap-3">
                        <span className="font-mono text-[9px] text-white/60 w-5 shrink-0">{String(n).padStart(2, "0")}</span>
                        <input className={`${inputCls} flex-1`}
                          placeholder={`Content URL ${n <= 3 ? "(required)" : "(optional)"}`}
                          value={val} onChange={e => set(e.target.value)} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── 05: MOTIVATION ── */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">05 / MOTIVATION</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <Field label="Why do you want to become an Arxon Ambassador?" id="motivation" required>
                    <textarea id="motivation" className={`${inputCls} min-h-[100px] resize-none`}
                      placeholder="Describe your motivations, your audience, and how you'll drive impact..."
                      value={motivation} onChange={e => setMotivation(e.target.value)} />
                  </Field>
                </div>

                {/* ── 06: PROJECTIONS ── */}
                <div>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="font-mono text-[9px] text-white/65 tracking-widest">06 / PROJECTIONS</span>
                    <div className="flex-1 h-px bg-white/[0.08]" />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Estimated New Users" id="est_users" note="Target: 40+">
                      <input id="est_users" className={inputCls} type="number" placeholder="e.g. 60" value={estimatedUsers} onChange={e => setEstimatedUsers(e.target.value)} />
                    </Field>
                    <Field label="Previous Experience" id="prev_exp" note="Optional">
                      <input id="prev_exp" className={inputCls} placeholder="Other ambassador roles..." value={prevExperience} onChange={e => setPrevExperience(e.target.value)} />
                    </Field>
                  </div>
                </div>

                {/* Notice */}
                <div className="flex items-start gap-3 px-4 py-3.5 bg-[#a8c3f0]/[0.08] border border-[#a8c3f0]/25 rounded-lg">
                  <AlertCircle size={12} className="text-[#a8c3f0] shrink-0 mt-0.5" />
                  <p className="font-mono text-[9px] text-white/65 leading-relaxed">
                    By submitting, you confirm you have followed @arxoninfra and retweeted the required posts, and that all content will be original and compliant with Arxon guidelines. Reward allocation is merit-based. Vest period: 12 months post-TGE.
                  </p>
                </div>

                {/* Submit */}
                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.015, boxShadow: "0 0 40px rgba(168,195,240,0.4)" }} whileTap={{ scale: 0.98 }}
                  className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-4 rounded-xl font-mono text-sm font-bold text-[#09090b] disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg,#a8c3f0,#c8d8f8)" }}>
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                    animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2.5, repeat: Infinity, ease: "linear", repeatDelay: 1 }} />
                  <span className="relative z-10 flex items-center gap-2">
                    {loading ? <><Activity size={14} className="animate-spin" /> SUBMITTING...</> : <><Send size={14} /> SUBMIT APPLICATION <ChevronRight size={14} /></>}
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
