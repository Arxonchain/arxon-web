-- Admin-assigned weekly points for ambassador reports (idempotent)

ALTER TABLE public.ambassador_weekly_reports
  ADD COLUMN IF NOT EXISTS admin_points integer,
  ADD COLUMN IF NOT EXISTS admin_points_note text,
  ADD COLUMN IF NOT EXISTS admin_points_assigned_at timestamptz,
  ADD COLUMN IF NOT EXISTS admin_points_assigned_by uuid REFERENCES auth.users(id);

DO $$ BEGIN
  ALTER TABLE public.ambassador_weekly_reports
    ADD CONSTRAINT ambassador_weekly_reports_admin_points_check
    CHECK (admin_points IS NULL OR (admin_points >= 0 AND admin_points <= 1000));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

COMMENT ON COLUMN public.ambassador_weekly_reports.admin_points IS 'Admin-assigned score (0-1000) for weekly deliverables';
COMMENT ON COLUMN public.ambassador_weekly_reports.admin_points_note IS 'Optional note explaining the score';
COMMENT ON COLUMN public.ambassador_weekly_reports.admin_points_assigned_at IS 'When points were last assigned';
COMMENT ON COLUMN public.ambassador_weekly_reports.admin_points_assigned_by IS 'Admin user who assigned points';

-- Admins can assign/update points on submitted reports
DO $$ BEGIN
  CREATE POLICY "Admins can assign report points"
    ON public.ambassador_weekly_reports
    FOR UPDATE
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'))
    WITH CHECK (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
