"use client";

import { useState, type PointerEvent } from "react";
import { SectionHeading, Reveal } from "@/components/Reveal";
import { isHoverPointer } from "@/lib/utils";

/*
 * Brand icons: GitHub, Discord, and Spotify paths are from Simple Icons
 * (CC0, license-free). Mail, Ko-fi cup, and the owl are hand-drawn line
 * icons to match the rest of the site.
 */
const lineStroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const ICONS: Record<string, React.ReactNode> = {
  email: (
    <svg viewBox="0 0 24 24" {...lineStroke}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  github: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  discord: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
    </svg>
  ),
  duolingo: (
    <svg viewBox="0 0 24 24" {...lineStroke}>
      <path d="M12 21c-4.4 0-7-3-7-7V8a5 5 0 0 1 5-5c.9 0 1.6.3 2 .8.4-.5 1.1-.8 2-.8a5 5 0 0 1 5 5v6c0 4-2.6 7-7 7Z" />
      <circle cx="9.2" cy="10.5" r="1.9" />
      <circle cx="14.8" cy="10.5" r="1.9" />
      <path d="M12 14.5 10.8 16h2.4L12 14.5Z" />
    </svg>
  ),
  maps: (
    <svg viewBox="0 0 24 24" {...lineStroke}>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </svg>
  ),
  // public/google-play.png, masked so it takes currentColor
  play: <span className="icon-play-mask h-full w-full" />,
  spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.5.3z" />
    </svg>
  ),
};

/*
 * The one thing that navigates. The card body only expands; opening is this
 * button and nothing else, on every input — so a click or tap anywhere else
 * on an open card never fires a link by accident. Left-aligned under the
 * value, and no trailing arrow: the word carries it.
 */
function OpenButton({
  href,
  label,
  className,
}: {
  href: string;
  label: string;
  className?: string;
}) {
  const external = !href.startsWith("mailto:");
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel="noopener noreferrer"
      aria-label={`Open ${label}`}
      onClick={(e) => e.stopPropagation()}
      className={`btn-explore ${className ?? ""}`}
    >
      Open
    </a>
  );
}

/*
 * Ordered, not arbitrary: how to reach me, then what I've shipped, then
 * where to support it, then the personal accounts — each group narrower in
 * purpose than the one before.
 */
const LINKS = [
  // reach me
  {
    id: "email",
    label: "Email",
    value: "Email me",
    href: "mailto:abdulllkajjfc@gmail.com",
  },
  {
    id: "discord",
    label: "Discord",
    value: "Message me",
    href: "https://discord.com/users/kingkimabdu",
  },
  // the work
  {
    id: "github",
    label: "GitHub",
    value: "KINGKIMABDU",
    href: "https://github.com/KINGKIMABDU",
  },
  {
    id: "play",
    label: "Google Play",
    value: "My apps",
    href: "https://play.google.com/store/apps/dev?id=7595494064844396849",
  },
  // Ko-fi deliberately isn't here — the footer badge is already the one
  // dedicated place to support the work, and two of them dilutes both.
  // everything else
  {
    id: "spotify",
    label: "Spotify",
    value: "What I build to",
    href: "https://open.spotify.com/user/kingkimabdu",
  },
  {
    id: "duolingo",
    label: "Duolingo",
    value: "KINGKIMABDU",
    href: "https://www.duolingo.com/profile/KINGKIMABDU",
  },
  {
    id: "maps",
    label: "Google Maps",
    value: "My reviews",
    href: "https://www.google.com/maps/contrib/115666625407870451555/reviews",
  },
];

