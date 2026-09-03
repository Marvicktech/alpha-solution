import { ArrowUpRight } from "lucide-react";
import onomzSite from "@/assets/onomz-site.jpg";

export function WorkShowcase() {
  return (
    <div className="ambient-float">
      <p className="mb-3 text-xs font-bold tracking-widest uppercase text-on-ink-muted">
        Recent work · Built by Alpha Presence
      </p>

      <a
        href="https://onomzinvestments.co.uk"
        target="_blank"
        rel="noopener noreferrer"
        className="group block overflow-hidden rounded-2xl border border-white/15 bg-white/5 shadow-[var(--shadow-glow)] backdrop-blur-md transition-all duration-300 hover:border-white/30"
        aria-label="View the ONOMZ website, built by Alpha Presence (opens in a new tab)"
      >
        <div className="flex items-center gap-2 border-b border-white/10 bg-white/10 px-3 py-2.5">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#28c840]" aria-hidden="true" />
          <span className="ml-2 truncate rounded-md bg-black/30 px-2.5 py-1 text-[11px] text-on-ink-muted">
            onomzinvestments.co.uk
          </span>
        </div>

        <div className="relative">
          <img
            src={onomzSite}
            alt="Homepage of ONOMZ, a natural hair and braiding salon in Aberdeen, Scotland, built by Alpha Presence"
            width={1280}
            height={720}
            loading="lazy"
            decoding="async"
            className="block w-full transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <span className="pointer-events-none absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-ink/80 px-3 py-1.5 text-xs font-semibold text-on-ink opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            View live site
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </span>
        </div>
      </a>

      <p className="mt-3 text-xs text-on-ink-muted/80">
        ONOMZ — natural hair &amp; braiding salon, Aberdeen, Scotland.
      </p>
    </div>
  );
}
