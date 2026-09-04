import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Inbox, Loader2, Search } from "lucide-react";
import { RequestDetail } from "./RequestDetail";
import {
  STATUS_BADGE,
  STATUS_OPTIONS,
  SERVICE_OPTIONS,
  bookedThisWeek,
  fetchRequests,
  formatDateTime,
  serviceLabel,
  sourceLabel,
  statusLabel,
  updateRequest,
  type ConsultationRequest,
} from "./requests";
import { notifyStatusChange } from "./notifications.functions";
import { acceptBookingRequest, declineBookingRequest } from "./bookingActions.functions";

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}

export function RequestsDashboard() {
  const queryClient = useQueryClient();
  const sendStatusChangeEmail = useServerFn(notifyStatusChange);
  const acceptRequest = useServerFn(acceptBookingRequest);
  const declineRequest = useServerFn(declineBookingRequest);
  const [status, setStatus] = useState("all");
  const [service, setService] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["consultation_requests"],
    queryFn: fetchRequests,
  });

  const mutation = useMutation({
    mutationFn: ({
      id,
      patch,
    }: {
      id: string;
      patch: { status?: string; notes?: string | null; cal_booking_uid?: string | null };
    }) => updateRequest(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consultation_requests"] }),
  });

  const rows = useMemo(() => data ?? [], [data]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (status !== "all" && r.status !== status) return false;
      if (service !== "all" && r.service_interest !== service) return false;
      if (!q) return true;
      return [r.name, r.email, r.business_name ?? ""].some((v) => v.toLowerCase().includes(q));
    });
  }, [rows, status, service, search]);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight">Consultation requests</h1>
        <p className="text-sm text-muted-foreground">
          Every enquiry from the website, newest first.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <Stat label="Total requests" value={rows.length} />
        <Stat label="New / needs attention" value={rows.filter((r) => r.status === "new").length} />
        <Stat label="Booked this week" value={bookedThisWeek(rows)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            aria-label="Search requests"
            placeholder="Search name, email or business…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-full sm:w-40" aria-label="Filter by status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUS_OPTIONS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={service} onValueChange={setService}>
          <SelectTrigger className="w-full sm:w-56" aria-label="Filter by service interest">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All services</SelectItem>
            {SERVICE_OPTIONS.map((s) => (
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
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading requests…
          </div>
        ) : error ? (
          <p role="alert" className="px-4 py-16 text-center text-sm text-destructive">
            Couldn't load requests. Refresh and try again.
          </p>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-2 px-4 py-16 text-center">
            <Inbox className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">
              {rows.length === 0 ? "No requests yet" : "No requests match those filters"}
            </p>
            <p className="text-sm text-muted-foreground">
              {rows.length === 0
                ? "New enquiries from the website will appear here."
                : "Try clearing the search or filters."}
            </p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden md:table-cell">Business</TableHead>
                <TableHead className="hidden lg:table-cell">Contact</TableHead>
                <TableHead>Service</TableHead>
                <TableHead className="hidden sm:table-cell">Source</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden sm:table-cell">Submitted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r: ConsultationRequest) => (
                <TableRow
                  key={r.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Open request from ${r.name}`}
                  onClick={() => setSelectedId(r.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setSelectedId(r.id);
                    }
                  }}
                  className="cursor-pointer"
                >
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell className="hidden md:table-cell">{r.business_name || "—"}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <span className="block text-sm">{r.email}</span>
                    <span className="block text-xs text-muted-foreground">{r.phone || "—"}</span>
                  </TableCell>
                  <TableCell>{serviceLabel(r.service_interest)}</TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground">
                    {sourceLabel(r.source)}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
                        STATUS_BADGE[r.status] ?? STATUS_BADGE["closed"]
                      }`}
                    >
                      {statusLabel(r.status)}
                    </span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell whitespace-nowrap text-muted-foreground">
                    {formatDateTime(r.created_at)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <RequestDetail
        request={selected}
        onClose={() => setSelectedId(null)}
        onSave={async (id, patch) => {
          await mutation.mutateAsync({ id, patch });
          // Only status changes get an email out to the client — saving
          // internal notes shouldn't notify them.
          if (patch.status && selected) {
            try {
              await sendStatusChangeEmail({
                data: { name: selected.name, email: selected.email, status: patch.status },
              });
            } catch (e) {
              console.error("[RequestsDashboard] notifyStatusChange failed:", e);
            }
          }
        }}
        onAccept={async (request) => {
          if (!request.requested_start) {
            throw new Error("No requested time on this request — use the status dropdown instead.");
          }
          // Create the real Cal.com booking (and email the confirmed time)
          // FIRST — only mark this "booked" in Supabase once that succeeds,
          // so a Cal.com failure never leaves a request looking confirmed
          // when no meeting actually exists.
          const result = await acceptRequest({
            data: {
              name: request.name,
              email: request.email,
              start: request.requested_start,
              timeZone: "Europe/London",
            },
          });
          await mutation.mutateAsync({
            id: request.id,
            patch: { status: "booked", cal_booking_uid: result.uid },
          });
        }}
        onDecline={async (request) => {
          await declineRequest({ data: { name: request.name, email: request.email } });
          await mutation.mutateAsync({ id: request.id, patch: { status: "declined" } });
        }}
      />
    </div>
  );
}
