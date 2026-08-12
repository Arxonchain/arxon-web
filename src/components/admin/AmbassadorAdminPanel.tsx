import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Users, Link2, Search, RefreshCw, Activity, ExternalLink,
  MessageSquare, Video, Globe, CheckCircle2, Shield, Twitter,
  ChevronLeft, ChevronRight, Copy, Check, ArrowLeft, Eye,
  ClipboardList, Clock, XCircle, BadgeCheck, Mail,
} from "lucide-react";
import {
  AMBASSADOR_QUEUES,
  AmbassadorQueue,
  AmbassadorStatus,
  AmbassadorTab,
  isAmbassadorQueue,
  isAmbassadorTab,
  statusLabel,
} from "@/lib/ambassadorAdmin";

const SUPABASE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;
const inputCls =
  "w-full bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-white text-sm placeholder:text-[#52525b] focus:outline-none focus:border-[#7c93c3]/50 transition-colors";

type AppRow = {
  id: string;
  full_name: string;
  x_handle: string;
  arxon_account_id: string;
  country: string | null;
  follower_count: number;
  estimated_new_users: number;
  motivation: string;
  previous_experience: string | null;
  recent_post_links: string[];
  status: string;
  created_at: string;
  approved_at: string | null;
};

type SubRow = {
  id: string;
  arxon_account_id: string;
  submission_type: string;
  submission_url: string;
  created_at: string;
};

type WeeklyReportRow = {
  id: string;
  arxon_account_id: string;
  week_start: string;
  status: string;
  summary: string | null;
  submitted_at: string | null;
  ambassador_report_items: { id: string; item_type: string; url: string | null }[];
};

export const AmbassadorStatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    approved: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    rejected: "text-red-400 bg-red-400/10 border-red-400/20",
    consideration: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    pending: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${styles[status] ?? styles.pending}`}>
      {statusLabel(status)}
    </span>
  );
};

const TypeTag = ({ type }: { type: string }) => {
  const map: Record<string, string> = {
    post: "text-[#7c93c3] bg-[#7c93c3]/10 border-[#7c93c3]/20",
    space: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    video: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${map[type] ?? "text-white/40 bg-white/[0.04] border-white/[0.08]"}`}>
      {type}
    </span>
  );
};

const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={copy}
      className="shrink-0 w-7 h-7 rounded-md flex items-center justify-center bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
      title="Copy"
    >
      {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} className="text-white/40" />}
    </button>
  );
};

const StatusActions = ({
  status,
  updating,
  onChange,
  compact = false,
}: {
  status: string;
  updating: boolean;
  onChange: (next: AmbassadorStatus) => void;
  compact?: boolean;
}) => {
  const btn = compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs";
  return (
    <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
      {status !== "consideration" && (
        <button
          disabled={updating}
          onClick={() => onChange("consideration")}
          className={`${btn} rounded-lg bg-sky-400/10 text-sky-400 font-semibold border border-sky-400/20 hover:bg-sky-400/20 disabled:opacity-40`}
        >
          Mark for Audit
        </button>
      )}
      {status !== "approved" && (
        <button
          disabled={updating}
          onClick={() => onChange("approved")}
          className={`${btn} rounded-lg bg-emerald-400/10 text-emerald-400 font-semibold border border-emerald-400/20 hover:bg-emerald-400/20 disabled:opacity-40`}
        >
          Approve
        </button>
      )}
      {status !== "rejected" && (
        <button
          disabled={updating}
          onClick={() => onChange("rejected")}
          className={`${btn} rounded-lg bg-red-400/10 text-red-400 font-semibold border border-red-400/20 hover:bg-red-400/20 disabled:opacity-40`}
        >
          Reject
        </button>
      )}
      {status !== "pending" && (
        <button
          disabled={updating}
          onClick={() => onChange("pending")}
          className={`${btn} rounded-lg bg-yellow-400/10 text-yellow-400 font-semibold border border-yellow-400/20 hover:bg-yellow-400/20 disabled:opacity-40`}
        >
          Reset Pending
        </button>
      )}
    </div>
  );
};

