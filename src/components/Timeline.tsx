"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/Reveal";

/*
 * Same organic gooey text treatment as the hero's morphing words:
 * an alpha-threshold SVG filter turns the blurred glyphs into liquid
 * ink blobs that coalesce into sharp text as the step scrolls into view.
 */
function GooeyReveal({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-block"
      style={{ filter: "url(#gooey-threshold)" }}
    >
      <motion.span
        initial={{ filter: "blur(7px)", opacity: 0 }}
        whileInView={{ filter: "blur(0px)", opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </span>
  );
}

type Step = {
  n: string;
  title: string;
  text: React.ReactNode;
  link?: { href: string; label: string };
};

const STEPS: Step[] = [
  {
    n: "01",
    title: "Taking things apart",
    text: "As a child, I learned by exploring, testing, and taking things apart. That curiosity shaped how I think. I never liked only accepting that something works — I wanted to know how.",
  },
  {
    n: "02",
    title: "First steps into building",
    text: (
      <>
        Lego Ninjago{" "}
        <em className="italic">
          (Lloyd and Zane are my favourites, though I like all of them.)
        </em>
        , Lego Technic, Lego Mindstorms, Scratch, and small creative projects
        were my first real steps into coding, robotics, logic, and turning ideas
        into something that moves, reacts, or runs.
      </>
    ),
  },
  {
    n: "03",
    title: "Tinkering with real hardware",
    text: "I started using my father's old laptop and experimenting seriously — software, hardware, settings, systems, tools. I learned by trying, breaking, fixing, and understanding more each time.",
  },
  {
    n: "04",
    title: "Finding my own machine",
    text: "A turning point: finding and rebuilding my MSI laptop. I upgraded it, installed different systems, and learned Linux, Windows, drivers, performance — how computers really work beyond the surface.",
  },
  {
    n: "05",
    title: "Becoming an Android & Samsung fan",
    text: "I grew deeply interested in Android, Samsung, and the freedom of customizing devices. Technology became more than a hobby — a way to express creativity and build my own setup.",
  },
  {
    n: "06",
    title: "Going deeper",
    text: "Today I code, tinker, study, build websites, explore AI, and use Linux. I'm fully on Arch — my MSI as main machine, my ThinkPad X270 for outdoor work and mobility.",
  },
  {
    n: "07",
    title: "Discipline and growth",
    text: "Fitness became a major part of my life. Bodybuilding taught me consistency, patience, and discipline. It changed how I approach everything, from school to coding to long-term goals.",
  },
  {
    n: "08",
    title: "My father's influence",
    text: "A huge part of who I am comes from my father. His intelligence, his support, and his work as a doctor inspired me — he showed me how powerful knowledge, discipline, and helping people can be.",
    link: {
      href: "https://www.linkedin.com/in/muhammad-ameen-alhariri-a6267998/",
      label: "Muhammad Ameen Alhariri",
    },
  },
  {
    n: "09",
    title: "The long game",
    text: "My goal is to become a doctor while continuing to build with technology — connecting medicine, AI, creativity, and real problem solving to help people live healthier, better lives.",
  },
];

export default function Timeline() {
  return (
    <section
      id="timeline"
      className="shell shell-y scroll-mt-24 [--shell-cap:52rem]"
    >
      <SectionHeading
        label="Timeline"
        title="How curiosity became direction."
        intro="The path from taking things apart as a kid to building real projects today."
      />

      {/* threshold filter shared by all GooeyReveal titles below */}
      <svg className="absolute h-0 w-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="gooey-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div className="relative">
        {/* the line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          className="absolute top-0 bottom-0 left-[19px] w-px origin-top bg-matcha md:left-1/2"
        />

        <div className="space-y-14">
          {STEPS.map((step, i) => {
            const left = i % 2 === 0;
            return (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                className={`relative flex gap-6 pl-12 md:w-1/2 md:pl-0 ${
                  left
                    ? "md:mr-auto md:pr-12 md:text-right"
                    : "md:ml-auto md:pl-12"
                }`}
              >
                {/* node */}
                <span
                  className={`absolute top-1 left-[8px] flex h-6 w-6 items-center justify-center rounded-full border border-matcha-deep bg-paper ${
                    left
                      ? "md:left-auto md:-right-3"
                      : "md:-left-3"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-matcha-deep" />
                </span>

                <div>
                  <p className="font-label text-xs font-medium tracking-[0.14em] text-matcha-deep">
                    {step.n}
                  </p>
                  <h3 className="mt-2 font-serif text-2xl text-ink">
                    <GooeyReveal>{step.title}</GooeyReveal>
                  </h3>
                  <p className="mt-3 leading-relaxed text-ink-soft">
                    {step.text}
                  </p>
                  {step.link ? (
                    <div className={`mt-4 flex ${left ? "md:justify-end" : ""}`}>
                      <a
                        href={step.link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        /* a person's name, so it belongs in the body face */
                        className="card-inset card-sweep group inline-flex items-center gap-2.5 px-3.5 py-1.5 text-sm text-ink"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5 shrink-0 text-olive transition-colors duration-300 group-hover:text-matcha-deep"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path d="M4.98 3.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5ZM3 9h4v12H3V9Zm7 0h3.8v1.7h.05c.53-.95 1.83-1.95 3.76-1.95C21.4 8.75 22 11 22 14v7h-4v-6.2c0-1.48-.03-3.38-2.06-3.38-2.06 0-2.38 1.6-2.38 3.27V21h-4V9Z" />
                        </svg>
                        <span>{step.link.label}</span>
                      </a>
                    </div>
                  ) : null}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
