-- Adds what's needed for the accept/decline booking workflow:
-- the exact slot a visitor requested (so we can create the real Cal.com
-- booking on accept), and a link to that Cal.com booking once created.
ALTER TABLE public.consultation_requests
  ADD COLUMN IF NOT EXISTS requested_start timestamptz,
  ADD COLUMN IF NOT EXISTS requested_end timestamptz,
  ADD COLUMN IF NOT EXISTS cal_booking_uid text;

-- "declined" joins the existing status set — a request the admin turned
-- down (as opposed to "closed", which covers everything else that's done).
ALTER TABLE public.consultation_requests DROP CONSTRAINT IF EXISTS consultation_requests_status_check;
ALTER TABLE public.consultation_requests
  ADD CONSTRAINT consultation_requests_status_check
  CHECK (status IN ('new','contacted','booked','declined','closed'));
