"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { m } from "framer-motion";
import { ARTICLES } from "@/lib/news-data";
import type { Article } from "@/lib/news-data";

function ArticleCard({ article, index }: { article: Article; index: number }) {
  const locale = useLocale();
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
        <Link
          href={`/${locale}/news/${article.slug}`}
          className="font-heading font-bold uppercase"
          style={{ fontSize: "10px", color: "#C8E400", letterSpacing: "0.12em", textDecoration: "none" }}
          onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
          onMouseLeave={(e) => (e.currentTarget.style.color = "#C8E400")}
        >
          Read More &rarr;
        </Link>
      </div>
    </m.article>
  );
}

export default function NewsPage() {
  const locale = useLocale();
  const t = useTranslations("news_page");

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
            {t("back")}
          </Link>
          <span className="eyebrow">{t("eyebrow")}</span>
          <h1 className="font-heading font-black uppercase text-white" style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "16px" }}>{t("title")}</h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "400px", lineHeight: 1.65 }}>
            {t("description")}
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
              {t("latest_badge")}
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
