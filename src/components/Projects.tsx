import { Stagger, StaggerItem, SectionHeading } from "@/components/Reveal";
import { GITHUB_PROFILE, SITE_URL, VERTISOVA_PLAY } from "@/lib/site";

type LinkKind = "github" | "play" | "demo";

type ProjectLink = {
  kind: LinkKind;
  href: string;
  label: string;
};

type Project = {
  n: string;
  kind: string;
  title: string;
  blurb: string;
  links: ProjectLink[];
  linkLabel: string;
};

const PROJECTS: Project[] = [
  {
    n: "01",
    kind: "Android App",
    title: "Vertisova",
    blurb:
      "Posture and screen-distance tracking that runs on your own phone. Built for my own routine first, published on Google Play in August 2026.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/Vertisova",
        label: "Vertisova on GitHub",
      },
      { kind: "play", href: VERTISOVA_PLAY, label: "Vertisova on Google Play" },
    ],
    linkLabel: "GitHub · Play",
  },
  {
    n: "02",
    kind: "School Project",
    title: "Vakuole",
    blurb:
      "Interactive biology learning website with a clean layout, focused explanations, and a visual style made for studying without clutter.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/VAKUOLE.github.io",
        label: "Vakuole on GitHub",
      },
      {
        kind: "demo",
        href: `${SITE_URL}/VAKUOLE.github.io/`,
        label: "Open the Vakuole site",
      },
    ],
    linkLabel: "Repo · Live site",
  },
  {
    n: "03",
    kind: "School Project",
    title: "Mitosis",
    blurb:
      "Science study project about mitosis, built to practice structure, presentation, and turning school topics into something easier to explore.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/MITOSIS",
        label: "Mitosis on GitHub",
      },
      {
        kind: "demo",
        href: `${SITE_URL}/MITOSIS/`,
        label: "Open the Mitosis simulation",
      },
    ],
    linkLabel: "Repo · Live site",
  },
  {
    n: "04",
    kind: "Personal Site",
    title: "Personal Website",
    blurb:
      "The site you are on right now. Built from scratch around my identity, my projects, and my favorite color.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/kingkimabdu.github.io",
        label: "Personal Website on GitHub",
      },
    ],
    linkLabel: "Open Repository",
  },
  {
    n: "05",
    kind: "Profile Repo",
    title: "KINGKIMABDU",
    blurb:
      "Profile repository and visual identity hub for my GitHub presence, including the small details that make my account feel personal.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/KINGKIMABDU",
        label: "KINGKIMABDU profile repo",
      },
    ],
    linkLabel: "Open Repository",
  },
];

const GITHUB_PATH =
  "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12";

const LINK_ICONS: Record<LinkKind, React.ReactNode> = {
  github: (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
      <path d={GITHUB_PATH} />
    </svg>
  ),
  // public/google-play.png, masked so it picks up currentColor like the rest
  play: <span className="icon-play-mask h-4 w-4" />,
  /* These two live on this same domain, so the arrow is the "leaves this
     card" cue rather than a "leaves the site" one. */
  demo: (
    <svg
      viewBox="0 0 24 24"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <path d="M15 3h6v6" />
      <path d="M10 14 21 3" />
    </svg>
  ),
};

/*
 * The title panel is ~140px of usable width, which "KINGKIMABDU" overruns at
 * text-2xl — it has no space to wrap at, so it just breaks the card. Sizing
 * off the longest *word* rather than the whole string: "Personal Website" is
 * longer overall but wraps happily and should stay large.
 */
function titleSize(title: string) {
  const longest = Math.max(...title.split(" ").map((w) => w.length));
  if (longest >= 11) return "text-base";
  if (longest >= 9) return "text-xl";
  return "text-2xl";
}

/* Card adapted from Uiverse.io by ashif_6672, recoloured to matcha. The art is
   a radial arc rising from the bottom edge, pushed through turbulence so its
   rings come out torn and organic, the same family as the blob behind the
   page. Each card gets its own seed, so no two arcs tear the same way. The
   original's gradient-filled title is gone: the arc is the colour, the type
   stays solid.

   Built on --project-* rather than the page tokens, so each theme can give
   the card its own arc instead of a straight inversion. */
