import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Wordmark } from "./Wordmark";
import { Button } from "@/components/ui/button";

/**
 * Simple, static header for standalone pages that aren't the single-page
 * homepage (e.g. /work/onomz-investments) — the real `Navbar` is deliberately
 * NOT reused here. Navbar's own links and its `onBook` scroll-into-view
 * behaviour are wired specifically for scrolling within the homepage's own
 * sections, not for a page that needs to navigate back to the homepage
 * first. Keeping this separate means subpages get a correct, working header
 * without touching the homepage's own (already tuned) navigation at all.
 */
export function SubpageHeader() {
  return (
    <header className="border-b border-border bg-background/95 py-4 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" aria-label="Alpha Presence home" className="inline-flex shrink-0">
          <Wordmark tone="ink" className="text-lg" />
        </Link>
        <div className="flex items-center gap-3">
          {/* Plain anchors (not TanStack's <Link>) — these cross from a
              standalone route back to a same-page anchor on the homepage,
              which a normal browser navigation handles correctly on its own
              (load "/", then scroll to the element with that id). */}
          <a
            href="/#work"
            className="hidden items-center gap-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            All work
          </a>
          <Button asChild variant="hero" size="sm">
            <a href="/#book">Book a free consultation</a>
          </Button>
        </div>
      </div>
    </header>
  );
}
