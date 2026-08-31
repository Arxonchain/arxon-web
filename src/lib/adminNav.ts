const ADMIN_PATHS = ["/admin", "/waitlist-admin", "/investor-admin"] as const;

export const ADMIN_SECTIONS = ["overview", "waitlist", "investors", "ambassadors", "reports", "settings"] as const;
export type AdminSection = (typeof ADMIN_SECTIONS)[number];

export function isAdminSection(value: string | null): value is AdminSection {
  return ADMIN_SECTIONS.includes(value as AdminSection);
}

/** Only allow in-app admin return paths. */
export function validateAdminReturnTo(value: string | null, fallback = "/admin?section=overview"): string {
  if (!value) return fallback;
  try {
    const url = new URL(value, "https://arxon.io");
    if (url.pathname !== "/admin") return fallback;
    const section = url.searchParams.get("section");
    if (section && !isAdminSection(section)) return fallback;
    return `${url.pathname}${url.search}`;
  } catch {
    return fallback;
  }
}

export function authPathWithReturn(pathname: string, search = ""): string {
  const target = `${pathname}${search}`;
  if (!ADMIN_PATHS.some((p) => pathname.startsWith(p))) {
    return "/auth";
  }
  return `/auth?returnTo=${encodeURIComponent(target)}`;
}

export function buildAdminSectionUrl(section: AdminSection, extra?: Record<string, string>): string {
  const params = new URLSearchParams({ section });
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => params.set(k, v));
  }
  return `/admin?${params.toString()}`;
}
