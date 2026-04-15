import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article — IMPerfect Esports",
  description: "Read the latest from IMPerfect Esports.",
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
