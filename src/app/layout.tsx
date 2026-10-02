import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import "./globals.css";

const host = localFont({
  src: "../fonts/HostGrotesk.woff2",
  variable: "--font-host",
  weight: "300 800",
  display: "swap",
});

const plexMono = localFont({
  src: "../fonts/PlexMono.woff2",
  variable: "--font-plex-mono",
  weight: "400",
  display: "swap",
});

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

const description =
  "Strand is a website concept for a genetic testing laboratory: editorial, Swiss-inspired design with scroll-driven motion. Designed and built by Marta Jakovleva.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Strand — Genetics, in focus", template: "%s — Strand" },
  description,
  applicationName: "Strand",
  authors: [{ name: "Marta Jakovleva" }],
  creator: "Marta Jakovleva",
  keywords: ["website concept", "UI/UX", "art direction", "genetics", "DNA", "laboratory", "Next.js", "portfolio"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Strand — Genetics, in focus",
    description,
    url: "/",
    type: "website",
    siteName: "Strand",
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: "Strand — Genetics, in focus", description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${host.variable} ${plexMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
