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
import { Loader2 } from "lucide-react";
import {
  STATUS_OPTIONS,
  formatDateTime,
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
}: {
  request: ConsultationRequest | null;
  onClose: () => void;
  onSave: (id: string, patch: { status?: string; notes?: string | null }) => Promise<void>;
}) {
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedAt, setSavedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setNotes(request?.notes ?? "");
    setSavedAt(null);
    setError(null);
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
