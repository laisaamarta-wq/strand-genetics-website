import type { Metadata } from "next";
import Link from "next/link";
import { StrandMark } from "@/components/ui/primitives";
import { legal } from "@/content/legal";

export const metadata: Metadata = {
  title: "Legal & credits",
  description: "Privacy, terms, accessibility and credits for the Strand website concept.",
};

export default function LegalPage() {
  return (
    <div className="min-h-[100svh] bg-paper text-ink">
      <header className="grid-site h-[var(--nav-h)] items-center border-b border-line">
        <Link href="/" className="col-span-2 flex items-center gap-2 text-[17px] font-medium tracking-[-0.03em]">
          <StrandMark /> Strand
        </Link>
        <Link href="/" className="col-span-2 col-start-3 justify-self-end py-2 text-[14px] md:col-start-7 lg:col-start-11">
          <span className="link-u pb-0.5">← Back to site</span>
        </Link>
      </header>

      <main id="main" className="grid-site gap-y-16 pb-32 pt-24 lg:pt-32">
        <div className="col-span-4 md:col-span-8 lg:col-span-3">
          <p className="t-mono text-mute">(00) Legal</p>
          <nav aria-label="On this page" className="mt-8 hidden lg:block">
            <ul className="space-y-1 text-[15px]">
              {legal.sections.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className="inline-block py-1">
                    <span className="link-u pb-0.5">{s.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="col-span-4 md:col-span-8 lg:col-span-7 lg:col-start-5">
          <h1 className="t-display-m">{legal.title}</h1>
          <p className="t-lead mt-8 max-w-[52ch] text-ink-2">{legal.intro}</p>

          {legal.sections.map((s, i) => (
            <section key={s.id} id={s.id} aria-labelledby={`${s.id}-h`} className="mt-20 scroll-mt-12 border-t border-line pt-6">
              <div className="flex items-baseline justify-between">
                <h2 id={`${s.id}-h`} className="t-heading">{s.title}</h2>
                <span className="t-mono text-mute">0{i + 1}</span>
              </div>
              {s.body.map((p, j) => (
                <p key={j} className="t-body mt-5 max-w-[60ch] text-ink-2">{p}</p>
              ))}
            </section>
          ))}

          <p className="t-mono mt-24 text-mute">Last updated · October 2026</p>
        </div>
      </main>
    </div>
  );
}
