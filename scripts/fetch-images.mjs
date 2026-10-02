// Fetches Strand's 12 generated images (GPT Image 2.5 via Higgsfield) and writes
// web-optimised WebP files into src/assets/images. Runs before `dev` / `build`;
// skipped once done (force with `npm run images -- --force`). Never fails the build:
// if the network is unavailable the existing files are kept.
import { writeFile, readFile, stat, mkdir } from "node:fs/promises";
import path from "node:path";

const CDN = "https://d8j0ntlcm91z4.cloudfront.net/user_3C15E03naKYn0k12cqxNShlIybX/";
// name → [source file, max width]
const SOURCES = {
  "hero-helix": ["hf_20261001_102105_d86d860a-3cd0-4091-8399-1bd9437e77e7.png", 2688],
  "hero-particles": ["hf_20261001_102105_62b325fd-3409-4f58-bacb-42fce962b35d.png", 1024],
  chromosome: ["hf_20261001_102105_67e06ca6-4d55-4202-a6a6-950801b8990c.png", 1440],
  lab: ["hf_20261001_102104_7439fabd-0b17-4c02-80f0-3ce81873a4a3.png", 2560],
  droplet: ["hf_20261001_102105_c3ae988c-c265-4a12-b15b-887e047c3623.png", 1200],
  landscape: ["hf_20261001_102105_4d34dc11-1d41-49e8-9568-8cfe985aa098.png", 2688],
  hands: ["hf_20261001_102104_e46c7ebd-90ec-4e70-847c-fb87957efd27.png", 1440],
  kit: ["hf_20261001_102105_a7f5c7cc-a934-42b8-8e2a-c6ba038d0f07.png", 1440],
  tubes: ["hf_20261001_102105_2f94b3f2-c3ae-4616-a77a-ecfb435e4168.png", 1440],
  flowcell: ["hf_20261001_102104_14ab8ace-328a-4ae1-9acd-6df9c260feb0.png", 1440],
  report: ["hf_20261001_102105_a042e6a4-d36c-4d11-8aeb-b38179aa7eec.png", 1440],
  fragment: ["hf_20261001_102104_04736064-630f-4ce8-ad6a-2bb6e2689013.png", 2560],
};

const outDir = path.join(process.cwd(), "src", "assets", "images");
const rawDir = path.join(process.cwd(), "assets-raw");
const MARKER = path.join(outDir, ".fetched");
const force = process.argv.includes("--force");

await mkdir(outDir, { recursive: true });
await mkdir(rawDir, { recursive: true });
if (!force) {
  try {
    await stat(MARKER);
    process.exit(0);
  } catch {}
}

let sharp = null;
try {
  sharp = (await import("sharp")).default;
} catch {
  console.warn("[images] sharp not available — saving originals without re-encoding");
}

let ok = 0;
for (const [name, [file, maxW]] of Object.entries(SOURCES)) {
  const rawPath = path.join(rawDir, `${name}.png`);
  try {
    let buf;
    try {
      buf = await readFile(rawPath); // reuse a previous download
    } catch {
      const res = await fetch(CDN + file, { signal: AbortSignal.timeout(60000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      buf = Buffer.from(await res.arrayBuffer());
      await writeFile(rawPath, buf);
    }
    const out = path.join(outDir, `${name}.webp`);
    if (sharp) {
      await sharp(buf).resize({ width: maxW, withoutEnlargement: true }).webp({ quality: 80, alphaQuality: 90, effort: 5 }).toFile(out);
    } else {
      await writeFile(out, buf);
    }
    console.log(`[images] ${name}`);
    ok++;
  } catch (err) {
    console.warn(`[images] ${name}: ${err.message} — keeping existing file`);
  }
}
if (ok === Object.keys(SOURCES).length) await writeFile(MARKER, new Date().toISOString());
console.log(`[images] ${ok}/${Object.keys(SOURCES).length} ready`);
