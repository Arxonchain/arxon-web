import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  AmbassadorProfile,
  WeeklyReport,
  authenticatePortal,
  currentWeekStart,
  fetchDashboard,
} from "@/lib/ambassadorPortalApi";
import { clearSession, loadSession, saveSession } from "@/lib/ambassadorPortalSession";
import { ApprovedWorkHub } from "@/components/ambassador/ApprovedWorkHub";
import { PortalLogin } from "@/components/ambassador/PortalLogin";
import { PortalShell } from "@/components/ambassador/PortalShell";
import { StatusScreen } from "@/components/ambassador/StatusScreen";

type PortalView =
  | { kind: "login" }
  | { kind: "status"; profile: AmbassadorProfile }
  | {
      kind: "approved";
      profile: AmbassadorProfile;
      sessionToken: string;
      reports: WeeklyReport[];
      currentWeek: string;
    };

const AmbassadorPortal = () => {
  const navigate = useNavigate();
  const [accountId, setAccountId] = useState("");
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [view, setView] = useState<PortalView>({ kind: "login" });

  const bootstrapSession = useCallback(async (storedToken: string) => {
    setLoading(true);
    try {
      const data = await fetchDashboard(storedToken);
      if (!data.profile || data.profile.status !== "approved") {
        clearSession();
        setView({ kind: "login" });
        return;
      }
      setView({
        kind: "approved",
        profile: data.profile,
        sessionToken: storedToken,
        reports: data.reports ?? [],
        currentWeek: data.current_week ?? currentWeekStart(),
      });
    } catch {
      clearSession();
      setView({ kind: "login" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const stored = loadSession();
    if (stored?.token) bootstrapSession(stored.token);
  }, [bootstrapSession]);

  const handleSignIn = async () => {
    const id = accountId.trim();
    if (!id) return;
    setLoading(true);
    setNotFound(false);
    try {
      const data = await authenticatePortal(id);
      if (!data.found || !data.profile) {
        setNotFound(true);
        setView({ kind: "login" });
        return;
      }

      if (data.status === "approved" && data.session_token) {
        saveSession(data.session_token, data.profile.arxon_account_id, data.expires_in ?? 60 * 60 * 12);
        setView({
          kind: "approved",
          profile: data.profile,
          sessionToken: data.session_token,
          reports: data.reports ?? [],
          currentWeek: data.current_week ?? currentWeekStart(),
        });
        return;
      }

      setView({ kind: "status", profile: data.profile });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    clearSession();
    setAccountId("");
    setNotFound(false);
    setView({ kind: "login" });
  };

  return (
    <PortalShell>
      {view.kind === "login" && (
        <PortalLogin
          accountId={accountId}
          loading={loading}
          notFound={notFound}
          onAccountIdChange={setAccountId}
          onSubmit={handleSignIn}
          onBack={() => navigate("/ambassadors")}
        />
      )}

      {view.kind === "status" && (
        <StatusScreen profile={view.profile} onSignOut={handleSignOut} />
      )}

      {view.kind === "approved" && (
        <ApprovedWorkHub
          profile={view.profile}
          reports={view.reports}
          currentWeek={view.currentWeek}
          sessionToken={view.sessionToken}
          onReportsUpdated={(reports) => setView((prev) => (prev.kind === "approved" ? { ...prev, reports } : prev))}
          onSignOut={handleSignOut}
        />
      )}
    </PortalShell>
  );
};

export default AmbassadorPortal;
