import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { CalendarCheck, CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { submitLead } from "./leads";
import { notifyNewLead } from "./notifications.functions";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "whatsapp" | "email" | "when", string>>;

export function BookingForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);
  const sendNewLeadEmails = useServerFn(notifyNewLead);

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
    if (get("when").length < 2) next.when = "Let us know roughly when works for you.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setFailed(false);
    track("booking_form_submit", {});

    const note = get("note");
    const message = `Preferred time: ${get("when")}${note ? `\n\n${note}` : ""}`;

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
            That is exactly what we fix. Tell us where it is happening and get a free,
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
              <div>
                <Label htmlFor="when">Best time to reach you</Label>
                <Input
                  id="when"
                  name="when"
                  className={fieldClass}
                  placeholder="e.g. Weekday mornings, or Tue 3pm"
                />
                {errors.when && <p className="mt-1 text-sm text-destructive">{errors.when}</p>}
              </div>
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
