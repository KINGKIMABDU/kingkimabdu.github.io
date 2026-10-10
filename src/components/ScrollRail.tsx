"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import {
  SECTIONS,
  goToSection,
  useActiveSection,
  type SectionId,
} from "@/lib/sections";

type Mark = { id: SectionId; label: string; at: number };

/* Where each section starts, as a fraction of the scrollable height, which
   is the same unit the bead rides on, so a tick sits exactly where the bead
   will be when that section is at the top. Re-measured whenever the page
   changes height (fonts landing, images, the viewport resizing). */
function useSectionMarks() {
  const [marks, setMarks] = useState<Mark[]>([]);

  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      setMarks(
        SECTIONS.map((s) => {
          const el = document.getElementById(s.id);
          const top = el ? el.getBoundingClientRect().top + window.scrollY : 0;
          return { ...s, at: Math.min(1, Math.max(0, top / max)) };
        })
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    /* The intro holds the page still with overflow:hidden on <body>, and
       while it does there is nothing to scroll, so nothing to measure.
       Lifting it changes no element's size, so the ResizeObserver never
       hears about it; watching the style attribute does. */
    const mo = new MutationObserver(measure);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return marks;
}

/* Entering a section says its name once, beside the rail, then lets it go.
   It's the only place the page tells you where you are without being asked. */
function useFlash(active: SectionId | null) {
  // the last section whose name has already been shown and let go
  const [spent, setSpent] = useState<SectionId | null>(null);
  useEffect(() => {
    if (!active) return;
    const t = window.setTimeout(() => setSpent(active), 1800);
    return () => window.clearTimeout(t);
  }, [active]);
  return active !== spent ? active : null;
}

/* Flags <html> while the page is moving so the cursor can switch to its
   scroll state, and clears it once things settle. */
function useScrollingFlag() {
  useEffect(() => {
    const root = document.documentElement;
    let idle: number | undefined;

    const onScroll = () => {
      root.classList.add("is-scrolling");
      window.clearTimeout(idle);
      idle = window.setTimeout(() => root.classList.remove("is-scrolling"), 320);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(idle);
      root.classList.remove("is-scrolling");
    };
  }, []);
}

/**
 * Replaces the native scrollbar (hidden in globals.css) with a hairline rail
 * in the site's own palette: a matcha fill that grows top-down, plus a bead
 * that rides the current position. Click or drag anywhere along it to scrub.
 *
 * It is also the menu. Each section is a tick on the rail; hover the rail and
 * their names slide out beside the ticks, click one to go there. There is no
 * bar across the top of the page any more, only the wordmark.
 */
export default function ScrollRail() {
  useScrollingFlag();
  const marks = useSectionMarks();
  const active = useActiveSection();
  const flash = useFlash(active);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 36,
    restDelta: 0.001,
  });
  const beadTop = useTransform(progress, (v) => `${v * 100}%`);

  const railRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const scrubTo = useCallback((clientY: number) => {
    const rail = railRef.current;
    if (!rail) return;
    const box = rail.getBoundingClientRect();
    const fraction = Math.min(
      1,
      Math.max(0, (clientY - box.top) / box.height)
    );
    const max =
      document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top: fraction * max });
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // html has scroll-behavior: smooth, which would make every drag frame
    // animate and lag a long way behind the pointer
    document.documentElement.style.scrollBehavior = "auto";
    // capture can legitimately fail (stale pointer id); the drag still works
    // off the element's own move events, so never let it throw
    try {
      railRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    setDragging(true);
    scrubTo(e.clientY);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) scrubTo(e.clientY);
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging) return;
    try {
      railRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    setDragging(false);
    document.documentElement.style.scrollBehavior = "";
  };

  return (
    <div
      ref={railRef}
      className="scroll-rail"
      data-dragging={dragging}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
    >
      <div className="scroll-rail__track">
        <motion.span
          className="scroll-rail__thumb"
          style={{ height: "100%", scaleY: progress }}
        />
        <motion.span className="scroll-rail__bead" style={{ top: beadTop }} />

        <nav aria-label="Sections">
          {marks.map((m) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className="rail-mark"
              style={{ top: `${m.at * 100}%` }}
              data-active={active === m.id}
              data-flash={flash === m.id}
              aria-current={active === m.id ? "location" : undefined}
              /* a press on a name is a jump, not the start of a scrub */
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => goToSection(e, m.id)}
            >
              <span className="rail-mark__tick" aria-hidden="true" />
              <span className="rail-mark__label">{m.label}</span>
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}
