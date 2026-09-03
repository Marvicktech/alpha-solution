import { useEffect, useRef, useState } from "react";

/**
 * Animates the numeric parts of a stat string (e.g. "99%", "2–4", "1 in 5")
 * counting up when it scrolls into view. Honours prefers-reduced-motion.
 */
export function CountUp({ value, duration = 1200 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      setProgress(1);
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          io.disconnect();
          const start = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - start) / duration);
            // ease-out cubic
            setProgress(1 - Math.pow(1 - t, 3));
            if (t < 1) raf = requestAnimationFrame(tick);
          };
          raf = requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [duration]);

  const rendered = value.replace(/\d+/g, (n) => String(Math.round(Number(n) * progress)));

  return (
    <span ref={ref} aria-label={value}>
      <span aria-hidden="true">{rendered}</span>
    </span>
  );
}
