-- Ensure RLS is enabled on waitlist table
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to recreate them with explicit deny-by-default
DROP POLICY IF EXISTS "Admins can view all waitlist entries" ON public.waitlist;
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;

-- Recreate SELECT policy - only admins can view waitlist entries
CREATE POLICY "Admins can view all waitlist entries"
ON public.waitlist
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Recreate INSERT policy - anyone can join the waitlist (unauthenticated users too)
CREATE POLICY "Anyone can join waitlist"
ON public.waitlist
FOR INSERT
TO anon, authenticated
WITH CHECK (true);