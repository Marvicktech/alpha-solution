import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { addDays, isAfter, isBefore, startOfDay } from "date-fns";
import { CalendarCheck, CheckCircle2, Send, Loader2, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import { submitLead } from "./leads";
import { notifyNewLead } from "./notifications.functions";
import { getAvailableSlots } from "./availability.functions";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "whatsapp" | "email" | "when", string>>;

// How far ahead visitors can book. Kept modest — Cal.com bookings this far
// out are rare for a 30-minute consult, and a shorter window keeps the
// slots request (and the calendar's disabled-day pass) cheap.
const DAYS_AHEAD = 21;

function dateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-4 py-2 text-sm font-semibold transition-all",
        active
          ? "border-primary bg-primary text-primary-foreground shadow-[var(--shadow-glow)]"
          : "border-input bg-background text-foreground hover:border-primary/50 hover:bg-accent",
      )}
    >
      {children}
    </button>
  );
}

// Fallback used only if the live Cal.com calendar can't be reached (no API
// key configured, Cal.com is down, etc.) — the form should still be usable
// even then, just without real slot times.
const FALLBACK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;
const FALLBACK_TIMES = ["Morning", "Afternoon", "Evening", "Anytime"] as const;

export function BookingForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  // Live calendar state.
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  // Fallback (no-live-data) picker state.
  const [fallbackDays, setFallbackDays] = useState<string[]>([]);
  const [fallbackTime, setFallbackTime] = useState<string | null>(null);

  const sendNewLeadEmails = useServerFn(notifyNewLead);
  const fetchSlots = useServerFn(getAvailableSlots);

  const timeZone = useMemo(() => {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Europe/London";
    } catch {
      return "Europe/London";
    }
  }, []);

  const rangeStart = useMemo(() => startOfDay(new Date()), []);
  const rangeEnd = useMemo(() => addDays(rangeStart, DAYS_AHEAD), [rangeStart]);

  const slotsQuery = useQuery({
    queryKey: ["available_slots", rangeStart.toISOString(), rangeEnd.toISOString(), timeZone],
    queryFn: () =>
      fetchSlots({
        data: {
          startTime: rangeStart.toISOString(),
          endTime: rangeEnd.toISOString(),
          timeZone,
        },
      }),
    staleTime: 60_000,
    retry: 1,
  });

  const liveAvailable = !slotsQuery.isError;
  const slotsByDate = slotsQuery.data ?? {};
  const dayFormatter = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { timeZone, weekday: "short", day: "numeric", month: "short" }),
    [timeZone],
  );
  const timeFormatter = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { timeZone, hour: "2-digit", minute: "2-digit" }),
    [timeZone],
  );

  const slotsForSelectedDate = selectedDate ? (slotsByDate[dateKey(selectedDate)] ?? []) : [];

  function toggleFallbackDay(day: string) {
    setFallbackDays((d) => (d.includes(day) ? d.filter((x) => x !== day) : [...d, day]));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const next: Errors = {};

    if (get("name").length < 2) next.name = "Please enter your name.";
    if (get("whatsapp").replace(/[^\d]/g, "").length < 10)
      next.whatsapp = "Please enter a valid WhatsApp number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get("email")))
      next.email = "Please enter a valid email address.";

    if (liveAvailable) {
      if (!selectedDate || !selectedSlot)
        next.when = "Pick a day and time from the calendar above.";
    } else if (fallbackDays.length === 0 || !fallbackTime) {
      next.when = "Pick at least one day and a time of day that works for you.";
    }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setFailed(false);
    track("booking_form_submit", {});

    const when =
      liveAvailable && selectedDate && selectedSlot
        ? `${dayFormatter.format(selectedDate)}, ${timeFormatter.format(new Date(selectedSlot))} (${timeZone})`
        : `${fallbackDays.join(", ")} · ${fallbackTime}`;
    const note = get("note");
    const message = `Preferred time: ${when}${
      liveAvailable && selectedSlot ? `\nSlot: ${selectedSlot}` : ""
    }${note ? `\n\n${note}` : ""}`;

    try {
      await submitLead({
        name: get("name"),
        email: get("email"),
        phone: get("whatsapp"),
        business_name: null,
        service_interest: "other",
        message,
        source: "booking_form",
      });
      setSubmitted(true);
      track("booking_form_success", {});
      toast.success("Thanks! We'll be in touch within 1 business day.");
      form.reset();
      setSelectedDate(undefined);
      setSelectedSlot(null);
      setFallbackDays([]);
      setFallbackTime(null);

      // Confirmation + notification emails. The lead is already saved above,
      // so a hiccup here shouldn't turn a successful submission into an
      // error the visitor sees.
      try {
        await sendNewLeadEmails({
          data: {
            name: get("name"),
            email: get("email"),
            phone: get("whatsapp"),
            businessName: null,
            serviceLabel: "General enquiry",
            message,
            source: "booking_form",
          },
        });
      } catch (emailErr) {
        console.error("[BookingForm] notifyNewLead failed:", emailErr);
      }
    } catch (err) {
      // Logged so the real cause (RLS, network, etc.) shows up in the browser
      // console instead of only the generic toast below.
      console.error("[BookingForm] submitLead failed:", err);
      setFailed(true);
      track("booking_form_error", {});
      toast.error("Something went wrong sending your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  const fieldClass = "mt-2";

  return (
    <section id="book" className="bg-background py-24" aria-labelledby="book-heading">
      <div className="mx-auto max-w-2xl px-5">
        <Reveal className="text-center">
          <span className="inline-grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <CalendarCheck className="size-6" aria-hidden="true" />
          </span>
          <h2 id="book-heading" className="mt-5 heading-2 font-extrabold text-balance">
            Losing customers because they can't find you, don't trust what they see, or give up
            halfway through booking?
          </h2>
          <p className="mt-3 text-muted-foreground">
            That is exactly what we fix. Pick a time that works below and get a free,
            no-obligation 30-minute consultation on what is worth fixing first — no pressure, no
            jargon.
          </p>
        </Reveal>

        <Reveal delay={100}>
          <form
            onSubmit={handleSubmit}
            noValidate
            className="mt-10 rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)] md:p-8"
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" className={fieldClass} placeholder="Jane Smith" />
                {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  className={fieldClass}
                  placeholder="jane@business.co.uk"
                />
                {errors.email && <p className="mt-1 text-sm text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="whatsapp">WhatsApp number</Label>
                <Input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  className={fieldClass}
                  placeholder="07123 456789"
                />
                {errors.whatsapp && (
                  <p className="mt-1 text-sm text-destructive">{errors.whatsapp}</p>
                )}
              </div>
            </div>

            <div className="mt-6">
              <Label>Pick a day and time</Label>

              {liveAvailable ? (
                <div className="mt-2 overflow-hidden rounded-xl border border-border">
                  <div className="flex flex-col sm:flex-row">
                    <div className="flex justify-center border-b border-border p-2 sm:border-b-0 sm:border-r">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => {
                          setSelectedDate(d);
                          setSelectedSlot(null);
                        }}
                        disabled={(date) => {
                          if (isBefore(startOfDay(date), rangeStart)) return true;
                          if (isAfter(date, rangeEnd)) return true;
                          if (slotsQuery.isSuccess) return (slotsByDate[dateKey(date)] ?? []).length === 0;
                          return false;
                        }}
                        className="[--cell-size:2.25rem]"
                      />
                    </div>
                    <div className="min-w-0 flex-1 p-4">
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                        <Clock className="size-4 text-primary" aria-hidden="true" />
                        {selectedDate ? dayFormatter.format(selectedDate) : "Choose a day"}
                      </p>

                      {slotsQuery.isLoading && (
                        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                          Loading live availability…
                        </p>
                      )}

                      {!slotsQuery.isLoading && selectedDate && slotsForSelectedDate.length === 0 && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          No open times that day — try another date.
                        </p>
                      )}

                      {!slotsQuery.isLoading && !selectedDate && (
                        <p className="mt-3 text-sm text-muted-foreground">
                          Times shown are pulled from our live calendar and in your local time
                          ({timeZone}).
                        </p>
                      )}

                      {slotsForSelectedDate.length > 0 && (
                        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                          {slotsForSelectedDate.map((slot) => (
                            <Chip
                              key={slot.start}
                              active={selectedSlot === slot.start}
                              onClick={() => setSelectedSlot(slot.start)}
                            >
                              {timeFormatter.format(new Date(slot.start))}
                            </Chip>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {FALLBACK_DAYS.map((day) => (
                      <Chip key={day} active={fallbackDays.includes(day)} onClick={() => toggleFallbackDay(day)}>
                        {day}
                      </Chip>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {FALLBACK_TIMES.map((t) => (
                      <Chip key={t} active={fallbackTime === t} onClick={() => setFallbackTime(t)}>
                        {t}
                      </Chip>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    We couldn't load the live calendar just now — pick your general availability
                    instead and we'll confirm an exact time with you.
                  </p>
                </div>
              )}

              {errors.when && <p className="mt-2 text-sm text-destructive">{errors.when}</p>}
            </div>

            <div className="mt-5">
              <Label htmlFor="note">Anything else? (optional)</Label>
              <Textarea
                id="note"
                name="note"
                rows={4}
                className={fieldClass}
                placeholder="What's going on, and what would a good outcome look like?"
              />
            </div>

            <Button
              type="submit"
              variant="hero"
              data-magnetic
              size="xl"
              className="mt-7 w-full"
              disabled={submitting}
            >
              {submitting ? (
                <Loader2 className="animate-spin" aria-hidden="true" />
              ) : (
                <Send aria-hidden="true" />
              )}
              {submitting ? "Sending…" : "Request my free consultation"}
            </Button>
            <div aria-live="polite">
              {submitted && (
                <p className="mt-4 flex items-start gap-2 rounded-xl border border-primary/30 bg-primary/10 p-4 text-sm font-semibold text-foreground">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
                  Thanks! Your request is in — we'll WhatsApp or email you within 1 business day to
                  confirm a time.
                </p>
              )}
              {failed && (
                <p className="mt-4 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
                  We couldn't send your request. Please try again in a moment.
                </p>
              )}
              {!submitted && !failed && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  We reply within one working day. No spam, ever.
                </p>
              )}
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
