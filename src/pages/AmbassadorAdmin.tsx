import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Users, FileText, CheckCircle2, XCircle, Clock, Search,
  ExternalLink, ChevronDown, ChevronUp, Shield, ArrowLeft, Download,
  MessageSquare, Globe, BarChart3
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

  useEffect(() => {
    checkAdmin();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Please sign in to access admin panel");
      navigate("/auth");
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin");

    if (!roles || roles.length === 0) {
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
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
    const { error } = await supabase
      .from("ambassador_applications")
      .update({ 
        status, 
        approved_at: status === "approved" ? new Date().toISOString() : null 
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success(`Application ${status}`);
    await loadData();
  };

  const getSubmissionsForApp = (arxonId: string) => {
    return submissions.filter(s => s.arxon_account_id === arxonId);
  };

  const stats = useMemo(() => ({
    total: applications.length,
    pending: applications.filter(a => a.status === "pending").length,
    approved: applications.filter(a => a.status === "approved").length,
    rejected: applications.filter(a => a.status === "rejected").length,
    totalSubmissions: submissions.length,
    totalFollowers: applications.reduce((sum, a) => sum + (a.follower_count || 0), 0),
    avgFollowers: applications.length ? Math.round(applications.reduce((sum, a) => sum + (a.follower_count || 0), 0) / applications.length) : 0,
  }), [applications, submissions]);

  const filteredApps = useMemo(() => {
    let filtered = filter === "all" 
      ? applications 
      : applications.filter(a => a.status === filter);

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(a => 
        a.full_name?.toLowerCase().includes(q) ||
        a.x_handle?.toLowerCase().includes(q) ||
        a.arxon_account_id?.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => {
      if (sortBy === "name") return (a.full_name || "").localeCompare(b.full_name || "");
      if (sortBy === "followers") return (b.follower_count || 0) - (a.follower_count || 0);
      if (sortBy === "submissions") {
        return getSubmissionsForApp(b.arxon_account_id).length - getSubmissionsForApp(a.arxon_account_id).length;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [applications, filter, searchQuery, sortBy, submissions]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-[#7c93c3] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-[#09090b]">
      <Navbar />
      <div className="pt-24 pb-20 px-6">
        <div className="max-w-[1200px] mx-auto">
          <motion.button
            onClick={() => navigate("/ambassadors")}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-[#7c93c3] text-sm font-semibold mb-6 hover:gap-3 transition-all"
          >
            <ArrowLeft size={16} /> Back to Ambassador Program
          </motion.button>

          <div className="flex items-center gap-3 mb-8">
            <Shield size={24} className="text-[#7c93c3]" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">Ambassador Admin</h1>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
            {[
              { label: "Total Applications", value: stats.total, color: "text-white" },
              { label: "Pending", value: stats.pending, color: "text-yellow-400" },
              { label: "Approved", value: stats.approved, color: "text-green-400" },
              { label: "Rejected", value: stats.rejected, color: "text-red-400" },
              { label: "Total Submissions", value: stats.totalSubmissions, color: "text-[#7c93c3]" },
              { label: "Total Followers", value: stats.totalFollowers.toLocaleString(), color: "text-white" },
              { label: "Avg Followers", value: stats.avgFollowers.toLocaleString(), color: "text-[#a1a1aa]" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4"
              >
                <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-[#52525b] text-xs mt-1">{s.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Search, Sort, Filter bar */}
          <div className="flex flex-col md:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
              <input
                className="w-full bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-4 py-2.5 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/40 transition-colors"
                placeholder="Search by name, handle, or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["all", "pending", "approved", "rejected"] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-colors ${
                    filter === f
                      ? "bg-[#7c93c3] text-white"
                      : "bg-white/[0.04] text-[#a1a1aa] hover:bg-white/[0.08]"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 text-[#a1a1aa] text-xs focus:outline-none"
            >
              <option value="date">Sort: Date</option>
              <option value="name">Sort: Name</option>
              <option value="followers">Sort: Followers</option>
              <option value="submissions">Sort: Submissions</option>
            </select>
          </div>

          {/* Applications List */}
          <div className="space-y-3">
            {filteredApps.map((app, i) => {
              const appSubs = getSubmissionsForApp(app.arxon_account_id);
              const isExpanded = expandedApp === app.id;

              return (
                <motion.div
                  key={app.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden"
                >
                  <div
                    className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                    onClick={() => setExpandedApp(isExpanded ? null : app.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-white font-semibold">{app.full_name}</h3>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border capitalize ${
                          app.status === "approved" ? "text-green-400 bg-green-400/10 border-green-400/20" :
                          app.status === "rejected" ? "text-red-400 bg-red-400/10 border-red-400/20" :
                          "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
                        }`}>
                          {app.status}
                        </span>
                      </div>
                      <p className="text-[#a1a1aa] text-xs mt-1">
                        {app.x_handle} · ID: {app.arxon_account_id} · {app.follower_count} followers · {appSubs.length} submissions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {app.status === "pending" && (
                        <>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(app.id, "approved"); }}
                            className="px-3 py-1.5 rounded-lg bg-green-400/10 text-green-400 text-xs font-semibold hover:bg-green-400/20 transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); updateStatus(app.id, "rejected"); }}
                            className="px-3 py-1.5 rounded-lg bg-red-400/10 text-red-400 text-xs font-semibold hover:bg-red-400/20 transition-colors"
                          >
                            Reject
                          </button>
                        </>
                      )}
                      {isExpanded ? <ChevronUp size={16} className="text-[#52525b]" /> : <ChevronDown size={16} className="text-[#52525b]" />}
                    </div>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-white/[0.06] overflow-hidden"
                      >
                        <div className="p-4 md:p-5 space-y-4">
                          {/* Application Details */}
                          <div className="grid md:grid-cols-3 gap-4">
                            <InfoBlock label="Full Name" value={app.full_name} />
                            <InfoBlock label="X Handle" value={app.x_handle} />
                            <InfoBlock label="Arxon ID" value={app.arxon_account_id} />
                            <InfoBlock label="Follower Count" value={app.follower_count?.toLocaleString()} />
                            <InfoBlock label="Estimated New Users" value={app.estimated_new_users} />
                            <InfoBlock label="Applied" value={new Date(app.created_at).toLocaleDateString()} />
                          </div>

                          <InfoBlock label="Motivation" value={app.motivation} />
                          <InfoBlock label="Previous Experience" value={app.previous_experience || "None provided"} />

                          {/* Recent Post Links */}
                          {app.recent_post_links?.length > 0 && (
                            <div>
                              <p className="text-[#52525b] text-xs font-semibold uppercase mb-2">Recent Post Links</p>
                              <div className="space-y-1">
                                {app.recent_post_links.map((link: string, j: number) => (
                                  <a key={j} href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-[#7c93c3] text-xs hover:underline">
                                    <ExternalLink size={12} /> {link}
                                  </a>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Content Submissions */}
                          {appSubs.length > 0 && (
                            <div>
                              <p className="text-[#52525b] text-xs font-semibold uppercase mb-2">Content Submissions ({appSubs.length})</p>
                              <div className="bg-white/[0.02] border border-white/[0.04] rounded-xl overflow-hidden">
                                <table className="w-full text-xs">
                                  <thead>
                                    <tr className="border-b border-white/[0.06]">
                                      <th className="text-left p-3 text-[#52525b] font-semibold">#</th>
                                      <th className="text-left p-3 text-[#52525b] font-semibold">Type</th>
                                      <th className="text-left p-3 text-[#52525b] font-semibold">URL</th>
                                      <th className="text-left p-3 text-[#52525b] font-semibold">Notes</th>
                                      <th className="text-left p-3 text-[#52525b] font-semibold">Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {appSubs.map((sub: any, j: number) => (
                                      <tr key={j} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                                        <td className="p-3 text-[#a1a1aa]">{j + 1}</td>
                                        <td className="p-3">
                                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                            sub.submission_type === "space" ? "bg-purple-400/10 text-purple-400" : "bg-blue-400/10 text-blue-400"
                                          }`}>
                                            {sub.submission_type}
                                          </span>
                                        </td>
                                        <td className="p-3">
                                          <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className="text-[#7c93c3] hover:underline truncate block max-w-[300px]">
                                            {sub.submission_url}
                                          </a>
                                        </td>
                                        <td className="p-3 text-[#a1a1aa]">{sub.notes || "-"}</td>
                                        <td className="p-3 text-[#52525b]">{new Date(sub.created_at).toLocaleDateString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          )}

                          {app.approved_at && <p className="text-green-400/60 text-xs">Approved: {new Date(app.approved_at).toLocaleDateString()}</p>}

                          {app.status !== "pending" && (
                            <button
                              onClick={() => updateStatus(app.id, "pending")}
                              className="px-3 py-1.5 rounded-lg bg-yellow-400/10 text-yellow-400 text-xs font-semibold hover:bg-yellow-400/20 transition-colors"
                            >
                              Reset to Pending
                            </button>
                          )}
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

const InfoBlock = ({ label, value }: { label: string; value: string | number }) => (
  <div>
    <p className="text-[#52525b] text-xs font-semibold uppercase mb-1">{label}</p>
    <p className="text-[#a1a1aa] text-sm">{String(value)}</p>
  </div>
);

export default AmbassadorAdmin;
