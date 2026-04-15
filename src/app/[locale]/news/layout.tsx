import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "News — IMPerfect Esports",
  description:
    "Org updates, tournament recaps, roster news, and player spotlights.",
  openGraph: {
    title: "News — IMPerfect Esports",
    description:
      "Org updates, tournament recaps, roster news, and player spotlights.",
    type: "website",
  },
  alternates: {
    canonical: "https://imperfectgg.com/en/news",
    languages: {
      en: "https://imperfectgg.com/en/news",
      es: "https://imperfectgg.com/es/news",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
