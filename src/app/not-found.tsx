import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center">
      {/* Sad face — from Uiverse.io by preet_7613 */}
      <main className="my-custom-face-container">
        <svg className="face" viewBox="0 0 320 380">
          <g
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="25"
          >
            <g className="face__eyes" transform="translate(0,112.5)">
              <g transform="translate(15,0)">
                <polyline
                  className="face__eye-lid"
                  points="37,0 0,120 75,120"
                ></polyline>
                <polyline
                  className="face__pupil"
                  points="55,120 55,155"
                  strokeDasharray="35 35"
                ></polyline>
              </g>
              <g transform="translate(230,0)">
                <polyline
                  className="face__eye-lid"
                  points="37,0 0,120 75,120"
                ></polyline>
                <polyline
                  className="face__pupil"
                  points="55,120 55,155"
                  strokeDasharray="35 35"
                ></polyline>
              </g>
            </g>
            <rect
              className="face__nose"
              x="132.5"
              y="112.5"
              width="55"
              height="155"
              rx="4"
              ry="4"
            ></rect>
            <g transform="translate(65,334)" strokeDasharray="102 102">
              <path className="face__mouth-left" d="M 0 30 C 0 30 40 0 95 0"></path>
              <path className="face__mouth-right" d="M 95 0 C 150 0 190 30 190 30"></path>
            </g>
          </g>
        </svg>
      </main>

      <p className="font-label font-medium text-xs uppercase tracking-[0.35em] text-matcha-deep">
        404 — page not found
      </p>
      <h1 className="mt-4 font-serif text-4xl text-ink md:text-5xl">
        This page wandered off.
      </h1>
      <p className="mt-4 max-w-md text-ink-soft">
        Whatever you were looking for isn&apos;t here. Let&apos;s get you back
        to solid ground.
      </p>
      <Link href="/" className="btn-sweep mt-8 font-medium">
        <span className="btn-sweep-content">Back home</span>
      </Link>
    </div>
  );
}