const ApplicantDetailView = ({
  app,
  submissions,
  weeklyReports,
  queueApps,
  onBack,
  onNavigate,
  onStatusChange,
}: {
  app: AppRow;
  submissions: SubRow[];
  weeklyReports: WeeklyReportRow[];
  queueApps: AppRow[];
  onBack: () => void;
  onNavigate: (id: string) => void;
  onStatusChange: (id: string, status: AmbassadorStatus) => Promise<void>;
}) => {
  const [referralCount, setReferralCount] = useState<number | null>(null);
  const [loadingRefs, setLoadingRefs] = useState(false);
  const [updating, setUpdating] = useState(false);

  const postSubs = submissions.filter((s) => s.submission_type === "post");
  const spaceSubs = submissions.filter((s) => s.submission_type === "space");
  const videoSubs = submissions.filter((s) => s.submission_type === "video");
  const idx = queueApps.findIndex((a) => a.id === app.id);
  const prevApp = queueApps[idx - 1];
  const nextApp = queueApps[idx + 1];

  const syncRefs = useCallback(async () => {
    setLoadingRefs(true);
    try {
      const res = await fetch(
        `${SUPABASE_FUNCTIONS_URL}/get-referral-count?account_id=${encodeURIComponent(app.arxon_account_id)}`,
        {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const d = res.ok ? await res.json() : null;
      setReferralCount(d?.referral_count ?? app.estimated_new_users ?? 0);
    } catch {
      setReferralCount(app.estimated_new_users ?? 0);
    }
    setLoadingRefs(false);
  }, [app.arxon_account_id, app.estimated_new_users]);

  useEffect(() => {
    syncRefs();
  }, [syncRefs]);

  const handleStatus = async (status: AmbassadorStatus) => {
    setUpdating(true);
    await onStatusChange(app.id, status);
    setUpdating(false);
  };

  const LinkList = ({ items, color }: { items: SubRow[]; color: string }) =>
    items.length === 0 ? (
      <p className="text-sm text-white/25 px-4 py-3">No links submitted</p>
    ) : (
      <div className="divide-y divide-white/[0.04]">
        {items.map((sub, j) => (
          <div key={sub.id} className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.02]">
            <span className="text-xs text-white/30 w-5">{j + 1}</span>
            <TypeTag type={sub.submission_type} />
            <a href={sub.submission_url} target="_blank" rel="noopener noreferrer" className={`text-sm hover:underline truncate flex-1 ${color}`}>
              {sub.submission_url}
            </a>
            <CopyBtn text={sub.submission_url} />
            <span className="text-xs text-white/30 hidden md:block">{new Date(sub.created_at).toLocaleDateString()}</span>
          </div>
        ))}
      </div>
    );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <button onClick={onBack} className="flex items-center gap-2 text-[#7c93c3] text-sm font-semibold hover:gap-3 transition-all">
          <ArrowLeft size={16} /> Back to queue
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => prevApp && onNavigate(prevApp.id)}
            disabled={!prevApp}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm disabled:opacity-30"
          >
            <ChevronLeft size={14} /> Previous
          </button>
          <span className="text-xs text-white/40 px-2">
            {idx + 1} of {queueApps.length}
          </span>
          <button
            onClick={() => nextApp && onNavigate(nextApp.id)}
            disabled={!nextApp}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm disabled:opacity-30"
          >
            Next <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-start gap-5">
          <div className="w-14 h-14 rounded-xl bg-[#7c93c3]/15 border border-[#7c93c3]/25 flex items-center justify-center text-xl font-bold text-[#7c93c3] shrink-0">
            {app.full_name?.charAt(0)?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0 space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{app.full_name}</h2>
              <AmbassadorStatusBadge status={app.status} />
            </div>
            <p className="text-sm text-white/50">
              {app.x_handle} · ID {app.arxon_account_id} · {app.country || "No country"} · Applied {new Date(app.created_at).toLocaleDateString()}
            </p>
            <p className="text-sm text-white/40">{(app.follower_count || 0).toLocaleString()} followers · Est. referrals {app.estimated_new_users || 0}</p>
            <StatusActions status={app.status} updating={updating} onChange={handleStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Referrals", value: referralCount === null ? "…" : referralCount, target: 40, icon: Globe, met: (referralCount ?? 0) >= 40, action: syncRefs, loading: loadingRefs },
          { label: "Posts", value: postSubs.length, target: 8, icon: MessageSquare, met: postSubs.length >= 8 },
          { label: "Spaces", value: spaceSubs.length, target: 2, icon: Users, met: spaceSubs.length >= 2 },
          { label: "Videos", value: videoSubs.length, target: 1, icon: Video, met: videoSubs.length >= 1, bonus: true },
        ].map((stat) => (
          <div key={stat.label} className={`rounded-xl border p-4 ${stat.met ? "border-emerald-400/25 bg-emerald-400/[0.03]" : "border-white/[0.08] bg-white/[0.02]"}`}>
            <div className="flex items-center justify-between mb-2">
              <stat.icon size={16} className={stat.met ? "text-emerald-400" : "text-[#7c93c3]"} />
              <div className="flex items-center gap-1">
                {"bonus" in stat && stat.bonus && (
                  <span className="text-[9px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">BONUS</span>
                )}
                {stat.action && (
                  <button onClick={stat.action} disabled={stat.loading} className="p-1 rounded hover:bg-white/[0.06]">
                    <RefreshCw size={12} className={`text-[#7c93c3] ${stat.loading ? "animate-spin" : ""}`} />
                  </button>
                )}
              </div>
            </div>
            <p className={`text-2xl font-bold ${stat.met ? "text-emerald-400" : "text-white"}`}>{stat.value}</p>
            <p className="text-xs text-white/35 mt-1">
              {stat.label} / {stat.target}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <CheckCircle2 size={14} className="text-[#7c93c3]" />
          <span className="text-sm font-semibold text-white">Requirements Checklist</span>
        </div>
        <div className="p-4 grid sm:grid-cols-2 gap-2">
          {[
            { label: `8+ posts (${postSubs.length} submitted)`, met: postSubs.length >= 8 },
            { label: `2+ spaces (${spaceSubs.length} submitted)`, met: spaceSubs.length >= 2 },
            { label: `40+ referrals (${referralCount ?? "?"} counted)`, met: (referralCount ?? 0) >= 40 },
            { label: "Portal activity submitted", met: submissions.length > 0 },
            { label: `1+ video bonus (${videoSubs.length} done)`, met: videoSubs.length >= 1, bonus: true },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm ${
                item.met ? "border-emerald-400/20 bg-emerald-400/[0.04]" : "border-white/[0.06] bg-white/[0.02]"
              }`}
            >
              <CheckCircle2 size={14} className={item.met ? "text-emerald-400 shrink-0" : "text-white/20 shrink-0"} />
              <span className={item.met ? "text-white/85" : "text-white/45"}>{item.label}</span>
              {item.bonus && (
                <span className="ml-auto text-[9px] font-mono text-amber-300 bg-amber-400/10 border border-amber-400/20 px-1.5 py-0.5 rounded">BONUS</span>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <Shield size={14} className="text-[#7c93c3]" />
            <span className="text-sm font-semibold text-white">Applicant Profile</span>
          </div>
          <div className="p-5 grid sm:grid-cols-2 gap-4 text-sm">
            {[
              ["Full Name", app.full_name],
              ["X Handle", app.x_handle],
              ["Arxon ID", app.arxon_account_id],
              ["Country", app.country || "—"],
              ["Followers", (app.follower_count || 0).toLocaleString()],
              ["Experience", app.previous_experience || "None"],
            ].map(([label, value]) => (
              <div key={label}>
                <p className="text-[11px] uppercase tracking-wide text-white/35 mb-1">{label}</p>
                <p className="text-white/80 break-all">{value}</p>
              </div>
            ))}
          </div>
          <div className="px-5 pb-5">
            <p className="text-[11px] uppercase tracking-wide text-white/35 mb-2">Motivation</p>
            <p className="text-sm text-white/65 leading-relaxed">{app.motivation}</p>
          </div>
        </div>

        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <Twitter size={14} className="text-[#7c93c3]" />
            <span className="text-sm font-semibold text-white">Application Content Links</span>
          </div>
          {app.recent_post_links?.length ? (
            <div className="divide-y divide-white/[0.04]">
              {app.recent_post_links.map((link, j) => (
                <div key={j} className="flex items-center gap-3 px-4 py-3">
                  <span className="text-xs text-white/30 w-5">{j + 1}</span>
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-[#7c93c3] hover:underline truncate flex-1">
                    {link}
                  </a>
                  <CopyBtn text={link} />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/25 px-5 py-4">No application links provided</p>
          )}
        </div>
      </div>

      {weeklyReports.length > 0 && (
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
            <ClipboardList size={14} className="text-[#7c93c3]" />
            <span className="text-sm font-semibold text-white">Weekly Reports</span>
            <span className="text-xs text-[#7c93c3] bg-[#7c93c3]/10 px-2 py-0.5 rounded-full">{weeklyReports.length}</span>
          </div>
          <div className="divide-y divide-white/[0.04]">
            {weeklyReports.map((report) => (
              <div key={report.id} className="px-4 py-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm font-semibold text-white">Week of {report.week_start}</p>
                  <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded-full ${
                    report.status === "submitted" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-300"
                  }`}>
                    {report.status}
                  </span>
                </div>
                {report.summary && <p className="text-sm text-white/55 mb-2">{report.summary}</p>}
                <p className="text-xs text-white/35">
                  {(report.ambassador_report_items ?? []).length} items
                  {report.submitted_at ? ` · submitted ${new Date(report.submitted_at).toLocaleDateString()}` : ""}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center gap-2">
          <Link2 size={14} className="text-[#7c93c3]" />
          <span className="text-sm font-semibold text-white">Portal Activity</span>
          <span className="text-xs text-[#7c93c3] bg-[#7c93c3]/10 px-2 py-0.5 rounded-full">{submissions.length} links</span>
        </div>
        <div className="grid lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
          <div>
            <p className="px-4 py-3 text-xs uppercase tracking-wide text-[#7c93c3]/70">Posts ({postSubs.length})</p>
            <LinkList items={postSubs} color="text-[#7c93c3]" />
          </div>
          <div>
            <p className="px-4 py-3 text-xs uppercase tracking-wide text-purple-400/70">Spaces ({spaceSubs.length})</p>
            <LinkList items={spaceSubs} color="text-purple-400" />
          </div>
          <div>
            <p className="px-4 py-3 text-xs uppercase tracking-wide text-amber-400/70">Videos ({videoSubs.length})</p>
            <LinkList items={videoSubs} color="text-amber-400" />
          </div>
        </div>
      </div>
    </div>
  );
};

const QueueCards = ({
  counts,
  activeQueue,
  onSelect,
}: {
  counts: Record<AmbassadorQueue, number>;
  activeQueue: AmbassadorQueue;
  onSelect: (queue: AmbassadorQueue) => void;
}) => (
  <div className="grid sm:grid-cols-2 xl:grid-cols-5 gap-3">
    {AMBASSADOR_QUEUES.map((queue) => {
      const active = activeQueue === queue.id;
      const icons: Record<AmbassadorQueue, typeof Clock> = {
        pending: Clock,
        consideration: ClipboardList,
        approved: BadgeCheck,
        rejected: XCircle,
        all: Users,
      };
      const Icon = icons[queue.id];
      return (
        <button
          key={queue.id}
          onClick={() => onSelect(queue.id)}
          className={`text-left rounded-2xl border p-4 transition-all ${
            active ? `${queue.border} ${queue.bg} ring-1 ring-white/10` : "border-white/[0.08] bg-white/[0.02] hover:bg-white/[0.04]"
          }`}
        >
          <div className="flex items-start justify-between gap-2 mb-3">
            <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${active ? queue.border : "border-white/[0.08]"}`}>
              <Icon size={18} className={active ? queue.color : "text-white/45"} />
            </div>
            <span className={`text-2xl font-bold ${active ? queue.color : "text-white"}`}>{counts[queue.id]}</span>
          </div>
          <p className={`text-sm font-semibold ${active ? "text-white" : "text-white/75"}`}>{queue.label}</p>
          <p className="text-xs text-white/35 mt-1 leading-relaxed">{queue.description}</p>
        </button>
      );
    })}
  </div>
);

const AmbassadorAdminPanel = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: AmbassadorTab = isAmbassadorTab(searchParams.get("tab")) ? searchParams.get("tab")! : "applications";
  const queue: AmbassadorQueue = isAmbassadorQueue(searchParams.get("queue")) ? searchParams.get("queue")! : "pending";
  const applicantId = searchParams.get("applicant");

  const [apps, setApps] = useState<AppRow[]>([]);
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [weeklyReports, setWeeklyReports] = useState<WeeklyReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [portalSort, setPortalSort] = useState<"submissions" | "date">("submissions");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [sendingEmails, setSendingEmails] = useState(false);

  const approvedCount = useMemo(() => apps.filter((a) => a.status === "approved").length, [apps]);

  const patchParams = useCallback(
    (patch: Record<string, string | null>) => {
      const next = new URLSearchParams(searchParams);
      next.set("section", "ambassadors");
      Object.entries(patch).forEach(([key, value]) => {
        if (value === null) next.delete(key);
        else next.set(key, value);
      });
      setSearchParams(next, { replace: false });
    },
    [searchParams, setSearchParams]
  );

  const load = useCallback(async () => {
    setLoading(true);
    const [a, s, w] = await Promise.all([
      supabase.from("ambassador_applications").select("*").order("created_at", { ascending: false }),
      supabase.from("ambassador_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("ambassador_weekly_reports").select(`
        id,
        arxon_account_id,
        week_start,
        status,
        summary,
        submitted_at,
        ambassador_report_items (id, item_type, url)
      `).order("week_start", { ascending: false }),
    ]);
    if (a.error || s.error) {
      toast.error("Failed to load ambassador data");
      setApps([]);
      setSubs([]);
      setWeeklyReports([]);
    } else {
      setApps((a.data as AppRow[]) || []);
      setSubs((s.data as SubRow[]) || []);
      setWeeklyReports((w.data as WeeklyReportRow[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const getSubsFor = useCallback((accountId: string) => subs.filter((s) => s.arxon_account_id === accountId), [subs]);
  const getReportsFor = useCallback(
    (accountId: string) => weeklyReports.filter((r) => r.arxon_account_id === accountId),
    [weeklyReports],
  );

  const counts = useMemo(
    () => ({
      all: apps.length,
      pending: apps.filter((a) => a.status === "pending").length,
      consideration: apps.filter((a) => a.status === "consideration").length,
      approved: apps.filter((a) => a.status === "approved").length,
      rejected: apps.filter((a) => a.status === "rejected").length,
    }),
    [apps]
  );

  const filterBySearch = useCallback(
    (list: AppRow[]) => {
      if (!search.trim()) return list;
      const q = search.toLowerCase();
      return list.filter(
        (a) =>
          a.full_name?.toLowerCase().includes(q) ||
          a.x_handle?.toLowerCase().includes(q) ||
          a.arxon_account_id?.toLowerCase().includes(q) ||
          a.country?.toLowerCase().includes(q)
      );
    },
    [search]
  );

  const queueApps = useMemo(() => {
    const base = queue === "all" ? apps : apps.filter((a) => a.status === queue);
    return filterBySearch(base);
  }, [apps, queue, filterBySearch]);

  const portalApps = useMemo(() => {
    const base = queue === "all" ? apps : apps.filter((a) => a.status === queue);
    return filterBySearch(base).sort((a, b) => {
      if (portalSort === "submissions") {
        return getSubsFor(b.arxon_account_id).length - getSubsFor(a.arxon_account_id).length;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
  }, [apps, queue, filterBySearch, portalSort, getSubsFor]);

  const selectedApp = applicantId ? apps.find((a) => a.id === applicantId) ?? null : null;

  const updateStatus = async (id: string, status: AmbassadorStatus) => {
    setUpdatingId(id);
    const { error } = await supabase
      .from("ambassador_applications")
      .update({ status, approved_at: status === "approved" ? new Date().toISOString() : null })
      .eq("id", id);
    setUpdatingId(null);
    if (error) {
      toast.error(error.message.includes("check") ? "Database needs migration for audit status. Run latest Supabase migration." : "Failed to update status");
      return;
    }
    toast.success(`Marked as ${statusLabel(status)}`);
    await load();
  };

  const openApplicant = (id: string) => patchParams({ applicant: id });
  const closeApplicant = () => patchParams({ applicant: null });

  const sendSelectionEmails = async (dryRun: boolean) => {
    setSendingEmails(true);
    try {
      const { data, error } = await supabase.functions.invoke("notify-ambassador-selection", {
        body: { dry_run: dryRun, force_resend: false },
      });
      if (error) throw error;
      const summary = data as { sent?: number; skipped?: number; failed?: number; total?: number };
      if (dryRun) {
        toast.success(`Dry run: ${summary.total ?? 0} approved · ${summary.skipped ?? 0} would skip`);
      } else {
        toast.success(`Emails sent: ${summary.sent ?? 0} · skipped: ${summary.skipped ?? 0} · failed: ${summary.failed ?? 0}`);
        await load();
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to send selection emails");
    }
    setSendingEmails(false);
  };

  if (selectedApp) {
    const detailList = tab === "portal" ? portalApps : queueApps;
    return (
      <ApplicantDetailView
        app={selectedApp}
        submissions={getSubsFor(selectedApp.arxon_account_id)}
        weeklyReports={getReportsFor(selectedApp.arxon_account_id)}
        queueApps={detailList.length ? detailList : [selectedApp]}
        onBack={closeApplicant}
        onNavigate={openApplicant}
        onStatusChange={updateStatus}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-white/[0.06]">
          <div>
            <h2 className="text-lg font-bold text-white">Ambassador Audit Center</h2>
            <p className="text-xs text-white/40 mt-0.5">Review applications, portal activity, and audit queues</p>
          </div>
          <div className="flex items-center gap-2">
            {approvedCount > 0 && (
              <>
                <button
                  onClick={() => sendSelectionEmails(true)}
                  disabled={sendingEmails}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs font-semibold text-white/60 hover:text-white disabled:opacity-40"
                >
                  <Mail size={13} /> Preview emails
                </button>
                <button
                  onClick={() => sendSelectionEmails(false)}
                  disabled={sendingEmails}
                  className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-400/10 border border-emerald-400/25 text-xs font-semibold text-emerald-400 hover:bg-emerald-400/20 disabled:opacity-40"
                >
                  <Mail size={13} /> {sendingEmails ? "Sending…" : "Send selection emails"}
                </button>
              </>
            )}
            <button
              onClick={load}
            className="w-9 h-9 rounded-lg bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08]"
          >
            <RefreshCw size={14} className="text-white/50" />
          </button>
          </div>
        </div>

        <div className="flex gap-2 p-4 border-b border-white/[0.06] bg-white/[0.01]">
          {([
            { id: "applications" as const, label: "Applications", icon: Users, count: apps.length },
            { id: "portal" as const, label: "Portal Activity", icon: Link2, count: subs.length },
          ]).map((item) => (
            <button
              key={item.id}
              onClick={() => patchParams({ tab: item.id, applicant: null })}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                tab === item.id ? "bg-[#7c93c3] text-white" : "text-white/45 hover:text-white/75 hover:bg-white/[0.05]"
              }`}
            >
              <item.icon size={15} />
              {item.label}
              <span className={`text-[11px] px-2 py-0.5 rounded-full ${tab === item.id ? "bg-white/20" : "bg-white/[0.06] text-white/35"}`}>
                {item.count}
              </span>
            </button>
          ))}
        </div>

        <div className="p-4 space-y-4 border-b border-white/[0.06]">
          <QueueCards activeQueue={queue} counts={counts} onSelect={(q) => patchParams({ queue: q, applicant: null })} />
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
              <input
                className={`${inputCls} pl-10 py-3`}
                placeholder="Search name, handle, Arxon ID, or country..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {tab === "portal" && (
              <select
                value={portalSort}
                onChange={(e) => setPortalSort(e.target.value as "submissions" | "date")}
                className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-3 text-sm text-white/70 min-w-[180px]"
              >
                <option value="submissions">Most portal links</option>
                <option value="date">Most recent</option>
              </select>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Activity size={22} className="text-[#7c93c3] animate-spin" />
          </div>
        ) : tab === "applications" ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="px-4 py-3 font-semibold">Applicant</th>
                  <th className="px-4 py-3 font-semibold">X Handle</th>
                  <th className="px-4 py-3 font-semibold">Arxon ID</th>
                  <th className="px-4 py-3 font-semibold">Country</th>
                  <th className="px-4 py-3 font-semibold">Followers</th>
                  <th className="px-4 py-3 font-semibold">Portal Links</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Applied</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {queueApps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center text-white/35">
                      No applicants in this queue
                    </td>
                  </tr>
                ) : (
                  queueApps.map((app) => {
                    const appSubs = getSubsFor(app.arxon_account_id);
                    return (
                      <tr key={app.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center font-semibold text-[#7c93c3]">
                              {app.full_name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{app.full_name}</p>
                              <p className="text-xs text-white/35 truncate max-w-[180px]">
                                {app.motivation
                                  ? app.motivation.length > 60
                                    ? `${app.motivation.slice(0, 60)}…`
                                    : app.motivation
                                  : "No motivation provided"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-white/70">{app.x_handle}</td>
                        <td className="px-4 py-4 font-mono text-xs text-white/60">{app.arxon_account_id}</td>
                        <td className="px-4 py-4 text-white/70">{app.country || "—"}</td>
                        <td className="px-4 py-4 text-white/80">{(app.follower_count || 0).toLocaleString()}</td>
                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1 text-[#7c93c3] font-semibold">
                            <Link2 size={13} /> {appSubs.length}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <AmbassadorStatusBadge status={app.status} />
                        </td>
                        <td className="px-4 py-4 text-white/50">{new Date(app.created_at).toLocaleDateString()}</td>
                        <td className="px-4 py-4">
                          <div className="flex flex-col gap-2 min-w-[220px]">
                            <button
                              onClick={() => openApplicant(app.id)}
                              className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-[#7c93c3]/10 text-[#7c93c3] border border-[#7c93c3]/20 text-xs font-semibold hover:bg-[#7c93c3]/20"
                            >
                              <Eye size={13} /> Open full record
                            </button>
                            <StatusActions
                              compact
                              status={app.status}
                              updating={updatingId === app.id}
                              onChange={(status) => updateStatus(app.id, status)}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1200px] text-sm">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02] text-left text-[11px] uppercase tracking-wide text-white/40">
                  <th className="px-4 py-3 font-semibold">Ambassador</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Posts</th>
                  <th className="px-4 py-3 font-semibold">Spaces</th>
                  <th className="px-4 py-3 font-semibold">Videos</th>
                  <th className="px-4 py-3 font-semibold">Weekly Reports</th>
                  <th className="px-4 py-3 font-semibold">Total Links</th>
                  <th className="px-4 py-3 font-semibold">Requirements</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {portalApps.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center text-white/35">
                      No ambassadors in this queue
                    </td>
                  </tr>
                ) : (
                  portalApps.map((app) => {
                    const appSubs = getSubsFor(app.arxon_account_id);
                    const posts = appSubs.filter((s) => s.submission_type === "post").length;
                    const spaces = appSubs.filter((s) => s.submission_type === "space").length;
                    const videos = appSubs.filter((s) => s.submission_type === "video").length;
                    const appReports = getReportsFor(app.arxon_account_id);
                    const submittedReports = appReports.filter((r) => r.status === "submitted").length;
                    const coreMet = posts >= 8 && spaces >= 2;
                    const bonusVideo = videos >= 1;
                    return (
                      <tr key={app.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center font-semibold text-[#7c93c3]">
                              {app.full_name?.charAt(0)?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-white">{app.full_name}</p>
                              <p className="text-xs text-white/45">{app.x_handle} · {app.arxon_account_id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <AmbassadorStatusBadge status={app.status} />
                        </td>
                        <td className={`px-4 py-4 font-semibold ${posts >= 8 ? "text-emerald-400" : "text-white"}`}>{posts}/8</td>
                        <td className={`px-4 py-4 font-semibold ${spaces >= 2 ? "text-emerald-400" : "text-purple-400"}`}>{spaces}/2</td>
                        <td className={`px-4 py-4 font-semibold ${videos >= 1 ? "text-emerald-400" : "text-amber-400"}`}>{videos}/1</td>
                        <td className="px-4 py-4 font-semibold text-sky-300">{submittedReports}/{appReports.length}</td>
                        <td className="px-4 py-4 font-semibold text-[#7c93c3]">{appSubs.length}</td>
                        <td className="px-4 py-4">
                          <span className={`inline-flex items-center gap-1 text-xs font-semibold ${coreMet ? "text-emerald-400" : "text-white/40"}`}>
                            <CheckCircle2 size={13} /> {coreMet ? "Core met" : "Incomplete"}
                          </span>
                          {bonusVideo && <span className="block text-[10px] text-amber-300 mt-1">+ video bonus</span>}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => openApplicant(app.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7c93c3]/10 text-[#7c93c3] border border-[#7c93c3]/20 text-xs font-semibold hover:bg-[#7c93c3]/20"
                          >
                            <Eye size={13} /> Review activity
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmbassadorAdminPanel;
