"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";

type Article = {
  slug: string;
  date: string;
  tag: string;
  tagColor: string;
  title: string;
  excerpt: string;
  game?: string;
};

const ARTICLES: Article[] = [
  {
    slug: "season-2-recap-marvel-rivals",
    date: "March 28, 2026",
    tag: "Tournament Recap",
    tagColor: "#E74C3C",
    title: "IMPerfect Closes Season 2 With Back-to-Back Finals Runs",
    excerpt:
      "The squad went 7–1 across the final two weeks of the Marvel Rivals Puerto Rico Open, finishing second overall and securing our highest regional placement to date.",
    game: "Marvel Rivals",
  },
  {
    slug: "roster-update-spring-2026",
    date: "March 15, 2026",
    tag: "Roster News",
    tagColor: "#C8E400",
    title: "Spring 2026 Roster Confirmed — IMPerfect, Shadows & Echoes",
    excerpt:
      "After a strong offseason, all three Marvel Rivals rosters are locked in for Spring 2026. Meet the coaches, captains, and the new faces joining the org.",
    game: "Marvel Rivals",
  },
  {
    slug: "overwatch-2-ranked-push",
    date: "March 5, 2026",
    tag: "Season Update",
    tagColor: "#F99E1A",
    title: "OW2 Division Eyes Diamond Climb in Season 14",
    excerpt:
      "With two new additions to the Overwatch 2 roster, the team is targeting a full Diamond rating across all five roles before the mid-season checkpoint.",
    game: "Overwatch 2",
  },
  {
    slug: "community-tournament-april",
    date: "February 24, 2026",
    tag: "Event",
    tagColor: "#3A7BD5",
    title: "IMPerfect Community Cup — April 12",
    excerpt:
      "We're hosting a open-bracket Marvel Rivals community tournament for Puerto Rico–based teams. $150 prize pool. Register in the Discord by April 8.",
    game: "Marvel Rivals",
  },
  {
    slug: "partnership-announcement",
    date: "February 10, 2026",
    tag: "Partnership",
    tagColor: "#9B59B6",
    title: "IMPerfect Partners With Puerto Rico Esports Alliance",
    excerpt:
      "We're proud to join forces with PREA to grow competitive gaming infrastructure on the island. This partnership brings coaching resources, tournament access, and community programming to our players.",
  },
  {
    slug: "player-spotlight-aguacate",
    date: "January 30, 2026",
    tag: "Player Spotlight",
    tagColor: "#C8E400",
    title: "Spotlight: iaguacate — The Strategist Behind the System",
    excerpt:
      "Coach and strategist iaguacate breaks down his role-reading philosophy, how he builds team comps from scratch, and what it means to rep Puerto Rico at every LAN.",
    game: "Marvel Rivals",
  },
];

function ArticleCard({ article, index }: { article: Article; index: number }) {
  return (
    <m.article
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      style={{
        background: "#222222",
        border: "1px solid #2A2A2A",
        borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Top accent bar */}
      <div style={{ height: "3px", background: article.tagColor }} />

      <div style={{ padding: "24px", flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Meta */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span
            className="font-heading font-bold uppercase"
            style={{
              fontSize: "9px",
              letterSpacing: "0.15em",
              padding: "3px 8px",
              borderRadius: "2px",
              color: article.tagColor,
              background: `${article.tagColor}18`,
              border: `1px solid ${article.tagColor}30`,
            }}
          >
            {article.tag}
          </span>
          {article.game && (
            <span style={{ fontSize: "10px", color: "#555555", fontWeight: 600 }}>{article.game}</span>
          )}
          <span style={{ fontSize: "10px", color: "#444444", marginLeft: "auto" }}>{article.date}</span>
        </div>

        {/* Title */}
        <h2
          className="font-heading font-black uppercase text-white"
          style={{ fontSize: "clamp(16px, 2vw, 20px)", lineHeight: 1.1 }}
        >
          {article.title}
        </h2>

        {/* Excerpt */}
        <p style={{ fontSize: "13px", color: "#888888", lineHeight: 1.65, flex: 1 }}>
          {article.excerpt}
        </p>

        {/* Read more */}
        <span
          className="font-heading font-bold uppercase"
          style={{ fontSize: "10px", color: "#555555", letterSpacing: "0.12em" }}
        >
          Coming Soon →
        </span>
      </div>
    </m.article>
  );
}

export default function NewsPage() {
  const locale = useLocale();

  const featured = ARTICLES[0];
  const rest = ARTICLES.slice(1);

  return (
    <main style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ padding: "120px 24px 64px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Link
            href={`/${locale}`}
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "11px", color: "#555555", textDecoration: "none", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: "32px" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
          >
            ← Back
          </Link>
          <span className="eyebrow">Latest</span>
          <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "16px" }}>News</h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>
            Org updates, tournament recaps, and player news.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px" }}>
        {/* Featured article */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "#222222",
            border: "1px solid #2A2A2A",
            borderLeft: `4px solid ${featured.tagColor}`,
            borderRadius: "8px",
            padding: "32px",
            marginBottom: "48px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span
              className="font-heading font-bold uppercase"
              style={{ fontSize: "9px", letterSpacing: "0.15em", padding: "3px 8px", borderRadius: "2px", color: featured.tagColor, background: `${featured.tagColor}18`, border: `1px solid ${featured.tagColor}30` }}
            >
              {featured.tag}
            </span>
            <span className="font-heading font-bold uppercase" style={{ fontSize: "9px", letterSpacing: "0.15em", padding: "3px 8px", borderRadius: "2px", color: "#C8E400", background: "rgba(200,228,0,0.08)", border: "1px solid rgba(200,228,0,0.2)" }}>
              Latest
            </span>
            <span style={{ fontSize: "10px", color: "#444444", marginLeft: "auto" }}>{featured.date}</span>
          </div>
          <h2 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(22px, 3vw, 32px)", lineHeight: 1.05 }}>
            {featured.title}
          </h2>
          <p style={{ fontSize: "14px", color: "#888888", lineHeight: 1.7, maxWidth: "640px" }}>{featured.excerpt}</p>
        </m.div>

        {/* Article grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "16px" }}>
          {rest.map((article, i) => (
            <ArticleCard key={article.slug} article={article} index={i} />
          ))}
        </div>
      </div>
    </main>
  );
}
