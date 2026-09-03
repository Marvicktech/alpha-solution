import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const INTERACTIVE =
  'a, button, [role="button"], input, select, textarea, summary, [data-cursor="interactive"]';

/**
 * Desktop-only custom cursor: instant dot + lagging ring, with magnetic pull
 * applied to elements marked with [data-magnetic].
 *
 * Rendered through a portal straight into <body> so no transformed ancestor
 * (hero, reveals, ambient-float) can capture the fixed positioning.
 */
export function CustomCursor() {
  const [mounted, setMounted] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [reduced, setReduced] = useState(false);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    // Loosened: `hover: hover` misreports on hybrid laptops / some trackpads.
    const fine = window.matchMedia("(pointer: fine)");
    const anyFine = window.matchMedia("(any-pointer: fine)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      setEnabled(fine.matches || anyFine.matches);
      setReduced(motion.matches);
    };
    sync();
    fine.addEventListener("change", sync);
    anyFine.addEventListener("change", sync);
    motion.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      anyFine.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled || !mounted) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("has-custom-cursor");

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let hovering = false;
    let visible = false;
    let magnetEl: HTMLElement | null = null;
    let raf = 0;

    const setVisible = (v: boolean) => {
      visible = v;
      dot.style.opacity = v && !hovering ? "1" : "0";
      ring.style.opacity = v ? "1" : "0";
    };

    const releaseMagnet = () => {
      if (magnetEl) {
        magnetEl.style.transition = "transform 350ms cubic-bezier(0.22,1,0.36,1)";
        magnetEl.style.transform = "";
        magnetEl = null;
      }
    };

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!visible) setVisible(true);

      const target = e.target as HTMLElement | null;
      const interactive = target?.closest?.(INTERACTIVE) as HTMLElement | null;
      const nextHover = Boolean(interactive);
      if (nextHover !== hovering) {
        hovering = nextHover;
        ring.classList.toggle("cursor-ring--active", hovering);
        dot.style.opacity = hovering ? "0" : "1";
      }

      if (reduced) return;

      const magnet = (target?.closest?.("[data-magnetic]") as HTMLElement | null) ?? null;
      if (magnet !== magnetEl) releaseMagnet();
      if (magnet) {
        magnetEl = magnet;
        const r = magnet.getBoundingClientRect();
        const dx = (mx - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (my - (r.top + r.height / 2)) / (r.height / 2);
        magnet.style.transition = "transform 150ms cubic-bezier(0.22,1,0.36,1)";
        magnet.style.transform = `translate(${(dx * 14).toFixed(2)}px, ${(dy * 10).toFixed(2)}px)`;
      }
    };

    const onLeave = () => {
      setVisible(false);
      releaseMagnet();
    };

    const onDown = () => {
      ring.classList.add("cursor-ring--pressed");
    };
    const onUp = () => {
      ring.classList.remove("cursor-ring--pressed");
    };

    const tick = () => {
      const ease = reduced ? 1 : 0.18;
      rx += (mx - rx) * ease;
      ry += (my - ry) * ease;
      dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };

    setVisible(false);
    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      releaseMagnet();
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, reduced, mounted]);

  if (!mounted || !enabled) return null;

  return createPortal(
    <div aria-hidden="true" className="cursor-layer">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>,
    document.body,
  );
}
