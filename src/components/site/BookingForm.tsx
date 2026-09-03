import { useState, type FormEvent } from "react";
import { CalendarCheck, CheckCircle2, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Reveal } from "./Reveal";
import { ConsultationPreview } from "./ConsultationPreview";
import contactBanner from "@/assets/book-contact-banner.jpg";
import { SERVICE_LABELS, type ServiceId } from "./data";
import { submitLead, toDbService } from "./leads";
import { track } from "@/lib/analytics";

type Errors = Partial<Record<"name" | "email" | "phone" | "business" | "message", string>>;

const FORM_SERVICES: ServiceId[] = ["website", "uiux", "automation", "branding", "other"];

export function BookingForm({
  service,
  onServiceChange,
}: {
  service: ServiceId | null;
  onServiceChange: (id: ServiceId) => void;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [failed, setFailed] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const get = (k: string) => String(fd.get(k) ?? "").trim();
    const next: Errors = {};

    if (get("name").length < 2) next.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(get("email")))
      next.email = "Please enter a valid email address.";
    if (get("phone").replace(/[^\d]/g, "").length < 10)
      next.phone = "Please enter a valid UK phone number.";
    if (get("business").length < 2) next.business = "Please enter your business name.";
    if (get("message").length < 10) next.message = "Tell us a little more (10+ characters).";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    setFailed(false);
    track("booking_form_submit", { service: get("service") || service || "unspecified" });
    try {
      await submitLead({
        name: get("name"),
        email: get("email"),
        phone: get("phone") || null,
        business_name: get("business") || null,
        service_interest: toDbService((get("service") as ServiceId) || service),
        message: get("message") || null,
        source: "booking_form",
      });
      setSubmitted(true);
      track("booking_form_success", { service: get("service") || service || "unspecified" });
      toast.success("Thanks! We'll be in touch within 1 business day.");
      form.reset();
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
      <div className="mx-auto max-w-3xl px-5">
        <Reveal className="text-center">
          <span className="inline-grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <CalendarCheck className="size-6" aria-hidden="true" />
          </span>
          <h2 id="book-heading" className="mt-5 heading-2 font-extrabold">
            Book your free consultation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Thirty minutes, no obligation. We look at how customers find you today and tell you
            what is worth fixing first.
          </p>
        </Reveal>

        <Reveal delay={60}>
          <div className="mx-auto mt-8 aspect-[21/8] max-w-md overflow-hidden rounded-2xl border border-border shadow-[var(--shadow-card)] sm:max-w-xl">
            <img
              src={contactBanner}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="photo-breathe size-full object-cover"
            />
          </div>
        </Reveal>

        <ConsultationPreview />

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
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  className={fieldClass}
                  placeholder="07123 456789"
                />
                {errors.phone && <p className="mt-1 text-sm text-destructive">{errors.phone}</p>}
              </div>
              <div>
                <Label htmlFor="business">Business name</Label>
                <Input
                  id="business"
                  name="business"
                  className={fieldClass}
                  placeholder="Smith & Co Plumbing"
                />
                {errors.business && (
                  <p className="mt-1 text-sm text-destructive">{errors.business}</p>
                )}
              </div>
            </div>

            <div className="mt-5">
              <Label htmlFor="service">What do you need help with?</Label>
              <select
                id="service"
                name="service"
                value={service ?? ""}
                onChange={(e) => onServiceChange(e.target.value as ServiceId)}
                className="mt-2 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="" disabled>
                  Select a service
                </option>
                {FORM_SERVICES.map((id) => (
                  <option key={id} value={id}>
                    {SERVICE_LABELS[id]}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <Label htmlFor="message">Tell us a bit more</Label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                className={fieldClass}
                placeholder="What's the current setup, and what would a good outcome look like?"
              />
              {errors.message && <p className="mt-1 text-sm text-destructive">{errors.message}</p>}
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
                  Thanks! Your request is in. We'll be in touch within 1 business day.
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
