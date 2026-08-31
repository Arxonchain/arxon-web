-- Allow admins to review ambassador weekly reports in the dashboard (idempotent)

DO $$ BEGIN
  CREATE POLICY "Admins can read weekly reports"
    ON public.ambassador_weekly_reports
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE POLICY "Admins can read report items"
    ON public.ambassador_report_items
    FOR SELECT
    TO authenticated
    USING (public.has_role(auth.uid(), 'admin'));
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
