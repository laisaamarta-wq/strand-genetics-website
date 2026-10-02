// Builds a single, self-contained HTML preview of the site (all CSS, JS, fonts
// and images inlined). It opens straight from disk — no server, no hosting.
//   npm run preview:file   →   preview/strand-preview.html
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const out = path.join(root, "out-preview");
if (existsSync(out)) rmSync(out, { recursive: true });
execSync("npx next build", { stdio: "inherit", env: { ...process.env, PREVIEW: "1" } });

const mime = { ".woff2": "font/woff2", ".webp": "image/webp", ".png": "image/png", ".svg": "image/svg+xml", ".jpg": "image/jpeg" };
const asset = (p) => path.join(out, decodeURIComponent(p.replace(/^\//, "").split("?")[0]));
const dataUri = (p) => `data:${mime[path.extname(p)] ?? "application/octet-stream"};base64,${readFileSync(asset(p)).toString("base64")}`;

let html = readFileSync(path.join(out, "index.html"), "utf8");

// scripts → inline, keeping document order
html = html.replace(/<script src="([^"]+)"[^>]*><\/script>/g, (_, src) => {
  const js = readFileSync(asset(src), "utf8").replace(/<\/script/gi, "<\\/script");
  return `<script>${js}</script>`;
});

// every static css/media reference — in markup *and* in the RSC payload — becomes a data URI,
// so stylesheet links and font preloads React injects at runtime resolve offline too
const refs = new Set(html.match(/\/_next\/static\/(?:css|media)\/[A-Za-z0-9._-]+/g) ?? []);
const css = [...refs].filter((r) => r.endsWith(".css"));
const media = [...refs].filter((r) => !r.endsWith(".css"));
for (const u of media) html = html.split(u).join(dataUri(u));
for (const u of css) {
  const text = readFileSync(asset(u), "utf8").replace(/url\((\/_next\/[^)]+)\)/g, (_m, f) => `url(${dataUri(f)})`);
  html = html.split(u).join(`data:text/css;base64,${Buffer.from(text).toString("base64")}`);
}
html = html.replace(/<link rel="icon"[^>]*>/g, "");
html = html.replace(/<link[^>]*href="\/_next\/static\/chunks\/[^"]+"[^>]*>/g, "");

mkdirSync(path.join(root, "preview"), { recursive: true });
const file = path.join(root, "preview", "strand-preview.html");
writeFileSync(file, html);
console.log(`preview → ${path.relative(root, file)}  (${(html.length / 1024 / 1024).toFixed(1)} MB)`);
