const FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ambassador-portal`;
const ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

export type AmbassadorProfile = {
  id: string;
  full_name: string;
  x_handle: string;
  arxon_account_id: string;
  country: string | null;
  status: string;
  follower_count: number;
  approved_at: string | null;
  created_at: string;
};

export type ReportItem = {
  id?: string;
  item_type: "post" | "space" | "video" | "image" | "link" | "other";
  url?: string | null;
  storage_path?: string | null;
  caption?: string | null;
  sort_order?: number;
  signed_url?: string | null;
};

export type WeeklyReport = {
  id: string;
  week_start: string;
  status: "draft" | "submitted";
  summary: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
  admin_points: number | null;
  admin_points_note: string | null;
  admin_points_assigned_at: string | null;
  ambassador_report_items: ReportItem[];
};

type PortalResponse = {
  ok?: boolean;
  error?: string;
  found?: boolean;
  status?: string;
  profile?: AmbassadorProfile;
  session_token?: string;
  expires_in?: number;
  reports?: WeeklyReport[];
  current_week?: string;
  report?: WeeklyReport;
  message?: string;
  storage_path?: string;
  signed_url?: string;
  token?: string;
};

async function callPortal(
  body: Record<string, unknown>,
  sessionToken?: string | null,
): Promise<PortalResponse> {
  const payload = sessionToken ? { ...body, session_token: sessionToken } : body;
  const res = await fetch(FUNCTIONS_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: ANON_KEY,
      Authorization: `Bearer ${ANON_KEY}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await res.json().catch(() => ({}))) as PortalResponse;
  if (!res.ok) throw new Error(data.error ?? "Request failed");
  return data;
}

export async function authenticatePortal(accountId: string) {
  return callPortal({ action: "auth", account_id: accountId });
}

export async function fetchDashboard(sessionToken: string) {
  return callPortal({ action: "dashboard" }, sessionToken);
}

export async function requestUploadUrl(
  sessionToken: string,
  filename: string,
  contentType: string,
  weekStart: string,
) {
  return callPortal({
    action: "upload_url",
    filename,
    content_type: contentType,
    week_start: weekStart,
  }, sessionToken);
}

export async function submitWeeklyReport(
  sessionToken: string,
  payload: {
    week_start: string;
    summary?: string;
    items: ReportItem[];
    finalize: boolean;
  },
) {
  return callPortal({
    action: "submit_report",
    week_start: payload.week_start,
    summary: payload.summary,
    items: payload.items,
    finalize: payload.finalize,
  }, sessionToken);
}

export function formatWeekLabel(weekStart: string): string {
  const start = new Date(`${weekStart}T00:00:00Z`);
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = new Intl.DateTimeFormat("en", { month: "short", day: "numeric", timeZone: "UTC" });
  return `${fmt.format(start)} to ${fmt.format(end)}`;
}

export function currentWeekStart(): string {
  const d = new Date();
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = date.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + diff);
  return date.toISOString().slice(0, 10);
}
