import { Award, BarChart3, CalendarDays, CheckCircle2 } from "lucide-react";
import { AmbassadorProfile, WeeklyReport } from "@/lib/ambassadorPortalApi";
import { ApprovedHeader, ProfileStrip } from "./StatusScreen";
import { WeeklyReportBuilder } from "./WeeklyReportBuilder";
import { portalCard, portalLabel } from "./portalTheme";

type Props = {
  profile: AmbassadorProfile;
  reports: WeeklyReport[];
  currentWeek: string;
  sessionToken: string;
  onReportsUpdated: (reports: WeeklyReport[]) => void;
  onSignOut: () => void;
};

export function ApprovedWorkHub({
  profile,
  reports,
  currentWeek,
  sessionToken,
  onReportsUpdated,
  onSignOut,
}: Props) {
  const submittedCount = reports.filter((r) => r.status === "submitted").length;
  const currentSubmitted = reports.some((r) => r.week_start === currentWeek && r.status === "submitted");
  const totalPoints = reports.reduce((sum, r) => sum + (r.admin_points ?? 0), 0);
  const scoredWeeks = reports.filter((r) => r.admin_points != null).length;

  return (
    <div className="mx-auto max-w-6xl">
      <ApprovedHeader profile={profile} onSignOut={onSignOut} />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          icon={Award}
          label="Ambassador status"
          value="Selected"
          tone="accent"
        />
        <StatCard
          icon={CalendarDays}
          label="Reports submitted"
          value={String(submittedCount)}
          tone="neutral"
        />
        <StatCard
          icon={CheckCircle2}
          label="This week"
          value={currentSubmitted ? "Submitted" : "Pending"}
          tone={currentSubmitted ? "success" : "neutral"}
        />
        <StatCard
          icon={BarChart3}
          label="Total points"
          value={totalPoints > 0 ? String(totalPoints) : "—"}
          hint={scoredWeeks > 0 ? `${scoredWeeks} week${scoredWeeks !== 1 ? "s" : ""} scored` : "Awaiting review"}
          tone={totalPoints > 0 ? "accent" : "neutral"}
        />
      </div>

      <ProfileStrip profile={profile} />

      <div className={`${portalCard} mt-6 overflow-hidden`}>
        <div className="border-b border-white/[0.08] px-5 py-4 md:px-6">
          <div className="flex items-center gap-2">
            <BarChart3 size={16} className="text-[#a8c3f0]" />
            <p className={portalLabel}>Weekly deliverables</p>
          </div>
          <p className="mt-2 text-sm text-white/55">
            Share your posts, spaces, and screenshots every week. Once submitted, a week locks so the review team sees a clean record.
          </p>
        </div>
        <div className="p-5 md:p-6">
          <WeeklyReportBuilder
            sessionToken={sessionToken}
            reports={reports}
            currentWeek={currentWeek}
            onReportsUpdated={onReportsUpdated}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: typeof Award;
  label: string;
  value: string;
  hint?: string;
  tone: "accent" | "success" | "neutral";
}) {
  const toneClass = {
    accent: "text-[#a8c3f0]",
    success: "text-emerald-300",
    neutral: "text-white",
  }[tone];

  return (
    <div className={`${portalCard} p-5`}>
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#a8c3f0]/20 bg-[#a8c3f0]/10">
        <Icon size={18} className="text-[#a8c3f0]" />
      </div>
      <p className="text-xs font-semibold uppercase tracking-wide text-white/40">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${toneClass}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-white/35">{hint}</p>}
    </div>
  );
}
