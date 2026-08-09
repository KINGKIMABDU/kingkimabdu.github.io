"use client";

import dynamic from "next/dynamic";
import { useScroll } from "framer-motion";

const FluidBackground = dynamic(() => import("@/components/FluidBackground"), {
  ssr: false,
});

/**
 * The living blob sits fixed behind the whole page. All movement happens
 * inside the WebGL scene (the mesh glides, not the canvas element), so
 * scrolling never forces the browser to re-composite a full-screen layer —
 * smooth on every device, at full resolution.
 */
export default function LivingBackground() {
  const { scrollYProgress } = useScroll();

  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10"
      aria-hidden="true"
    >
      <FluidBackground scrollProgress={scrollYProgress} />
    </div>
  );
}
