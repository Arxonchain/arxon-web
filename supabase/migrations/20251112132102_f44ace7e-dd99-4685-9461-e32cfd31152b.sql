-- Create investor_submissions table
CREATE TABLE public.investor_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  investment_range TEXT NOT NULL,
  investment_timeline TEXT NOT NULL,
  area_of_interest TEXT NOT NULL,
  linkedin_profile TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.investor_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Admins can view all submissions
CREATE POLICY "Admins can view all investor submissions"
ON public.investor_submissions
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Policy: Anyone can submit (no auth required for public form)
CREATE POLICY "Anyone can submit investor form"
ON public.investor_submissions
FOR INSERT
WITH CHECK (true);