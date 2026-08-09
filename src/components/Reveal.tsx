"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

const containerVariants: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE } },
};

export function Stagger({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div className={className} variants={itemVariants}>
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  label,
  title,
  intro,
}: {
  label: string;
  title: ReactNode;
  intro?: string;
}) {
  return (
    <div className="mb-14 max-w-2xl">
      <Reveal>
        {/* 0.3em was part of the problem — caps plus tracking that wide is the
            templated-portfolio eyebrow. Pulled in to 0.2em; the mono it used
            to be set in is gone too. */}
        <p className="mb-4 font-label font-medium text-xs uppercase tracking-[0.2em] text-matcha-deep">
          {label}
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <h2 className="font-serif text-4xl leading-tight text-ink md:text-5xl">
          {title}
        </h2>
      </Reveal>
      {intro ? (
        <Reveal delay={0.16}>
          <p className="mt-5 text-lg leading-relaxed text-ink-soft">{intro}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
