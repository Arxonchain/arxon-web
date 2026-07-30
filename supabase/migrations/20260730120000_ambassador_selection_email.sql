ALTER TABLE public.ambassador_applications
  ADD COLUMN IF NOT EXISTS email TEXT,
  ADD COLUMN IF NOT EXISTS selection_email_sent_at TIMESTAMPTZ;

COMMENT ON COLUMN public.ambassador_applications.email IS 'Cached contact email resolved from mining app auth';
COMMENT ON COLUMN public.ambassador_applications.selection_email_sent_at IS 'When the ambassador selection notification email was sent';
