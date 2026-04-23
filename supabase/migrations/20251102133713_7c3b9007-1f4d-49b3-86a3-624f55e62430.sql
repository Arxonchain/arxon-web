-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create separate policies for better security control

-- Policy: Only admins can INSERT new roles
CREATE POLICY "Only admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can UPDATE roles
CREATE POLICY "Only admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can DELETE roles
CREATE POLICY "Only admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Add a RESTRICTIVE policy to explicitly deny non-admins from modifying roles
-- This creates a double-lock: both permissive AND restrictive policies must pass
CREATE POLICY "Restrict role modifications to admins only"
ON public.user_roles
AS RESTRICTIVE
FOR ALL
TO authenticated
USING (
  -- Allow if user is admin OR if it's just a SELECT operation
  public.has_role(auth.uid(), 'admin') OR 
  (SELECT current_setting('request.method', true) = 'GET')
);