-- Weekly ambassador reports (approved ambassadors only via edge function)

CREATE TABLE IF NOT EXISTS public.ambassador_weekly_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id uuid NOT NULL REFERENCES public.ambassador_applications(id) ON DELETE CASCADE,
  arxon_account_id text NOT NULL,
  week_start date NOT NULL,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
  summary text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  UNIQUE (arxon_account_id, week_start)
);

CREATE TABLE IF NOT EXISTS public.ambassador_report_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id uuid NOT NULL REFERENCES public.ambassador_weekly_reports(id) ON DELETE CASCADE,
  item_type text NOT NULL CHECK (item_type IN ('post', 'space', 'video', 'image', 'link', 'other')),
  url text,
  storage_path text,
  caption text,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ambassador_report_item_has_content CHECK (
    (url IS NOT NULL AND length(trim(url)) > 0)
    OR (storage_path IS NOT NULL AND length(trim(storage_path)) > 0)
  )
);

CREATE INDEX IF NOT EXISTS idx_ambassador_weekly_reports_account
  ON public.ambassador_weekly_reports (arxon_account_id, week_start DESC);

CREATE INDEX IF NOT EXISTS idx_ambassador_report_items_report
  ON public.ambassador_report_items (report_id, sort_order);

ALTER TABLE public.ambassador_weekly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambassador_report_items ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE public.ambassador_weekly_reports IS 'Weekly deliverable reports from approved ambassadors';
COMMENT ON TABLE public.ambassador_report_items IS 'Links and uploaded media attached to a weekly report';

-- Storage bucket for ambassador screenshots and media
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'ambassador-reports',
  'ambassador-reports',
  false,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[];

-- No anon/authenticated policies: all access via service role edge function only
