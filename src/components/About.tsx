"use client";

import { Reveal, Stagger, StaggerItem, SectionHeading } from "@/components/Reveal";

const PRINCIPLES = [
  { n: "01", a: "Curiosity", b: "over assumptions" },
  { n: "02", a: "Discipline", b: "over motivation" },
  { n: "03", a: "Creativity", b: "over convention" },
  { n: "04", a: "Consistency", b: "over intensity" },
];

/*
 * The prose above says what I think; this says what I do with a free
 * afternoon. Set as a serif run rather than a row of outlined chips — the
 * chips were a component borrowed from a different design language, and the
 * cards beside them already establish the one this column speaks: tracked
 * caps label, serif subject, soft note.
 */
const INTERESTS = [
  "Coding",
  "Tinkering",
  "Inventing",
  "Biking",
  "FPV drones",
  "Bodybuilding",
  "Studying",
];

/*
 * The principles column used to drift on scroll — scrollYProgress through a
 * soft spring, offset by ±48px. The spring is the problem: it is always
 * chasing a target it never quite reaches, so reversing direction leaves it
 * crawling toward the new value for a second or two after the page has
 * stopped. Read as a bug, because it is one. The column just sits still now.
 */
export default function About() {
  return (
    <section
      id="about"
      className="shell shell-y scroll-mt-24"
    >
      <SectionHeading
        label="About"
        title={
          <>
            More than a student.
            <br />A builder in progress.
          </>
        }
      />

      {/* Prose carries the weight on the left; the right column holds the
          short, scannable stuff so the section isn't a long ragged block
          with dead space beside it. */}
      <div className="grid gap-x-[clamp(2.5rem,4.5vw,5rem)] gap-y-16 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink-soft">
          <Reveal>
            <p>
              I&apos;m Abdullah, a student from Germany, born in Damascus, with
              a passion for technology, science, and creating things that solve
              real problems. My curiosity has always pushed me to explore how
              things work — from software and artificial intelligence to the
              complexity of the human body and the world of medicine.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p>
              I enjoy developing applications, experimenting with AI, working
              with Linux, and diving into scientific topics. The MINT subjects
              at school are where a lot of this comes together. At the same
              time, I am fascinated by medicine and the challenge of
              understanding the human body, combining analytical thinking with
              the desire to make a meaningful impact on people&apos;s lives.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <p>
              Whether I&apos;m writing code, researching a new scientific
              concept, or building a project from an idea, I see every
              experience as an opportunity to learn, improve, and create
              something valuable.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p>
              Outside of technology and science, I spend time bodybuilding,
              exploring new ideas, and challenging myself with ambitious
              personal goals. I value curiosity, discipline, creativity, and the
              belief that progress comes from consistent effort and lifelong
              learning.
            </p>
          </Reveal>
          <Reveal delay={0.2}>
            <p>
              I&apos;m still at the beginning of my journey, but I&apos;m
              focused on building things that matter — combining technology,
              science, and innovation to shape the future.
            </p>
          </Reveal>
        </div>

        <div className="lg:self-start">
          {/* One card per row: the "X over Y" pairs read as a list, which is
              what they are — the old 2x2 grid of big serif words fought the
              paragraphs for attention. */}
          {/* The interests card rides in the same Stagger as the principles
              above rather than its own Reveal. As a standalone Reveal it had a
              separate viewport trigger and a longer 0.9s + 0.1 delay, so it
              landed a beat after the four cards had already settled and read as
              lag. Folded in, it's just the fifth item on the one timeline. */}
          <Stagger className="space-y-3">
            {PRINCIPLES.map((p) => (
              <StaggerItem
                key={p.n}
                className="card-inset card-sweep group flex items-baseline gap-5 px-6 py-5"
              >
                <span className="font-label text-xs font-medium tracking-[0.14em] text-matcha-deep">
                  {p.n}
                </span>
                <span className="font-serif text-xl text-ink">{p.a}</span>
                <span className="ml-auto text-sm text-ink-soft">{p.b}</span>
              </StaggerItem>
            ))}

            <StaggerItem className="card-inset card-sweep group px-6 py-5">
              <p className="font-label text-[11px] font-medium uppercase tracking-[0.18em] text-matcha-deep">
                Off the clock
              </p>
              {/*
               * A wrapping list, not one long inline run. As a single <p> of
               * sibling <span>s there was no break opportunity anywhere in the
               * line — JSX drops the newline-and-indent between elements, so
               * nothing separated them and the row ran straight off the card.
               * Flex gives every item its own break point; the separator rides
               * with the word before it so a wrapped line never opens on a dot.
               */}
              <ul className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5 font-serif text-lg text-ink">
                {INTERESTS.map((item, i) => (
                  <li key={item} className="flex items-baseline">
                    {/* two-word entries have to break as a unit — the line
                        was splitting "FPV" from "drones" */}
                    <span className="whitespace-nowrap">{item}</span>
                    {i < INTERESTS.length - 1 ? (
                      <span className="ml-3 text-matcha" aria-hidden="true">
                        ·
                      </span>
                    ) : null}
                  </li>
                ))}
              </ul>
              {/* a short mark, not a full-width hairline across the card */}
              <hr className="rule-mark mt-5 text-matcha" aria-hidden="true" />
              <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                Matcha and coffee, roughly in that order. Green — as you may
                have noticed.
              </p>
            </StaggerItem>
          </Stagger>
        </div>
      </div>
    </section>
  );
}
