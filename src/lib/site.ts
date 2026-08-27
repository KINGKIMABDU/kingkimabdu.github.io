/* One place for the facts that have to agree everywhere: the metadata, the
   JSON-LD graph, the sitemap and the projects list all used to state these
   separately, which is how the site ended up advertising a shipped app on the
   page while saying nothing about it in the description Google reads. */

export const SITE_URL = "https://kingkimabdu.github.io";

export const SITE_NAME = "KINGKIMABDU";

export const SITE_TITLE = "KINGKIMABDU | Crafted to Create";

/* This is the line printed under the result in search, and for anything that
   reads the site secondhand (summarisers, assistants, previews) it is often
   the only sentence about it they ever see. It stays about the person: this
   is a personal site, not a product page, and naming one app here would make
   the whole site read as that app's landing page. The shipped-work claim is
   carried by the JSON-LD instead, which is where machines look for facts
   anyway, and where it can be stated precisely without narrowing this line. */
export const SITE_DESCRIPTION =
  "Abdullah Alhariri (KINGKIMABDU), a student in Germany who builds and ships software and hardware projects, runs Arch Linux, and is working toward medicine.";

export const AUTHOR_NAME = "Abdullah Alhariri";

export const GITHUB_URL = "https://github.com/KINGKIMABDU";

export const VERTISOVA_PLAY =
  "https://play.google.com/store/apps/details?id=com.kingkimabdu.vertisova";

export const VERTISOVA_GITHUB = "https://github.com/KINGKIMABDU/Vertisova";

// Public Play Store release. Bumping a build does not change this.
export const VERTISOVA_RELEASE_DATE = "2026-08-06";
