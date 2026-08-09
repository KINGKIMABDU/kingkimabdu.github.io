import { Stagger, StaggerItem, SectionHeading } from "@/components/Reveal";

const stroke = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/*
 * Line icons drawn to match the nav set, but traced off the actual hardware
 * rather than off the generic category. The point of each one is the single
 * feature that makes the real device identifiable at a glance: the shield on
 * the MSI lid, the TrackPoint on the ThinkPad deck, the S Pen beside the
 * Ultra, the cushion case on the Watch Ultra, the bean on the Buds Live, the
 * tilt on the Lift. Same for the two marks — the Arch "A" keeps its archway
 * and its slashes, and VS Code keeps its actual crossing-ribbon geometry
 * instead of a generic pair of angle brackets.
 */
const ICONS: Record<string, React.ReactNode> = {
  /* The two laptops carry no marks on their screens — they're told apart by
     size and by the deck, which is how you tell them apart in a room. MSI is
     the 15.6" gaming machine: wide panel, deep vented base. */
  msi: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="2.6" y="4.2" width="18.8" height="10.8" rx="1" />
      <path d="M1 20.2h22l-2.1-5.2H3.1L1 20.2Z" />
      <path d="M8.8 17.8h6.4" />
    </svg>
  ),
  /* ThinkPad X270: 12.5", so a visibly smaller panel with a fatter bezel,
     and the TrackPoint dead centre of the deck between the keyboard halves. */
  thinkpad: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="5" y="3.6" width="14" height="10.4" rx="0.5" />
      <rect x="6.8" y="5.4" width="10.4" height="6.8" rx="0.3" />
      <path d="M3 19.8h18l-1.6-4.8H4.6L3 19.8Z" />
      <circle cx="12" cy="16.9" r="0.85" fill="currentColor" stroke="none" />
      <path d="M10 18.6h4" />
    </svg>
  ),
  /* Galaxy S22 Ultra: flat squared slab, stacked lens column, S Pen resting
     against the side rather than floating beside it. Lenses pulled down from
     r1.15 to r0.8 — at the old size three of them ate half the back. */
  phone: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="8.6" y="2.4" width="10.2" height="19.2" rx="1.2" />
      <circle cx="11.4" cy="5.5" r="0.8" />
      <circle cx="11.4" cy="7.9" r="0.8" />
      <circle cx="11.4" cy="10.3" r="0.8" />
      <circle cx="14.2" cy="5.5" r="0.55" />
      <g transform="rotate(9 8.4 5)">
        <path d="M6.3 6.05a1.05 1.05 0 0 1 2.1 0v11.5l-1.05 2.9-1.05-2.9V6.05Z" />
      </g>
    </svg>
  ),
  /* Galaxy Watch Ultra: a round dial sunk into a *square* cushion case. The
     case was 13.4 x 14.8 — taller than wide, which is the Apple Watch
     silhouette, not this one. Now 14 x 14, and the dial is big enough that
     the bezel reads as a bezel instead of a moat. Two side keys on the right. */
  watch: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <rect x="4" y="5" width="14" height="14" rx="4.6" />
      <circle cx="11" cy="12" r="5" />
      <path d="M7.3 5.2 7.6 1.9h6.8l.3 3.3" />
      <path d="M7.3 18.8l.3 3.3h6.8l.3-3.3" />
      <path d="M18 8.5h1.15v3.1H18" />
      <path d="M18 12.4h1.15v3.1H18" />
    </svg>
  ),
  // Galaxy Buds Live: the bean. Nothing else about them needs saying.
  buds: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M9.3 4.6c1.7.9 2.5 3 2.2 5.4-.4 3.4-2.3 6.1-4.6 6.1-1.8 0-3.1-1.5-2.9-3.4.2-1.7 1.5-2.7 1.7-4.1.2-1.3-.7-2.3-.4-3.3.4-1.3 2.3-1.6 4-.7Z" />
      <path d="M14.7 8.2c-1.7.9-2.5 3-2.2 5.4.4 3.4 2.3 6.1 4.6 6.1 1.8 0 3.1-1.5 2.9-3.4-.2-1.7-1.5-2.7-1.7-4.1-.2-1.3.7-2.3.4-3.3-.4-1.3-2.3-1.6-4-.7Z" />
    </svg>
  ),
  /* Logitech Lift. Vertical mice are narrow at the top and broad at the
     base, leaning right — a symmetric egg reads as an egg. The seam between
     the two buttons and the wheel riding high on it name the object. */
  mouse: (
    <svg viewBox="0 0 24 24" {...stroke}>
      <path d="M13.9 2.7c2.4 1 4.1 3.9 4.7 7.3.8 4.6-.8 8.7-4 10.1-3.3 1.4-6.8-.6-8-4.4-1.2-3.6-.3-7.7 2.2-10.5 1.7-2 3.5-3 5.1-2.5Z" />
      <path d="M10.6 3.5C8.8 6.1 7.9 9.2 8.1 12.3" />
      <rect x="12.4" y="5.8" width="2.1" height="4.1" rx="1.05" />
    </svg>
  ),
  /*
   * Arch Linux — the official mark, from Simple Icons (CC0), same source as
   * the GitHub/Discord/Spotify glyphs in Contact.tsx.
   *
   * Hand-reconstructing this twice failed for a reason worth recording: the
   * real logo is ONE continuous outline, not a triangle with holes punched
   * in it. The archway and the two slashes are notches in the contour, which
   * is why every version built as "solid A minus cutouts" came out reading
   * as a face or a tent with windows. Trademark glyph stripped.
   */
  arch: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M11.39.605C10.376 3.092 9.764 4.72 8.635 7.132c.693.734 1.543 1.589 2.923 2.554-1.484-.61-2.496-1.224-3.252-1.86C6.86 10.842 4.596 15.138 0 23.395c3.612-2.085 6.412-3.37 9.021-3.862a6.61 6.61 0 01-.171-1.547l.003-.115c.058-2.315 1.261-4.095 2.687-3.973 1.426.12 2.534 2.096 2.478 4.409a6.52 6.52 0 01-.146 1.243c2.58.505 5.352 1.787 8.914 3.844-.702-1.293-1.33-2.459-1.929-3.57-.943-.73-1.926-1.682-3.933-2.713 1.38.359 2.367.772 3.137 1.234-6.09-11.334-6.582-12.84-8.67-17.74z" />
    </svg>
  ),
  /* VS Code. Drawn at the family's stroke weight it came out spindly — the
     real mark is a solid ribbon, so this one is filled rather than stroked.
     Geometry is the actual logo's: a right-hand bar with two long diagonals
     running back to it, crossing each other well left of centre. */
  code: (
    <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
      <path d="M17.6 1.9a1.2 1.2 0 0 1 1.9-1l2.1 1.5c.3.2.4.5.4.9v17.4c0 .4-.1.7-.4.9l-2.1 1.5a1.2 1.2 0 0 1-1.9-1V1.9Z" />
      <path d="M17 3.4a1.1 1.1 0 0 1 1.4 1.7L4.6 16.6a1.1 1.1 0 0 1-1.6-.2l-1-1.3a1.1 1.1 0 0 1 .2-1.6L17 3.4Z" />
      <path d="M17 20.6a1.1 1.1 0 0 0 1.4-1.7L4.6 7.4A1.1 1.1 0 0 0 3 7.6l-1 1.3a1.1 1.1 0 0 0 .2 1.6l14.8 10.1Z" />
    </svg>
  ),
};

