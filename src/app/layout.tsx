import type { Metadata, Viewport } from "next";
import { Fraunces, Karla, Noto_Serif_KR } from "next/font/google";
import "./globals.css";
import { STRUCTURED_DATA } from "@/lib/structured-data";
import {
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
  SITE_URL,
  AUTHOR_NAME,
} from "@/lib/site";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const karla = Karla({
  variable: "--font-karla",
  subsets: ["latin"],
});

/* There is no third family any more. The micro-labels used to be DM Mono,
   before that IBM Plex Mono, and either way a monospace set in caps with wide
   tracking is *the* stock eyebrow of every generated portfolio — the slashed
   zero on "01" gave the whole page away. They're Karla now, at 500 with the
   same caps and tracking, so the page is two typefaces doing three jobs
   instead of three typefaces arguing. The label still reads as a label; case,
   size and colour were always what said so, not the letterforms. */

const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-kr",
  weight: ["400", "600"],
  preload: false,
});

/* The old description listed interests and stopped there. Nothing in it said
   an app had shipped, so anything reading the site through search results had
   the page claiming a launch and the snippet not corroborating it, and hedged
   accordingly. SITE_DESCRIPTION now carries the app and the store, and the
   JSON-LD below carries the date and the listing URL. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: AUTHOR_NAME, url: SITE_URL }],
  creator: AUTHOR_NAME,
  alternates: { canonical: "/" },
  appleWebApp: { title: SITE_NAME, capable: true },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    /* The app icon read as a generic favicon in link previews. This is a
       page about a person, so the preview should show the person — the
       same photo the Person node in the JSON-LD already points at. */
    images: [
      { url: "/profile.png", width: 640, height: 640, alt: AUTHOR_NAME },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/profile.png"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4ec" },
    { media: "(prefers-color-scheme: dark)", color: "#13160f" },
  ],
};

/* Runs before first paint: a stored choice wins, otherwise the CSS media
   query already has it right and we leave the attribute off entirely. */
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t)}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${karla.variable} ${notoSerifKr.variable} h-full antialiased`}
    >
      {/* First child of <body>, not <head>: browser extensions like to
          prepend their own scripts to <head>, which React then tries to
          reconcile against this one. Still runs before anything paints. */}
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />
        {children}
      </body>
    </html>
  );
}
