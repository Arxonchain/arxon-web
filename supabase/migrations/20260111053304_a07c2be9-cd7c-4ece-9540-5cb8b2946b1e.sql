-- Add x_username and country columns to investor_submissions table
ALTER TABLE public.investor_submissions 
ADD COLUMN x_username text NOT NULL DEFAULT '',
ADD COLUMN country text NOT NULL DEFAULT '';

-- Remove the defaults after adding (to enforce required on new inserts)
ALTER TABLE public.investor_submissions 
ALTER COLUMN x_username DROP DEFAULT,
ALTER COLUMN country DROP DEFAULT;