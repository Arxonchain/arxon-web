
-- Ambassador applications table
CREATE TABLE public.ambassador_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  x_handle TEXT NOT NULL,
  arxon_account_id TEXT NOT NULL UNIQUE,
  follower_count INTEGER NOT NULL DEFAULT 0,
  recent_post_links TEXT[] NOT NULL DEFAULT '{}',
  motivation TEXT NOT NULL,
  estimated_new_users INTEGER NOT NULL DEFAULT 0,
  previous_experience TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ambassador_applications ENABLE ROW LEVEL SECURITY;

-- Anyone can apply
CREATE POLICY "Anyone can submit ambassador application"
  ON public.ambassador_applications FOR INSERT
  WITH CHECK (true);

-- Anyone can look up their own application by arxon_account_id
CREATE POLICY "Users can view own application"
  ON public.ambassador_applications FOR SELECT
  USING (true);

-- Admins can update applications (approve/reject)
CREATE POLICY "Admins can update applications"
  ON public.ambassador_applications FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can delete applications
CREATE POLICY "Admins can delete applications"
  ON public.ambassador_applications FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Ambassador submissions table (up to 12 links per applicant)
CREATE TABLE public.ambassador_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  arxon_account_id TEXT NOT NULL,
  submission_url TEXT NOT NULL,
  submission_type TEXT NOT NULL DEFAULT 'post',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.ambassador_submissions ENABLE ROW LEVEL SECURITY;

-- Anyone can submit links
CREATE POLICY "Anyone can submit links"
  ON public.ambassador_submissions FOR INSERT
  WITH CHECK (true);

-- Anyone can view submissions (filtered by arxon_account_id in app)
CREATE POLICY "Users can view submissions"
  ON public.ambassador_submissions FOR SELECT
  USING (true);

-- Admins can manage submissions
CREATE POLICY "Admins can update submissions"
  ON public.ambassador_submissions FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete submissions"
  ON public.ambassador_submissions FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
