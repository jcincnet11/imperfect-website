import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Community — IMPerfect Esports",
  description:
    "Puerto Rico's gaming community hub. Events, content, Discord, and more.",
  openGraph: {
    title: "Community — IMPerfect Esports",
    description:
      "Puerto Rico's gaming community hub. Events, content, Discord, and more.",
    type: "website",
  },
  alternates: {
    canonical: "https://imperfect-sage.vercel.app/en/community",
    languages: {
      en: "https://imperfect-sage.vercel.app/en/community",
      es: "https://imperfect-sage.vercel.app/es/community",
    },
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
