import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import {
  CAL_STATUS_BADGE,
  calStatusLabel,
  formatBookingTime,
  primaryAttendee,
  type CalBooking,
} from "./calBookings";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm break-words">{value}</p>
    </div>
  );
}

export function BookingDetail({
  booking,
  onClose,
}: {
  booking: CalBooking | null;
  onClose: () => void;
}) {
  const attendee = booking ? primaryAttendee(booking) : null;

  return (
    <Sheet open={!!booking} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {booking && (
          <>
            <SheetHeader>
              <SheetTitle>{attendee?.name ?? "Booking"}</SheetTitle>
              <SheetDescription>
                {booking.title} · {formatBookingTime(booking.start)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-8">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" value={attendee?.email || "—"} />
                <Field label="Time zone" value={attendee?.timeZone || "—"} />
                <Field label="Duration" value={`${booking.duration} min`} />
                <Field label="Location" value={booking.location || "—"} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Status
                </p>
                <span
                  className={`mt-1 inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                    CAL_STATUS_BADGE[booking.status] ?? CAL_STATUS_BADGE["rejected"]
                  }`}
                >
                  {calStatusLabel(booking.status)}
                </span>
              </div>

              <p className="text-xs text-muted-foreground">
                To confirm, reschedule or cancel this booking, use Cal.com directly — this
                dashboard is a live view only.
              </p>

              <Button variant="outline" size="sm" asChild>
                <a
                  href={`https://app.cal.com/bookings/${booking.status === "cancelled" ? "cancelled" : "upcoming"}?booking=${booking.uid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  Open in Cal.com
                </a>
              </Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
