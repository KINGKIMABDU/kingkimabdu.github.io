"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BlobLoader from "@/components/BlobLoader";

const EASE = [0.22, 1, 0.36, 1] as const;

/* Whether the curtain should be skipped is external state (a media query and
   a sessionStorage flag), so it is read as a store instead of being copied
   into React state from inside an effect. */
function subscribe() {
  return () => {};
}

function shouldSkip() {
  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    sessionStorage.getItem("intro-seen") === "1"
  );
}

/**
 * Opening curtain: the blob, the wordmark, then the sheet lifts away and
 * hands over to the hero — which is already mid-entrance underneath, so the
 * two read as one continuous move rather than two separate animations.
 * Shown once per tab, so refreshing while iterating doesn't cost the wait.
 */
export default function Intro() {
  const skip = useSyncExternalStore(subscribe, shouldSkip, () => true);
  const [finished, setFinished] = useState(false);
  const open = !skip && !finished;

  useEffect(() => {
    if (skip || finished) return;

    document.body.style.overflow = "hidden";
    const id = window.setTimeout(() => {
      sessionStorage.setItem("intro-seen", "1");
      setFinished(true);
    }, 1500);

    return () => {
      window.clearTimeout(id);
      document.body.style.overflow = "";
    };
  }, [skip, finished]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="intro"
          className="intro-veil"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: "-100%" }}
          transition={{ duration: 0.85, ease: EASE }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.86 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <BlobLoader size={148} />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8, ease: EASE }}
            className="font-kr text-sm tracking-[0.3em] text-ink-soft"
          >
            킹키마브두
          </motion.p>

          {/* hairline that draws itself while the blob settles */}
          <motion.span
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.2, duration: 1.15, ease: EASE }}
            className="block h-px w-40 origin-left bg-matcha"
          />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
