/**
 * Strand — live DNA helix (WebGL, three.js).
 *
 * A procedural double helix built from thousands of small matte spheres, art-directed to match the
 * original hero image: clay-white clusters along two backbones, finer spheres on the base-pair rungs,
 * the far end dissolving into white. It reacts to presence rather than performing:
 *   - pointer   → the whole molecule leans and the camera shifts a little (perspective, parallax)
 *   - proximity → spheres near the cursor drift apart a few percent, like the structure breathing
 *   - hover     → the sphere under the cursor brightens, swells ~7% and takes a faint violet-ash halo
 *   - click     → a soft wave runs along the helix from the point touched, then settles
 *   - idle      → slow spin around its own axis, weightless drift
 *   - scroll    → the helix recedes into depth and opens the page beneath it
 *   - life      → (optional) ash violet flows slowly through the structure, as if the code were at work:
 *                 currents travel along the strands, base pairs light as they pass, single spheres
 *                 breathe on their own clock, and a faint violet glow lives in the gaps between them.
 *                 It builds up after the white sculpture has been seen: white → grey → ash violet.
 * Everything is eased; nothing jumps. One render loop, paused when the hero is off-screen.
 */
import * as THREE from "three";

export type HelixOptions = {
  canvas: HTMLCanvasElement;
  /** element whose scroll position drives the recede (the hero section) */
  section: HTMLElement;
  /** DOM nodes that should ride on the helix (hotspots, hint); positioned via CSS vars --ax/--ay */
  anchors: (HTMLElement | null)[];
  onFirstFrame?: () => void;
  onInteract?: () => void;
  /** intensity of the violet "life" inside the molecule; ?life=subtle|living|atmospheric overrides */
  life?: LifeLevel;
};

/* ------------------------------------------------------------------ */
/* life — ash violet living inside the molecule                         */
/* ------------------------------------------------------------------ */

export type LifeLevel = "off" | "subtle" | "living" | "atmospheric";

type LifePreset = {
  amt: number; // how far a sphere can travel along white → grey → ash violet → luminous
  reach: number; // how much of the structure the currents cover
  glow: number; // opacity of the violet glow in the gaps between spheres
  shadow: number; // violet in the shaded sides of every sphere
  rest: number; // permanent tonal variation of a few spheres
};

const LIFE: Record<Exclude<LifeLevel, "off">, LifePreset> = {
  subtle: { amt: 0.55, reach: 0.6, glow: 0, shadow: 0.2, rest: 0.1 },
  living: { amt: 0.85, reach: 0.85, glow: 0.22, shadow: 0.4, rest: 0.16 },
  atmospheric: { amt: 1, reach: 1, glow: 0.4, shadow: 0.65, rest: 0.24 },
};

export function readLifeLevel(fallback: LifeLevel = "off"): LifeLevel {
  if (typeof window === "undefined") return fallback;
  const q = new URLSearchParams(window.location.search).get("life")?.toLowerCase();
  const map: Record<string, LifeLevel> = {
    "0": "off", off: "off", "1": "subtle", "01": "subtle", subtle: "subtle",
    "2": "living", "02": "living", living: "living", "3": "atmospheric", "03": "atmospheric", atmospheric: "atmospheric",
  };
  return (q && map[q]) || fallback;
}

// palette (sRGB): grey-lavender → ash violet #7A6F9B → luminous violet
const LAV = [0.815, 0.8, 0.86];
const ASH = [0.478, 0.435, 0.608];
const LUM = [0.6, 0.54, 0.84];
const sstep = (a: number, b: number, x: number) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};
/** white-grey base b → violet, by life l in 0..1. Writes into out. */
function lifeColor(b: number, l: number, out: number[]) {
  let r = b, g = b, bl = b * 0.995;
  const k1 = sstep(0, 0.4, l);
  r += (LAV[0] - r) * k1; g += (LAV[1] - g) * k1; bl += (LAV[2] - bl) * k1;
  const k2 = sstep(0.3, 0.85, l);
  r += (ASH[0] - r) * k2; g += (ASH[1] - g) * k2; bl += (ASH[2] - bl) * k2;
  const k3 = sstep(0.82, 1, l);
  r += (LUM[0] - r) * k3; g += (LUM[1] - g) * k3; bl += (LUM[2] - bl) * k3;
  out[0] = r; out[1] = g; out[2] = bl;
}

