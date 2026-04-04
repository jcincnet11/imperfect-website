import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About — IMPerfect Esports",
  description:
    "Built in Puerto Rico. IMPerfect's story, values, and 6-month roadmap.",
  openGraph: {
    title: "About — IMPerfect Esports",
    description:
      "Built in Puerto Rico. IMPerfect's story, values, and 6-month roadmap.",
    type: "website",
  },
  alternates: {
    canonical: "https://imperfect-sage.vercel.app/en/about",
    languages: {
      en: "https://imperfect-sage.vercel.app/en/about",
      es: "https://imperfect-sage.vercel.app/es/about",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
