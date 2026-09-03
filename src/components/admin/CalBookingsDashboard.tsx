import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CalendarClock, Loader2, Search } from "lucide-react";
import { getCalBookings } from "./calBookings.functions";
import { BookingDetail } from "./BookingDetail";
import {
  CAL_STATUS_BADGE,
  CAL_STATUS_OPTIONS,
  calStatusLabel,
  formatBookingTime,
  primaryAttendee,
  thisWeekCount,
  upcomingCount,
  type CalBooking,
} from "./calBookings";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export function CalBookingsDashboard() {
  const getBookings = useServerFn(getCalBookings);
  const [status, setStatus] = useState<"upcoming" | "unconfirmed" | "past" | "cancelled">(
    "upcoming",
  );
  const [search, setSearch] = useState("");
  const [selectedUid, setSelectedUid] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["cal_bookings", status],
    queryFn: () => getBookings({ data: { status, limit: 100 } }),
  });

  const rows = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((b) => {
      const attendee = primaryAttendee(b);
      return [b.title, attendee?.name ?? "", attendee?.email ?? ""].some((v) =>
        v.toLowerCase().includes(q),
      );
    });
  }, [rows, search]);

  const selected = rows.find((b) => b.uid === selectedUid) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Cal.com bookings</h1>
        <p className="text-sm text-muted-foreground">
          Live from your Cal.com account, newest first.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Upcoming" value={upcomingCount(rows)} />
        <Stat label="This week" value={thisWeekCount(rows)} />
        <Stat
          label="Needs confirmation"
          value={rows.filter((b) => b.status === "pending").length}
        />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search bookings"
            placeholder="Search name or email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
          <SelectTrigger className="w-full sm:w-52" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CAL_STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading bookings…
          </div>
        ) : error ? (
          <p role="alert" className="px-4 py-16 text-center text-sm text-destructive">
            Couldn't load bookings. {error instanceof Error ? error.message : "Try refreshing."}
          </p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <CalendarClock className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">
              {rows.length === 0 ? "No bookings here yet" : "No bookings match that search"}
            </p>
            <p className="text-sm text-muted-foreground">
              {rows.length === 0
                ? "New Cal.com bookings will show up here automatically."
                : "Try a different search."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Attendee</TableHead>
                <TableHead className="hidden lg:table-cell">Email</TableHead>
                <TableHead>Event</TableHead>
                <TableHead>When</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b: CalBooking) => {
                const attendee = primaryAttendee(b);
                return (
                  <TableRow
                    key={b.uid}
                    tabIndex={0}
                    role="button"
                    aria-label={`Open booking with ${attendee?.name ?? "attendee"}`}
                    onClick={() => setSelectedUid(b.uid)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedUid(b.uid);
                      }
                    }}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">{attendee?.name ?? "—"}</TableCell>
                    <TableCell className="hidden lg:table-cell text-muted-foreground">
                      {attendee?.email ?? "—"}
                    </TableCell>
                    <TableCell>{b.title}</TableCell>
                    <TableCell className="whitespace-nowrap">{formatBookingTime(b.start)}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                          CAL_STATUS_BADGE[b.status] ?? CAL_STATUS_BADGE["rejected"]
                        }`}
                      >
                        {calStatusLabel(b.status)}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>

      <BookingDetail booking={selected} onClose={() => setSelectedUid(null)} />
    </div>
  );
}
