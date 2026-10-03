"use client";

import { caseMeta, chapter, overview } from "@/content/case";
import { Reveal } from "@/components/motion/Reveal";
import { Arrow } from "@/components/ui/primitives";

export function Overview() {
  const c = chapter("cs-overview");
  return (
    <section id={c.id} data-chapter={c.id} aria-label={c.label} className="relative pt-[clamp(120px,14vw,220px)]">
      <div className="grid-site gap-y-10">
        <Reveal className="col-span-4 md:col-span-2 lg:col-span-3">
          <p className="t-mono flex items-baseline gap-3">
            <span className="opacity-50">{c.index}</span>
            <span>{c.label}</span>
          </p>
        </Reveal>
        <Reveal as="p" className="t-statement col-span-4 md:col-span-6 lg:col-span-8 lg:col-start-4">
          {overview.statement}
        </Reveal>
        <Reveal index={1} as="p" className="t-lead col-span-4 max-w-[46ch] text-ink-2 md:col-span-5 md:col-start-3 lg:col-span-5 lg:col-start-4">
          {overview.body}
        </Reveal>
      </div>

      <dl className="grid-site cs-gap-m gap-y-8">
        {overview.facts.map((f, i) => (
          <Reveal
            key={f.k}
            index={i}
            className={`cs-rule col-span-2 pt-5 md:col-span-2 lg:col-span-2 ${i === 0 ? "lg:col-start-4" : ""} ${i === 1 ? "md:col-span-4 lg:col-span-3" : ""} ${i === 4 ? "lg:col-start-4" : ""}`}
          >
            <dt className="t-mono text-mute">{f.k}</dt>
            <dd className="t-body mt-3 text-ink">{f.v}</dd>
          </Reveal>
        ))}
        <Reveal index={overview.facts.length} className="cs-rule col-span-4 pt-5 md:col-span-2 lg:col-span-3">
          <dt className="t-mono text-mute">Live</dt>
          <dd className="mt-3">
            <a href={caseMeta.liveUrl} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-[15px]">
              <span className="link-u pb-0.5">{caseMeta.liveLabel}</span>
              <Arrow className="-rotate-45 transition-transform duration-500 group-hover:rotate-0" />
            </a>
          </dd>
        </Reveal>
      </dl>
      <div className="grid-site mt-10">
        <Reveal as="p" className="t-small col-span-4 text-mute md:col-span-6 lg:col-span-5 lg:col-start-4">
          {overview.note}
        </Reveal>
      </div>
    </section>
  );
}
