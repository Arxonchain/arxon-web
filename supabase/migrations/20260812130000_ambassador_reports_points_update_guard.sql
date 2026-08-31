-- Restrict admin UPDATE on weekly reports to points columns only (idempotent)

CREATE OR REPLACE FUNCTION public.guard_ambassador_report_admin_update()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF NEW.application_id IS DISTINCT FROM OLD.application_id
    OR NEW.arxon_account_id IS DISTINCT FROM OLD.arxon_account_id
    OR NEW.week_start IS DISTINCT FROM OLD.week_start
    OR NEW.status IS DISTINCT FROM OLD.status
    OR NEW.summary IS DISTINCT FROM OLD.summary
    OR NEW.submitted_at IS DISTINCT FROM OLD.submitted_at
    OR NEW.created_at IS DISTINCT FROM OLD.created_at
  THEN
    RAISE EXCEPTION 'Admins may only update admin_points fields on weekly reports';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_guard_ambassador_report_admin_update ON public.ambassador_weekly_reports;

CREATE TRIGGER trg_guard_ambassador_report_admin_update
  BEFORE UPDATE ON public.ambassador_weekly_reports
  FOR EACH ROW
  EXECUTE FUNCTION public.guard_ambassador_report_admin_update();
