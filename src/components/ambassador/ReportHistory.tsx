import { useMemo } from "react";
import { Award, CheckCircle2, Clock, ExternalLink, Image as ImageIcon } from "lucide-react";
import { WeeklyReport, formatWeekLabel } from "@/lib/ambassadorPortalApi";
import { portalCard, portalLabel } from "./portalTheme";

const typeLabels: Record<string, string> = {
  post: "Post",
  space: "Space",
  video: "Video",
  image: "Screenshot",
  link: "Link",
  other: "Other",
};

export function ReportHistory({
  reports,
  currentWeek,
  selectedWeek,
  onSelectWeek,
}: {
  reports: WeeklyReport[];
  currentWeek: string;
  selectedWeek: string;
  onSelectWeek: (weekStart: string) => void;
}) {
  const weeks = useMemo(() => {
    const map = new Map<string, WeeklyReport>();
    reports.forEach((r) => map.set(r.week_start, r));
    return [{ week_start: currentWeek, report: map.get(currentWeek) }, ...reports.map((r) => ({ week_start: r.week_start, report: r }))]
      .filter((v, i, arr) => arr.findIndex((x) => x.week_start === v.week_start) === i)
      .sort((a, b) => (a.week_start < b.week_start ? 1 : -1));
  }, [reports, currentWeek]);

  return (
    <div className={`${portalCard} p-5`}>
      <p className={portalLabel}>Your weeks</p>
      <div className="mt-4 space-y-2">
        {weeks.map(({ week_start, report }) => {
          const active = week_start === selectedWeek;
          const submitted = report?.status === "submitted";
          return (
            <button
              key={week_start}
              type="button"
              onClick={() => onSelectWeek(week_start)}
              className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition ${
                active
                  ? "border-[#a8c3f0]/40 bg-[#a8c3f0]/10"
                  : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-white">{formatWeekLabel(week_start)}</p>
                <p className="mt-0.5 text-xs text-white/45">
                  {week_start === currentWeek ? "Current week" : "Past week"}
                  {report?.admin_points != null ? ` · ${report.admin_points} pts` : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
              <span
                className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                  submitted
                    ? "bg-emerald-400/12 text-emerald-300"
                    : "bg-amber-400/10 text-amber-200"
                }`}
              >
                {submitted ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                {submitted ? "Submitted" : report ? "Draft" : "Open"}
              </span>
              {submitted && report?.admin_points != null && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#a8c3f0]">
                  <Award size={10} />
                  Scored
                </span>
              )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ReportPreviewCard({ report }: { report: WeeklyReport }) {
  const items = report.ambassador_report_items ?? [];
  const links = items.filter((i) => i.url);
  const images = items.filter((i) => i.storage_path);

  return (
    <div className={`${portalCard} p-5`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className={portalLabel}>Submitted report</p>
          <h3 className="mt-1 text-lg font-bold text-white">{formatWeekLabel(report.week_start)}</h3>
        </div>
        <span className="rounded-full bg-emerald-400/12 px-3 py-1 text-xs font-semibold text-emerald-300">
          Locked
        </span>
      </div>
      {report.summary && (
        <p className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 text-sm leading-relaxed text-white/65">
          {report.summary}
        </p>
      )}
      {report.admin_points != null && (
        <div className="mt-4 rounded-xl border border-[#a8c3f0]/25 bg-[#a8c3f0]/[0.06] p-4">
          <div className="flex items-center gap-2 text-[#a8c3f0]">
            <Award size={16} />
            <p className="text-sm font-semibold">Score: {report.admin_points} points</p>
          </div>
          {report.admin_points_note && (
            <p className="mt-2 text-sm text-white/55">{report.admin_points_note}</p>
          )}
        </div>
      )}
      {links.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Links</p>
          <div className="space-y-2">
            {links.map((item, idx) => (
              <a
                key={`${item.url}-${idx}`}
                href={item.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.02] px-3 py-2 text-sm text-[#a8c3f0] transition hover:bg-white/[0.05]"
              >
                <ExternalLink size={13} />
                <span className="truncate">{typeLabels[item.item_type] ?? "Link"} · {item.url}</span>
              </a>
            ))}
          </div>
        </div>
      )}
      {images.length > 0 && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-white/40">Screenshots</p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((item, idx) => (
              <div key={`${item.storage_path}-${idx}`} className="overflow-hidden rounded-xl border border-white/[0.08] bg-black/20">
                {item.signed_url ? (
                  <img src={item.signed_url} alt={item.caption ?? "Screenshot"} className="aspect-[4/3] w-full object-cover" />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center text-white/30">
                    <ImageIcon size={24} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
