import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmbassadorAdminPanel from "@/components/admin/AmbassadorAdminPanel";
import {
  Shield, Users, Settings, Save, ExternalLink,
  Activity, ChevronRight, Globe,
  CheckCircle2, Twitter, BarChart3,
  LogOut, KeyRound, List
} from "lucide-react";
import { toast } from "sonner";
import { verifyApprovedAdminAccess } from "@/lib/adminAccess";
import { authSchema } from "@/lib/validations";

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
   ACCOUNT SECURITY
════════════════════════════════════════ */
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
    <Card>
      <CardHeader icon={KeyRound} title="Account Security" subtitle="Change your admin password while signed in" />
      <div className="p-5 space-y-3">
        <input
          className={inputCls}
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <input
          className={inputCls}
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
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
        <p className="font-mono text-[9px] text-white/35">
          Forgot your password? Use the reset link on the sign-in page at /auth
        </p>
      </div>
    </Card>
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

const SiteStats = () => {
  const [stats, setStats] = useState({ users: 0, ambassadors: 0, submissions: 0, waitlist: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      supabase.from("ambassador_applications").select("*", { count:"exact", head:true }),
      supabase.from("ambassador_applications").select("*", { count:"exact", head:true }).eq("status","approved"),
      supabase.from("ambassador_submissions").select("*", { count:"exact", head:true }),
      supabase.from("waitlist").select("*", { count:"exact", head:true }),
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
  { id:"overview",    icon:BarChart3, label:"Overview",    type:"section" as const },
  { id:"waitlist",    icon:List,      label:"Waitlist",    type:"link" as const, path:"/waitlist-admin" },
  { id:"investors",   icon:Globe,     label:"Investors",   type:"link" as const, path:"/investor-admin" },
  { id:"ambassadors", icon:Users,     label:"Ambassadors", type:"section" as const },
  { id:"settings",    icon:Settings,  label:"Settings",    type:"section" as const },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  const sectionParam = searchParams.get("section");
  const activeSection =
    sectionParam && NAV.some((n) => n.id === sectionParam && n.type === "section")
      ? sectionParam
      : "overview";

  const goToSection = (id: string) => {
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
    setSearchParams(next);
  };

  const goToLinkedAdmin = (path: string) => {
    const returnTo = `/admin?${searchParams.toString()}`;
    navigate(`${path}?returnTo=${encodeURIComponent(returnTo)}`);
  };

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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out");
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-[#09090b]">
      <div className="absolute inset-0 pointer-events-none opacity-[0.015]"
        style={{ backgroundImage:"linear-gradient(rgba(124,147,195,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(124,147,195,0.5) 1px,transparent 1px)", backgroundSize:"64px 64px" }} />
      <Navbar />
      <div className="relative z-10 pt-24 pb-20 px-4 md:px-6">
        <div className="max-w-[1600px] mx-auto">

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
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-400/[0.06] border border-emerald-400/20 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[9px] text-emerald-400/80">SYSTEM ONLINE</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.03] border border-white/[0.08] rounded-lg font-mono text-[9px] text-white/50 hover:text-white/80 transition-colors"
              >
                <LogOut size={11} /> SIGN OUT
              </button>
            </div>
          </motion.div>

          <div className="flex gap-5 items-start">
            {/* Sidebar */}
            <motion.div initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
              className="w-48 shrink-0 bg-white/[0.02] border border-white/[0.06] rounded-xl overflow-hidden sticky top-24">
              {NAV.map(item => (
                <button key={item.id}
                  onClick={() => item.type === "link" ? goToLinkedAdmin(item.path!) : goToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors border-b border-white/[0.04] last:border-0 ${
                    item.type === "section" && activeSection===item.id ? "bg-[#7c93c3]/10 text-white" : "text-white/45 hover:text-white/70 hover:bg-white/[0.03]"
                  }`}>
                  <item.icon size={14} className={item.type === "section" && activeSection===item.id ? "text-[#7c93c3]" : "text-current"} />
                  <span className="text-sm font-medium">{item.label}</span>
                  {item.type === "section" && activeSection===item.id && <ChevronRight size={12} className="text-[#7c93c3] ml-auto" />}
                  {item.type === "link" && <ExternalLink size={10} className="text-white/25 ml-auto" />}
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
              {activeSection === "ambassadors" && <AmbassadorAdminPanel />}
              {activeSection === "settings"    && (
                <>
                  <AccountSecurity />
                  <RetweetSettings />
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
