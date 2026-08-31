import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbassadorAdminPanel from "@/components/admin/AmbassadorAdminPanel";
import WaitlistAdminSection from "@/components/admin/WaitlistAdminSection";
import InvestorAdminSection from "@/components/admin/InvestorAdminSection";
import AmbassadorReportsAuditSection from "@/components/admin/AmbassadorReportsAuditSection";
import { AdminCard, AdminCardHeader, AdminStatBox, adminInputCls } from "@/components/admin/adminUi";
import {
  Shield, Users, Settings, Save, ExternalLink,
  Activity, ChevronRight, Globe, Menu, X,
  CheckCircle2, Twitter, BarChart3,
  LogOut, KeyRound, List, ClipboardList,
} from "lucide-react";
import { toast } from "sonner";
import { verifyApprovedAdminAccess } from "@/lib/adminAccess";
import { authSchema } from "@/lib/validations";
import { AdminSection, authPathWithReturn, isAdminSection } from "@/lib/adminNav";

const NAV: { id: AdminSection; icon: typeof BarChart3; label: string }[] = [
  { id: "overview", icon: BarChart3, label: "Overview" },
  { id: "waitlist", icon: List, label: "Waitlist" },
  { id: "investors", icon: Globe, label: "Investors" },
  { id: "ambassadors", icon: Users, label: "Ambassadors" },
  { id: "reports", icon: ClipboardList, label: "Reports" },
  { id: "settings", icon: Settings, label: "Settings" },
];

const AccountSecurity = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const changePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    try {
      authSchema.shape.password.parse(newPassword);
      setSaving(true);
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        toast.error(error.message);
        return;
      }
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Invalid password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminCard>
      <AdminCardHeader icon={KeyRound} title="Account Security" subtitle="Change your admin password while signed in" />
      <div className="p-5 space-y-3">
        <input className={adminInputCls} type="password" placeholder="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        <input className={adminInputCls} type="password" placeholder="Confirm new password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        <motion.button
          onClick={changePassword}
          disabled={saving || !newPassword || !confirmPassword}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold text-[#09090b] disabled:opacity-40"
          style={{ background: "linear-gradient(135deg,#7c93c3,#a8b8d8)" }}
        >
          {saving ? <Activity size={12} className="animate-spin" /> : <KeyRound size={12} />}
          UPDATE PASSWORD
        </motion.button>
        <p className="font-mono text-[9px] text-white/35">Forgot your password? Use the reset link on the sign-in page at /auth</p>
      </div>
    </AdminCard>
  );
};

