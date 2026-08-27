/* One place for the facts that have to agree everywhere: the metadata, the
   JSON-LD graph, the sitemap and the projects list all used to state these
   separately, which is how the site ended up advertising a shipped app on the
   page while saying nothing about it in the description Google reads. */

export const SITE_URL = "https://kingkimabdu.github.io";

export const SITE_NAME = "KINGKIMABDU";

export const SITE_TITLE = "KINGKIMABDU | Crafted to Create";

/* This is the line printed under the result in search, and for anything that
   reads the site secondhand (summarisers, assistants, previews) it is often
   the only sentence about it they ever see. It has to carry the launch, not
   just the biography. */
export const SITE_DESCRIPTION =
  "Abdullah Alhariri (KINGKIMABDU), student developer in Germany. Vertisova, an Android posture and screen-distance tracker, is out now on Google Play.";

export const AUTHOR_NAME = "Abdullah Alhariri";

export const GITHUB_URL = "https://github.com/KINGKIMABDU";

export const VERTISOVA_PLAY =
  "https://play.google.com/store/apps/details?id=com.kingkimabdu.vertisova";

export const VERTISOVA_GITHUB = "https://github.com/KINGKIMABDU/Vertisova";

// Public Play Store release. Bumping a build does not change this.
export const VERTISOVA_RELEASE_DATE = "2026-08-06";
