/**
 * Copy for the Behance case study (/behance).
 * Everything here describes what the production site actually does.
 * Site content itself (tests, principles, steps) is imported from site.ts, never re-typed.
 */

export const caseMeta = {
  liveUrl: "https://strand-genetics.vercel.app/",
  liveLabel: "strand-genetics.vercel.app",
  author: "Marta Jakovleva",
  year: "2026",
};

export const chapters = [
  { id: "cs-overview", index: "01", label: "Overview" },
  { id: "cs-direction", index: "02", label: "Art direction" },
  { id: "cs-opening", index: "03", label: "The opening" },
  { id: "cs-navigation", index: "04", label: "Navigation" },
  { id: "cs-testing", index: "05", label: "Testing" },
  { id: "science", index: "06", label: "Science" },
  { id: "cs-process", index: "07", label: "Process" },
  { id: "cs-close", index: "08", label: "About & close" },
  { id: "cs-system", index: "09", label: "System" },
  { id: "cs-responsive", index: "10", label: "Responsive" },
  { id: "cs-screens", index: "11", label: "The website" },
] as const;

export type ChapterId = (typeof chapters)[number]["id"];
export const chapter = (id: ChapterId) => chapters.find((c) => c.id === id)!;

export const cover = {
  kicker: "Case study",
  disciplines: "Website concept · UI/UX · Art direction",
};

export const overview = {
  statement:
    "A website for a fictional genetic testing laboratory, built around one idea: complex genetic information should feel precise, human and easy to follow.",
  body: "I set the brief myself: a laboratory you would trust with the most personal data you have. The answer was restraint — a quiet, exact interface in which every image, label and transition has one job.",
  facts: [
    { k: "Role", v: "Website concept, UI/UX, Art direction" },
    { k: "Development", v: "Next.js 15, React 19, TypeScript, Tailwind CSS 4, Lenis" },
    { k: "Imagery", v: "12 images, GPT Image 2.5 via Higgsfield" },
    { k: "Typefaces", v: "Host Grotesk, IBM Plex Mono" },
    { k: "Year", v: "2026" },
  ],
  note: "Strand is not a real laboratory. The site offers no medical services and collects no data.",
};

export const direction = {
  title: ["DNA as sculpture,", "not as diagram."],
  body: "Genetics is usually illustrated with neon helices and blue-lit labs. Strand goes the other way: a white world where molecules are matte spheres under soft daylight, and the interface steps back so the images can set the mood. Each one was art-directed for its slot — ratio, focal point and the empty space the type would need.",
  rules: [
    { title: "Matter, not metaphor", body: "Molecules are rendered as physical objects you could hold." },
    { title: "The language of a paper", body: "Figure numbers, indexes and captions organise the page like a journal." },
    { title: "One accent", body: "Violet ash appears only when something responds to you." },
  ],
};

export const opening = {
  title: ["Three layers,", "one first look."],
  body: "The hero is built in depth. The helix, a few loose molecules and the type each move at their own rate with the pointer and the scroll. Two annotations sit on the helix and lead to the process and the laboratory — the deeper chapters, offered before they are needed.",
  stageNote: "Live component. Move the pointer across the frame and hover the annotations.",
  replay: "Replay entrance",
  reading: {
    title: "Then the page reads with you.",
    body: "The opening statement lights up word by word as it rises, so the first idea arrives at reading pace instead of all at once.",
    hint: "Scroll, or drag. On the site, scroll alone drives it.",
  },
};

export const navigation = {
  title: ["A bar that knows", "where you are."],
  body: "Five numbered chapters mirror the index that runs through the page. The bar is transparent over the hero and frosts once you scroll; it steps aside while you read down and returns the moment you scroll up. Over dark sections it inverts, and a hairline along its base tracks how far you have read.",
  states: [
    { key: "navTop", label: "At the top", note: "Transparent over the helix" },
    { key: "navSolid", label: "Reading", note: "Frosted, current chapter underlined, progress hairline" },
    { key: "navDark", label: "Over a dark section", note: "Inverts on its own" },
  ],
  mobile: {
    title: "On a phone, a full-screen index.",
    body: "The menu wipes down over the page and the chapters stagger in at display size.",
    open: "Open the menu",
    close: "Close the menu",
    note: "Real screenshots of both states",
  },
};

export const testing = {
  title: ["Six tests,", "read as an index."],
  body: "Testing is an index, not a grid of cards. Rows scan at a glance. Hover one and the others fall back while a preview follows the cursor; open it to see what the test is for and which samples it needs. On touch screens the image moves into the opened row.",
  stageNote: "Live component. Hover a row, then open it.",
};

