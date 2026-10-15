"use client";

import { useState, type PointerEvent } from "react";
import { SectionHeading, Reveal } from "@/components/Reveal";
import { isHoverPointer } from "@/lib/utils";

/*
 * Brand icons: GitHub, Discord, LinkedIn, Reddit, and Spotify paths are from Simple Icons
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
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  reddit: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z" />
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
    id: "linkedin",
    label: "LinkedIn",
    value: "Connect with me",
    href: "https://www.linkedin.com/in/abdullah-alhariri-655b63426/",
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
    id: "reddit",
    label: "Reddit",
    value: "My posts",
    href: "https://www.reddit.com/user/KINGKIMABDU5090/",
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
        title="Say hello."
        intro="If you want to work on something together, or you just have a question about one of these projects, email is the easiest way to reach me. I read everything."
      />

      {/*
       * Expand-on-hover row, lg and up — NOT md. The row is a fixed width by
       * construction: eight collapsed panels, one open, eight 8px gaps. Below
       * 1024 that is wider than the viewport, so at md it was pushing the
       * whole document sideways — iPad mini and iPad Air portrait both
       * scrolled horizontally, and the first and last panels were cut off.
       * At 4.5rem / 22rem the row is 992px, and the column at 1024 is only
       * ~911px, so lg runs the panels a size down (4rem / 20rem, 896px) and
       * only xl gets the full size back.
       */}
      <Reveal>
        <div className="hidden w-full items-center gap-2 [--panel-closed:4rem] [--panel-open:20rem] lg:flex xl:[--panel-closed:4.5rem] xl:[--panel-open:22rem]">
          {LINKS.map((link, idx) => {
            const isOpen = idx === expanded;
            return (
              <div
                key={link.id}
                {...cardProps(idx)}
                className="card-inset relative flex h-36 cursor-pointer items-center overflow-hidden"
                style={{
                  width: isOpen ? "var(--panel-open)" : "var(--panel-closed)",
                  flexShrink: 0,
                  /* was `transition-all ease-in-out`, which swept every
                     property including the colours below and landed with a
                     flat stop. Width only, on the page's own easing. */
                  transition: "width 0.62s cubic-bezier(0.22, 1, 0.36, 1)",
                }}
              >
                <span
                  aria-hidden="true"
                  className={`flex h-full w-[var(--panel-closed)] shrink-0 items-center justify-center transition-colors duration-500 ${
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
