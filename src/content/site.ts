/**
 * All copy for the Strand landing page.
 * Brand-level language only: no invented certifications, statistics,
 * partnerships or clinical results. Contact details are placeholders.
 */

export const nav = {
  links: [
    { id: "approach", label: "Approach", index: "01" },
    { id: "services", label: "Testing", index: "02" },
    { id: "science", label: "Science", index: "03" },
    { id: "process", label: "Process", index: "04" },
    { id: "about", label: "About", index: "05" },
  ],
  cta: { label: "Choose a test", href: "#contact" },
};

export const hero = {
  title: ["Genetics,", "in focus."],
  lead: "Strand is a genetic testing laboratory. We read DNA with precision, and explain it with care.",
  cta: { label: "Explore testing", href: "#services" },
  meta: { tags: "Website concept, UI/UX, Art direction", by: "Marta Jakovleva" },
  hotspots: [
    {
      id: "how",
      title: "How it works",
      body: "From one sample to one clear report, in four considered steps.",
      href: "#process",
    },
    {
      id: "lab",
      title: "Inside the laboratory",
      body: "Sequencing, analysis and human review, carried out under one roof.",
      href: "#science",
    },
  ],
};

export const intro = {
  label: "Approach",
  index: "01",
  statement:
    "Every cell in your body carries the same set of instructions, roughly three billion letters long. Strand reads them carefully, and translates what matters into language you can use.",
  figure: "Fig. 01 — Chromosome, rendered as molecular form",
  notesTitle: "Why genetics",
  notes: [
    {
      title: "Inherited",
      body: "Some health risks pass quietly through families. Genetic testing can make them visible, and earlier.",
    },
    {
      title: "Individual",
      body: "Your DNA can influence how your body processes certain medicines. Knowing this can inform treatment decisions.",
    },
    {
      title: "Interpreted",
      body: "A result is only useful when it is understood. Interpretation is part of every test we run, never an extra.",
    },
  ],
};

export type Service = {
  id: string;
  index: string;
  title: string;
  summary: string;
  detail: string;
  tags: string[];
  image: ImageKey;
};

export type ImageKey =
  | "heroHelix"
  | "particles"
  | "chromosome"
  | "lab"
  | "droplet"
  | "landscape"
  | "hands"
  | "kit"
  | "tubes"
  | "flowcell"
  | "report"
  | "fragment";

export const services = {
  label: "Testing",
  index: "02",
  title: ["Six disciplines.", "One laboratory."],
  lead: "Each test begins with a clear question, from you or from your clinician. We help you choose the one that answers it.",
  items: [
    {
      id: "clinical",
      index: "01",
      title: "Clinical genetic testing",
      summary: "Targeted panels for inherited conditions.",
      detail:
        "Focused analysis of the genes associated with a specific condition or family history, usually requested together with your clinician.",
      tags: ["Blood", "Saliva"],
      image: "hands",
    },
    {
      id: "genome",
      index: "02",
      title: "Exome & genome sequencing",
      summary: "When a targeted test is not enough.",
      detail:
        "Sequencing of the protein-coding regions or the whole genome, for complex or unresolved questions where a broader view is needed.",
      tags: ["Blood"],
      image: "flowcell",
    },
    {
      id: "carrier",
      index: "03",
      title: "Carrier screening",
      summary: "For individuals and couples planning a family.",
      detail:
        "Identifies whether you carry variants for certain recessive conditions that could be passed on to children.",
      tags: ["Saliva", "Blood"],
      image: "kit",
    },
    {
      id: "pgx",
      index: "04",
      title: "Pharmacogenomics",
      summary: "Genes and the medicines you take.",
      detail:
        "Looks at genetic variants known to affect how certain medicines are processed, to support conversations with your prescriber.",
      tags: ["Saliva"],
      image: "droplet",
    },
    {
      id: "research",
      index: "05",
      title: "DNA analysis for research",
      summary: "Laboratory services for research teams.",
      detail:
        "Extraction, sequencing and bioinformatics delivered to agreed specifications for academic and institutional research projects.",
      tags: ["Custom"],
      image: "tubes",
    },
    {
      id: "counselling",
      index: "06",
      title: "Genetic counselling",
      summary: "Every result, explained by a person.",
      detail:
        "Time with a qualified specialist before and after testing, to talk through what a result means and what it does not.",
      tags: ["In person", "Remote"],
      image: "report",
    },
  ] satisfies Service[],
};

