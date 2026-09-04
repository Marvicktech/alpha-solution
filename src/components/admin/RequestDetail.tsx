import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarIcon, Check, Loader2, X } from "lucide-react";
import {
  STATUS_OPTIONS,
  formatDateTime,
  formatRequestedSlot,
  serviceLabel,
  sourceLabel,
  type ConsultationRequest,
} from "./requests";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-sm break-words">{value}</p>
    </div>
  );
}

export function RequestDetail({
  request,
  onClose,
  onSave,
  onAccept,
  onDecline,
}: {
  request: ConsultationRequest | null;
  onClose: () => void;
  onSave: (id: string, patch: { status?: string; notes?: string | null }) => Promise<void>;
  onAccept: (request: ConsultationRequest) => Promise<void>;
  onDecline: (request: ConsultationRequest) => Promise<void>;
}) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [deciding, setDeciding] = useState<"accept" | "decline" | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  useEffect(() => {
    setNotes(request?.notes ?? "");
    setSavedAt(null);
    setError(null);
    setDecisionError(null);
    setDeciding(null);
  }, [request?.id, request?.notes]);

  async function save(patch: { status?: string; notes?: string | null }) {
    if (!request) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(request.id, patch);
      setSavedAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  }

  async function handleAccept() {
    if (!request) return;
    setDeciding("accept");
    setDecisionError(null);
    try {
      await onAccept(request);
    } catch (e) {
      setDecisionError(e instanceof Error ? e.message : "Couldn't confirm this booking.");
    } finally {
      setDeciding(null);
    }
  }

  async function handleDecline() {
    if (!request) return;
    setDeciding("decline");
    setDecisionError(null);
    try {
      await onDecline(request);
    } catch (e) {
      setDecisionError(e instanceof Error ? e.message : "Couldn't send that decline.");
    } finally {
      setDeciding(null);
    }
  }

  const pending = request && request.status !== "booked" && request.status !== "declined";
  const requestedSlot = request ? formatRequestedSlot(request) : null;

  return (
    <Sheet open={!!request} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        {request && (
          <>
            <SheetHeader>
              <SheetTitle>{request.name}</SheetTitle>
              <SheetDescription>
                {sourceLabel(request.source)} · {formatDateTime(request.created_at)}
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-5 px-4 pb-8">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Email" value={request.email} />
                <Field label="Phone" value={request.phone || "—"} />
                <Field label="Business" value={request.business_name || "—"} />
                <Field label="Service" value={serviceLabel(request.service_interest)} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                  {request.message || "—"}
                </p>
              </div>

              {requestedSlot && (
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="flex items-center gap-2 text-sm font-semibold">
                    <CalendarIcon className="size-4 text-primary" aria-hidden="true" />
                    Requested: {requestedSlot}
                  </p>
                  {request.cal_booking_uid && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Confirmed on Cal.com — booking {request.cal_booking_uid}
                    </p>
                  )}

                  {pending && (
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <Button size="sm" onClick={handleAccept} disabled={deciding !== null}>
                        {deciding === "accept" ? (
                          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                        ) : (
                          <Check className="size-3.5" aria-hidden="true" />
                        )}
                        Accept &amp; confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleDecline}
                        disabled={deciding !== null}
                      >
                        {deciding === "decline" ? (
                          <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                        ) : (
                          <X className="size-3.5" aria-hidden="true" />
                        )}
                        Decline
                      </Button>
                    </div>
                  )}
                  {decisionError && (
                    <p role="alert" className="mt-2 text-sm text-destructive">
                      {decisionError}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={request.status} onValueChange={(v) => save({ status: v })}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal notes</Label>
                <Textarea
                  id="notes"
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  onBlur={() => notes !== (request.notes ?? "") && save({ notes })}
                  placeholder="Call outcome, next steps, quoted price…"
                />
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={() => save({ notes })} disabled={saving}>
                    {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" /> : "Save notes"}
                  </Button>
                  {savedAt && <span className="text-xs text-muted-foreground">Saved {savedAt}</span>}
                </div>
                {error && (
                  <p role="alert" className="text-sm text-destructive">
                    {error}
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
