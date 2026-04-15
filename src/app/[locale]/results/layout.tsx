import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tournament Results — IMPerfect Esports",
  description:
    "Every bracket entered. Every placement earned. IMPerfect's competitive track record.",
  openGraph: {
    title: "Tournament Results — IMPerfect Esports",
    description:
      "Every bracket entered. Every placement earned. IMPerfect's competitive track record.",
    type: "website",
  },
  alternates: {
    canonical: "https://imperfectgg.com/en/results",
    languages: {
      en: "https://imperfectgg.com/en/results",
      es: "https://imperfectgg.com/es/results",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