export const science = {
  label: "Science & technology",
  index: "03",
  title: ["Measured,", "not assumed."],
  lead: "Our work sits where molecular biology meets computation. Samples are prepared in a controlled laboratory, sequenced on high-throughput platforms and analysed through documented pipelines, then reviewed by people.",
  figure: "Fig. 03 — The sequencing laboratory",
  aside: "Fig. 04 — One drop, prepared",
  principles: [
    {
      index: "A",
      title: "Sequencing",
      body: "DNA is read many times over, so each variant is measured with depth rather than inferred from a single pass.",
    },
    {
      index: "B",
      title: "Bioinformatics",
      body: "Analysis pipelines align, call and annotate variants against curated scientific reference databases.",
    },
    {
      index: "C",
      title: "Review",
      body: "Every reported finding is reviewed by scientists and clinicians before it reaches you or your doctor.",
    },
    {
      index: "D",
      title: "Traceability",
      body: "Each sample is tracked from arrival to report, with controls processed alongside it at every stage.",
    },
  ],
};

export const processContent = {
  label: "Process",
  index: "04",
  title: "From sample to understanding.",
  steps: [
    {
      index: "01",
      title: "Collect",
      body: "Choose a test with your clinician or our team. A simple saliva or blood sample is collected at home or at a partner clinic.",
      image: "kit" as ImageKey,
      caption: "Collection kit",
    },
    {
      index: "02",
      title: "Extract",
      body: "In the laboratory, DNA is carefully isolated from your sample and checked for quality before anything else happens.",
      image: "tubes" as ImageKey,
      caption: "Extraction",
    },
    {
      index: "03",
      title: "Sequence",
      body: "Your DNA is sequenced and analysed. Variants are identified, classified and reviewed by our scientists.",
      image: "flowcell" as ImageKey,
      caption: "Flow cell",
    },
    {
      index: "04",
      title: "Understand",
      body: "You receive a clear, written report, with a specialist available to talk it through and answer your questions.",
      image: "report" as ImageKey,
      caption: "Report",
    },
  ],
};

export const about = {
  label: "About Strand",
  index: "05",
  statement: ["Genetics is personal", "before it is scientific."],
  body: [
    "Strand brings together laboratory science, clinical expertise and careful engineering. We believe genetic information should be precise, private and understandable.",
    "Behind every sample is a person, and behind every result is a team that takes the time to explain what it means, and just as importantly, what it does not.",
  ],
  figure: "Fig. 05 — Handled with care",
  values: [
    { title: "Precision", body: "We report only what the evidence supports." },
    { title: "Privacy", body: "We treat genetic data as the most personal data there is." },
    { title: "Clarity", body: "Reports written to be read, not decoded." },
  ],
};

export const immersive = {
  line: "Three billion letters. One person. —",
  caption: "Fig. 06 — Cellular surface",
  label: "Perspective",
  index: "06",
};

export const cta = {
  title: ["Begin with", "a single sample."],
  body: "Speak with our team about the right test for you, or ask your clinician to refer you to Strand.",
  primary: { label: "Choose a test", href: "#services" },
  secondary: { label: "Talk to a specialist", href: "mailto:hello@strand.example" },
};

export const footer = {
  columns: [
    {
      title: "Navigate",
      links: [
        { label: "Approach", href: "#approach" },
        { label: "Testing", href: "#services" },
        { label: "Science", href: "#science" },
        { label: "Process", href: "#process" },
        { label: "About", href: "#about" },
      ],
    },
    {
      title: "Contact",
      links: [
        { label: "hello@strand.example", href: "mailto:hello@strand.example" },
        { label: "Laboratory visits by appointment", href: "" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "/legal#privacy" },
        { label: "Terms of use", href: "/legal#terms" },
        { label: "Accessibility", href: "/legal#accessibility" },
        { label: "Credits", href: "/legal#credits" },
      ],
    },
  ],
  disclaimer:
    "Information on this website is general and does not replace advice from a qualified healthcare professional. Genetic tests are performed on request and results are reported with appropriate clinical context.",
  concept:
    "Strand is a fictional laboratory: a website concept designed and built by Marta Jakovleva. Imagery generated with Higgsfield.",
  copyright: "© 2026 Marta Jakovleva",
};
