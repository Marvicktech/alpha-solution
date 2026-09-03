import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Team sign in | Alpha Presence" },
      { name: "description", content: "Private sign in for the Alpha Presence team." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Team sign in | Alpha Presence" },
      { property: "og:description", content: "Private sign in for the Alpha Presence team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      if (data.session) navigate({ to: "/admin", replace: true });
      else setChecking(false);
    });
    return () => {
      active = false;
    };
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (signInError) {
      setError(
        signInError.message === "Invalid login credentials"
          ? "Those details don't match an account. Check your email and password."
          : signInError.message,
      );
      return;
    }
    navigate({ to: "/admin", replace: true });
  }

  async function handleReset() {
    setError(null);
    setNotice(null);
    if (!email.trim()) {
      setError("Enter your email address first, then click Forgot password.");
      return;
    }
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/admin/login`,
    });
    if (resetError) setError(resetError.message);
    else setNotice("If that email has an account, a password reset link is on its way.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink px-4 py-16">
      <div className="pointer-events-none absolute inset-0" style={{ background: "var(--gradient-hero)" }} />
      <div className="relative w-full max-w-sm rounded-2xl border border-white/15 bg-white/[0.07] p-8 backdrop-blur-md">
        <div className="mb-6 flex items-center gap-2 text-on-ink">
          <ShieldCheck className="h-5 w-5 text-primary-glow" aria-hidden="true" />
          <span className="text-sm font-semibold tracking-tight">Alpha Presence · Team</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-on-ink">Sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-on-ink-muted">
          Private area for managing consultation requests.
        </p>

        {checking ? (
          <div className="mt-8 flex justify-center">
            <Loader2 className="h-5 w-5 animate-spin text-on-ink-muted" aria-hidden="true" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-on-ink">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-white/20 bg-white/10 text-on-ink placeholder:text-on-ink-muted/70"
                placeholder="you@alphapresence.co.uk"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-on-ink">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-white/20 bg-white/10 text-on-ink placeholder:text-on-ink-muted/70"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-red-400/40 bg-red-500/15 px-3 py-2 text-sm text-red-100">
                {error}
              </p>
            )}
            {notice && (
              <p role="status" className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-sm text-on-ink">
                {notice}
              </p>
            )}

            <Button type="submit" variant="hero" className="w-full" disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : "Sign in"}
            </Button>

            <button
              type="button"
              onClick={handleReset}
              className="w-full text-center text-sm text-on-ink-muted underline-offset-4 hover:text-on-ink hover:underline"
            >
              Forgot password?
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
