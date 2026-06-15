import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Shield, Users, Settings, Link2, Save, ExternalLink,
  Activity, ChevronRight, Terminal, Database, Globe,
  MessageSquare, Video, CheckCircle2, XCircle, Clock,
  Search, ChevronDown, ChevronUp, ArrowLeft, RefreshCw,
  Twitter, Plus, Trash2, Eye, BarChart3, Zap, Lock, Award
} from "lucide-react";
import { toast } from "sonner";

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

/* ════════════════════════════════════════
   SECTION: RETWEET SETTINGS
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

        {/* Post 3 — editable */}
        <div className="p-4 bg-[#7c93c3]/[0.04] border border-[#7c93c3]/20 rounded-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] text-[#7c93c3] font-semibold tracking-widest">POST #3 — CONFIGURABLE</span>
            <span className="font-mono text-[8px] text-[#7c93c3]/60 bg-[#7c93c3]/10 border border-[#7c93c3]/20 px-2 py-0.5 rounded">LIVE IN PORTAL</span>
          </div>
          <p className="font-mono text-[9px] text-white/35">Paste an X post URL below. It appears instantly in the ambassador portal and apply page without any code change.</p>
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
                <ExternalLink size={9} /> Preview post
              </a>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════
   SECTION: AMBASSADOR APPLICATIONS
