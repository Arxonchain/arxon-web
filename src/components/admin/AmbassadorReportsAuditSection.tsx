import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Activity, Award, Calendar, CheckCircle2, ChevronDown, ChevronUp, ClipboardList,
  ExternalLink, Image as ImageIcon, Loader2, RefreshCw, Save, Search, Users,
} from "lucide-react";
import { AdminCard, AdminCardHeader, AdminStatBox, adminInputCls } from "@/components/admin/adminUi";
import { verifyApprovedAdminAccess } from "@/lib/adminAccess";
import { buildAdminSectionUrl } from "@/lib/adminNav";
import {
  assignReportPoints,
  AuditReport,
  groupReportsByWeek,
  ITEM_TYPE_LABELS,
  loadSignedReportImageUrls,
  matchesReportSearch,
  MAX_ADMIN_POINTS,
  ReportStatusFilter,
  totalPointsForReports,
  weekLabel,
} from "@/lib/ambassadorReportsAdmin";

const TypeBadge = ({ type }: { type: string }) => {
  const styles: Record<string, string> = {
    post: "text-[#7c93c3] bg-[#7c93c3]/10 border-[#7c93c3]/20",
    space: "text-purple-400 bg-purple-400/10 border-purple-400/20",
    video: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    image: "text-sky-400 bg-sky-400/10 border-sky-400/20",
    link: "text-white/70 bg-white/[0.06] border-white/[0.1]",
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${styles[type] ?? styles.link}`}>
      {ITEM_TYPE_LABELS[type] ?? type}
    </span>
  );
};

const PointsEditor = ({
  report,
  adminUserId,
  onSaved,
}: {
  report: AuditReport;
  adminUserId: string;
  onSaved: (reportId: string, points: number | null, note: string | null) => void;
}) => {
  const [points, setPoints] = useState(report.admin_points?.toString() ?? "");
  const [note, setNote] = useState(report.admin_points_note ?? "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setPoints(report.admin_points?.toString() ?? "");
    setNote(report.admin_points_note ?? "");
  }, [report.id, report.admin_points, report.admin_points_note]);

  const handleSave = async () => {
    const trimmed = points.trim();
    const parsed = trimmed === "" ? null : Number.parseInt(trimmed, 10);
    if (parsed !== null && (Number.isNaN(parsed) || parsed < 0 || parsed > MAX_ADMIN_POINTS)) {
      toast.error(`Enter a whole number from 0 to ${MAX_ADMIN_POINTS}, or leave blank to clear`);
      return;
    }

    setSaving(true);
    const { error } = await assignReportPoints(report.id, adminUserId, parsed, note);
    setSaving(false);

    if (error) {
      toast.error(error);
      return;
    }

    toast.success(parsed !== null ? `Assigned ${parsed} points` : "Points cleared");
    onSaved(report.id, parsed, note.trim() || null);
  };

  if (report.status !== "submitted") {
    return (
      <p className="text-xs text-white/35">Points can be assigned after the ambassador submits this week.</p>
    );
  }

  return (
    <div className="rounded-xl border border-[#7c93c3]/20 bg-[#7c93c3]/[0.04] p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Award size={14} className="text-[#7c93c3]" />
        <p className="text-sm font-semibold text-white">Assign weekly points</p>
      </div>
      <div className="grid sm:grid-cols-[140px_1fr] gap-3">
        <div>
          <label className="text-[11px] uppercase tracking-wide text-white/35 mb-1 block">Points (0–{MAX_ADMIN_POINTS})</label>
          <input
            type="number"
            min={0}
            max={MAX_ADMIN_POINTS}
            className={adminInputCls}
            placeholder="e.g. 100"
            value={points}
            onChange={(e) => setPoints(e.target.value)}
          />
        </div>
        <div>
          <label className="text-[11px] uppercase tracking-wide text-white/35 mb-1 block">Note (optional)</label>
          <input
            className={adminInputCls}
            placeholder="Brief feedback for the ambassador"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={saving}
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#7c93c3]/15 text-[#7c93c3] border border-[#7c93c3]/25 text-xs font-semibold hover:bg-[#7c93c3]/25 disabled:opacity-40"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save points
        </button>
        {report.admin_points_assigned_at && (
          <p className="text-xs text-white/35">
            Last updated {new Date(report.admin_points_assigned_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

const ReportDetailPanel = ({
  report,
  imageUrls,
  adminUserId,
  onClose,
  onPointsSaved,
}: {
  report: AuditReport;
  imageUrls: Record<string, string>;
  adminUserId: string;
  onClose: () => void;
  onPointsSaved: (reportId: string, points: number | null, note: string | null) => void;
}) => {
  const app = report.ambassador_applications;
  const items = [...(report.ambassador_report_items ?? [])].sort((a, b) => a.sort_order - b.sort_order);
  const links = items.filter((i) => i.url);
  const images = items.filter((i) => i.storage_path);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="rounded-2xl border border-[#7c93c3]/25 bg-[#7c93c3]/[0.04] overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4 px-5 py-4 border-b border-white/[0.08]">
        <div>
          <p className="text-lg font-bold text-white">{app?.full_name ?? report.arxon_account_id}</p>
          <p className="text-sm text-white/50 mt-0.5">
            {app?.x_handle} · {report.arxon_account_id}
            {app?.country ? ` · ${app.country}` : ""}
          </p>
          <p className="text-xs text-white/35 mt-1">{weekLabel(report.week_start)}</p>
          {app?.id && (
            <Link
              to={buildAdminSectionUrl("ambassadors", { tab: "portal", applicant: app.id, queue: "approved" })}
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold text-[#7c93c3] hover:underline"
            >
              <Users size={12} />
              Open ambassador record
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap justify-end">
          {report.admin_points != null && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#7c93c3]/15 text-[#a8c3f0] border border-[#7c93c3]/25">
              <Award size={11} />
              {report.admin_points} pts
            </span>
          )}
          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
            report.status === "submitted" ? "bg-emerald-400/10 text-emerald-400" : "bg-amber-400/10 text-amber-300"
          }`}>
            {report.status}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg text-xs text-white/50 border border-white/[0.1] hover:bg-white/[0.05]"
          >
            Close
          </button>
        </div>
      </div>

      <div className="p-5 space-y-5">
        {report.summary && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/35 mb-2">Summary</p>
            <p className="text-sm text-white/70 leading-relaxed rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
              {report.summary}
            </p>
          </div>
        )}

        <PointsEditor report={report} adminUserId={adminUserId} onSaved={onPointsSaved} />

        {links.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/35 mb-2">Links ({links.length})</p>
            <div className="space-y-2">
              {links.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-3">
                  <TypeBadge type={item.item_type} />
                  <a
                    href={item.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 min-w-0 text-sm text-[#7c93c3] hover:underline truncate"
                  >
                    {item.url}
                  </a>
                  <a
                    href={item.url ?? "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 p-2 rounded-lg bg-white/[0.04] hover:bg-white/[0.08]"
                  >
                    <ExternalLink size={14} className="text-white/50" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/35 mb-2">Screenshots ({images.length})</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {images.map((item) => {
                const src = item.storage_path ? imageUrls[item.storage_path] : null;
                return (
                  <div key={item.id} className="rounded-xl border border-white/[0.08] bg-black/20 overflow-hidden">
                    <div className="aspect-[16/10] bg-black/40 flex items-center justify-center">
                      {src ? (
                        <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                          <img src={src} alt={item.caption ?? "Screenshot"} className="w-full h-full object-cover" loading="lazy" />
                        </a>
                      ) : (
                        <div className="text-center px-3">
                          <ImageIcon size={28} className="text-white/20 mx-auto" />
                          <p className="text-[10px] text-white/25 mt-2">Preview unavailable</p>
                        </div>
                      )}
                    </div>
                    {item.caption && (
                      <p className="px-3 py-2 text-xs text-white/45 border-t border-white/[0.06]">{item.caption}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {report.admin_points_note && (
          <div>
            <p className="text-[11px] uppercase tracking-wide text-white/35 mb-2">Points note</p>
            <p className="text-sm text-white/60 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
              {report.admin_points_note}
            </p>
          </div>
        )}

        <p className="text-xs text-white/30">
          {report.submitted_at
            ? `Submitted ${new Date(report.submitted_at).toLocaleString()}`
            : `Last updated ${new Date(report.updated_at).toLocaleString()}`}
        </p>
      </div>
    </motion.div>
  );
};

const AmbassadorReportsAuditSection = () => {
  const [reports, setReports] = useState<AuditReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminVerified, setAdminVerified] = useState(false);
  const [adminUserId, setAdminUserId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReportStatusFilter>("submitted");
  const [weekFilter, setWeekFilter] = useState<string>("all");
  const [expandedWeeks, setExpandedWeeks] = useState<Set<string>>(new Set());
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Sign in required");
      setLoading(false);
      return;
    }
    const access = await verifyApprovedAdminAccess(user.id);
    if (!access.allowed) {
      toast.error(access.reason ?? "Admin access required");
      setAdminVerified(false);
      setReports([]);
      setLoading(false);
      return;
    }
    setAdminVerified(true);
    setAdminUserId(user.id);

    const { data, error } = await supabase
      .from("ambassador_weekly_reports")
      .select(`
        id,
        arxon_account_id,
        week_start,
        status,
        summary,
        submitted_at,
        created_at,
        updated_at,
        admin_points,
        admin_points_note,
        admin_points_assigned_at,
        admin_points_assigned_by,
        ambassador_report_items (
          id,
          item_type,
          url,
          storage_path,
          caption,
          sort_order
        ),
        ambassador_applications (
          id,
          full_name,
          x_handle,
          country
        )
      `)
      .order("week_start", { ascending: false })
      .order("submitted_at", { ascending: false });

    if (error) {
      toast.error("Failed to load weekly reports");
      setReports([]);
    } else {
      setReports((data ?? []) as AuditReport[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const paths = reports
      .flatMap((r) => r.ambassador_report_items ?? [])
      .map((i) => i.storage_path)
      .filter((p): p is string => Boolean(p));

    if (!paths.length) return;

    let cancelled = false;
    (async () => {
      const urls = await loadSignedReportImageUrls(paths);
      if (!cancelled) setImageUrls(urls);
    })();

    return () => { cancelled = true; };
  }, [reports]);

  const handlePointsSaved = (reportId: string, points: number | null, note: string | null) => {
    setReports((prev) => prev.map((r) => (
      r.id === reportId
        ? {
            ...r,
            admin_points: points,
            admin_points_note: note,
            admin_points_assigned_at: points !== null ? new Date().toISOString() : null,
            admin_points_assigned_by: points !== null ? adminUserId : null,
          }
        : r
    )));
  };

  const weekOptions = useMemo(() => {
    const weeks = [...new Set(reports.map((r) => r.week_start))].sort((a, b) => (a < b ? 1 : -1));
    return weeks;
  }, [reports]);

  const filtered = useMemo(() => {
    return reports.filter((report) => {
      if (statusFilter !== "all" && report.status !== statusFilter) return false;
      if (weekFilter !== "all" && report.week_start !== weekFilter) return false;
      return matchesReportSearch(report, search);
    });
  }, [reports, statusFilter, weekFilter, search]);

  const grouped = useMemo(() => groupReportsByWeek(filtered), [filtered]);

  useEffect(() => {
    if (weekOptions.length && expandedWeeks.size === 0) {
      setExpandedWeeks(new Set(weekOptions.slice(0, 2)));
    }
  }, [weekOptions, expandedWeeks.size]);

  const stats = useMemo(() => ({
    total: reports.length,
    submitted: reports.filter((r) => r.status === "submitted").length,
    drafts: reports.filter((r) => r.status === "draft").length,
    ambassadors: new Set(reports.map((r) => r.arxon_account_id)).size,
    pointsAssigned: reports.filter((r) => r.admin_points != null).length,
    totalPoints: totalPointsForReports(reports),
  }), [reports]);

  const selectedReport = reports.find((r) => r.id === selectedReportId) ?? null;

  const toggleWeek = (week: string) => {
    setExpandedWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(week)) next.delete(week);
      else next.add(week);
      return next;
    });
  };

  if (!adminVerified && !loading) {
    return (
      <AdminCard>
        <div className="py-16 text-center text-white/35 text-sm">
          Admin access is required to view ambassador weekly reports.
        </div>
      </AdminCard>
    );
  }

  return (
    <div className="space-y-5">
      <AdminCard>
        <AdminCardHeader
          icon={ClipboardList}
          title="Ambassador Weekly Reports"
          subtitle="Audit submitted deliverables and assign weekly points"
          action={
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-xs text-white/60 hover:text-white"
            >
              <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>
          }
        />
        <div className="p-4 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 border-b border-white/[0.06]">
          <AdminStatBox label="SUBMITTED REPORTS" value={stats.submitted} color="text-emerald-400" />
          <AdminStatBox label="DRAFT REPORTS" value={stats.drafts} color="text-amber-300" />
          <AdminStatBox label="TOTAL REPORTS" value={stats.total} color="text-[#7c93c3]" />
          <AdminStatBox label="AMBASSADORS REPORTING" value={stats.ambassadors} color="text-white" />
          <AdminStatBox label="WEEKS SCORED" value={stats.pointsAssigned} color="text-[#a8c3f0]" />
          <AdminStatBox label="TOTAL POINTS" value={stats.totalPoints} color="text-[#7c93c3]" />
        </div>

        <div className="p-4 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#52525b]" />
            <input
              className={`${adminInputCls} pl-10`}
              placeholder="Search ambassador, handle, ID, country, or summary..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ReportStatusFilter)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white/70 min-w-[160px]"
          >
            <option value="submitted">Submitted only</option>
            <option value="draft">Drafts only</option>
            <option value="all">All statuses</option>
          </select>
          <select
            value={weekFilter}
            onChange={(e) => setWeekFilter(e.target.value)}
            className="bg-white/[0.04] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white/70 min-w-[200px]"
          >
            <option value="all">All weeks</option>
            {weekOptions.map((week) => (
              <option key={week} value={week}>{weekLabel(week)}</option>
            ))}
          </select>
        </div>
      </AdminCard>

      {selectedReport && adminUserId && (
        <AnimatePresence>
          <ReportDetailPanel
            report={selectedReport}
            imageUrls={imageUrls}
            adminUserId={adminUserId}
            onClose={() => setSelectedReportId(null)}
            onPointsSaved={handlePointsSaved}
          />
        </AnimatePresence>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Activity size={22} className="text-[#7c93c3] animate-spin" />
        </div>
      ) : grouped.size === 0 ? (
        <AdminCard>
          <div className="py-16 text-center space-y-2">
            <ClipboardList size={28} className="text-white/15 mx-auto" />
            <p className="text-white/35 text-sm">No reports match your filters yet.</p>
            <p className="text-white/25 text-xs">Submitted reports appear here after ambassadors use the portal.</p>
          </div>
        </AdminCard>
      ) : (
        [...grouped.entries()].map(([weekStart, weekReports]) => {
          const expanded = expandedWeeks.has(weekStart);
          const submittedInWeek = weekReports.filter((r) => r.status === "submitted").length;
          const weekPoints = totalPointsForReports(weekReports);
          return (
            <AdminCard key={weekStart}>
              <button
                type="button"
                onClick={() => toggleWeek(weekStart)}
                className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-[#7c93c3]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-bold text-white">{weekLabel(weekStart)}</p>
                  <p className="text-xs text-white/40 mt-0.5">
                    {weekReports.length} report{weekReports.length !== 1 ? "s" : ""} · {submittedInWeek} submitted
                    {weekPoints > 0 ? ` · ${weekPoints} pts assigned` : ""}
                  </p>
                </div>
                {expanded ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
              </button>

              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border-t border-white/[0.06]"
                  >
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[980px] text-sm">
                        <thead>
                          <tr className="border-b border-white/[0.06] bg-white/[0.02] text-left text-[11px] uppercase tracking-wide text-white/40">
                            <th className="px-4 py-3 font-semibold">Ambassador</th>
                            <th className="px-4 py-3 font-semibold">Status</th>
                            <th className="px-4 py-3 font-semibold">Points</th>
                            <th className="px-4 py-3 font-semibold">Links</th>
                            <th className="px-4 py-3 font-semibold">Screenshots</th>
                            <th className="px-4 py-3 font-semibold">Submitted</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {weekReports.map((report) => {
                            const items = report.ambassador_report_items ?? [];
                            const linkCount = items.filter((i) => i.url).length;
                            const imageCount = items.filter((i) => i.storage_path).length;
                            const app = report.ambassador_applications;
                            return (
                              <tr key={report.id} className="border-b border-white/[0.04] hover:bg-white/[0.02]">
                                <td className="px-4 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[#7c93c3]/10 border border-[#7c93c3]/20 flex items-center justify-center font-semibold text-[#7c93c3] shrink-0">
                                      {app?.full_name?.charAt(0)?.toUpperCase() ?? "?"}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-white">{app?.full_name ?? report.arxon_account_id}</p>
                                      <p className="text-xs text-white/40">{app?.x_handle ?? "—"} · {report.arxon_account_id}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4">
                                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    report.status === "submitted"
                                      ? "bg-emerald-400/10 text-emerald-400"
                                      : "bg-amber-400/10 text-amber-300"
                                  }`}>
                                    {report.status === "submitted" && <CheckCircle2 size={11} />}
                                    {report.status}
                                  </span>
                                </td>
                                <td className="px-4 py-4">
                                  {report.admin_points != null ? (
                                    <span className="inline-flex items-center gap-1 font-semibold text-[#a8c3f0]">
                                      <Award size={12} />
                                      {report.admin_points}
                                    </span>
                                  ) : (
                                    <span className="text-white/30 text-xs">Not scored</span>
                                  )}
                                </td>
                                <td className="px-4 py-4 font-semibold text-[#7c93c3]">{linkCount}</td>
                                <td className="px-4 py-4 font-semibold text-sky-300">{imageCount}</td>
                                <td className="px-4 py-4 text-white/50 text-xs">
                                  {report.submitted_at
                                    ? new Date(report.submitted_at).toLocaleString()
                                    : "Not submitted"}
                                </td>
                                <td className="px-4 py-4">
                                  <button
                                    type="button"
                                    onClick={() => setSelectedReportId(report.id)}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-[#7c93c3]/10 text-[#7c93c3] border border-[#7c93c3]/20 text-xs font-semibold hover:bg-[#7c93c3]/20"
                                  >
                                    <Users size={13} />
                                    Review & score
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </AdminCard>
          );
        })
      )}
    </div>
  );
};

export default AmbassadorReportsAuditSection;
