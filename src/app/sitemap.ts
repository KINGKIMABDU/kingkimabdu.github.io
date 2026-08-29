import type { MetadataRoute } from "next";
import { SITE_LAST_MODIFIED, SITE_URL } from "@/lib/site";

// same reason as manifest.ts: a route under `output: "export"` has to opt in
export const dynamic = "force-static";

/* One page, but crawlers still want to be told it exists and told which URL
   is the real one. next.config sets trailingSlash, so the canonical form ends
   in a slash and the sitemap has to agree with it. lastModified is the same
   hand-bumped date as the ProfilePage's dateModified, not the build time —
   an unchanged date is itself the signal that nothing worth recrawling
   happened, so a rebuild timestamp here would just spend priority for
   nothing. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      lastModified: SITE_LAST_MODIFIED,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
