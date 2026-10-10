"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";
import {
  goToSection,
  useActiveSection,
  useSectionMarks,
  type SectionId,
} from "@/lib/sections";
import { isHoverPointer } from "@/lib/utils";

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

/* How far a finger has to travel on the rail before it counts as a drag.
   Under that it's a tap, and a tap opens the index instead of jumping. */
const TAP_SLOP = 8;

/**
 * Replaces the native scrollbar (hidden in globals.css) with a hairline rail
 * in the site's own palette: a matcha fill that grows top-down, plus a bead
 * that rides the current position. Drag along it to scrub.
 *
 * It is also the menu. Each section is a tick beside the rail; open the rail
 * and their names slide out next to the ticks, pick one to go there.
 *
 * "Open" is state, not :hover, because the ways in differ by input:
 *  - mouse, trackpad, and an Apple Pencil hovering over an iPad: pointer
 *    enters, it opens; pointer leaves, it closes.
 *  - a finger: tap the rail to open, tap a name to go, tap anywhere else to
 *    close. A finger *dragging* the rail still scrubs; only a tap opens.
 * CSS :hover can't tell those apart: iPadOS fires it on a tap and then never
 * lets go, which left the names stuck out over the page.
 */
export default function ScrollRail() {
  useScrollingFlag();
  const marks = useSectionMarks();
  const active = useActiveSection();
  const flash = useFlash(active);
  const activeIndex = marks.findIndex((m) => m.id === active);

  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 36,
    restDelta: 0.001,
  });
  const beadTop = useTransform(progress, (v) => `${v * 100}%`);

  const railRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);
  const [open, setOpen] = useState(false);
  /* a finger that has touched down but not yet moved far enough to drag */
  const touchStart = useRef<number | null>(null);

  // a tap anywhere off the rail puts the names away again
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!railRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

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

  const startDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    // html has scroll-behavior: smooth, which would make every drag frame
    // animate and lag a long way behind the pointer
    document.documentElement.style.scrollBehavior = "auto";
    setDragging(true);
    scrubTo(e.clientY);
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    // capture can legitimately fail (stale pointer id); the drag still works
    // off the element's own move events, so never let it throw
    try {
      railRef.current?.setPointerCapture(e.pointerId);
    } catch {}
    if (e.pointerType === "touch") {
      touchStart.current = e.clientY;
      return;
    }
    startDrag(e);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragging) {
      scrubTo(e.clientY);
    } else if (
      touchStart.current !== null &&
      Math.abs(e.clientY - touchStart.current) > TAP_SLOP
    ) {
      touchStart.current = null;
      setOpen(false);
      startDrag(e);
    }
  };

  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      railRef.current?.releasePointerCapture(e.pointerId);
    } catch {}
    if (touchStart.current !== null) {
      // never became a drag: it was a tap
      touchStart.current = null;
      if (e.type === "pointerup") setOpen((o) => !o);
    }
    if (!dragging) return;
    setDragging(false);
    document.documentElement.style.scrollBehavior = "";
  };

  return (
    <div
      ref={railRef}
      className="scroll-rail"
      data-dragging={dragging}
      data-open={open}
      onPointerEnter={(e) => isHoverPointer(e) && setOpen(true)}
      onPointerLeave={(e) => isHoverPointer(e) && !dragging && setOpen(false)}
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
          {marks.map((m, i) => (
            <a
              key={m.id}
              href={`#${m.id}`}
              className="rail-mark"
              style={{ top: `${m.at * 100}%` }}
              data-active={active === m.id}
              data-passed={activeIndex >= 0 && i < activeIndex}
              data-flash={flash === m.id}
              aria-current={active === m.id ? "location" : undefined}
              /* a press on a name is a jump, not the start of a scrub */
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                setOpen(false);
                goToSection(e, m.id);
              }}
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
