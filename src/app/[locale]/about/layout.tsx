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
    canonical: "https://imperfectgg.com/en/about",
    languages: {
      en: "https://imperfectgg.com/en/about",
      es: "https://imperfectgg.com/es/about",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
