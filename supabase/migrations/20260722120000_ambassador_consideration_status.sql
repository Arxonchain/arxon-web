-- Extend ambassador application status for audit workflow
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'ambassador_applications_status_check'
  ) THEN
    ALTER TABLE public.ambassador_applications
      DROP CONSTRAINT ambassador_applications_status_check;
  END IF;
END $$;

ALTER TABLE public.ambassador_applications
  ADD CONSTRAINT ambassador_applications_status_check
  CHECK (status IN ('pending', 'consideration', 'approved', 'rejected'));

COMMENT ON COLUMN public.ambassador_applications.status IS
  'pending = new application, consideration = selected for audit review, approved/rejected = final decision';
