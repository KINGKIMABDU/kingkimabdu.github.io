import BlobLoader from "@/components/BlobLoader";

export default function Loading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-paper">
      <BlobLoader size={140} />
      <p className="font-label font-medium text-[11px] uppercase tracking-[0.35em] text-ink-soft">
        Loading
      </p>
    </div>
  );
}
