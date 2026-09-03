import { cn } from "@/lib/utils";
import logoMark from "@/assets/logo-mark.png";

/**
 * Alpha Presence identity: the real logo mark (a transparent PNG supplied
 * by the client — background removed), paired with the "Presence"
 * wordmark. The mark's own pink is fixed regardless of tone, so it reads
 * the same on dark and light surfaces.
 */
export function Wordmark({
  tone = "ink",
  className,
  showMark = true,
}: {
  tone?: "ink" | "light";
  className?: string;
  showMark?: boolean;
}) {
  const dark = tone === "ink";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-[0.45em] leading-none whitespace-nowrap",
        "text-lg sm:text-xl",
        className,
      )}
      aria-label="Alpha Presence"
    >
      {showMark && (
        <img
          src={logoMark}
          alt=""
          aria-hidden="true"
          className="h-[1.5em] w-[1.5em] shrink-0 object-contain"
        />
      )}
      <span
        className={cn(
          "font-semibold tracking-[0.02em]",
          dark ? "text-on-ink" : "text-foreground",
        )}
      >
        Presence
      </span>
    </span>
  );
}
