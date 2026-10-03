# Strand — genetic laboratory website concept

An art-directed, motion-rich landing page for **Strand**, a fictional genetic testing laboratory.
Editorial, Swiss-inspired layout on a strict 12-column grid, scroll-driven storytelling and
custom imagery generated with Higgsfield.

**Concept, design & development:** Marta Jakovleva

> Strand is not a real laboratory. The site offers no medical services and collects no data.

## Stack

Next.js 15 (App Router, static) · React 19 · TypeScript · Tailwind CSS 4 · Lenis (smooth scroll).
No other runtime libraries, no environment variables, no backend.

## Run locally

```bash
npm install
npm run dev                    # http://localhost:3000
```

On a Mac you can also double-click `start-site.command`.

## Production build

```bash
npm run build
npm start                      # serves the production build on :3000
```

Deployed on Vercel with the default Next.js preset (install `npm install`, build `next build`,
output `.next`). Every push to `main` triggers a new production deployment.

## Pages

| Route | |
|---|---|
| `/` | Landing page: hero, approach, testing, science, process, about, perspective, call to action |
| `/behance` | Case study: concept, art direction, live interaction showcases, system, responsive, every screen |
| `/legal` | Privacy, terms, accessibility and credits |
| `/sitemap.xml`, `/robots.txt` | Generated from `src/app` |
| any other path | Custom 404 |

## Design system

| | Desktop ≥1200 | Tablet 768–1199 | Mobile |
|---|---|---|---|
| Columns | 12 | 8 | 4 |
| Gutter | 16px | 16px | 16px |
| Margin | 40px | 24px | 16px |

8px base unit. Type: Host Grotesk and IBM Plex Mono (both SIL OFL, self-hosted).
Ink `#0C0C0D`, paper `#FFFFFF` / `#F4F4F2`, one accent, violet ash `#7A6F9B`, used only on interaction.
Press **Shift + G** on the page to toggle the column grid overlay.

## Structure

```
src/
  app/            layout + metadata, page, legal, not-found, sitemap, robots, OG image, globals.css
  content/        all copy (site.ts, legal.ts)
  lib/images.ts   image registry + alt text
  assets/images/  generated imagery, optimised WebP (~820 KB total)
  fonts/          self-hosted woff2
  components/
    motion/       SmoothScroll (one scroll loop → CSS variables), hooks, Reveal/SplitLines, Interactions
    sections/     Loader, Nav, Hero, Intro, Services, Science, Process, About, Immersive, FinalCta, Footer
    case/         /behance case study: frames, chapters, live showcases (reuse the sections above)
    ui/           primitives (CTA, labels, icons), ParallaxImage
scripts/
  fetch-images.mjs   re-download + re-encode the source imagery (`npm run images`)
  build-preview.mjs  single self-contained HTML preview (`npm run preview:file`)
```

Scroll-linked motion writes progress into CSS custom properties (`--p`, `--e`, `--mx` …) and CSS
does the transforms, so React never re-renders per frame. `prefers-reduced-motion` turns off
smooth scrolling, parallax, the loader and every reveal.

## Case study (`/behance`)

A Behance-style presentation of the project, built from the production code itself: the Hero (with Loader),
Testing and Process sections run live inside it, the Approach reading and Science frame use the site's own CSS
mechanics with a scrub control, and the column grid toggle is the site's Shift + G overlay. Static frames are real
screenshots of the production build (`src/assets/case`, captured at 1440, 834 and 390 px). Copy lives in
`src/content/case.ts`; styles in `src/app/behance/case.css` load on that route only.

## Imagery

All 12 images were generated for this project with GPT Image 2.5 via Higgsfield and art-directed per
slot: aspect ratio, negative space for type, focal point.