export const scienceCase = {
  title: ["A frame that opens", "as you arrive."],
  body: "The laboratory photograph starts as an inset window and widens to full bleed as it rises — the section literally opens up. Beneath it, four principles describe how a result becomes trustworthy, indexed A to D like the figures of a paper.",
  hint: "Scroll, or drag. On the site, scroll alone drives it.",
  chainTitle: "From raw read to reported result",
};

export const processCase = {
  title: ["Four steps,", "one screen at a time."],
  body: "This is the one place the page holds still. The section pins, the background turns from paper to ink, and each screen of scroll advances a single step: the numeral rolls, the image wipes up, the copy hands over. On tablet and mobile it lets go of the pin and becomes a plain sequence.",
  hint: "Live component. Keep scrolling.",
};

export const closeCase = {
  title: ["Personal first,", "then one clear action."],
  body: "After the science the tone turns human: three values — precision, privacy, clarity — in plain words. The page ends on one unhurried call to action, with the helix returning in the negative space. Below it, the content lifts away to reveal the wordmark.",
  captions: {
    values: "About — Precision, Privacy, Clarity",
    cta: "Call to action",
    footer: "Footer, revealed as the page lifts away",
  },
};

export const system = {
  title: ["A small system,", "applied strictly."],
  body: "One sans and one mono. Ink, two papers and one accent. A 12-column grid on an 8px unit. Everything else is restraint.",
  type: [
    { name: "Display", cls: "t-display-m", sample: "Measured, not assumed." },
    { name: "Statement", cls: "t-statement", sample: "Three billion letters." },
    { name: "Lead", cls: "t-lead", sample: "We read DNA with precision, and explain it with care." },
    { name: "Body", cls: "t-body", sample: "Every reported finding is reviewed by scientists and clinicians." },
    { name: "Label", cls: "t-mono", sample: "(04) Process — Fig. 04.3" },
  ],
  colours: [
    { name: "Ink", hex: "#0C0C0D", cls: "bg-ink" },
    { name: "Ink 2", hex: "#2A2A2D", cls: "bg-ink-2" },
    { name: "Mute", hex: "#6B6B70", cls: "bg-mute" },
    { name: "Paper", hex: "#FFFFFF", cls: "bg-paper" },
    { name: "Paper 2", hex: "#F4F4F2", cls: "bg-paper-2" },
    { name: "Violet ash", hex: "#7A6F9B", cls: "bg-accent", note: "Interaction only" },
  ],
  grid: [
    { k: "Desktop", v: "12 columns · 40px margins" },
    { k: "Tablet", v: "8 columns · 24px margins" },
    { k: "Mobile", v: "4 columns · 16px margins" },
    { k: "Base", v: "8px unit · 16px gutters" },
  ],
  gridButton: ["Show the column grid", "Hide the column grid"],
  gridHint: "Or press Shift + G — it works on the live site too.",
  componentsNote: "Live components. Hover them — the accent only appears on interaction.",
};

export const responsive = {
  title: ["One layout,", "three grids."],
  body: "Desktop runs on twelve columns, tablet on eight, mobile on four. The hero recomposes rather than shrinks: the helix crops closer and the type settles beneath it. The process lets go of its pin and becomes a sequence, and each test carries its own image once opened.",
  devices: [
    { name: "Desktop", spec: "1440 · 12 columns" },
    { name: "Tablet", spec: "834 · 8 columns" },
    { name: "Mobile", spec: "390 · 4 columns" },
  ],
  details: [
    { key: "mTestingOpen", caption: "An opened test carries its image" },
    { key: "mScience", caption: "The frame still opens on arrival" },
    { key: "mProcess", caption: "Process becomes a sequence" },
    { key: "tProcess", caption: "Tablet, eight columns" },
  ],
  live: {
    title: "Try it live",
    note: "The production site in a frame, at real device widths.",
    load: "Load the live site",
    interact: "Click to interact",
  },
};

export const screens = {
  title: "The website, screen by screen.",
  items: [
    { key: "dHero", caption: "Hero" },
    { key: "dApproach", caption: "Approach" },
    { key: "dTesting", caption: "Testing" },
    { key: "dTestingHover", caption: "Testing — hover" },
    { key: "dTestingOpen", caption: "Testing — open" },
    { key: "dScience", caption: "Science" },
    { key: "dSciencePrinciples", caption: "Principles A–D" },
    { key: "dProcess1", caption: "Process — 01" },
    { key: "dProcess3", caption: "Process — 03" },
    { key: "dAbout", caption: "About" },
    { key: "dPerspective", caption: "Perspective" },
    { key: "dCta", caption: "Call to action" },
    { key: "dFooter", caption: "Footer" },
  ],
};

export const finale = {
  brand: "STRAND",
  tagline: "Genetics, in focus.",
  credit: "Website concept, UI/UX and art direction by Marta Jakovleva.",
  imagery: "Imagery generated with Higgsfield.",
  cta: "View live website",
};
