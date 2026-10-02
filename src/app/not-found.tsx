import Link from "next/link";
import { CtaLink, StrandMark } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <main id="main" className="grid-site min-h-[100svh] content-between gap-y-16 bg-paper py-8 text-ink">
      <Link href="/" className="col-span-full flex items-center gap-2 text-[17px] font-medium tracking-[-0.03em]">
        <StrandMark /> Strand
      </Link>
      <div className="col-span-full lg:col-span-8">
        <p className="t-mono text-mute">(404) Not found</p>
        <h1 className="t-display-xl mt-6">
          Sequence
          <br />
          not found.
        </h1>
        <p className="t-lead mt-8 max-w-[36ch] text-ink-2">This page does not exist, or it has moved.</p>
        <div className="mt-10">
          <CtaLink href="/">Back to Strand</CtaLink>
        </div>
      </div>
      <p className="t-mono col-span-full text-mute">Strand — a website concept</p>
    </main>
  );
}
