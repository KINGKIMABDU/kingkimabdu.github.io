"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { GooeyText } from "@/components/GooeyText";

const EASE = [0.22, 1, 0.36, 1] as const;

const HEADLINE = "I am Abdullah Alhariri";

export default function Hero() {
  const words = HEADLINE.split(" ");

  return (
    <section
      id="home"
      /* svh, not vh: on iOS and Android `100vh` is the viewport with the
         browser chrome *retracted*, so the hero is taller than what you can
         actually see and the page jumps as the toolbar hides on scroll. */
      className="relative flex min-h-[100svh] w-full flex-col justify-center overflow-hidden"
    >
      {/* soft wash so text stays readable over the living blob */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-paper/70 via-paper/30 to-paper/0" />

      {/* Vertical padding is off the viewport *height*, not a flat 128px. The
          section is min-h-100svh and centred, so on a short landscape
          viewport — an iPad Air at 820, a 1366x768 laptop — a fixed 256px of
          padding plus the avatar, the headline, the paragraph, the buttons
          and the morphing line adds up to more than the screen, and the last
          line sits on the bottom edge. vh gives that back where it is scarce
          and keeps the generous version on a tall panel. */}
      <div className="shell relative z-10 max-w-[92rem] pt-[clamp(6rem,13vh,8.5rem)] pb-[clamp(3.5rem,10vh,8rem)]">
        {/* avatar — sits where the wordmark used to */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
          className="mb-9"
        >
          <div className="relative h-32 w-32 sm:h-36 sm:w-36">
            {/* outer ring */}
            <div className="absolute -inset-2 rounded-full border border-matcha/50" />
            {/* inner plate */}
            <div className="relative h-full w-full overflow-hidden rounded-full border border-line bg-paper-2 shadow-[0_22px_40px_-20px_rgba(69,77,51,0.55)]">
              {/* fixed size, so width/height rather than fill + sizes —
                  the responsive srcset asks for a 16w candidate the
                  optimizer rejects */}
              <Image
                src="/profile.png"
                alt="Abdullah Alhariri"
                width={288}
                height={288}
                priority
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* 7xl lands at lg, not md: at exactly 768 (iPad portrait) the 72px
            headline is 689px wide against ~704px of usable width — it all but
            touches the edge. 60px holds comfortably across 768–1023. */}
        <h1 className="max-w-4xl font-serif text-5xl leading-[1.08] text-ink sm:text-6xl lg:text-7xl">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 34 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + i * 0.07, duration: 1.1, ease: EASE }}
              className="mr-[0.25em] inline-block last:mr-0"
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 1.1, ease: EASE }}
          className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft"
        >
          Most of this started as a question I couldn&apos;t leave alone. A few
          became apps, one became a laptop I took apart and rebuilt, one became
          a plan for the next ten years. This is where they ended up.
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a href="#projects" className="btn-sweep font-medium">
            <span className="btn-sweep-content">View work</span>
          </a>
          <a href="#contact" className="btn-sweep btn-sweep--soft font-medium">
            <span className="btn-sweep-content">Get in touch</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.1, duration: 1 }}
          className="mt-16"
        >
          <GooeyText
            texts={[
              "future doctor",
              "disciplined",
              "gymrat",
              "coder",
              "thinker",
              "tinkerer",
            ]}
            morphTime={1.2}
            cooldownTime={1.6}
            align="left"
            className="h-20"
            textClassName="font-serif text-4xl text-matcha-deep sm:text-5xl md:text-6xl"
          />
        </motion.div>
      </div>
    </section>
  );
}
