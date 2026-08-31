-- Allow admins to view uploaded ambassador report screenshots (idempotent)

DO $$ BEGIN
  CREATE POLICY "Admins can read ambassador report files"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
      bucket_id = 'ambassador-reports'
      AND public.has_role(auth.uid(), 'admin')
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
