// Your live Cal.com booking page, shown inline (not a popup) so picking a
// date, a time and confirming your details all happen in one place — one
// goal, no separate "form vs calendar" choice for the visitor to make.
const CAL_BOOKING_URL = "https://cal.com/alphapresenced/30min";

/**
 * The calendar's own dates/buttons follow whatever brand colour is set on
 * your Cal.com account (Settings → My Account → Appearance → Brand colour).
 * Set that to your red (#da0418) once and it carries through here
 * automatically — this wrapper just gives it an on-brand frame so it feels
 * native to the page instead of like an embedded third-party widget.
 */
export function LiveBookingCalendar() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)]">
      <div className="h-1.5 bg-gradient-to-r from-primary via-primary-glow to-primary" aria-hidden="true" />
      <iframe
        src={`${CAL_BOOKING_URL}?embed=true&theme=light`}
        title="Book a free consultation with Alpha Presence"
        loading="lazy"
        className="h-[760px] w-full max-h-[80vh] min-h-[560px] border-0"
      />
    </div>
  );
}
