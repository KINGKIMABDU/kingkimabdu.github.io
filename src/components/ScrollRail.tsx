"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useScroll, useSpring, useTransform, motion } from "framer-motion";

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
 */
export default function ScrollRail() {
  useScrollingFlag();
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
      </div>
    </div>
  );
}
