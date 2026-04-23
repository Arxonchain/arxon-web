-- Add length constraints to waitlist table for security
ALTER TABLE public.waitlist
  ADD CONSTRAINT waitlist_name_length CHECK (char_length(name) > 0 AND char_length(name) <= 100),
  ADD CONSTRAINT waitlist_email_length CHECK (char_length(email) > 0 AND char_length(email) <= 255),
  ADD CONSTRAINT waitlist_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');