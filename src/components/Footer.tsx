import { AwardBadge } from "@/components/AwardBadge";
import ThemeToggle from "@/components/ThemeToggle";

export default function Footer() {
  return (
    <footer className="pb-12">
      {/* Inset to the content column and fading at both ends, rather than a
          full-bleed border on the <footer> itself. The old one ran edge to
          edge past every margin on the page and was the only element that
          did. */}
      <div className="shell">
        <hr className="rule-fade" aria-hidden="true" />
      </div>

      <div className="shell flex flex-col items-center gap-10 pt-12 md:flex-row md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <p className="font-kr text-lg text-ink">
            킹키마브두 · KINGKIMABDU · Abdullah
          </p>
          {/* This is a sentence, not a label — it was only in mono because
              everything small was. */}
          <p className="mt-2 text-sm text-ink-soft">
            © {new Date().getFullYear()} Abdullah Alhariri — built with care,
            coffee, and discipline.
          </p>
        </div>

        {/* On phones the switch sits on the left and the Ko-fi badge to its
            right — a single tidy row rather than a tall stack. The "Theme"
            caption only earns its width from sm up; below that the switch
            speaks for itself and the space goes to the badge. */}
        <div className="flex w-full items-center justify-center gap-3 sm:w-auto sm:gap-8">
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden font-label font-medium text-[10px] uppercase tracking-[0.25em] text-ink-soft sm:inline">
              Theme
            </span>
            <ThemeToggle />
          </div>
          <AwardBadge
            topText="Ko-fi"
            text="Support my work"
            link="https://ko-fi.com/kingkimabdu"
          />
        </div>
      </div>
    </footer>
  );
}
