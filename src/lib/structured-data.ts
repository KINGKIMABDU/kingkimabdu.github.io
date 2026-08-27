import {
  AUTHOR_NAME,
  GITHUB_URL,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  VERTISOVA_GITHUB,
  VERTISOVA_PLAY,
  VERTISOVA_RELEASE_DATE,
} from "@/lib/site";

const PERSON_ID = `${SITE_URL}/#person`;
const APP_ID = `${SITE_URL}/#vertisova`;

/* Prose is not evidence. A crawler reading "now out in the open" has no way to
   tell a public store release from an open-sourced repo, so it hedges, and an
   assistant summarising the site hedges with it. This graph states the same
   thing in the vocabulary those readers actually parse: a MobileApplication
   with a store URL, a price and a publication date, authored by the person the
   site is about. Everything here is checkable against the listing itself. */
export const STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": PERSON_ID,
      name: AUTHOR_NAME,
      alternateName: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/profile.png`,
      jobTitle: "Software developer",
      homeLocation: { "@type": "Place", name: "Germany" },
      sameAs: [GITHUB_URL, VERTISOVA_PLAY],
    },
    {
      "@type": "MobileApplication",
      "@id": APP_ID,
      name: "Vertisova",
      applicationCategory: "HealthApplication",
      operatingSystem: "Android",
      description:
        "Posture and screen-distance tracker for Android. On-device camera analysis watches neck, shoulders and back, and alerts you when you slouch or sit too close to the screen.",
      url: VERTISOVA_PLAY,
      installUrl: VERTISOVA_PLAY,
      downloadUrl: VERTISOVA_PLAY,
      datePublished: VERTISOVA_RELEASE_DATE,
      inLanguage: "en",
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      codeRepository: VERTISOVA_GITHUB,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        url: VERTISOVA_PLAY,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      about: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
    },
  ],
};
