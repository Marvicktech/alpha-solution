import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Inbox, LogOut, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";

export function AdminShell({ email, children }: { email: string; children: ReactNode }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", replace: true });
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-30 border-b border-border bg-card">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 px-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" aria-hidden="true" />
            <span className="text-sm font-semibold tracking-tight">Alpha Presence Admin</span>
          </div>
          <nav className="hidden items-center gap-1 sm:flex" aria-label="Admin sections">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-xs font-medium text-accent-foreground">
              <Inbox className="h-3.5 w-3.5" aria-hidden="true" />
              Consultation requests
            </span>
          </nav>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-xs text-muted-foreground md:inline">{email}</span>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
    </div>
  );
}
