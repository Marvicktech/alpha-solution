import { CalendarCheck } from "lucide-react";
import { Reveal } from "./Reveal";
import { LiveBookingCalendar } from "./LiveBookingCalendar";

export function BookingForm() {
  return (
    <section id="book" className="bg-background py-24" aria-labelledby="book-heading">
      <div className="mx-auto max-w-4xl px-5">
        <Reveal className="text-center">
          <span className="inline-grid size-12 place-items-center rounded-2xl bg-accent text-accent-foreground">
            <CalendarCheck className="size-6" aria-hidden="true" />
          </span>
          <h2 id="book-heading" className="mt-5 heading-2 font-extrabold">
            Book your free consultation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Thirty minutes, no obligation. Pick a time below — you'll get an instant confirmation
            by email, and if anything ever needs to change, we'll email you about that too.
          </p>
        </Reveal>

        <Reveal delay={80} className="mt-8">
          <LiveBookingCalendar />
        </Reveal>
      </div>
    </section>
  );
}
