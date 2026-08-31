import { formatWeekLabel } from "@/lib/ambassadorPortalApi";

export type AuditReportItem = {
  id: string;
  item_type: string;
  url: string | null;
  storage_path: string | null;
  caption: string | null;
  sort_order: number;
};

export type AuditReport = {
  id: string;
  arxon_account_id: string;
  week_start: string;
  status: string;
  summary: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  ambassador_report_items: AuditReportItem[];
  ambassador_applications: {
    full_name: string;
    x_handle: string;
    country: string | null;
  } | null;
};

export type ReportStatusFilter = "all" | "submitted" | "draft";

export const ITEM_TYPE_LABELS: Record<string, string> = {
  post: "Post",
  space: "Space",
  video: "Video",
  image: "Screenshot",
  link: "Link",
  other: "Other",
};

export function groupReportsByWeek(reports: AuditReport[]): Map<string, AuditReport[]> {
  const map = new Map<string, AuditReport[]>();
  for (const report of reports) {
    const list = map.get(report.week_start) ?? [];
    list.push(report);
    map.set(report.week_start, list);
  }
  for (const [, list] of map) {
    list.sort((a, b) => a.ambassador_applications?.full_name.localeCompare(b.ambassador_applications?.full_name ?? "") ?? 0);
  }
  return new Map([...map.entries()].sort((a, b) => (a[0] < b[0] ? 1 : -1)));
}

export function weekLabel(weekStart: string): string {
  return formatWeekLabel(weekStart);
}

export function matchesReportSearch(report: AuditReport, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  const app = report.ambassador_applications;
  return (
    report.arxon_account_id.toLowerCase().includes(q)
    || app?.full_name.toLowerCase().includes(q)
    || app?.x_handle.toLowerCase().includes(q)
    || (app?.country?.toLowerCase().includes(q) ?? false)
    || (report.summary?.toLowerCase().includes(q) ?? false)
  );
}