════════════════════════════════════════ */
const AmbassadorSection = () => {
  const [apps, setApps] = useState<any[]>([]);
  const [subs, setSubs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all"|"pending"|"approved"|"rejected">("all");
  const [search, setSearch] = useState("");

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

  const filtered = apps
    .filter(a => filter === "all" || a.status === filter)
    .filter(a => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return a.full_name?.toLowerCase().includes(q) || a.x_handle?.toLowerCase().includes(q) ||
        a.arxon_account_id?.toLowerCase().includes(q) || a.country?.toLowerCase().includes(q);
    });

  const stats = {
    total: apps.length,
    pending: apps.filter(a => a.status === "pending").length,
    approved: apps.filter(a => a.status === "approved").length,
    rejected: apps.filter(a => a.status === "rejected").length,
    submissions: subs.length,
  };

  return (
    <Card>
      <CardHeader icon={Users} title="Ambassador Applications" subtitle={`${stats.total} total · ${stats.pending} pending review`}
        action={<button onClick={load} className="w-7 h-7 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors"><RefreshCw size={11} className="text-white/50" /></button>} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-4 border-b border-white/[0.05]">
        {[
          { label: "TOTAL", value: stats.total, color: "text-white" },
          { label: "PENDING", value: stats.pending, color: "text-yellow-400" },
          { label: "APPROVED", value: stats.approved, color: "text-emerald-400" },
          { label: "REJECTED", value: stats.rejected, color: "text-red-400" },
          { label: "SUBMISSIONS", value: stats.submissions, color: "text-[#7c93c3]" },
        ].map(s => (
          <div key={s.label} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3 text-center">
            <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
            <p className="font-mono text-[8px] text-white/30 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
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

      {/* List */}
      <div className="divide-y divide-white/[0.04] max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Activity size={20} className="text-[#7c93c3] animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-[#52525b] text-sm">No applications found</div>
        ) : filtered.map(app => {
          const appSubs = getSubsFor(app.arxon_account_id);
          const isExp = expanded === app.id;
          return (
            <div key={app.id}>
              <div className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                onClick={() => setExpanded(isExp ? null : app.id)}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-white text-sm font-semibold">{app.full_name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                      app.status==="approved" ? "text-emerald-400 bg-emerald-400/10 border-emerald-400/20" :
                      app.status==="rejected" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                      "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"}`}>{app.status}</span>
                    {app.country && <span className="font-mono text-[9px] text-white/25 bg-white/[0.03] px-2 py-0.5 rounded">{app.country}</span>}
                  </div>
                  <p className="text-[#52525b] text-xs mt-0.5 font-mono">
                    {app.x_handle} · {app.arxon_account_id} · {(app.follower_count||0).toLocaleString()} followers · {appSubs.length} submissions
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
                          ["Full Name", app.full_name],
                          ["X Handle", app.x_handle],
                          ["Arxon ID", app.arxon_account_id],
                          ["Country", app.country||"—"],
                          ["Followers", (app.follower_count||0).toLocaleString()],
                          ["Est. Referrals", app.estimated_new_users||0],
                          ["Applied", new Date(app.created_at).toLocaleDateString()],
                          ["Previous Exp", app.previous_experience||"None"],
                        ].map(([l,v]) => (
                          <div key={l}><p className="text-[#52525b] font-mono text-[9px] uppercase mb-0.5">{l}</p><p className="text-white/70">{String(v)}</p></div>
                        ))}
                      </div>

                      <div><p className="text-[#52525b] font-mono text-[9px] uppercase mb-1">Motivation</p><p className="text-white/60 text-xs leading-relaxed">{app.motivation}</p></div>

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

                      {appSubs.length > 0 && (
                        <div>
                          <p className="text-[#52525b] font-mono text-[9px] uppercase mb-2">Content Submissions ({appSubs.length})</p>
                          <div className="space-y-1">
                            {["post","space","video"].map(type => {
                              const typed = appSubs.filter(s => s.submission_type===type);
                              if (!typed.length) return null;
                              const color = type==="post"?"text-[#7c93c3]":type==="space"?"text-purple-400":"text-amber-400";
                              return (
                                <div key={type} className="bg-white/[0.02] border border-white/[0.04] rounded-lg p-3">
                                  <p className={`font-mono text-[9px] ${color} uppercase mb-2`}>{type}s ({typed.length})</p>
                                  {typed.map((s:any,j:number) => (
                                    <a key={j} href={s.submission_url} target="_blank" rel="noopener noreferrer"
                                      className={`flex items-center gap-2 text-xs hover:underline break-all mb-1 ${color}`}>
                                      <ExternalLink size={9} className="shrink-0" />{s.submission_url}
                                    </a>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 pt-1 flex-wrap">
                        {app.status !== "approved" && <button onClick={() => updateStatus(app.id,"approved")} className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 text-xs font-semibold hover:bg-emerald-400/20 transition-colors">✓ Approve</button>}
                        {app.status !== "rejected" && <button onClick={() => updateStatus(app.id,"rejected")} className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold hover:bg-red-400/20 transition-colors">✕ Reject</button>}
                        {app.status !== "pending" && <button onClick={() => updateStatus(app.id,"pending")} className="px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors">↺ Reset to Pending</button>}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════
   SECTION: SITE STATS
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
        {loading ? <div className="col-span-4 py-8 flex items-center justify-center"><Activity size={18} className="text-[#7c93c3] animate-spin" /></div> : <>
          <StatBox label="AMBASSADOR APPS" value={stats.users} color="text-white" />
          <StatBox label="APPROVED AMBASSADORS" value={stats.ambassadors} color="text-emerald-400" />
          <StatBox label="CONTENT SUBMISSIONS" value={stats.submissions} color="text-[#7c93c3]" />
          <StatBox label="WAITLIST ENTRIES" value={stats.waitlist} color="text-amber-400" />
        </>}
      </div>
    </Card>
  );
};

/* ════════════════════════════════════════
   NAV SIDEBAR
════════════════════════════════════════ */
const NAV = [
  { id:"overview",    icon:BarChart3,   label:"Overview" },
  { id:"ambassadors", icon:Users,       label:"Ambassadors" },
  { id:"settings",    icon:Settings,    label:"Settings & Links" },
];

/* ════════════════════════════════════════
   MAIN COMPONENT
════════════════════════════════════════ */
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const check = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { toast.error("Sign in required"); navigate("/auth"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role","admin");
      if (!roles || roles.length === 0) { toast.error("Admin access required"); navigate("/"); return; }
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

          {/* Header */}
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
            {/* Sidebar nav */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              className="w-48 shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden sticky top-24">
              {NAV.map((item, i) => (
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
                  { label:"Apply Page", path:"/ambassador-apply" },
                  { label:"Portal", path:"/ambassador-portal" },
                  { label:"Site Home", path:"/" },
                ].map(l => (
                  <button key={l.path} onClick={() => navigate(l.path)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] text-white/35 hover:text-white/60 hover:bg-white/[0.04] transition-colors text-left">
                    <ExternalLink size={9} /> {l.label}
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Main content */}
            <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} className="flex-1 min-w-0 space-y-5">
              {activeSection === "overview" && <SiteStats />}
              {activeSection === "ambassadors" && <AmbassadorSection />}
              {activeSection === "settings" && <RetweetSettings />}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
