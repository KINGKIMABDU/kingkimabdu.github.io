"use client";

import dynamic from "next/dynamic";

const FluidBackground = dynamic(() => import("@/components/FluidBackground"), {
  ssr: false,
});

/**
 * The page's living blob, shrunk down and spun in place: the attractor that
 * normally follows the cursor walks a circle instead, so the pull arrives
 * from every side in turn. Same shader, same palette — the loading state
 * looks like the site rather than a stock spinner.
 *
 * The WebGL scene is a lazily-loaded chunk, so a soft disc sits underneath
 * and breathes on its own. It carries the first moment on a cold load and
 * then simply reads as the blob's glow once the canvas arrives.
 */
export default function BlobLoader({ size = 132 }: { size?: number }) {
  return (
    <div
      className="relative"
      style={{ height: size, width: size }}
      role="status"
      aria-label="Loading"
    >
      <span className="blob-loader-fallback" aria-hidden="true" />
      <FluidBackground variant="loader" />
    </div>
  );
}
