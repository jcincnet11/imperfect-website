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
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
