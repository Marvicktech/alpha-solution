CREATE TABLE public.consultation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  business_name text,
  service_interest text NOT NULL DEFAULT 'other' CHECK (service_interest IN ('website','uiux','automation','branding_seo','other')),
  message text,
  source text NOT NULL DEFAULT 'booking_form' CHECK (source IN ('booking_form','live_person_request')),
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','booked','closed')),
  notes text
);

GRANT INSERT ON public.consultation_requests TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.consultation_requests TO authenticated;
GRANT ALL ON public.consultation_requests TO service_role;

ALTER TABLE public.consultation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a consultation request"
  ON public.consultation_requests FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can read requests"
  ON public.consultation_requests FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update requests"
  ON public.consultation_requests FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Authenticated users can delete requests"
  ON public.consultation_requests FOR DELETE TO authenticated USING (true);
