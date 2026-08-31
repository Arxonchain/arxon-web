import { formatWeekLabel } from "@/lib/ambassadorPortalApi";
import { supabase } from "@/integrations/supabase/client";

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
  admin_points: number | null;
  admin_points_note: string | null;
  admin_points_assigned_at: string | null;
  admin_points_assigned_by: string | null;
  ambassador_report_items: AuditReportItem[];
  ambassador_applications: {
    id: string;
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

export const MAX_ADMIN_POINTS = 1000;

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

export function totalPointsForReports(reports: Pick<AuditReport, "admin_points">[]): number {
  return reports.reduce((sum, r) => sum + (r.admin_points ?? 0), 0);
}

export async function assignReportPoints(
  reportId: string,
  adminUserId: string,
  points: number | null,
  note: string | null,
): Promise<{ error: string | null }> {
  if (points !== null && (points < 0 || points > MAX_ADMIN_POINTS || !Number.isInteger(points))) {
    return { error: `Points must be a whole number from 0 to ${MAX_ADMIN_POINTS}` };
  }

  const { error } = await supabase
    .from("ambassador_weekly_reports")
    .update({
      admin_points: points,
      admin_points_note: note?.trim() || null,
      admin_points_assigned_at: points !== null ? new Date().toISOString() : null,
      admin_points_assigned_by: points !== null ? adminUserId : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", reportId);

  return { error: error?.message ?? null };
}

export async function loadSignedReportImageUrls(paths: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (!unique.length) return {};

  const entries = await Promise.all(
    unique.map(async (path) => {
      const { data, error } = await supabase.storage.from("ambassador-reports").createSignedUrl(path, 3600);
      return [path, error ? "" : data?.signedUrl ?? ""] as const;
    }),
  );

  return Object.fromEntries(entries.filter(([, url]) => url));
}
