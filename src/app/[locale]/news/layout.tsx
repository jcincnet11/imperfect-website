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
    canonical: "https://imperfect-sage.vercel.app/en/news",
    languages: {
      en: "https://imperfect-sage.vercel.app/en/news",
      es: "https://imperfect-sage.vercel.app/es/news",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
