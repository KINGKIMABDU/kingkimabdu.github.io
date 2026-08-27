"use client";

/*
 * ============================================================================
 * TEMPORARY. Delete this file and its mount in src/app/page.tsx once the iPad
 * animation freeze is diagnosed. It is not part of the site and only renders
 * for ?diag=1, so an ordinary visitor never sees it.
 * ============================================================================
 *
 * Two different faults produce the same symptom — "animations only move while
 * I scroll" — and they need opposite fixes:
 *
 *   A. iOS suspended requestAnimationFrame. The animation clock stopped.
 *   B. iOS kept running requestAnimationFrame but stopped painting. The clock
 *      ran on the whole time; the screen was just stale.
 *
 * HOW TO READ IT
 *   1. Open the site on the iPad with ?diag=1 on the end of the URL.
 *   2. Press Reset, then do not touch the screen for 10 seconds.
 *   3. Scroll, then read "longest rAF gap".
 *
 *   longest gap ~10s   -> A: the loop was suspended.
 *   longest gap ~16ms  -> B: the loop ran fine and the screen was stale. The
 *                         tick count will also have jumped by several hundred
 *                         the instant you scrolled.
 *
 * "timer ticks" is a setInterval running alongside. If rAF stalls while the
 * timer keeps counting, a timer-driven fallback loop is a viable fix. If both
 * stall together the whole page was suspended and no loop can help.
 */

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

type Sample = {
  rafTicks: number;
  timerTicks: number;
  longestGapMs: number;
  lastGapMs: number;
  elapsedMs: number;
  contextLost: boolean;
  pointer: string;
  /* Longest stretch where the wall clock advanced but the document's
     animation timeline did not — i.e. the browser stopped producing frames
     at all, rather than merely skipping rAF callbacks. */
  maxPaintStallMs: number;
};

const ZERO: Sample = {
  rafTicks: 0,
  timerTicks: 0,
  longestGapMs: 0,
  lastGapMs: 0,
  elapsedMs: 0,
  contextLost: false,
  pointer: "—",
  maxPaintStallMs: 0,
};

const subscribeNothing = () => () => {};

export default function Diagnostics() {
  const on = useSyncExternalStore(
    subscribeNothing,
    () => window.location.search.includes("diag=1"),
    () => false
  );
  if (!on) return null;
  return <Panel />;
}

/*
 * What is sitting below the footer. Walks every element and finds the one
 * whose bottom edge reaches furthest down the document — that is whatever is
 * stretching the page past its last section and leaving blank space under the
 * footer. Run on demand; it is far too expensive for a loop.
 */
function findOverhang() {
  const doc = document.documentElement;
  const footer = document.querySelector("footer");
  const footerBottom = footer
    ? Math.round(footer.getBoundingClientRect().bottom + window.scrollY)
    : 0;

  let worst: Element | null = null;
  let worstBottom = 0;
  for (const el of Array.from(document.body.querySelectorAll("*"))) {
    const style = getComputedStyle(el);
    if (style.position === "fixed" || style.display === "none") continue;
    const bottom = el.getBoundingClientRect().bottom + window.scrollY;
    if (bottom > worstBottom) {
      worstBottom = bottom;
      worst = el;
    }
  }

  const name = worst
    ? `${worst.tagName.toLowerCase()}${
        typeof worst.className === "string" && worst.className
          ? "." + worst.className.trim().split(/\s+/).slice(0, 2).join(".")
          : ""
      }`
    : "—";

  return [
    `scrollHeight ${doc.scrollHeight}`,
    `footer ends ${footerBottom}`,
    `gap below footer ${doc.scrollHeight - footerBottom}px`,
    `lowest: ${name} @ ${Math.round(worstBottom)}`,
  ].join("\n");
}

