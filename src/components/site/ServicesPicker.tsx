import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Check, MessageCircle, Phone, ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";
import workstationPhoto from "@/assets/services-workstation.jpg";
import workstationPhotoWebp from "@/assets/services-workstation.webp";
import { SERVICES, SERVICE_TABLE, type ServiceId } from "./data";
import { submitLead } from "./leads";
import { notifyNewLead } from "./notifications.functions";
import { SITE } from "@/config/site";

function QuickContact() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const sendNewLeadEmails = useServerFn(notifyNewLead);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("qc-name") ?? "").trim();
    const email = String(fd.get("qc-email") ?? "").trim();
    const phone = String(fd.get("qc-phone") ?? "").trim();

    if (name.length < 2) {
      setError("Please enter your name.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
    const phoneOk = phone.replace(/[^\d]/g, "").length >= 10;
    if (!emailOk && !phoneOk) {
      setError("Add an email or a phone number so we can reach you.");
      return;
    }
    setError(null);
    setStatus("sending");
    const finalEmail = emailOk ? email : "not-provided@alphapresence.invalid";
    try {
      await submitLead({
        name,
        email: finalEmail,
        phone: phoneOk ? phone : null,
        service_interest: "other",
        source: "live_person_request",
        message: "Requested a call back from the talk-to-a-real-person panel.",
      });
      setStatus("done");
      toast.success("Thanks! We'll be in touch within 1 business day.");
      form.reset();

      if (emailOk) {
        try {
          await sendNewLeadEmails({
            data: {
              name,
              email: finalEmail,
              phone: phoneOk ? phone : null,
              businessName: null,
              serviceLabel: "General enquiry",
              message: "Requested a call back from the talk-to-a-real-person panel.",
              source: "live_person_request",
            },
          });
        } catch (emailErr) {
          console.error("[QuickContact] notifyNewLead failed:", emailErr);
        }
      }
    } catch {
      setStatus("error");
      toast.error("Couldn't send that. Please try again in a moment.");
    }
  }

  if (status === "done") {
    return (
      <p className="mt-6 flex items-start gap-2 rounded-xl border border-white/25 bg-white/10 p-4 text-sm font-semibold text-on-ink">
        <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-primary-glow" aria-hidden="true" />
        Thanks! We've got your details and we'll be in touch within 1 business day.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-6 border-t border-white/15 pt-6">
      <p className="text-sm font-semibold text-on-ink">
        Prefer we call you? Leave your details and we'll reach out.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <div>
          <Label htmlFor="qc-name" className="text-on-ink-muted">
            Name
          </Label>
          <Input
            id="qc-name"
            name="qc-name"
            className="mt-2 border-white/25 bg-white/10 text-on-ink placeholder:text-on-ink-muted"
            placeholder="Jane Smith"
          />
        </div>
        <div>
          <Label htmlFor="qc-email" className="text-on-ink-muted">
            Email
          </Label>
          <Input
            id="qc-email"
            name="qc-email"
            type="email"
            className="mt-2 border-white/25 bg-white/10 text-on-ink placeholder:text-on-ink-muted"
            placeholder="jane@business.co.uk"
          />
        </div>
        <div>
          <Label htmlFor="qc-phone" className="text-on-ink-muted">
            Phone
          </Label>
          <Input
            id="qc-phone"
            name="qc-phone"
            type="tel"
            className="mt-2 border-white/25 bg-white/10 text-on-ink placeholder:text-on-ink-muted"
            placeholder="07123 456789"
          />
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4">
        <Button type="submit" variant="hero" disabled={status === "sending"}>
          {status === "sending" && <Loader2 className="animate-spin" aria-hidden="true" />}
          {status === "sending" ? "Sending…" : "Ask us to call back"}
        </Button>
        <span aria-live="polite" className="text-sm font-semibold">
          {error && <span className="text-destructive">{error}</span>}
          {status === "error" && !error && (
            <span className="text-destructive">
              Couldn't send that. Please try again in a moment.
            </span>
          )}
        </span>
      </div>
    </form>
  );
}


export function ServicesPicker({
  selected,
  onSelect,
  showHuman,
}: {
  selected: ServiceId | null;
  onSelect: (id: ServiceId) => void;
  showHuman: boolean;
}) {
  return (
    <section id="services" className="section-ink relative overflow-hidden py-24">
      <div className="hero-glow absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <Reveal className="max-w-2xl">
            <p className="text-sm font-semibold tracking-[0.2em] text-on-ink-muted uppercase">
              Services
            </p>
            <h2 className="mt-4 heading-2 font-extrabold text-on-ink">
              Six ways we help UK local businesses get found and get chosen.
            </h2>
            <p className="mt-4 text-on-ink-muted">
              Choose the closest fit, then leave your details below and we'll take it from there. Not sure? Say so and we'll work it out together on the call.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="relative mx-auto w-[82%] max-w-xs sm:max-w-sm lg:w-full lg:max-w-none">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl border border-white/12 shadow-[var(--shadow-card)]">
                <picture className="contents">
                  <source srcSet={workstationPhotoWebp} type="image/webp" />
                  <img
                    src={workstationPhoto}
                    alt="A design and development workspace, showing the site-build and UI/UX work Alpha Presence does for every project"
                    loading="lazy"
                    decoding="async"
                    className="photo-breathe size-full object-cover"
                  />
                </picture>
              </div>
              <span className="absolute -bottom-4 right-4 max-w-[calc(100%-2rem)] rounded-xl border border-white/15 bg-ink/85 px-3.5 py-2 text-xs leading-snug font-bold text-on-ink shadow-[var(--shadow-card)] backdrop-blur-sm">
                Design, build &amp; UI/UX
              </span>
            </div>
          </Reveal>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s, i) => {
            const active = selected === s.id;
            const fallback = s.id === "other";
            return (
              <Reveal key={s.id} delay={i * 80} bounce>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => onSelect(s.id)}
                  className={cn(
                    "group h-full w-full cursor-pointer rounded-2xl border p-7 text-left transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    "border-white/12 bg-white/5 backdrop-blur-sm hover:-translate-y-1.5 hover:border-white/35 hover:bg-white/10",
                    fallback && "border-dashed border-white/20 bg-white/[0.03]",
                    active &&
                      "border-solid border-primary-glow bg-white/15 shadow-[var(--shadow-glow)] -translate-y-1",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="font-display text-3xl leading-none font-extrabold text-primary-glow sm:text-4xl">
                      {String(i + 1).padStart(2, "0")}
                      <span className="text-on-ink-muted/60">/{String(SERVICES.length).padStart(2, "0")}</span>
                    </span>
                    {active ? (
                      <span className="grid size-6 shrink-0 place-items-center rounded-full bg-primary">
                        <Check className="size-3.5 text-primary-foreground" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="grid size-11 shrink-0 place-items-center rounded-full border border-white/20 bg-white/10 text-on-ink">
                        <s.icon className="size-5" aria-hidden="true" />
                      </span>
                    )}
                  </div>
                  <h3 className="mt-8 heading-3 font-bold text-on-ink">{s.title}</h3>
                  <p className="mt-2 text-sm text-on-ink-muted">{s.description}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary-glow">
                    {active ? "Selected" : fallback ? "Talk to us" : "Choose this"}
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </span>
                </button>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={320} className="mt-12">
          <h3 className="text-lg font-bold text-on-ink">
            What's included, and how long does each service take?
          </h3>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-white/12 bg-white/5 backdrop-blur-sm">
            <table className="w-full min-w-[38rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Alpha Presence services, what each includes, and typical delivery timeframe
              </caption>
              <thead>
                <tr className="border-b border-white/12 text-on-ink">
                  <th scope="col" className="px-5 py-3 font-bold">Service</th>
                  <th scope="col" className="px-5 py-3 font-bold">What's included</th>
                  <th scope="col" className="px-5 py-3 font-bold">Typical timeframe</th>
                </tr>
              </thead>
              <tbody>
                {SERVICE_TABLE.map((row) => (
                  <tr key={row.id} className="border-b border-white/8 last:border-0">
                    <th scope="row" className="px-5 py-4 align-top font-semibold text-on-ink">
                      {row.name}
                    </th>
                    <td className="px-5 py-4 align-top text-on-ink-muted">{row.includes}</td>
                    <td className="px-5 py-4 align-top whitespace-nowrap text-on-ink-muted">
                      {row.timeframe}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-sm text-on-ink-muted">
            Timeframes are typical ranges. Your exact scope, price and dates are confirmed after a
            free consultation.
          </p>
        </Reveal>

        {showHuman && (
          <div id="talk-to-a-human" className="glass-panel mt-3 rounded-2xl p-7">
            <div className="md:flex md:items-center md:justify-between md:gap-8">
              <div>
                <h3 className="text-xl font-extrabold text-on-ink">
                  Not sure what you need? Talk to a real person.
                </h3>
                <p className="mt-2 max-w-xl text-on-ink-muted">
                  No sales script. Leave your details and we will tell you honestly what would
                  make the biggest difference, even if that is nothing from us.
                </p>
              </div>
              {(SITE.whatsapp || SITE.phone) && (
                <div className="mt-5 flex flex-col gap-3 sm:flex-row md:mt-0 md:shrink-0">
                  {SITE.whatsapp && (
                    <Button variant="hero" size="lg" asChild>
                      <a
                        href={`https://wa.me/${SITE.whatsapp}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Chat with Alpha Presence on WhatsApp"
                      >
                        <MessageCircle aria-hidden="true" />
                        WhatsApp us
                      </a>
                    </Button>
                  )}
                  {SITE.phone && (
                    <Button variant="glass" size="lg" asChild>
                      <a href={`tel:${SITE.phoneHref || SITE.phone}`} aria-label="Call Alpha Presence">
                        <Phone aria-hidden="true" />
                        {SITE.phone}
                      </a>
                    </Button>
                  )}
                </div>
              )}
            </div>
            <QuickContact />
          </div>
        )}

      </div>
    </section>
  );
}