export default function Contact() {
  const [expanded, setExpanded] = useState(1);

  /*
   * The card is a container, not a link — it only ever expands, and the same
   * way for every input:
   *  - mouse / pen: entering opens it (pen reports real hover).
   *  - touch: the first tap opens it; the body stays inert once open, so a
   *    second tap on the value or icon does nothing. Only the Open button
   *    navigates — which is the second tap on phone and iPad.
   *  - keyboard: focus lands on the Open link, which bubbles up to open the
   *    card, and Enter follows it — same single path as the mouse.
   * Because nothing here calls the link but the button, a hybrid laptop can't
   * fire a redirect on the first touch the way a whole-card <a> used to.
   */
  const cardProps = (idx: number) => ({
    onPointerEnter: (e: PointerEvent) => {
      if (isHoverPointer(e)) setExpanded(idx);
    },
    onFocus: () => setExpanded(idx),
    onClick: () => setExpanded(idx),
  });

  return (
    <section
      id="contact"
      className="shell shell-y scroll-mt-24"
    >
      <SectionHeading
        label="Contact"
        title="Say hello."
        intro="If you want to work on something together, or you just have a question about one of these projects, email is the easiest way to reach me. I read everything."
      />

      {/*
       * Expand-on-hover row, lg and up — NOT md. The row is a fixed width by
       * construction: six collapsed panels at 4.5rem, one open at 22rem, six
       * 8px gaps, 880px with the section padding. Below 1024 that is wider
       * than the viewport, so at md it was pushing the whole document sideways
       * — iPad mini and iPad Air portrait both scrolled horizontally, and the
       * first and last panels were cut off the edges.
       */}
      <Reveal>
        <div className="hidden w-full items-center gap-2 lg:flex">
          {LINKS.map((link, idx) => {
            const isOpen = idx === expanded;
            return (
              <div
                key={link.id}
                {...cardProps(idx)}
                className="card-inset relative flex h-36 cursor-pointer items-center overflow-hidden"
                style={{
                  width: isOpen ? "22rem" : "4.5rem",
                  flexShrink: 0,
                  /* was `transition-all ease-in-out`, which swept every
                     property including the colours below and landed with a
                     flat stop. Width only, on the page's own easing. */
                  transition: "width 0.62s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-full w-[4.5rem] shrink-0 items-center justify-center transition-colors duration-500 ${
                    isOpen ? "text-matcha-deep" : "text-olive"
                  }`}
                >
                  <span className="h-7 w-7">{ICONS[link.id]}</span>
                </span>
                {/* the label rides in behind the widening panel rather than
                    arriving with it, so it never gets clipped mid-fade.
                    pointer-events off while collapsed so a tap on the closed
                    panel falls through to the card and only opens it. */}
                <span
                  className={`min-w-0 pr-6 transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                    isOpen
                      ? "pointer-events-auto translate-x-0 opacity-100 delay-[180ms]"
                      : "pointer-events-none -translate-x-4 opacity-0"
                  }`}
                >
                  <span className="block font-label font-medium text-[11px] uppercase tracking-[0.25em] text-matcha-deep">
                    {link.label}
                  </span>
                  <span className="mt-1 block whitespace-nowrap font-serif text-2xl text-ink">
                    {link.value}
                  </span>
                  <OpenButton
                    href={link.href}
                    label={link.label}
                    className="mt-4"
                  />
                </span>
              </div>
            );
          })}
        </div>
      </Reveal>

      {/*
       * Below lg: the same panel, transposed. The row's fixed 4.5rem icon
       * column becomes a fixed 4rem icon band at the top of each card, and
       * the panel grows downward instead of rightward to bring in the label,
       * the value, and the Open button. Same easing, same delayed entry, same
       * three-input rules as the row above.
       */}
      <div className="flex flex-col gap-2 lg:hidden">
        {LINKS.map((link, idx) => {
          const isOpen = idx === expanded;
          return (
            <div
              key={link.id}
              {...cardProps(idx)}
              className="card-inset relative flex w-full cursor-pointer flex-col overflow-hidden"
              style={{
                height: isOpen ? "12rem" : "4rem",
                transition: "height 0.62s cubic-bezier(0.22, 1, 0.36, 1)",
              }}
            >
              <span
                aria-hidden="true"
                className={`flex h-16 shrink-0 items-center px-6 transition-colors duration-500 ${
                  isOpen ? "text-matcha-deep" : "text-olive"
                }`}
              >
                <span className="h-7 w-7">{ICONS[link.id]}</span>
              </span>
              <span
                className={`min-w-0 px-6 transition-[opacity,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
                  isOpen
                    ? "pointer-events-auto translate-y-0 opacity-100 delay-[180ms]"
                    : "pointer-events-none -translate-y-4 opacity-0"
                }`}
              >
                <span className="block font-label text-[11px] font-medium uppercase tracking-[0.25em] text-matcha-deep">
                  {link.label}
                </span>
                <span className="mt-1 block whitespace-nowrap font-serif text-2xl text-ink">
                  {link.value}
                </span>
                <OpenButton
                  href={link.href}
                  label={link.label}
                  className="mt-3"
                />
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
