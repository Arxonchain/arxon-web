export type AmbassadorQueue = "all" | "pending" | "consideration" | "approved" | "rejected";
export type AmbassadorTab = "applications" | "portal";

export const AMBASSADOR_QUEUES: {
  id: AmbassadorQueue;
  label: string;
  description: string;
  color: string;
  border: string;
  bg: string;
}[] = [
  {
    id: "pending",
    label: "Pending",
    description: "New applications awaiting first review",
    color: "text-yellow-400",
    border: "border-yellow-400/30",
    bg: "bg-yellow-400/10",
  },
  {
    id: "consideration",
    label: "Selected for Audit",
    description: "Flagged for deeper review and activity check",
    color: "text-sky-400",
    border: "border-sky-400/30",
    bg: "bg-sky-400/10",
  },
  {
    id: "approved",
    label: "Approved",
    description: "Accepted ambassadors",
    color: "text-emerald-400",
    border: "border-emerald-400/30",
    bg: "bg-emerald-400/10",
  },
  {
    id: "rejected",
    label: "Rejected",
    description: "Declined applications",
    color: "text-red-400",
    border: "border-red-400/30",
    bg: "bg-red-400/10",
  },
  {
    id: "all",
    label: "All Applicants",
    description: "Complete registry across every status",
    color: "text-white",
    border: "border-white/20",
    bg: "bg-white/[0.04]",
  },
];

export const AMBASSADOR_STATUSES = ["pending", "consideration", "approved", "rejected"] as const;
export type AmbassadorStatus = (typeof AMBASSADOR_STATUSES)[number];

export function isAmbassadorQueue(value: string | null): value is AmbassadorQueue {
  return value === "all" || value === "pending" || value === "consideration" || value === "approved" || value === "rejected";
}

export function isAmbassadorTab(value: string | null): value is AmbassadorTab {
  return value === "applications" || value === "portal";
}

export function statusLabel(status: string): string {
  if (status === "consideration") return "Selected for Audit";
  return status.charAt(0).toUpperCase() + status.slice(1);
}

export function buildAdminUrl(params: {
  section?: string;
  tab?: AmbassadorTab;
  queue?: AmbassadorQueue;
  applicant?: string | null;
}): string {
  const search = new URLSearchParams();
  search.set("section", params.section ?? "overview");
  if (params.tab) search.set("tab", params.tab);
  if (params.queue) search.set("queue", params.queue);
  if (params.applicant) search.set("applicant", params.applicant);
  return `/admin?${search.toString()}`;
}
