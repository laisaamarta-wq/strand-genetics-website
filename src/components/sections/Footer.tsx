"use client";

import { type CSSProperties } from "react";
import { footer } from "@/content/site";
import { Reveal } from "@/components/motion/Reveal";

export function Footer() {
  const letters = "STRAND".split("");
  return (
    <footer data-nav-tone="dark" className="relative z-0 bg-ink pt-24 text-paper lg:sticky lg:bottom-0 lg:pt-32">
      <div className="grid-site gap-y-12">
        <p className="t-lead col-span-4 max-w-[26ch] md:col-span-3 lg:col-span-4">
          Genetic testing and DNA analysis, read with precision and explained with care.
        </p>
        {footer.columns.map((col, ci) => (
          <nav
            key={col.title}
            aria-label={col.title}
            className={`col-span-2 md:col-span-2 lg:col-span-2 ${ci === 0 ? "lg:col-start-7" : ""} ${ci === 1 ? "md:col-span-3 lg:col-span-2" : ""}`}
          >
            <h2 className="t-mono opacity-50">{col.title}</h2>
            <ul className="mt-5 space-y-1 text-[15px] tracking-[-0.01em]">
              {col.links.map((l) => (
                <li key={l.label}>
                  {l.href ? (
                    <a href={l.href} className="inline-block py-1"><span className="link-u pb-0.5">{l.label}</span></a>
                  ) : (
                    <span className="inline-block py-1 opacity-60">{l.label}</span>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="grid-site mt-24 gap-y-6 border-t border-line-inv pt-6 lg:mt-32">
        <div className="col-span-4 md:col-span-5 lg:col-span-6">
          <p className="t-small">{footer.concept}</p>
          <p className="t-small mt-2 opacity-50">{footer.disclaimer}</p>
        </div>
        <p className="t-mono col-span-4 opacity-50 md:col-span-3 md:text-right lg:col-span-3 lg:col-start-10">{footer.copyright}</p>
      </div>

      <Reveal kind="group" className="overflow-hidden px-site pb-2" >
        <p
          aria-hidden="true"
          className="flex justify-between text-[25.6vw] font-medium leading-[0.78] tracking-[-0.06em]"
        >
          {letters.map((l, i) => (
            <span key={i} className="inline-block overflow-hidden pt-[0.04em]">
              <span className="wordmark-letter" style={{ "--i": i } as CSSProperties}>{l}</span>
            </span>
          ))}
        </p>
      </Reveal>
    </footer>
  );
}
