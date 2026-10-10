"use client";

import { useEffect, useRef, useState } from "react";
import {
  goToSection,
  useActiveSection,
  useSectionMarks,
} from "@/lib/sections";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
  useTransform,
} from "framer-motion";
import { isHoverPointer } from "@/lib/utils";

/* The EMV contact plate, drawn rather than imaged so it recolors with the
   theme and stays crisp at any density. The engraving is the real smart-card
   layout: a tall centre pad with three separate contacts down each side and a
   split bar along the bottom — the old chip was a bare gold rectangle with a
   single cross scored through it and read as a placeholder. */
function CardChip() {
  return (
    <span className="handle-card__chip" aria-hidden="true">
      <svg
        viewBox="0 0 40 31"
        preserveAspectRatio="none"
        fill="none"
        stroke="rgba(70, 60, 26, 0.55)"
        strokeWidth={1.1}
        strokeLinecap="round"
      >
        <path d="M15 2.5V21M25 2.5V21M2.5 8.5H37.5M2.5 15H15M25 15H37.5M2.5 21H37.5M20 21V28.5" />
      </svg>
    </span>
  );
}

/* Two interlocking discs, in the spot a card scheme's mark would sit.
   Deliberately not any real network's logo — it borrows the placement and
   the silhouette, nothing else. */
function CardMark() {
  return (
    <svg viewBox="0 0 44 28" className="h-6 w-9" aria-hidden="true">
      <circle cx="16" cy="14" r="12" fill="var(--matcha-deep)" opacity="0.95" />
      <circle cx="28" cy="14" r="12" fill="var(--matcha)" opacity="0.7" />
    </svg>
  );
}

function ContactlessMark() {
  return (
    <svg
      viewBox="0 0 20 20"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6.5a7 7 0 0 1 0 7" />
      <path d="M9.5 4.5a10.5 10.5 0 0 1 0 11" />
      <path d="M13 2.5a14 14 0 0 1 0 15" />
    </svg>
  );
}

/* The handle card. Front is the wordmark as a card face; the back carries
   the same explanation the old panel had. Hovering the wordmark opens it,
   hovering the card itself turns it over. */
