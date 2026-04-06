import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Player Stats — IMPerfect Team Hub",
};

export default function PlayerStatsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