const MACHINES = [
  {
    icon: "msi",
    tag: "Main machine",
    name: "MSI GL62VR7RFX",
    blurb: "My main rig for coding and the heavier work.",
    specs: [
      "Intel i7 7th gen H",
      "16 GB RAM",
      "1 TB storage",
      "GTX 1060 6 GB VRAM",
    ],
  },
  {
    icon: "thinkpad",
    tag: "On the go",
    name: "Lenovo ThinkPad X270",
    blurb: "For outdoor work or work on the go.",
    specs: ["Intel i7 7500U", "16 GB RAM", "90 Wh battery"],
  },
  {
    icon: "phone",
    tag: "Daily phone",
    name: "Samsung Galaxy S22 Ultra",
    blurb: "My main phone — notes, photos, and everything in between.",
    specs: ["Exynos 2200", "256 GB storage", "12 GB RAM"],
  },
];

const GEAR: {
  icon: string;
  name: string;
  note: string;
  extra?: string;
}[] = [
  {
    icon: "watch",
    name: "Samsung Galaxy Watch Ultra",
    note: "Health & training",
  },
  {
    icon: "buds",
    name: "Samsung Galaxy Buds Live",
    note: "Audio anywhere",
    extra: "Unique design",
  },
  { icon: "mouse", name: "Logitech Lift", note: "Vertical mouse, white" },
  { icon: "arch", name: "Arch Linux", note: "On every laptop I own" },
  { icon: "code", name: "VS Code", note: "My main coding environment" },
];

export default function Stack() {
  return (
    <section
      id="stack"
      className="mx-auto max-w-[92rem] scroll-mt-24 px-6 py-28 sm:px-8"
    >
      <SectionHeading
        label="Stack & Setup"
        title="The stack I build on."
        intro="The devices and tools I actually use every day — from the machines I build on to the software I live in."
      />

      <Stagger className="grid gap-5 md:grid-cols-3">
        {MACHINES.map((m) => (
          <StaggerItem
            key={m.name}
            className="card-inset card-sweep group p-7"
          >
            <div className="flex items-start justify-between">
              <p className="font-label font-medium text-[11px] uppercase tracking-[0.25em] text-matcha-deep">
                {m.tag}
              </p>
              <span className="h-8 w-8 text-olive transition-colors duration-300 group-hover:text-matcha-deep">
                {ICONS[m.icon]}
              </span>
            </div>
            <h3 className="mt-2 font-serif text-2xl text-ink">{m.name}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">{m.blurb}</p>
            <ul className="mt-5 space-y-2">
              {m.specs.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2.5 text-sm text-ink-soft"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-matcha transition-colors duration-300 group-hover:bg-matcha-deep" />
                  {s}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>

      {/* five items: at two columns the fifth would sit alone on its own
          row, so it spans the full width there instead. Three and five
          columns divide the row cleanly and reset it. */}
      <Stagger className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
        {GEAR.map((g, i) => (
          <StaggerItem
            key={g.name}
            className={`card-inset card-sweep group p-5 ${
              i === GEAR.length - 1 ? "col-span-2 sm:col-span-1" : ""
            }`}
          >
            <span className="mb-3 block h-7 w-7 text-olive transition-colors duration-300 group-hover:text-matcha-deep">
              {ICONS[g.icon]}
            </span>
            <p className="font-medium text-ink">{g.name}</p>
            <p className="mt-1 text-xs text-ink-soft">{g.note}</p>
            {g.extra ? (
              <p className="mt-0.5 text-xs text-ink-soft">{g.extra}</p>
            ) : null}
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