function Panel() {
  const [sample, setSample] = useState<Sample>(ZERO);
  const [resetAt, setResetAt] = useState(0);
  const [overhang, setOverhang] = useState("");

  const live = useRef<Sample>({ ...ZERO });
  const startedAt = useRef(0);
  const lastRaf = useRef(0);

  useEffect(() => {
    const now = performance.now();
    live.current = { ...ZERO };
    startedAt.current = now;
    lastRaf.current = now;

    let raf = 0;
    const onFrame = () => {
      const t = performance.now();
      const gap = t - lastRaf.current;
      lastRaf.current = t;

      const s = live.current;
      s.rafTicks += 1;
      s.lastGapMs = gap;
      // the first frame after a reset is not a real gap
      if (s.rafTicks > 1 && gap > s.longestGapMs) s.longestGapMs = gap;
      s.elapsedMs = t - startedAt.current;

      raf = requestAnimationFrame(onFrame);
    };
    raf = requestAnimationFrame(onFrame);

    /*
     * The discriminator, measured rather than eyeballed.
     *
     * document.timeline.currentTime is the clock every CSS animation and
     * transition runs on, and it only advances when the browser actually
     * produces a frame. performance.now() is the wall clock and keeps going
     * regardless. This interval survives the stall (96% of ticks, measured),
     * so it can watch the two drift apart:
     *
     *   both advance together -> frames are still being produced, and only
     *     the rAF callbacks are being skipped. A JS-side fix can work.
     *   wall clock moves, timeline does not -> the browser has stopped
     *     rendering the page entirely. Nothing written in JS can help, and
     *     the answer is to stop looking idle / expensive.
     */
    let lastWall = now;
    let lastTimeline = Number(document.timeline.currentTime ?? 0);
    let paintStall = 0;

    const timer = window.setInterval(() => {
      const s = live.current;
      s.timerTicks += 1;

      const wall = performance.now();
      const timeline = Number(document.timeline.currentTime ?? 0);
      const dWall = wall - lastWall;
      const dTimeline = timeline - lastTimeline;
      lastWall = wall;
      lastTimeline = timeline;

      // timeline moved less than a fifth of real time => frames were dropped
      if (dWall > 50 && dTimeline < dWall * 0.2) {
        paintStall += dWall;
        if (paintStall > s.maxPaintStallMs) s.maxPaintStallMs = paintStall;
      } else {
        paintStall = 0;
      }
    }, 100);

    const onLost = () => {
      live.current.contextLost = true;
    };
    const onPointer = (event: PointerEvent) => {
      live.current.pointer = event.pointerType;
    };
    window.addEventListener("webglcontextlost", onLost, true);
    window.addEventListener("pointerdown", onPointer, {
      capture: true,
      passive: true,
    });

    // the readout repaints on its own slow timer, so the panel is not itself
    // what is being measured
    const paint = window.setInterval(
      () => setSample({ ...live.current }),
      250
    );

    /* Measured once the page has settled rather than behind a button, so the
       answer is simply on screen when someone looks. Walking every element is
       far too expensive to repeat, hence the single shot. */
    const layout = window.setTimeout(() => setOverhang(findOverhang()), 2500);

    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(timer);
      window.clearInterval(paint);
      window.clearTimeout(layout);
      window.removeEventListener("webglcontextlost", onLost, true);
      window.removeEventListener("pointerdown", onPointer, true);
    };
  }, [resetAt]);

  const seconds = sample.elapsedMs / 1000;
  const fps = seconds > 0 ? sample.rafTicks / seconds : 0;

  const paintDied = sample.maxPaintStallMs > 700;
  const rafDied = sample.longestGapMs > 700;
  const verdict =
    seconds < 8
      ? "keep watching…"
      : paintDied
        ? "B — PAINTING STOPPED (no JS fix)"
        : rafDied
          ? "A — rAF only; painting alive"
          : "no stall seen yet";

  const rows: [string, string][] = [
    ["rAF ticks", String(sample.rafTicks)],
    ["timer ticks (100ms)", String(sample.timerTicks)],
    ["PAINT frozen for", `${sample.maxPaintStallMs.toFixed(0)} ms`],
    ["longest rAF gap", `${sample.longestGapMs.toFixed(0)} ms`],
    ["last rAF gap", `${sample.lastGapMs.toFixed(0)} ms`],
    ["elapsed", `${seconds.toFixed(1)} s`],
    ["average fps", fps.toFixed(1)],
    ["webgl context lost", sample.contextLost ? "YES" : "no"],
    ["last pointer", sample.pointer],
    ["devicePixelRatio", String(window.devicePixelRatio)],
    ["viewport", `${window.innerWidth}x${window.innerHeight}`],
    [
      "reduced motion",
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "ON"
        : "off",
    ],
    [
      "pointer: coarse",
      window.matchMedia("(pointer: coarse)").matches ? "yes" : "no",
    ],
    ["hover: hover", window.matchMedia("(hover: hover)").matches ? "yes" : "no"],
  ];

  return (
    <div
      style={{
        position: "fixed",
        top: 8,
        left: 8,
        zIndex: 200,
        maxWidth: "min(23rem, calc(100vw - 16px))",
        padding: "10px 12px",
        borderRadius: 12,
        background: "rgba(10,12,8,0.92)",
        color: "#dfe6d2",
        font: "12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace",
        boxShadow: "0 10px 30px -12px rgba(0,0,0,0.8)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <strong style={{ fontSize: 11, letterSpacing: "0.14em" }}>DIAG</strong>
        {/* a pure CSS animation, to compare against the JS loops */}
        <span
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: 2,
            background: "#a7bc8f",
            animation: "diag-spin 1.4s linear infinite",
          }}
        />
        <button
          type="button"
          onClick={() => setOverhang(findOverhang())}
          style={{
            marginLeft: "auto",
            padding: "3px 10px",
            borderRadius: 999,
            border: "1px solid #4a5936",
            background: "transparent",
            color: "inherit",
            font: "inherit",
          }}
        >
          Layout
        </button>
        <button
          type="button"
          onClick={() => setResetAt((n) => n + 1)}
          style={{
            padding: "3px 10px",
            borderRadius: 999,
            border: "1px solid #4a5936",
            background: "transparent",
            color: "inherit",
            font: "inherit",
          }}
        >
          Reset
        </button>
      </div>

      {overhang ? (
        <pre
          style={{
            margin: "8px 0 0",
            padding: "6px 8px",
            borderRadius: 7,
            background: "#1b2015",
            whiteSpace: "pre-wrap",
            font: "inherit",
          }}
        >
          {overhang}
        </pre>
      ) : null}

      <p
        style={{
          margin: "8px 0",
          padding: "5px 8px",
          borderRadius: 7,
          background: "#26301b",
          color: "#ceefac",
        }}
      >
        {verdict}
      </p>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          {rows.map(([k, v]) => (
            <tr key={k}>
              <td style={{ opacity: 0.7, paddingRight: 8 }}>{k}</td>
              <td style={{ textAlign: "right", whiteSpace: "nowrap" }}>{v}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <style>{`@keyframes diag-spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