function ProjectCard({ project }: { project: Project }) {
  const filterId = `project-noise-${project.n}`;

  return (
    <div className="group/card relative h-[340px] w-[240px] overflow-hidden rounded-2xl bg-[var(--project-fill)] shadow-[0_18px_32px_-18px_rgba(46,50,38,0.45)]">
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <filter id={filterId}>
          <feTurbulence
            type="turbulence"
            baseFrequency="0.9"
            numOctaves="2"
            seed={Number(project.n)}
            stitchTiles="stitch"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="30"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      {/* oversized so the displaced edges never show the card behind them;
          the wrapper carries the hover brightness, since the arc's own
          filter is already the noise */}
      <div className="project-arc-glow absolute inset-0" aria-hidden="true">
        <div
          className="project-arc absolute -inset-[5%]"
          style={{ filter: `url(#${filterId})` }}
        />
      </div>

      <div className="relative flex h-full flex-col p-5">
        <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--project-fg-soft)]/70">
          {project.kind}
        </span>
        <span
          className={`mt-2 font-serif leading-tight break-words hyphens-auto text-[var(--project-fg)] transition-[letter-spacing] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/card:tracking-[0.01em] ${titleSize(
            project.title
          )}`}
        >
          {project.title}
        </span>
        <span className="mt-2.5 text-[11.5px] leading-relaxed text-[var(--project-fg-soft)]/85">
          {project.blurb}
        </span>

        <div className="mt-auto flex items-end justify-between">
          <span className="pb-1 text-[10px] font-medium uppercase tracking-[0.12em] text-[var(--project-arc-ink)]">
            {project.linkLabel}
          </span>
          <div className="flex gap-2">
            {project.links.map((link) => (
              <a
                key={link.kind}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--project-btn-bg)] text-[var(--project-btn-fg)] transition-colors duration-300 hover:bg-[var(--project-arc-ink)]"
              >
                {LINK_ICONS[link.kind]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/*
 * The card is drawn at one fixed size (240x340) and everything inside it — the
 * orb, the padding, the type scale — is tuned to that. Rather than reflow all
 * of it for phones, the whole card is scaled as a unit so two sit side by side
 * and stay legible. The box grows with the phone instead of sitting at one
 * tiny size: it takes the largest scale that still fits two across at each
 * width — ~148px on a 360, up past 184px on a large phone — then locks to full
 * size from md up. Box height tracks 340/240 of the width so the scaled card
 * fills it exactly.
 */
function ProjectCardShell({ project }: { project: Project }) {
  return (
    <div className="h-[210px] w-[148px] min-[384px]:h-[230px] min-[384px]:w-[162px] min-[430px]:h-[261px] min-[430px]:w-[184px] md:h-[340px] md:w-[240px]">
      <div className="origin-top-left scale-[0.6167] min-[384px]:scale-[0.675] min-[430px]:scale-[0.7667] md:scale-100">
        <ProjectCard project={project} />
      </div>
    </div>
  );
}

/* A spine on md and up: full row height, narrow, text set on its side, same
   inset surface as the contact cards. Below md that shape is wrong — a lone
   72px tower next to a centred card — so it lays flat into a full-width bar
   with the label running normally. */
function GithubProfileSpine() {
  return (
    <a
      /* The bare profile URL, not ?tab=repositories: the tab variant carries
         no canonical of its own, so linking it split the one signal this site
         sends to my GitHub profile across two URLs. */
      href={GITHUB_PROFILE}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View my GitHub profile"
      className="card-inset card-sweep group flex w-full flex-row items-center justify-center gap-4 py-5 md:h-[340px] md:w-[72px] md:flex-col md:gap-7"
    >
      <span className="text-olive transition-colors duration-300 group-hover:text-matcha-deep">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d={GITHUB_PATH} />
        </svg>
      </span>

      <span className="font-label font-medium text-[11px] uppercase tracking-[0.3em] text-matcha-deep md:[writing-mode:vertical-rl] md:rotate-180">
        View my profile
      </span>
    </a>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="shell shell-y scroll-mt-24"
    >
      <SectionHeading title="Selected work from GitHub." />

      {/* No lift on hover any more: the card stays put and the arc inside it
          rises (globals.css, .project-arc). Two-up on phones via the scaled
          shell, gap tightened to match. */}
      <Stagger className="flex flex-wrap justify-center gap-2 md:justify-start md:gap-6">
        {PROJECTS.slice(0, -1).map((project) => (
          <StaggerItem key={project.n}>
            <ProjectCardShell project={project} />
          </StaggerItem>
        ))}

        {/*
         * The last card and the spine travel as one flex item, because apart
         * they don't. Six loose items wrap into a band — roughly 1360px to
         * 1455px, which is exactly where an iPad Pro 12.9" in landscape sits
         * — where all five cards fit on one row and the spine doesn't, so it
         * dropped onto a row by itself with the whole width beside it. Only
         * ≥1456px ever fit all six, not xl as the old note claimed.
         * The nested wrap is what keeps the pair from overflowing a 360px
         * phone, where 240 + 24 + 72 is wider than the column.
         */}
        <StaggerItem className="flex w-full flex-col items-center gap-3 md:w-auto md:flex-row md:flex-wrap md:justify-start md:gap-6">
          <ProjectCardShell project={PROJECTS[PROJECTS.length - 1]} />
          <GithubProfileSpine />
        </StaggerItem>
      </Stagger>
    </section>
  );
}