/* ------------------------------------------------------------------ */
/* geometry                                                             */
/* ------------------------------------------------------------------ */

export const L = 27; // helix length along local X
export const R = 1.62; // helix radius
const TURNS = 5.3;
const GROOVE = Math.PI * 0.82; // phase between the two strands (major / minor groove)

export type Inst = {
  bx: number; by: number; bz: number; // base position (local)
  r: number; // radius
  s: number; // position along axis, -L/2..L/2
  shade: number; // 0..1 base brightness offset
  kind: 0 | 1 | 2; // strand A, strand B, base-pair rung
  aff: number; // 0..1 how readily this sphere carries colour (life)
  seed: number; // 0..1 phase of its own slow breathing
  dx: number; dy: number; dz: number; // current displacement (eased)
  h: number; // highlight (eased)
  lit: boolean; // colour currently differs from base
};

function rand(seed: number) {
  // small deterministic PRNG so the molecule is the same on every load
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function buildHelix(detail: number): Inst[] {
  const rnd = rand(20260403);
  const out: Inst[] = [];
  const rl = rand(4101); // separate stream so the geometry stays identical
  let kind: 0 | 1 | 2 = 0;
  const push = (x: number, y: number, z: number, r: number, shade: number) => {
    const a = rl();
    out.push({
      bx: x, by: y, bz: z, r, s: x, shade, kind,
      aff: kind === 2 ? 0.55 + a * 0.45 : a * a, // the code (rungs) carries the signal; backbones only in places
      seed: rl(),
      dx: 0, dy: 0, dz: 0, h: 0, lit: false,
    });
  };

  const samples = Math.round(330 * detail);
  for (const phase of [0, GROOVE]) {
    kind = phase === 0 ? 0 : 1;
    for (let i = 0; i < samples; i++) {
      const t = i / (samples - 1);
      const x = -L / 2 + t * L;
      const a = t * TURNS * Math.PI * 2 + phase;
      const cy = Math.cos(a) * R;
      const cz = Math.sin(a) * R;
      // a lumpy cluster around the backbone point
      const k = 2 + Math.round(rnd() * 2 * detail);
      for (let j = 0; j < k; j++) {
        const big = rnd() < 0.15;
        const r = big ? 0.19 + rnd() * 0.05 : 0.12 + rnd() * 0.06;
        const u = rnd() * Math.PI * 2;
        const v = Math.acos(2 * rnd() - 1);
        const d = 0.07 + rnd() * 0.13;
        push(
          x + Math.sin(v) * Math.cos(u) * d * 0.7,
          cy + Math.sin(v) * Math.sin(u) * d,
          cz + Math.cos(v) * d,
          r,
          0.75 + rnd() * 0.25,
        );
      }
    }
  }

  // base-pair rungs: finer spheres bridging the strands
  const rungs = Math.round(TURNS * 10);
  kind = 2;
  for (let i = 0; i < rungs; i++) {
    const t = (i + 0.5) / rungs;
    const x = -L / 2 + t * L;
    const a = t * TURNS * Math.PI * 2;
    const ay = Math.cos(a) * R, az = Math.sin(a) * R;
    const by = Math.cos(a + GROOVE) * R, bz = Math.sin(a + GROOVE) * R;
    const n = 12;
    for (let j = 1; j < n; j++) {
      const f = j / n;
      const r = 0.085 + rnd() * 0.04;
      push(
        x + (rnd() - 0.5) * 0.08,
        ay + (by - ay) * f + (rnd() - 0.5) * 0.06,
        az + (bz - az) * f + (rnd() - 0.5) * 0.06,
        r,
        0.62 + rnd() * 0.2,
      );
    }
  }
  return out;
}

/* loose molecules close to the camera — the fastest parallax layer */
function buildLoose(): { x: number; y: number; z: number; r: number; c: number }[] {
  const rnd = rand(7);
  const clusters = [
    { x: -2.6, y: -3.5, z: 4, n: 11 },
    { x: 8.4, y: 1.6, z: -2, n: 3 },
  ];
  const out: { x: number; y: number; z: number; r: number; c: number }[] = [];
  clusters.forEach((cl, ci) => {
    for (let i = 0; i < cl.n; i++) {
      out.push({
        x: cl.x + (rnd() - 0.5) * 1.5,
        y: cl.y + (rnd() - 0.5) * 1.1,
        z: cl.z + (rnd() - 0.5) * 1.0,
        r: 0.08 + rnd() * 0.17,
        c: ci,
      });
    }
  });
  return out;
}

/* ------------------------------------------------------------------ */
/* scene                                                                */
/* ------------------------------------------------------------------ */

export function createHelix({ canvas, section, anchors, onFirstFrame, onInteract, life: lifeOpt = "off" }: HelixOptions) {
  const lifeLevel = readLifeLevel(lifeOpt);
  const LP = lifeLevel === "off" ? null : LIFE[lifeLevel];
  // Frame-exact recording for presentation videos (local builds with NEXT_PUBLIC_CAPTURE=1 only).
  const capture = process.env.NEXT_PUBLIC_CAPTURE === "1";
  let virtualTime = 0;
  const now = () => (capture ? virtualTime : performance.now() / 1000);

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = Math.min(window.innerWidth, window.innerHeight) < 700;
  const detail = coarse || small ? 0.7 : 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setClearColor(0xffffff, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NoToneMapping;
  let dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.75 : 2);
  renderer.setPixelRatio(dpr);

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xffffff, 15, 31);

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 200);
  camera.position.set(0, 0, 20);

  // clay light: bright sky, grey bounce, one soft key from the upper left
  const hemi = new THREE.HemisphereLight(0xffffff, 0x9c9c99, 2.2);
  scene.add(hemi);
  const groundGrey = new THREE.Color(0x9c9c99);
  const groundViolet = new THREE.Color(0x8a83a6); // shaded sides lean toward ash violet as life builds
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(-6, 9, 10);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xffffff, 0.22);
  rim.position.set(7, -3, 4);
  scene.add(rim);

  /* placement → tilt → spin → helix */
  const place = new THREE.Group();
  const tilt = new THREE.Group();
  const spin = new THREE.Group();
  place.add(tilt);
  tilt.add(spin);
  scene.add(place);

  const seg = detail < 1 ? [10, 8] : [14, 11];
  const sphere = new THREE.SphereGeometry(1, seg[0], seg[1]);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.92, metalness: 0 });

  const inst = buildHelix(detail);
  const N = inst.length;
  const mesh = new THREE.InstancedMesh(sphere, mat, N);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const base = new THREE.Color();
  for (let i = 0; i < N; i++) {
    const v = 0.86 + inst[i].shade * 0.14;
    mesh.setColorAt(i, base.setRGB(v, v, v * 0.995));
  }
  mesh.frustumCulled = false;
  spin.add(mesh);

  const loose = buildLoose();
  const looseMesh = new THREE.InstancedMesh(sphere, mat, loose.length);
  looseMesh.frustumCulled = false;
  loose.forEach((_, i) => looseMesh.setColorAt(i, base.setRGB(0.95, 0.95, 0.948)));
  scene.add(looseMesh);

  // hover halo: a soft violet-ash disc behind the hovered sphere (the accent only appears on interaction)
  const haloTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(122,111,155,0.55)");
    grd.addColorStop(0.45, "rgba(122,111,155,0.18)");
    grd.addColorStop(1, "rgba(122,111,155,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: haloTex, transparent: true, depthWrite: false, depthTest: false, opacity: 0 }));
  halo.renderOrder = 2;
  spin.add(halo);

  // life glow: soft violet light inside the helix, riding the currents; it shows only through the gaps
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(140,126,190,0.75)");
    grd.addColorStop(0.35, "rgba(132,120,176,0.32)");
    grd.addColorStop(0.7, "rgba(122,111,155,0.08)");
    grd.addColorStop(1, "rgba(122,111,155,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  })();
  const glows: THREE.Sprite[] = [];
  if (LP && LP.glow > 0) {
    for (let i = 0; i < 12; i++) {
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0 }));
      sp.renderOrder = 1;
      spin.add(sp);
      glows.push(sp);
    }
  }

  /* ---------------- layout ---------------- */
  let W = 1, H = 1;
  const layout = { x: 0, y: 0, rz: 0, ry: 0, s: 1 };
  function resize() {
    const r = canvas.getBoundingClientRect();
    W = Math.max(1, r.width);
    H = Math.max(1, r.height);
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    camera.updateProjectionMatrix();
    const a = W / H;
    // compositions tuned to the original hero image: a diagonal sweep, far end receding to the upper right
    if (a >= 1.15) Object.assign(layout, { x: 0.1, y: 2.95, rz: 0.22, ry: -0.34, s: 1.16 });
    else if (a >= 0.75) Object.assign(layout, { x: 0.9, y: 2.6, rz: 0.42, ry: -0.5, s: 0.82 });
    else Object.assign(layout, { x: 0.3, y: 2.5, rz: 0.62, ry: -0.4, s: 0.8 });
  }

  /* ---------------- input ---------------- */
  const ndc = new THREE.Vector2(0, 0);
  const ndcEase = new THREE.Vector2(0, 0);
  let pointerInside = false;
  let pointerMoved = false;
  let lastMove = 0;
  const onMove = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    pointerInside = x >= 0 && x <= 1 && y >= 0 && y <= 1 && e.pointerType !== "touch";
    ndc.set(Math.max(-1.2, Math.min(1.2, x * 2 - 1)), Math.max(-1.2, Math.min(1.2, -(y * 2 - 1))));
    pointerMoved = true;
    lastMove = now() * 1000;
  };
  const onLeave = () => (pointerInside = false);

  const raycaster = new THREE.Raycaster();
  let hovered = -1;

  type Wave = { s0: number; t0: number; amp: number };
  const waves: Wave[] = [];

  const pulse = (s0: number, amp = 1) => {
    waves.push({ s0, t0: now(), amp });
    if (waves.length > 4) waves.shift();
  };

  const onDown = (e: PointerEvent) => {
    const target = e.target as HTMLElement | null;
    if (target?.closest("a, button, input, textarea, [role=button]")) return;
    const r = canvas.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    if (x < 0 || x > 1 || y < 0 || y > 1) return;
    raycaster.setFromCamera(new THREE.Vector2(x * 2 - 1, -(y * 2 - 1)), camera);
    const hit = raycaster.intersectObject(mesh, false)[0];
    if (hit && hit.instanceId !== undefined) {
      pulse(inst[hit.instanceId].s, 1);
      onInteract?.();
      return;
    }
    // between spheres still counts: pulse from the nearest point on the helix
    place.getWorldPosition(tmp);
    plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(v3).negate(), tmp);
    if (raycaster.ray.intersectPlane(plane, localPointer)) {
      mesh.worldToLocal(localPointer);
      if (Math.hypot(localPointer.y, localPointer.z) < R + 1.1 && Math.abs(localPointer.x) < L / 2) {
        pulse(localPointer.x, 1);
        onInteract?.();
      }
    }
  };

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onDown);
  document.addEventListener("pointerleave", onLeave);

  /* ---------------- loop ---------------- */
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const v3 = new THREE.Vector3();
  const sc = new THREE.Vector3();
  const plane = new THREE.Plane();
  const localPointer = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const col = new THREE.Color();
  const lc = [1, 1, 1];
  const anchorIdx = anchors.map((_, i) => {
    // anchors sit on the front strand at fixed positions along the axis
    const target = [-0.33, 0.06, -0.14][i] ?? 0;
    let best = 0, bd = Infinity;
    for (let k = 0; k < N; k++) {
      const d = Math.abs(inst[k].s / L - target) + (inst[k].r < 0.18 ? 1 : 0);
      if (d < bd) { bd = d; best = k; }
    }
    return best;
  });

  let running = true;
  let visible = true;
  let raf = 0;
  let first = true;
  const t0 = now();
  let spinAngle = -0.6;
  let last = t0;
  let frameAvg = 16;

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && running && !raf && !capture) raf = requestAnimationFrame(frame);
  });
  io.observe(canvas);
  const onVis = () => {
    running = document.visibilityState === "visible";
    last = now();
    if (running && visible && !raf && !capture) raf = requestAnimationFrame(frame);
  };
  document.addEventListener("visibilitychange", onVis);
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  resize();

  // the first thing a visitor sees is the molecule settling in and a pulse travelling through it
  const intro = { start: t0 + 0.9, dur: 2.6 };
  let introPulsed = false;

  function frame() {
    raf = 0;
    if (!running || !visible) return;
    const t = now();
    const raw = t - last;
    const dt = Math.min(0.05, raw);
    last = t;
    // adapt resolution only to sustained slowness, never to throttled / resumed frames
    if (raw < 0.1) frameAvg = frameAvg * 0.96 + raw * 1000 * 0.04;
    if (frameAvg > 34 && dpr > 1.25) {
      dpr = Math.max(1.25, dpr - 0.25);
      renderer.setPixelRatio(dpr);
      resize();
      frameAvg = 16;
    }

    // scroll: 0 at the top of the hero, 1 once it has scrolled away
    const sr = section.getBoundingClientRect();
    const p = Math.min(1, Math.max(0, -sr.top / Math.max(1, sr.height)));

    // intro ease (settle from further away, slightly turned)
    const ki = Math.min(1, Math.max(0, (t - intro.start) / intro.dur));
    const ease = 1 - Math.pow(1 - ki, 4);
    if (!introPulsed && t > intro.start + 1.1) {
      introPulsed = true;
      pulse(-L / 2 - 1, 0.85);
    }

    // pointer: idle wanders gently so the object never looks frozen
    const idle = t - lastMove / 1000 > 2.5 || !pointerInside;
    const wx = idle ? Math.sin(t * 0.21) * 0.25 : ndc.x;
    const wy = idle ? Math.cos(t * 0.17) * 0.18 : ndc.y;
    ndcEase.x += (wx - ndcEase.x) * 0.045;
    ndcEase.y += (wy - ndcEase.y) * 0.045;

    // placement + scroll recede
    // as the hero scrolls away the molecule lags behind the page and sinks into depth
    const viewH = 2 * 20 * Math.tan((camera.fov * Math.PI) / 360);
    const s = layout.s * (0.92 + 0.08 * ease) * (1 - p * 0.22);
    place.position.set(
      layout.x + p * 1.4,
      layout.y - p * viewH * 0.42 + Math.sin(t * 0.38) * 0.08,
      -(1 - ease) * 3 - p * 12,
    );
    place.rotation.set(0, layout.ry + (1 - ease) * 0.25 - p * 0.3, layout.rz + Math.sin(t * 0.23) * 0.012 + p * 0.12);
    place.scale.setScalar(s);
    // lean toward the pointer, a few degrees at most
    tilt.rotation.set(-ndcEase.y * 0.09, ndcEase.x * 0.12, 0);
    // camera shift = perspective change; near spheres move more than far ones
    camera.position.set(ndcEase.x * 0.9, ndcEase.y * 0.55, 20);
    camera.lookAt(0, 0.4, 0);
    // idle: slow spin about its own axis
    spinAngle += dt * (0.075 + p * 0.25);
    spin.rotation.x = spinAngle;
    scene.updateMatrixWorld();

    // pointer → local space of the helix
    let haveLocal = false;
    if (pointerInside) {
      raycaster.setFromCamera(ndc, camera);
      place.getWorldPosition(tmp);
      plane.setFromNormalAndCoplanarPoint(camera.getWorldDirection(v3).negate(), tmp);
      if (raycaster.ray.intersectPlane(plane, localPointer)) {
        mesh.worldToLocal(localPointer);
        haveLocal = true;
      }
      if (pointerMoved) {
        const hit = raycaster.intersectObject(mesh, false)[0];
        hovered = hit && hit.instanceId !== undefined ? hit.instanceId : -1;
        pointerMoved = false;
      }
    } else {
      hovered = -1;
    }
    (section.style as CSSStyleDeclaration).cursor = hovered >= 0 ? "pointer" : "";

    // waves
    for (let w = waves.length - 1; w >= 0; w--) if (t - waves[w].t0 > 3.2) waves.splice(w, 1);

    // life builds up after the white sculpture has been seen
    const grow = LP ? sstep(intro.start + 2.4, intro.start + 9, t) : 0;
    if (LP) hemi.groundColor.copy(groundGrey).lerp(groundViolet, LP.shadow * grow);

    const hb = hovered >= 0 ? inst[hovered] : null;
    for (let i = 0; i < N; i++) {
      const it = inst[i];
      let tx = 0, ty = 0, tz = 0;

      // proximity: drift apart a little, with a slow breath
      if (haveLocal) {
        const ex = it.bx - localPointer.x, ey = it.by - localPointer.y, ez = it.bz - localPointer.z;
        const d2 = ex * ex + ey * ey + ez * ez;
        const rad = 2.4;
        if (d2 < rad * rad) {
          const d = Math.sqrt(d2) + 1e-4;
          const f = 1 - d / rad;
          const k = f * f * (0.16 + Math.sin(t * 2.1 + i * 0.37) * 0.025);
          tx += (ex / d) * k; ty += (ey / d) * k; tz += (ez / d) * k;
        }
      }

      // click waves: a swell travelling along the axis in both directions
      let swell = 0;
      for (const w of waves) {
        const age = t - w.t0;
        const front = age * 11;
        const ds = Math.abs(it.s - w.s0);
        const g = Math.exp(-((ds - front) ** 2) / 2.2);
        swell += g * Math.exp(-age * 1.05) * 0.5 * w.amp;
      }
      if (swell > 0.001) {
        const rl = Math.hypot(it.by, it.bz) + 1e-4;
        ty += (it.by / rl) * swell;
        tz += (it.bz / rl) * swell;
      }

      it.dx += (tx - it.dx) * 0.12;
      it.dy += (ty - it.dy) * 0.12;
      it.dz += (tz - it.dz) * 0.12;

      // hover highlight: the sphere itself, and a faint echo on its neighbours
      let ht = 0;
      if (hb) {
        if (i === hovered) ht = 1;
        else {
          const ex = it.bx - hb.bx, ey = it.by - hb.by, ez = it.bz - hb.bz;
          const d = Math.sqrt(ex * ex + ey * ey + ez * ez);
          if (d < 1.1) ht = 0.35 * (1 - d / 1.1);
        }
      }
      it.h += (ht - it.h) * 0.14;

      const scale = it.r * (1 + it.h * 0.07 + swell * 0.18);
      v3.set(it.bx + it.dx, it.by + it.dy, it.bz + it.dz);
      sc.set(scale, scale, scale);
      m4.compose(v3, q, sc);
      mesh.setMatrixAt(i, m4);

      if (LP && grow > 0) {
        // currents flowing along each strand (slow, opposite phase), modulated by a slower tide
        const c1 = 0.5 + 0.5 * Math.sin(it.s * 0.5 - t * 0.32 + (it.kind === 1 ? 2.2 : it.kind === 2 ? 1.1 : 0));
        const c2 = 0.5 + 0.5 * Math.sin(it.s * 0.19 + t * 0.09 + 2.1);
        const flow = c1 * c1 * c1 * c1 * (0.4 + 0.6 * c2);
        // each sphere breathes on its own clock — cells at work, almost imperceptibly
        const breathe = 0.72 + 0.28 * Math.sin(t * (0.35 + it.seed * 0.3) + it.seed * 40);
        let l = flow * (0.5 + 0.5 * it.aff) * breathe * (0.95 + 0.6 * LP.reach);
        l = Math.max(l, it.aff > 0.86 ? LP.rest * 2.6 : 0); // a few spheres keep a quiet tone of their own
        l += swell * 0.5; // a touch sends the signal through
        l = Math.min(1, l) * LP.amt * grow;
        const b = Math.min(1, 0.86 + it.shade * 0.14 + it.h * 0.1);
        lifeColor(b, l, lc);
        const k = Math.min(0.42, it.h * 0.32);
        mesh.setColorAt(i, col.setRGB(lc[0] + (0.478 - lc[0]) * k, lc[1] + (0.435 - lc[1]) * k, lc[2] + (0.608 - lc[2]) * k));
        it.lit = true;
      } else if (it.h > 0.002 || swell > 0.002) {
        const b = Math.min(1, 0.86 + it.shade * 0.14 + it.h * 0.1);
        const k = Math.min(0.42, it.h * 0.32 + swell * 0.55);
        // on a white field brightness alone is invisible: interaction tints toward violet ash #7A6F9B
        mesh.setColorAt(i, col.setRGB(b + (0.478 - b) * k, b + (0.435 - b) * k, b + (0.608 - b) * k));
        it.lit = true;
      } else if (it.lit) {
        const b = 0.86 + it.shade * 0.14;
        mesh.setColorAt(i, col.setRGB(b, b, b * 0.995));
        it.h = 0;
        it.lit = false;
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // life glow: rides the peaks of the strand-A current, inside the helix
    if (glows.length && LP) {
      const k = 0.5, w = 0.32;
      const n0 = Math.floor(((-L / 2 - 2) * k - t * w - Math.PI / 2) / (Math.PI * 2));
      glows.forEach((g, gi) => {
        const n = n0 + Math.floor(gi / 3);
        const off = ((gi % 3) - 1) * 1.5; // three soft lights per current, spread along the axis
        const sPeak = (t * w + Math.PI / 2 + Math.PI * 2 * n) / k + off;
        const edge = sstep(L / 2 + 1, L / 2 - 3, Math.abs(sPeak)); // fade in/out at the ends
        const tide = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(sPeak * 0.19 + t * 0.09 + 2.1));
        g.position.set(sPeak, 0, 0);
        g.scale.setScalar(R * (off ? 1.9 : 2.4) * (0.9 + 0.1 * Math.sin(t * 0.4 + gi)));
        (g.material as THREE.SpriteMaterial).opacity = LP.glow * grow * edge * tide * (off ? 0.7 : 1);
      });
    }

    // halo
    const hm = halo.material as THREE.SpriteMaterial;
    if (hb) {
      halo.position.set(hb.bx + hb.dx, hb.by + hb.dy, hb.bz + hb.dz);
      halo.scale.setScalar(hb.r * 4.6);
    }
    hm.opacity += ((hb ? 0.55 : 0) - hm.opacity) * 0.12;

    // loose molecules: closest layer, strongest parallax, drifting on their own
    loose.forEach((l, i) => {
      const drift = Math.sin(t * 0.3 + l.c * 1.7) * 0.25;
      v3.set(
        l.x + drift - ndcEase.x * (0.6 + l.z * 0.12),
        l.y + Math.cos(t * 0.26 + l.c) * 0.2 - ndcEase.y * 0.4 + p * (6 + l.z),
        l.z,
      );
      const r = l.r * (0.9 + 0.1 * ease);
      sc.set(r, r, r);
      m4.compose(v3, q, sc);
      looseMesh.setMatrixAt(i, m4);
    });
    looseMesh.instanceMatrix.needsUpdate = true;

    // fade the whole object as it leaves; reveal on entrance
    const alpha = Math.max(0, Math.min(ease * 1.4, 1 - Math.max(0, (p - 0.4) / 0.5)));
    canvas.style.opacity = String(alpha);
    // hotspots and hint leave with the molecule (they fade a little earlier, they are text)
    const anchorAlpha = Math.max(0, 1 - p / 0.28);

    renderer.render(scene, camera);

    // anchors (hotspots, hint) ride on the helix
    anchorIdx.forEach((idx, a) => {
      const el = anchors[a];
      if (!el) return;
      const it = inst[idx];
      v3.set(it.bx + it.dx, it.by + it.dy, it.bz + it.dz);
      mesh.localToWorld(v3);
      v3.project(camera);
      el.style.opacity = String(anchorAlpha);
      el.style.visibility = anchorAlpha < 0.01 ? "hidden" : "";
      el.style.setProperty("--ax", `${((v3.x + 1) / 2) * W}px`);
      el.style.setProperty("--ay", `${((1 - v3.y) / 2) * H}px`);
    });

    if (first) {
      first = false;
      onFirstFrame?.();
    }
    if (!capture) raf = requestAnimationFrame(frame);
  }
  if (capture) {
    (window as unknown as { __helixStep?: (dt: number) => void }).__helixStep = (dt: number) => {
      virtualTime += dt;
      frame();
    };
  } else {
    raf = requestAnimationFrame(frame);
  }

  return {
    pulse: () => pulse(-L / 2 - 1, 1),
    dispose() {
      cancelAnimationFrame(raf);
      running = false;
      io.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerleave", onLeave);
      document.removeEventListener("visibilitychange", onVis);
      section.style.cursor = "";
      sphere.dispose();
      mat.dispose();
      haloTex.dispose();
      glowTex.dispose();
      glows.forEach((g) => (g.material as THREE.Material).dispose());
      (halo.material as THREE.Material).dispose();
      mesh.dispose();
      looseMesh.dispose();
      renderer.dispose();
    },
  };
}
