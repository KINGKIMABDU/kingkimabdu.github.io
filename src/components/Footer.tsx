import { AwardBadge } from "@/components/AwardBadge";
import ThemeToggle from "@/components/ThemeToggle";

export default function Footer() {
  return (
    <footer className="pb-12">
      {/* Inset to the content column and fading at both ends, rather than a
          full-bleed border on the <footer> itself. The old one ran edge to
          edge past every margin on the page and was the only element that
          did. */}
      <div className="mx-auto max-w-[92rem] px-6 sm:px-8">
        <hr className="rule-fade" aria-hidden="true" />
      </div>

      <div className="mx-auto flex max-w-[92rem] flex-col items-center gap-10 px-6 pt-12 sm:px-8 md:flex-row md:items-center md:justify-between">
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

        <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-3">
            <span className="font-label font-medium text-[10px] uppercase tracking-[0.25em] text-ink-soft">
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
