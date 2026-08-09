import type { Metadata, Viewport } from "next";
import { Fraunces, Karla, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "KINGKIMABDU | Crafted to Create",
  description:
    "Abdullah Alhariri (KINGKIMABDU) — student in Germany building software and hardware projects, running Arch Linux, and working toward medicine.",
  applicationName: "KINGKIMABDU",
  appleWebApp: { title: "KINGKIMABDU", capable: true },
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
        {children}
      </body>
    </html>
  );
}