const RetweetSettings = () => {
  const [post3, setPost3] = useState("");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from("ambassador_settings")
      .select("value")
      .eq("key", "retweet_post_3")
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) toast.error("Failed to load retweet settings");
        if (data?.value) setPost3(data.value);
        setLoaded(true);
      });
  }, []);

  const save = async () => {
    if (!post3.trim()) {
      toast.error("Paste a valid X post URL");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("ambassador_settings").upsert({ key: "retweet_post_3", value: post3.trim() }, { onConflict: "key" });
    if (error) toast.error("Failed to save: " + error.message);
    else toast.success("Post #3 link saved — live in ambassador portal immediately");
    setSaving(false);
  };

  const FIXED_POSTS = [
    { n: 1, url: "https://x.com/arxoninfra/status/2052324369775440352?s=20" },
    { n: 2, url: "https://x.com/arxoninfra/status/2041816286724796678?s=20" },
  ];

  return (
    <AdminCard>
      <AdminCardHeader icon={Twitter} title="Retweet Post Links" subtitle="Posts ambassadors must retweet during application" />
      <div className="p-5 space-y-4">
        {FIXED_POSTS.map((p) => (
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
          <div className="flex gap-2 flex-col sm:flex-row">
            <input
              className={`${adminInputCls} flex-1`}
              placeholder="https://x.com/arxoninfra/status/..."
              value={loaded ? post3 : ""}
              onChange={(e) => setPost3(e.target.value)}
              disabled={!loaded}
            />
            <motion.button
              onClick={save}
              disabled={saving || !post3.trim() || !loaded}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-mono text-xs font-bold text-[#09090b] disabled:opacity-40 shrink-0"
              style={{ background: "linear-gradient(135deg,#7c93c3,#a8b8d8)" }}
            >
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
    </AdminCard>
  );
};

const SiteStats = ({ onNavigate }: { onNavigate: (section: AdminSection, extra?: Record<string, string>) => void }) => {
  const [stats, setStats] = useState({
    applications: 0,
    approved: 0,
    audit: 0,
    pending: 0,
    submissions: 0,
    weeklyReports: 0,
    waitlist: 0,
    investors: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("ambassador_applications").select("*", { count: "exact", head: true }),
      supabase.from("ambassador_applications").select("*", { count: "exact", head: true }).eq("status", "approved"),
      supabase.from("ambassador_applications").select("*", { count: "exact", head: true }).eq("status", "consideration"),
      supabase.from("ambassador_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
      supabase.from("ambassador_submissions").select("*", { count: "exact", head: true }),
      supabase.from("ambassador_weekly_reports").select("*", { count: "exact", head: true }).eq("status", "submitted"),
      supabase.from("waitlist").select("*", { count: "exact", head: true }),
      supabase.from("investor_submissions").select("*", { count: "exact", head: true }),
    ])
      .then(([apps, approved, audit, pending, subs, weeklyReports, waitlist, investors]) => {
        const failed = [apps, approved, audit, pending, subs, weeklyReports, waitlist, investors].some((r) => r.error);
        if (failed) toast.error("Some overview stats could not be loaded");
        setStats({
          applications: apps.count || 0,
          approved: approved.count || 0,
          audit: audit.count || 0,
          pending: pending.count || 0,
          submissions: subs.count || 0,
          weeklyReports: weeklyReports.count || 0,
          waitlist: waitlist.count || 0,
          investors: investors.count || 0,
        });
      })
      .catch(() => toast.error("Failed to load overview stats"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminCard>
      <AdminCardHeader icon={BarChart3} title="Site Overview" subtitle="Live counts — click a stat to open that section" />
      <div className="p-4 grid grid-cols-2 lg:grid-cols-4 gap-3">
        {loading ? (
          <div className="col-span-full py-8 flex items-center justify-center">
            <Activity size={18} className="text-[#7c93c3] animate-spin" />
          </div>
        ) : (
          <>
            <AdminStatBox label="PENDING APPLICATIONS" value={stats.pending} color="text-yellow-400" onClick={() => onNavigate("ambassadors", { queue: "pending" })} />
            <AdminStatBox label="SELECTED FOR AUDIT" value={stats.audit} color="text-sky-400" onClick={() => onNavigate("ambassadors", { queue: "consideration" })} />
            <AdminStatBox label="APPROVED AMBASSADORS" value={stats.approved} color="text-emerald-400" onClick={() => onNavigate("ambassadors", { queue: "approved" })} />
            <AdminStatBox label="TOTAL APPLICATIONS" value={stats.applications} onClick={() => onNavigate("ambassadors", { queue: "all" })} />
            <AdminStatBox label="WEEKLY REPORTS" value={stats.weeklyReports} color="text-sky-400" onClick={() => onNavigate("reports")} />
            <AdminStatBox label="PORTAL SUBMISSIONS" value={stats.submissions} color="text-[#7c93c3]" onClick={() => onNavigate("ambassadors", { tab: "portal" })} />
            <AdminStatBox label="WAITLIST ENTRIES" value={stats.waitlist} color="text-amber-400" onClick={() => onNavigate("waitlist")} />
            <AdminStatBox label="INVESTOR INQUIRIES" value={stats.investors} color="text-purple-400" onClick={() => onNavigate("investors")} />
            <AdminStatBox label="TOTAL APPS + INVESTORS" value={stats.applications + stats.investors} />
          </>
        )}
      </div>
    </AdminCard>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [mobileNav, setMobileNav] = useState(false);

  const sectionParam = searchParams.get("section");
  const activeSection: AdminSection = isAdminSection(sectionParam) ? sectionParam : "overview";

  const goToSection = (id: AdminSection, extra?: Record<string, string>) => {
    const next = new URLSearchParams(searchParams);
    next.set("section", id);
    if (id !== "ambassadors") {
      next.delete("tab");
      next.delete("queue");
      next.delete("applicant");
    } else {
      if (!next.get("tab")) next.set("tab", "applications");
      if (!next.get("queue")) next.set("queue", "pending");
    }
    if (extra) Object.entries(extra).forEach(([k, v]) => next.set(k, v));
    setSearchParams(next);
    setMobileNav(false);
  };

  useEffect(() => {
    const check = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          toast.error("Sign in required");
          navigate(authPathWithReturn(location.pathname, location.search));
          return;
        }
        const access = await verifyApprovedAdminAccess(user.id);
        if (!access.allowed) {
          await supabase.auth.signOut();
          toast.error(access.reason ?? "Admin access required");
          navigate(authPathWithReturn(location.pathname, location.search));
          return;
        }
        setIsAdmin(true);
      } catch {
        toast.error("Could not verify admin access");
        navigate(authPathWithReturn(location.pathname, location.search));
      } finally {
        setChecking(false);
      }
    };
    check();
  }, [location.pathname, location.search, navigate]);

  if (checking) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-8 h-8 border-2 border-[#7c93c3] border-t-transparent rounded-full" />
      </div>
    );
  }
  if (!isAdmin) return null;

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  const sidebar = (
    <>
      {NAV.map((item) => (
        <button
          key={item.id}
          onClick={() => goToSection(item.id)}
          className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-white/[0.04] last:border-0 ${
            activeSection === item.id ? "bg-[#7c93c3]/10 text-white" : "text-white/45 hover:text-white/70 hover:bg-white/[0.03]"
          }`}
        >
          <item.icon size={14} className={activeSection === item.id ? "text-[#7c93c3]" : "text-current"} />
          <span className="text-sm font-medium">{item.label}</span>
          {activeSection === item.id && <ChevronRight size={12} className="text-[#7c93c3] ml-auto" />}
        </button>
      ))}
      <div className="p-3 border-t border-white/[0.06] space-y-1.5 mt-1">
        <p className="font-mono text-[8px] text-white/20 px-1 mb-2">QUICK LINKS</p>
        {[
          { label: "Ambassador Page", path: "/ambassadors" },
          { label: "Portal", path: "/ambassador-portal" },
          { label: "Site Home", path: "/" },
        ].map((l) => (
          <button
            key={l.path}
            onClick={() => navigate(l.path)}
            className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] text-white/35 hover:text-white/60 hover:bg-white/[0.04] transition-colors text-left"
          >
            <ExternalLink size={9} /> {l.label}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: "linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <Navbar />
      <div className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto">
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6 flex-wrap">
            <button
              onClick={() => setMobileNav(true)}
              className="lg:hidden w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center"
              aria-label="Open admin menu"
            >
              <Menu size={18} className="text-white/70" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#7c93c3]/15 border border-[#7c93c3]/25 flex items-center justify-center">
                <Shield size={18} className="text-[#7c93c3]" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Arxon Admin</h1>
                <p className="font-mono text-[9px] text-white/35">CONTROL_CENTER · {NAV.find((n) => n.id === activeSection)?.label.toUpperCase()}</p>
              </div>
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400/[0.06] border border-emerald-400/20 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9px] text-emerald-400/80">SYSTEM ONLINE</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg font-mono text-[9px] text-white/50 hover:text-white/80 transition-colors">
                <LogOut size={11} /> SIGN OUT
              </button>
            </div>
          </motion.div>

          <div className="flex gap-5 items-start">
            <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="hidden lg:block w-52 shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden sticky top-24">
              {sidebar}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex-1 min-w-0 space-y-5">
              {activeSection === "overview" && <SiteStats onNavigate={goToSection} />}
              {activeSection === "waitlist" && <WaitlistAdminSection />}
              {activeSection === "investors" && <InvestorAdminSection />}
              {activeSection === "ambassadors" && <AmbassadorAdminPanel />}
              {activeSection === "reports" && <AmbassadorReportsAuditSection />}
              {activeSection === "settings" && (
                <>
                  <AccountSecurity />
                  <RetweetSettings />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileNav && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/70" onClick={() => setMobileNav(false)} />
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#101014] border-r border-white/[0.08] overflow-y-auto"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/[0.06]">
                <span className="font-semibold text-white text-sm">Admin Menu</span>
                <button onClick={() => setMobileNav(false)} className="w-8 h-8 rounded-lg bg-white/[0.05] flex items-center justify-center">
                  <X size={16} className="text-white/70" />
                </button>
              </div>
              {sidebar}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
};

export default AdminDashboard;
