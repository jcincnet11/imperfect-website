import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Article — IMPerfect Esports",
  description: "Read the latest from IMPerfect Esports.",
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
