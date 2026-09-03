import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-reveal wrapper. When used directly inside a grid/list of siblings,
 * pass `stagger` on the parent's map index (e.g. `delay={i * 80}`) — or wrap
 * the whole group with `staggerChildren` below to get that spacing for free
 * without threading delay props through every call site.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
  bounce = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "li" | "article";
  /** Springy overshoot on the way in, instead of the default smooth ease-out. */
  bounce?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setShown(true);
            io.disconnect();
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={ref as any}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={cn("reveal", bounce && "reveal--bounce", shown && "is-revealed", className)}
    >
      {children}
    </Tag>
  );
}

/**
 * Wraps a grid/list of children and staggers each direct child's reveal by
 * `step` ms (default 80ms) instead of the whole group fading in as one block.
 * Each child still needs to be (or contain) a `Reveal`-style element that
 * reacts to inline `transition-delay` — pass the computed delay down via
 * `delay` on `Reveal`, or use this alongside `.reveal` class children.
 */
export function RevealGroup({
  children,
  step = 80,
  className,
}: {
  children: ReactNode[];
  step?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {children.map((child, i) => (
        <div key={i} style={{ transitionDelay: `${i * step}ms` }}>
          {child}
        </div>
      ))}
    </div>
  );
}
