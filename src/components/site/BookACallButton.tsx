import type { ReactNode } from "react";
import { CalendarDays } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { track } from "@/lib/analytics";

// Your live Cal.com booking page. Cal.com's booking pages render fine inside
// a plain iframe — ?embed=true just trims their own header/footer chrome so
// it looks native inside our modal instead of like an external site.
const CAL_BOOKING_URL = "https://cal.com/alphapresenced/30min";

/**
 * A button that opens your real Cal.com calendar in a popup so visitors can
 * pick a slot and book instantly, without leaving the site or filling in the
 * longer consultation form first. Cal.com sends the booking confirmation
 * (and any later reschedule/cancellation) emails to both you and the visitor
 * automatically — nothing extra to wire up for that part.
 */
export function BookACallButton({
  location,
  children,
  variant = "hero",
  size = "xl",
  className,
}: {
  location: string;
  children?: ReactNode;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  className?: string;
}) {
  return (
    <Dialog onOpenChange={(open) => open && track("calendar_popup_open", { location })}>
      <DialogTrigger asChild>
        <Button variant={variant} size={size} className={className} data-magnetic>
          <CalendarDays aria-hidden="true" />
          {children ?? "See my calendar & book instantly"}
        </Button>
      </DialogTrigger>
      <DialogContent className="flex h-[85vh] max-w-2xl flex-col gap-0 p-0 sm:h-[80vh]">
        <DialogHeader className="border-b border-border px-5 py-4 text-left">
          <DialogTitle>Pick a time that works</DialogTitle>
          <DialogDescription>
            Live availability from my calendar — choose a slot and you're booked instantly.
          </DialogDescription>
        </DialogHeader>
        <iframe
          src={`${CAL_BOOKING_URL}?embed=true`}
          title="Book a call with Alpha Presence"
          className="w-full flex-1 border-0"
          loading="lazy"
        />
      </DialogContent>
    </Dialog>
  );
}
