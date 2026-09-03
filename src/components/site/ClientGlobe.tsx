import { useState } from "react";

/**
 * Lightweight animated SVG globe (orthographic projection) with glowing pins
 * for the places Alpha Presence has worked with real clients.
 * Pure SVG/CSS — no runtime animation library. Reduced-motion aware via CSS.
 *
 * NOTE: unused after the redesign (Hero now uses a full-bleed video
 * background instead of the two-column globe layout). Left in place in case
 * it's needed again for a future section.
 */

const SIZE = 340;
const R = 128;
const CX = SIZE / 2;
const CY = SIZE / 2;
// Projection centred over north-west Europe so the client pins face the viewer.
const LAT0 = (52 * Math.PI) / 180;
const LON0 = (4 * Math.PI) / 180;
// Stylised magnification: real relative geography, spread out so the European
// pins are readable at this size.
const MAG = 5.5;
const AMBIENT_MAG = 1.5;

function project(latDeg: number, lonDeg: number) {
  const lat = (latDeg * Math.PI) / 180;
  const lon = (lonDeg * Math.PI) / 180;
  const dl = lon - LON0;
  const x = R * Math.cos(lat) * Math.sin(dl);
  const y = R * (Math.cos(LAT0) * Math.sin(lat) - Math.sin(LAT0) * Math.cos(lat) * Math.cos(dl));
  return { x: CX + x, y: CY - y };
}

function projectPin(latDeg: number, lonDeg: number, mag = MAG) {
  const p = project(latDeg, lonDeg);
  const dx = (p.x - CX) * mag;
  const dy = (p.y - CY) * mag;
  const d = Math.hypot(dx, dy);
  const max = R * 0.82;
  const k = d > max ? max / d : 1;
  return { x: CX + dx * k, y: CY + dy * k };
}

type Pin = {
  id: string;
  lat: number;
  lon: number;
  label: string;
  sub: string;
  href?: string;
};

const PINS: Pin[] = [
  {
    id: "aberdeen",
    lat: 57.15,
    lon: -2.09,
    label: "Onomz Investments",
    sub: "Aberdeen, Scotland",
    href: "https://onomzinvestments.co.uk",
  },
  {
    id: "sheffield",
    lat: 53.38,
    lon: -1.47,
    label: "S9 Direct Motor",
    sub: "Sheffield, England · DVSA-approved MOT centre",
    href: "https://s9directmotor.com",
  },
  { id: "denmark", lat: 56.0, lon: 10.0, label: "Client project", sub: "Denmark" },
];

// Unlabelled ambient glow points — decorative only, no client claims attached.
const AMBIENT: [number, number][] = [
  [48.9, 2.35],
  [40.4, -3.7],
  [52.4, 13.4],
  [59.3, 18.1],
  [45.5, 9.2],
  [50.1, 14.4],
];

const PARALLELS = [-60, -30, 0, 30, 60];
const MERIDIANS = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150];

