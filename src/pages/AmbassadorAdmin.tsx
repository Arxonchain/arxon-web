import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Users, CheckCircle2, XCircle, Clock, Search,
  ExternalLink, ChevronDown, ChevronUp, Shield, ArrowLeft,
  MessageSquare, Globe, Twitter, Link2, Settings, Save, Plus,
  Video, Activity
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

/* ════════════════════════════════════════
   ADMIN SETTINGS PANEL (Post 3 + future links)
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
          <p className="font-mono text-[9px] text-white/35 mb-3">Paste the X post link here. It appears instantly in the ambassador portal without any code change.</p>
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
              <a href={post3} target="_blank" rel="noopener noreferrer" className="ml-auto">
                <ExternalLink size={10} className="text-[#7c93c3]/50 hover:text-[#7c93c3]" />
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
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

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { toast.error("Please sign in to access admin panel"); navigate("/auth"); return; }
    const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin");
    if (!roles || roles.length === 0) { toast.error("Access denied. Admin privileges required."); navigate("/"); return; }
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
            <motion.button onClick={() => setShowSettings(s => !s)} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold border transition-colors ${showSettings ? "bg-[#7c93c3]/20 border-[#7c93c3]/40 text-[#7c93c3]" : "bg-white/[0.04] border-white/[0.08] text-white/60 hover:text-white/90 hover:bg-white/[0.07]"}`}>
              <Settings size={13} /> RETWEET LINKS SETTINGS
            </motion.button>
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
              { label: "Submissions", value: stats.totalSubs, color: "text-[#7c93c3]" },
              { label: "Total Followers", value: stats.totalFollowers.toLocaleString(), color: "text-white" },
            ].map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4">
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[#52525b] text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
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

          {/* Applications list */}
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
                  {/* Header row */}
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
                        <span className="text-[#7c93c3]">{appSubs.length} submissions ({postSubs.length}P · {spaceSubs.length}S · {videoSubs.length}V)</span>
                      </p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
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

                  {/* Expanded detail */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/[0.06] overflow-hidden">
                        <div className="p-4 md:p-6 space-y-5">

                          {/* Identity grid */}
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

                          {/* Follow / Retweet status */}
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

                          {/* Content links from application */}
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

                          {/* Submissions by type */}
                          {appSubs.length > 0 && (
                            <div>
                              <p className="text-[#52525b] text-xs font-semibold uppercase mb-3">Content Submissions ({appSubs.length} total)</p>
                              {/* Posts */}
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
                                        <span className="font-mono text-[9px] text-[#52525b] shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Spaces */}
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
                                        <span className="font-mono text-[9px] text-[#52525b] shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {/* Videos */}
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
                                        <span className="font-mono text-[9px] text-[#52525b] shrink-0">{new Date(sub.created_at).toLocaleDateString()}</span>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Actions */}
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
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AmbassadorAdmin;
