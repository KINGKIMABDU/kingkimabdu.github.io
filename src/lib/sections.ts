"use client";

import { useEffect, useState } from "react";

/* The page's map, shared by the rail index and the touch index. Home is the
   wordmark, so it isn't listed. */
export const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Work" },
  { id: "stack", label: "Stack" },
  { id: "timeline", label: "Timeline" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

/* Which section owns the middle of the screen. A thin band across the centre
   rather than a threshold per section: one section crosses it at a time, so
   there's never two candidates. Above About it's the hero, which has no
   entry, so nothing is current. */
export function useActiveSection() {
  const [active, setActive] = useState<SectionId | null>(null);

  useEffect(() => {
    const els = ["home", ...SECTIONS.map((s) => s.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          setActive(e.target.id === "home" ? null : (e.target.id as SectionId));
        }
      },
      { rootMargin: "-45% 0px -54% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return active;
}

/* Go to a section from the index. Done by hand rather than left to the
   anchor: the native fragment jump was unreliable here (it would stop part
   way, or not start when the hash was already set), and this also honours
   reduced motion and each section's scroll-margin. The hash is still
   written, so the address bar and back button keep working. */
export function goToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  history.pushState(null, "", `#${id}`);
}

export type Mark = { id: SectionId; label: string; at: number };

/* Where each section starts, as a fraction of the scrollable height, which
   is the same unit the rail's bead rides on, so a tick sits exactly where the
   bead will be when that section reaches the top. Re-measured whenever the
   page changes height (fonts landing, images, the viewport resizing). */
export function useSectionMarks() {
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
