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
