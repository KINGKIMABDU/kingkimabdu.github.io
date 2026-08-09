"use client";

import { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { isHoverPointer } from "@/lib/utils";

type MenuItem = {
  id: string;
  label: string;
  href: string;
  external?: boolean;
  icon: React.ReactNode;
};

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ITEMS: MenuItem[] = [
  {
    id: "home",
    label: "Home",
    href: "#home",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M10 21v-6h4v6" />
      </svg>
    ),
  },
  {
    id: "about",
    label: "About",
    href: "#about",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
      </svg>
    ),
  },
  {
    id: "projects",
    label: "Projects",
    href: "#projects",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M21 8 12 3 3 8v8l9 5 9-5V8Z" />
        <path d="M3 8l9 5 9-5" />
        <path d="M12 13v8" />
      </svg>
    ),
  },
  {
    id: "stack",
    label: "Stack",
    href: "#stack",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="4" y="4" width="7" height="7" rx="1.5" />
        <rect x="13" y="4" width="7" height="7" rx="1.5" />
        <rect x="4" y="13" width="7" height="7" rx="1.5" />
        <rect x="13" y="13" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    id: "timeline",
    label: "Timeline",
    href: "#timeline",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M3 12h4l3-8 4 16 3-8h4" />
      </svg>
    ),
  },
  {
    id: "contact",
    label: "Contact",
    href: "#contact",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  /* GitHub isn't here: the Projects section, the profile spine beside it and
     the Contact row all already lead there, and a nav should be a map of the
     page rather than a place to park outbound links. */
];

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
              Hover on me
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
            </span>{" "}
            — the username I go by everywhere online.
          </p>
        </div>
      </div>
    </div>
  );
}

function LogoWithCard() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => {
    // small hysteresis so it can't flicker on a trackpad nudge
    setScrolled((was) => (was ? v > 24 : v > 56));
  });

  return (
    <div
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

export default function Nav() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 1, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-40"
    >
      {/* Same max-width and padding as every <section> on the page, and that
          is the whole reason it looks placed: the wordmark lands exactly
          above the hero avatar and the pill lands exactly on the right edge
          of the hero text column. Insetting either end further would read as
          tidier in isolation and misaligned in context. */}
      <div className="mx-auto flex max-w-[92rem] items-center justify-between gap-3 px-6 py-4 sm:px-8">
        <LogoWithCard />

        <div className="flex items-center gap-1 rounded-full border border-line bg-paper/80 p-1.5 shadow-lg shadow-olive-deep/10 backdrop-blur-md sm:gap-1.5">
          {ITEMS.map((item) => (
            <a
              key={item.id}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              aria-label={item.label}
              className="nav-orb group flex h-8 w-8 items-center justify-center rounded-full text-olive sm:h-10 sm:w-10"
            >
              {/* the fill is its own clipped layer so the label below can
                  still escape the button's bounds */}
              <span className="nav-orb__fill" aria-hidden="true" />
              <span className="relative z-[1] h-[46%] w-[46%]">{item.icon}</span>
              <span className="pointer-events-none absolute top-full left-1/2 z-[1] mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2.5 py-1 font-label font-medium text-[10px] uppercase tracking-widest text-paper opacity-0 transition-all duration-300 group-hover:translate-y-0.5 group-hover:opacity-100">
                {item.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