function parallelPath(latDeg: number) {
  const pts: string[] = [];
  for (let lon = -180; lon <= 180; lon += 4) {
    const lat = (latDeg * Math.PI) / 180;
    const dl = (lon * Math.PI) / 180 - LON0;
    const cosC = Math.sin(LAT0) * Math.sin(lat) + Math.cos(LAT0) * Math.cos(lat) * Math.cos(dl);
    if (cosC < 0) {
      if (pts.length && pts[pts.length - 1] !== "GAP") pts.push("GAP");
      continue;
    }
    const p = project(latDeg, lon);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return segmentsToPath(pts);
}

function meridianPath(lonDeg: number) {
  const pts: string[] = [];
  for (let lat = -90; lat <= 90; lat += 3) {
    const l = (lat * Math.PI) / 180;
    const dl = (lonDeg * Math.PI) / 180 - LON0;
    const cosC = Math.sin(LAT0) * Math.sin(l) + Math.cos(LAT0) * Math.cos(l) * Math.cos(dl);
    if (cosC < 0) {
      if (pts.length && pts[pts.length - 1] !== "GAP") pts.push("GAP");
      continue;
    }
    const p = project(lat, lonDeg);
    pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
  }
  return segmentsToPath(pts);
}

function segmentsToPath(pts: string[]) {
  let d = "";
  let starting = true;
  for (const pt of pts) {
    if (pt === "GAP") {
      starting = true;
      continue;
    }
    d += `${starting ? "M" : "L"}${pt} `;
    starting = false;
  }
  return d.trim();
}

export function ClientGlobe({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className={className}>
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <svg
          viewBox={`0 0 ${SIZE} ${SIZE}`}
          role="img"
          aria-label="Stylised rotating globe marking client locations in Aberdeen, Sheffield and Denmark"
          className="h-full w-full"
        >
          <defs>
            <radialGradient id="globe-face" cx="35%" cy="30%">
              <stop offset="0%" stopColor="var(--primary-glow)" stopOpacity="0.42" />
              <stop offset="55%" stopColor="var(--primary)" stopOpacity="0.18" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.04" />
            </radialGradient>
            <radialGradient id="globe-halo" cx="50%" cy="50%">
              <stop offset="60%" stopColor="var(--primary)" stopOpacity="0" />
              <stop offset="85%" stopColor="var(--primary-glow)" stopOpacity="0.28" />
              <stop offset="100%" stopColor="var(--primary-glow)" stopOpacity="0" />
            </radialGradient>
            <clipPath id="globe-clip">
              <circle cx={CX} cy={CY} r={R} />
            </clipPath>
          </defs>

          <circle cx={CX} cy={CY} r={R + 22} fill="url(#globe-halo)" className="hg-breathe" />
          <circle cx={CX} cy={CY} r={R} fill="url(#globe-face)" />
          <circle
            cx={CX}
            cy={CY}
            r={R}
            fill="none"
            stroke="color-mix(in oklab, var(--primary-glow) 55%, transparent)"
            strokeWidth="1"
          />

          <g
            clipPath="url(#globe-clip)"
            stroke="color-mix(in oklab, var(--primary-glow) 34%, transparent)"
            strokeWidth="0.9"
            fill="none"
          >
            {PARALLELS.map((lat) => (
              <path key={`p${lat}`} d={parallelPath(lat)} />
            ))}
            <g className="globe-spin" style={{ transformOrigin: `${CX}px ${CY}px` }}>
              {MERIDIANS.map((lon) => (
                <path key={`m${lon}`} d={meridianPath(lon)} opacity="0.85" />
              ))}
            </g>
          </g>

          {/* ambient, unlabelled glow points */}
          <g>
            {AMBIENT.map(([lat, lon], i) => {
              const p = projectPin(lat, lon, AMBIENT_MAG);
              return (
                <circle
                  key={i}
                  cx={p.x}
                  cy={p.y}
                  r="2.4"
                  fill="var(--primary-glow)"
                  opacity="0.55"
                  className="hg-pulse"
                  style={{ animationDelay: `${i * 0.6}s`, transformOrigin: `${p.x}px ${p.y}px` }}
                />
              );
            })}
          </g>

          {/* client pins (visual layer) */}
          <g>
            {PINS.map((pin, i) => {
              const p = projectPin(pin.lat, pin.lon);
              return (
                <g key={pin.id}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="11"
                    fill="var(--primary)"
                    opacity="0.25"
                    className="hg-pulse"
                    style={{ animationDelay: `${i * 0.9}s`, transformOrigin: `${p.x}px ${p.y}px` }}
                  />
                  <circle cx={p.x} cy={p.y} r="4.5" fill="var(--primary-glow)" />
                </g>
              );
            })}
          </g>
        </svg>

        {/* interactive hit areas + tooltips */}
        {PINS.map((pin) => {
          const p = projectPin(pin.lat, pin.lon);
          const left = `${(p.x / SIZE) * 100}%`;
          const top = `${(p.y / SIZE) * 100}%`;
          const open = active === pin.id;
          const Tip = (
            <span className="block">
              <span className="block text-xs font-semibold text-on-ink">{pin.label}</span>
              <span className="block text-[11px] text-on-ink-muted">{pin.sub}</span>
              {pin.href ? (
                <span className="mt-0.5 block text-[11px] font-medium text-primary-glow">
                  Visit site →
                </span>
              ) : null}
            </span>
          );

          return (
            <div
              key={pin.id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left, top }}
              onMouseEnter={() => setActive(pin.id)}
              onMouseLeave={() => setActive((c) => (c === pin.id ? null : c))}
            >
              {pin.href ? (
                <a
                  href={pin.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onFocus={() => setActive(pin.id)}
                  onBlur={() => setActive(null)}
                  className="block size-7 rounded-full"
                  aria-label={`${pin.label}: ${pin.sub} (opens in a new tab)`}
                />
              ) : (
                <button
                  type="button"
                  onFocus={() => setActive(pin.id)}
                  onBlur={() => setActive(null)}
                  onClick={() => setActive((c) => (c === pin.id ? null : pin.id))}
                  className="block size-7 rounded-full"
                  aria-label={`${pin.label}: ${pin.sub}`}
                />
              )}

              <div
                role="tooltip"
                className={`glass-panel pointer-events-none absolute bottom-full left-1/2 z-10 mb-2 w-max max-w-[190px] -translate-x-1/2 rounded-xl px-3 py-2 text-left shadow-lg transition-all duration-200 ${
                  open ? "opacity-100" : "translate-y-1 opacity-0"
                }`}
              >
                {Tip}
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-4 text-center text-xs text-on-ink-muted">
        Trusted by businesses across the UK and beyond.
      </p>
    </div>
  );
}
