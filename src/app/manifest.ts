import type { MetadataRoute } from "next";

// required by `output: "export"` — the manifest is a route, and routes have
// to opt in to being emitted as a static file
export const dynamic = "force-static";

/* Home-screen install metadata: Android reads the maskable icon, iOS uses
   apple-icon.png from the app directory instead. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "KINGKIMABDU | Crafted to Create",
    short_name: "KINGKIMABDU",
    description:
      "Abdullah Alhariri (KINGKIMABDU) — student in Germany building software and hardware projects, running Arch Linux, and working toward medicine.",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f4ec",
    theme_color: "#7e9765",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
