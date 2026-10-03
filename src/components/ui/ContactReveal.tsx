"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Arrow, Plus } from "@/components/ui/primitives";

/**
 * Quiet contact reveal: only the labels are on the page. The real address and number
 * are kept encoded (not present in the HTML) and decoded on the visitor's click,
 * which keeps them away from scrapers and out of the visible design until asked for.
 */

// base64 of the reversed strings — decoded only on interaction
const ENC = {
  email: "bW9jLmxpYW1nQGF0cmFtLmFhc2lhbA==",
  phone: "NDQwMzAyODIxNzMr",
};
const decode = (s: string) => atob(s).split("").reverse().join("");
const pretty = (p: string) => p.replace(/^\+371(\d{2})(\d{3})(\d{3})$/, "+371 $1 $2 $3");

type Kind = "email" | "phone";

export function ContactReveal({
  className = "",
  label = "Get in touch",
  variant = "inline",
}: {
  className?: string;
  label?: string;
  /** "column" matches the footer's link columns (heading + list); "inline" is a compact mono row */
  variant?: "inline" | "column";
}) {
  const [open, setOpen] = useState<Kind | null>(null);
  const [value, setValue] = useState<{ email?: string; phone?: string }>({});
  const [copied, setCopied] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const timer = useRef<number>(0);

  const toggle = (k: Kind) => {
    setCopied(false);
    if (!value[k]) setValue((v) => ({ ...v, [k]: decode(ENC[k]) }));
    setOpen((o) => (o === k ? null : k));
  };

  // close on Escape or a click elsewhere
  useEffect(() => {
    if (!open) return;
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    const out = (e: PointerEvent) => !root.current?.contains(e.target as Node) && setOpen(null);
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", out);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", out);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async () => {
    const v = open && value[open];
    if (!v) return;
    try {
      await navigator.clipboard.writeText(v);
    } catch {
      const t = document.createElement("textarea");
      t.value = v;
      t.setAttribute("readonly", "");
      t.style.position = "fixed";
      t.style.opacity = "0";
      document.body.appendChild(t);
      t.select();
      document.execCommand("copy");
      t.remove();
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 1800);
  };

  const v = open ? value[open] : undefined;
  const href = open === "email" ? `mailto:${v}` : open === "phone" ? `tel:${v}` : undefined;

  return (
    <div ref={root} className={`contact-reveal ${className}`} data-open={open ?? "none"}>
      {variant === "column" ? (
        <>
          <h2 className="t-mono opacity-50">{label}</h2>
          <ul className="mt-5 space-y-1 text-[15px] tracking-[-0.01em]">
            {(["email", "phone"] as Kind[]).map((k) => (
              <li key={k}>
                <button
                  type="button"
                  className="contact-reveal__btn inline-flex items-center gap-2 py-1"
                  aria-expanded={open === k}
                  aria-controls={panelId}
                  data-active={open === k}
                  onClick={() => toggle(k)}
                >
                  <span className="link-u pb-0.5">{k === "email" ? "Email" : "Phone"}</span>
                  <Plus size={9} className="contact-reveal__plus opacity-60" />
                </button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <p className="t-mono opacity-50">{label}</p>
          <div className="mt-3 flex gap-6">
            {(["email", "phone"] as Kind[]).map((k) => (
              <button
                key={k}
                type="button"
                className="contact-reveal__btn t-mono inline-flex items-center gap-2 py-1"
                aria-expanded={open === k}
                aria-controls={panelId}
                data-active={open === k}
                onClick={() => toggle(k)}
              >
                <span className="link-u pb-0.5">{k === "email" ? "Email" : "Phone"}</span>
                <Plus size={8} className="contact-reveal__plus" />
              </button>
            ))}
          </div>
        </>
      )}

      <div id={panelId} className="contact-reveal__panel" aria-live="polite">
        <div>
          {open && v && (
            <div key={open} className="contact-reveal__row flex flex-wrap items-center gap-x-4 gap-y-2 pt-3">
              <a href={href} className="group inline-flex items-center gap-2 text-[15px] tracking-[-0.01em]">
                <span className="link-u pb-0.5">{open === "phone" ? pretty(v) : v}</span>
                <Arrow size={11} className="-rotate-45 opacity-60 transition-transform duration-500 group-hover:rotate-0" />
              </a>
              <button type="button" className="contact-reveal__copy t-mono py-1" onClick={copy}>
                <span className={copied ? "opacity-100" : "opacity-50 hover:opacity-100"}>{copied ? "Copied" : "Copy"}</span>
              </button>
              {open === "phone" && (
                <a
                  href={`https://wa.me/${v.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="t-mono py-1 opacity-50 transition-opacity hover:opacity-100"
                >
                  WhatsApp
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