function HandleCard() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="handle-card"
      data-flipped={flipped}
      onPointerEnter={(e) => isHoverPointer(e) && setFlipped(true)}
      onPointerLeave={(e) => isHoverPointer(e) && setFlipped(false)}
      /* a finger can't hover, so a tap turns it over instead */
      onPointerUp={(e) => e.pointerType === "touch" && setFlipped((f) => !f)}
    >
      <div className="handle-card__inner">
        <div className="handle-card__face">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CardChip />
              <span className="text-[var(--card-fg-soft)]">
                <ContactlessMark />
              </span>
            </div>
            <p className="font-label font-medium text-[9px] uppercase tracking-[0.28em] text-[var(--card-fg-soft)]">
              <span className="pointer-coarse:hidden">Hover on me</span>
              <span className="hidden pointer-coarse:inline">Tap me</span>
            </p>
          </div>

          <p className="mt-auto font-kr text-[28px] leading-none font-semibold tracking-wide">
            킹키마브두
          </p>
          <p className="mt-2 font-label text-[10px] tracking-[0.2em] text-[var(--card-fg-soft)]">
            / king-ki-ma-beu-du /
          </p>

          <div className="mt-3 flex items-end justify-between">
            <p className="font-label font-medium text-[11px] tracking-[0.16em]">
              KINGKIMABDU
            </p>
            <CardMark />
          </div>
        </div>

        <div className="handle-card__face handle-card__face--back">
          <div className="handle-card__stripe" />

          <div className="handle-card__signature">
            <span className="font-label font-medium text-[10px] tracking-[0.18em]">
              킹키마브두
            </span>
          </div>

          <p className="mt-4 px-5 text-[12px] leading-relaxed text-[var(--card-fg-soft)]">
            The Korean rendering of{" "}
            <span className="font-medium text-[var(--card-fg)]">
              KINGKIMABDU
            </span>
            , the username I go by everywhere online.
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoWithCard() {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);
  /* set on touchdown, read on click: was this press a finger? */
  const touched = useRef(false);

  // a tap anywhere off the wordmark and card puts the card away
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [open]);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    // small hysteresis so it can't flicker on a trackpad nudge
    setScrolled((was) => (was ? v > 24 : v > 56));
  });

  return (
    <div
      ref={wrapRef}
      className="relative"
      onPointerEnter={(e) => isHoverPointer(e) && setOpen(true)}
      onPointerLeave={(e) => isHoverPointer(e) && setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      {/* Scrolled, the wordmark sits over the blob and over whatever section
          happens to be beneath it, so it goes from soft to full-contrast ink
          and picks up a paper-coloured halo — enough to stay legible against
          anything without putting a chip around it. Noto Serif KR only ships
          400 and 600 here, so the weight can't interpolate; two stacked
          copies crossfade instead, which does. */}
      <a
        href="#home"
        onPointerDown={(e) => {
          touched.current = e.pointerType === "touch";
        }}
        /* With a mouse or Pencil the card is already open from hovering, so
           a click just goes home. A finger has no hover: its first tap shows
           the card, and a second tap, with the card up, goes home. */
        onClick={(e) => {
          if (touched.current && !open) {
            e.preventDefault();
            setOpen(true);
          } else {
            setOpen(false);
          }
        }}
        className={`relative inline-flex font-kr text-xl tracking-wide transition-colors duration-500 ease-out hover:text-matcha-deep ${
          scrolled ? "text-ink" : "text-ink-soft"
        }`}
        style={{
          textShadow: scrolled
            ? "0 0 12px var(--paper), 0 0 4px var(--paper), 0 0 2px var(--paper)"
            : "none",
          transition: "text-shadow 0.5s ease, color 0.5s ease",
        }}
      >
        {/* invisible copy holds the box, so the weight crossfade can't shift
            anything around it */}
        <span className="invisible font-semibold" aria-hidden="true">
          킹키마브두
        </span>
        <span className="absolute inset-0 font-semibold">
          <span
            aria-hidden="true"
            className="absolute inset-0 font-normal transition-opacity duration-500 ease-out"
            style={{ opacity: scrolled ? 0 : 1 }}
          >
            킹키마브두
          </span>
          <span
            className="transition-opacity duration-500 ease-out"
            style={{ opacity: scrolled ? 1 : 0 }}
          >
            킹키마브두
          </span>
        </span>
      </a>

      {/* pt-3 rather than mt-3: the gap has to belong to the element, or the
          pointer crossing it counts as leaving and the card flickers. */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            /* -left-5, not left-0. Edge-aligning the card to the wordmark
               puts the card's *padding* under the wordmark, so the 킹키마브두
               inside it sits 20px right of the one above — which is the
               misalignment you actually see. Pulling the card left by its own
               padding lines the two wordmarks up instead. */
            className="absolute -left-5 top-full z-50 pt-3"
          >
            <HandleCard />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const EASE = [0.22, 1, 0.36, 1] as const;

/* Phones. There's no room for the rail beside the text, so the rail comes
   to them instead: "Index" in the corner opens the page drawn as a map, one
   tall line down the right with each section's name set at its real place
   along it (the same fractions the desktop rail uses), the filled part and
   the bead showing how far down you are. Same object as on a laptop, just
   big enough for a thumb. */
function PhoneIndex() {
  const active = useActiveSection();
  const marks = useSectionMarks();
  const [open, setOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const beadTop = useTransform(scrollYProgress, (v) => `${v * 100}%`);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="phone-index"
        className="relative z-[2] flex h-11 items-center gap-2.5 text-[15px] font-medium text-ink"
        style={{
          textShadow:
            "0 0 12px var(--paper), 0 0 4px var(--paper), 0 0 2px var(--paper)",
        }}
      >
        <span className="relative">
          <span className={open ? "invisible" : ""}>Index</span>
          <span className={`absolute inset-0 ${open ? "" : "invisible"}`}>
            Close
          </span>
        </span>
        <span
          className={`block h-px bg-matcha-deep transition-[width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
            open ? "w-6" : "w-3.5"
          }`}
          aria-hidden="true"
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="phone-index"
            aria-label="Sections"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed inset-0 z-[1] bg-paper"
          >
            <div className="shell flex h-full flex-col pt-24 pb-12">
              <a
                href="#home"
                onClick={(e) => {
                  setOpen(false);
                  goToSection(e, "home");
                }}
                className="self-end text-sm text-ink-soft"
              >
                Back to the top
              </a>

              {/* the map: a line the height of the screen, the page laid on it */}
              <div className="relative mt-8 mr-1 flex-1 self-stretch">
                <motion.div
                  className="absolute top-0 right-0 bottom-0 w-px origin-top bg-line"
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: 1 }}
                  transition={{ duration: 0.7, ease: EASE }}
                />
                <motion.div
                  className="absolute top-0 right-0 w-px origin-top bg-matcha-deep"
                  style={{ height: beadTop }}
                  aria-hidden="true"
                />
                <motion.span
                  className="absolute right-0 h-2 w-2 translate-x-[3.5px] -translate-y-1/2 rounded-full bg-matcha-deep shadow-[0_0_0_4px_var(--paper)]"
                  style={{ top: beadTop }}
                  aria-hidden="true"
                />

                {marks.map((m, i) => {
                  const here = active === m.id;
                  return (
                    <motion.a
                      key={m.id}
                      href={`#${m.id}`}
                      onClick={(e) => {
                        setOpen(false);
                        goToSection(e, m.id);
                      }}
                      aria-current={here ? "location" : undefined}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.15 + i * 0.05, duration: 0.6, ease: EASE }}
                      className="absolute right-3.5 flex -translate-y-1/2 items-center gap-4 py-1 pl-6"
                      style={{ top: `${m.at * 100}%` }}
                    >
                      <span
                        className={`font-serif text-[2.4rem] leading-none ${
                          here ? "text-ink" : "text-ink-soft"
                        }`}
                      >
                        {m.label}
                      </span>
                      <span
                        className={`h-px ${here ? "w-7 bg-matcha-deep" : "w-3 bg-ink-soft/50"}`}
                        aria-hidden="true"
                      />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none fixed inset-x-0 top-0 z-40"
    >
      {/* Only the wordmark up here now; the section index lives on the
          scroll rail (ScrollRail.tsx). Same `shell` as every <section>, so
          the wordmark lands exactly above the hero avatar. pointer-events go
          back on per object so the empty width never eats a click. */}
      <div className="shell flex items-start justify-between gap-3 py-4">
        <div className="pointer-events-auto pt-1.5">
          <LogoWithCard />
        </div>
        <div className="pointer-events-auto">
          <PhoneIndex />
        </div>
      </div>
    </motion.header>
  );
}
