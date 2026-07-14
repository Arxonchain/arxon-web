-- Admin access requests: signup requires email approval before login works
CREATE TABLE public.admin_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  organization TEXT,
  reason TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'approved', 'rejected')),
  approval_token UUID NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  reviewed_at TIMESTAMPTZ,
  reviewed_by TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_access_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own admin access request"
ON public.admin_access_requests
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all admin access requests"
ON public.admin_access_requests
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update admin access requests"
ON public.admin_access_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- New signups only get the base user role (no auto-admin)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create pending admin request from signup metadata
CREATE OR REPLACE FUNCTION public.handle_admin_signup_request()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF COALESCE((NEW.raw_user_meta_data->>'admin_signup')::boolean, false) THEN
    INSERT INTO public.admin_access_requests (
      user_id,
      full_name,
      email,
      organization,
      reason
    ) VALUES (
      NEW.id,
      COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
      COALESCE(NEW.email, ''),
      NULLIF(NEW.raw_user_meta_data->>'organization', ''),
      NULLIF(NEW.raw_user_meta_data->>'reason', '')
    )
    ON CONFLICT (user_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_admin_signup ON auth.users;
CREATE TRIGGER on_auth_user_admin_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_signup_request();

-- Approve or reject from secure email link (service role / edge function)
CREATE OR REPLACE FUNCTION public.review_admin_access_request(
  _token uuid,
  _action text,
  _reviewed_by text DEFAULT 'email'
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  req public.admin_access_requests%ROWTYPE;
  next_status text;
BEGIN
  IF _action NOT IN ('approve', 'reject') THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid action');
  END IF;

  SELECT * INTO req
  FROM public.admin_access_requests
  WHERE approval_token = _token
  FOR UPDATE;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Request not found');
  END IF;

  IF req.status <> 'pending' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'Request already reviewed',
      'status', req.status,
      'email', req.email,
      'full_name', req.full_name
    );
  END IF;

  next_status := CASE WHEN _action = 'approve' THEN 'approved' ELSE 'rejected' END;

  UPDATE public.admin_access_requests
  SET
    status = next_status,
    reviewed_at = now(),
    reviewed_by = _reviewed_by
  WHERE id = req.id;

  IF _action = 'approve' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (req.user_id, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'status', next_status,
    'email', req.email,
    'full_name', req.full_name
  );
END;
$$;
