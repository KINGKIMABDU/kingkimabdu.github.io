import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // GitHub Pages serves static files only — no Next server, so no on-demand
  // image optimizer either. `unoptimized` makes next/image emit plain <img>
  // tags pointing at the files in public/.
  output: "export",
  images: {
    unoptimized: true,
  },
  // /about -> /about/index.html, so paths resolve without server rewrites
  trailingSlash: true,
};

export default nextConfig;
