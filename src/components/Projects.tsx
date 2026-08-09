import { Stagger, StaggerItem, SectionHeading } from "@/components/Reveal";

const VERTISOVA_PLAY =
  "https://play.google.com/store/apps/details?id=com.kingkimabdu.vertisova";

type LinkKind = "github" | "play";

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
      "Health, habits, and personal progress in one app. Built for my own routine first, now out in the open.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/Vertisova",
        label: "Vertisova on GitHub",
      },
      { kind: "play", href: VERTISOVA_PLAY, label: "Vertisova on Google Play" },
    ],
    linkLabel: "GitHub · Google Play",
  },
  {
    n: "02",
    kind: "Biology Web",
    title: "Vakuole",
    blurb:
      "Interactive biology learning website with a clean layout, focused explanations, and a visual style made for studying without clutter.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/Vakuole",
        label: "Vakuole on GitHub",
      },
    ],
    linkLabel: "Open Repository",
  },
  {
    n: "03",
    kind: "Study Project",
    title: "Mitosis",
    blurb:
      "Science study project about mitosis, built to practice structure, presentation, and turning school topics into something easier to explore.",
    links: [
      {
        kind: "github",
        href: "https://github.com/KINGKIMABDU/Mitosis",
        label: "Mitosis on GitHub",
      },
    ],
    linkLabel: "Open Repository",
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

/* Card layout adapted from Uiverse.io by monkey_8812, recolored to matcha.
   Built on --project-* rather than the page tokens: these stay dark tiles
   with light labels in both themes instead of inverting in dark mode. */
function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="relative h-[340px] w-[240px] overflow-hidden rounded-2xl border border-olive/25">
      {/* backdrop layer with the signature cut corner */}
      <div className="absolute h-full w-full bg-[var(--project-edge)] p-1">
        <div className="h-full w-full rounded-xl rounded-tr-[100px] rounded-br-[40px] bg-[var(--project-fill)]" />
      </div>

      {/* slow-spinning orb behind the glass */}
      <div className="relative flex h-full w-full items-center justify-center rounded-2xl backdrop-blur-lg">
        <div className="animate-spin-slow h-36 w-36 rounded-full bg-gradient-to-tr from-matcha via-matcha-soft to-[var(--project-fill)] opacity-70" />
      </div>

      {/* content overlay */}
      <div className="absolute inset-0 flex h-full w-full justify-between p-2">
        <div className="flex w-[68%] flex-col rounded-xl bg-[var(--project-fg)]/10 p-3 pt-4 font-label backdrop-blur-lg">
          <span
            className={`font-serif leading-tight break-words hyphens-auto text-[var(--project-fg)] ${titleSize(
              project.title
            )}`}
          >
            {project.title}
          </span>
          <span className="mt-2 text-[11px] leading-relaxed text-[var(--project-fg-soft)]/80">
            {project.blurb}
          </span>
          <div className="mt-auto flex w-full items-center justify-center">
            <span className="text-[10px] font-medium uppercase tracking-widest text-[var(--project-fg-soft)]/60">
              {project.linkLabel}
            </span>
          </div>
        </div>

        <div className="flex h-full flex-col items-end pt-2 pr-1 text-[var(--project-fg)]/60">
          <span className="text-[10px] leading-[13px]">{project.kind}</span>
          <span className="text-[10px] leading-[13px]">· {project.n}</span>
          <div className="mt-auto flex flex-col items-end gap-2">
            {project.links.map((link) => (
              <a
                key={link.kind}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--project-fg)]/20 backdrop-blur-lg transition-all duration-300 hover:bg-matcha hover:text-[var(--project-fill)]"
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

/* A spine, not a card: full row height, narrow, text set on its side. Same
   inset surface as the contact cards, at the dimensions it already had. */
function GithubProfileSpine() {
  return (
    <a
      href="https://github.com/KINGKIMABDU?tab=repositories"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="View my GitHub profile"
      className="card-inset card-sweep group flex h-[340px] w-[72px] flex-col items-center justify-center gap-7 py-5"
    >
      <span className="text-olive transition-colors duration-300 group-hover:text-matcha-deep">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
          <path d={GITHUB_PATH} />
        </svg>
      </span>

      <span
        className="font-label font-medium text-[11px] uppercase tracking-[0.3em] text-matcha-deep"
        style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
      >
        View my profile
      </span>
    </a>
  );
}

export default function Projects() {
  return (
    <section
      id="projects"
      className="mx-auto max-w-[92rem] scroll-mt-24 px-6 py-28 sm:px-8"
    >
      <SectionHeading label="Projects" title="Selected work from GitHub." />

      <Stagger className="flex flex-wrap justify-center gap-6 md:justify-start">
        {PROJECTS.slice(0, -1).map((project) => (
          <StaggerItem key={project.n}>
            {/* the one lift left on the page — these cards are objects on a
                surface, so picking one up reads; the buttons aren't */}
            <div className="transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2">
              <ProjectCard project={project} />
            </div>
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
        <StaggerItem className="flex flex-wrap justify-center gap-6 md:justify-start">
          <div className="transition-transform duration-[520ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-2">
            <ProjectCard project={PROJECTS[PROJECTS.length - 1]} />
          </div>
          <GithubProfileSpine />
        </StaggerItem>
      </Stagger>
    </section>
  );
}
