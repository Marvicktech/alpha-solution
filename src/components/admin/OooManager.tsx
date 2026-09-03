import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { endOfDay, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { CalendarOff, CalendarX2, Loader2, X } from "lucide-react";
import { createOooBlock, deleteOooBlock, getOooEntries } from "./calOoo.functions";
import {
  OOO_REASON_OPTIONS,
  formatBlockRange,
  isActiveOrUpcoming,
  oooReasonLabel,
  sortByStart,
  type CalOooEntry,
  type CalOooReason,
} from "./calOoo";

export function OooManager() {
  const queryClient = useQueryClient();
  const getEntries = useServerFn(getOooEntries);
  const createBlock = useServerFn(createOooBlock);
  const removeBlock = useServerFn(deleteOooBlock);

  const [range, setRange] = useState<DateRange | undefined>(undefined);
  const [reason, setReason] = useState<CalOooReason>("unspecified");
  const [notes, setNotes] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<CalOooEntry | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cal_ooo"],
    queryFn: () => getEntries({ data: {} }),
  });

  const rows = useMemo(() => sortByStart(data ?? []).filter(isActiveOrUpcoming), [data]);

  const createMutation = useMutation({
    mutationFn: () => {
      if (!range?.from) throw new Error("Pick a date first.");
      return createBlock({
        data: {
          start: startOfDay(range.from).toISOString(),
          end: endOfDay(range.to ?? range.from).toISOString(),
          reason,
          notes: notes.trim() || undefined,
        },
      });
    },
    onSuccess: () => {
      toast.success("That time is now blocked on Cal.com.");
      setRange(undefined);
      setReason("unspecified");
      setNotes("");
      queryClient.invalidateQueries({ queryKey: ["cal_ooo"] });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Couldn't block that time. Try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => removeBlock({ data: { id } }),
    onSuccess: () => {
      toast.success("Block removed — that time is bookable again.");
      setPendingDelete(null);
      queryClient.invalidateQueries({ queryKey: ["cal_ooo"] });
    },
    onError: (e) => {
      toast.error(e instanceof Error ? e.message : "Couldn't remove that block. Try again.");
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Availability</h1>
        <p className="text-sm text-muted-foreground">
          Block off a day or date range so it's removed from your Cal.com booking availability.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-4">
        <p className="mb-3 text-sm font-semibold">Block time off</p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
          <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start sm:w-64">
                <CalendarOff className="h-4 w-4" aria-hidden="true" />
                {range?.from
                  ? formatBlockRange(range.from.toISOString(), (range.to ?? range.from).toISOString())
                  : "Choose date(s)"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={range}
                onSelect={setRange}
                numberOfMonths={1}
                disabled={{ before: new Date() }}
              />
            </PopoverContent>
          </Popover>

          <Select value={reason} onValueChange={(v) => setReason(v as CalOooReason)}>
            <SelectTrigger className="w-full sm:w-48" aria-label="Reason">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {OOO_REASON_OPTIONS.map((r) => (
                <SelectItem key={r.value} value={r.value}>
                  {r.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => createMutation.mutate()}
            disabled={!range?.from || createMutation.isPending}
            className="sm:w-auto"
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              "Block this time"
            )}
          </Button>
        </div>

        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Note for yourself (optional) — e.g. \"Dentist appointment\""
          className="mt-3"
          rows={2}
        />
        <p className="mt-2 text-xs text-muted-foreground">
          This stops all Cal.com event types from being booked for the dates you pick — it doesn't
          cancel anything already booked in that window.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border px-4 py-3">
          <p className="text-sm font-semibold">Upcoming blocks</p>
        </div>
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading…
          </div>
        ) : error ? (
          <p role="alert" className="px-4 py-12 text-center text-sm text-destructive">
            Couldn't load your availability blocks. {error instanceof Error ? error.message : ""}
          </p>
        ) : rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
            <CalendarX2 className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">No time blocked right now</p>
            <p className="text-sm text-muted-foreground">
              Your full Cal.com availability is open to bookings.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {formatBlockRange(entry.start, entry.end)}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {oooReasonLabel(entry.reason)}
                    {entry.notes ? ` · ${entry.notes}` : ""}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Remove this block"
                  onClick={() => setPendingDelete(entry)}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove this block?</AlertDialogTitle>
            <AlertDialogDescription>
              {pendingDelete && formatBlockRange(pendingDelete.start, pendingDelete.end)} will become
              bookable again on Cal.com.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteMutation.isPending}
              onClick={() => pendingDelete && deleteMutation.mutate(pendingDelete.id)}
            >
              {deleteMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                "Remove block"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
