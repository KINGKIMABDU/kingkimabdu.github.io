import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// same reason as manifest.ts: a route under `output: "export"` has to opt in
export const dynamic = "force-static";

/* One page, but crawlers still want to be told it exists and told which URL
   is the real one. next.config sets trailingSlash, so the canonical form ends
   in a slash and the sitemap has to agree with it. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
