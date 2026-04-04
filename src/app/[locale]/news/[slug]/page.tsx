"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import Link from "next/link";
import { m } from "framer-motion";
import { ARTICLES } from "@/lib/news-data";

export default function ArticleDetailPage() {
  const locale = useLocale();
  const params = useParams();
  const slug = params.slug as string;

  const article = ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return (
      <main style={{ background: "#1A1A1A", minHeight: "100vh" }}>
        <section style={{ padding: "120px 24px 64px" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
            <h1
              className="font-heading font-black uppercase text-white"
              style={{ fontSize: "clamp(32px, 6vw, 48px)", lineHeight: 0.92, marginBottom: "24px" }}
            >
              Article not found
            </h1>
            <p style={{ fontSize: "15px", color: "#888888", marginBottom: "32px", lineHeight: 1.65 }}>
              The article you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>
            <Link
              href={`/${locale}/news`}
              className="font-heading font-bold uppercase"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "11px",
                color: "#C8E400",
                textDecoration: "none",
                letterSpacing: "0.15em",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#C8E400")}
            >
              &larr; Back to News
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      {/* Header */}
      <section style={{ padding: "120px 24px 64px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link
            href={`/${locale}/news`}
            className="font-heading font-bold uppercase"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#555555",
              textDecoration: "none",
              letterSpacing: "0.15em",
              marginBottom: "32px",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
          >
            &larr; Back to News
          </Link>
        </div>
      </section>

      {/* Article content */}
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "56px 24px" }}>
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{
            background: "#222222",
            border: "1px solid #2A2A2A",
            borderLeft: `4px solid ${article.tagColor}`,
            borderRadius: "8px",
            padding: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          {/* Meta row */}
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
              <span
                className="font-heading font-bold uppercase"
                style={{
                  fontSize: "9px",
                  letterSpacing: "0.15em",
                  padding: "3px 8px",
                  borderRadius: "2px",
                  color: "#FFFFFF",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              >
                {article.game}
              </span>
            )}
            <span style={{ fontSize: "10px", color: "#444444", marginLeft: "auto" }}>
              {article.date}
            </span>
          </div>

          {/* Title */}
          <h1
            className="font-heading font-black uppercase text-white"
            style={{ fontSize: "clamp(24px, 4vw, 40px)", lineHeight: 1.05 }}
          >
            {article.title}
          </h1>

          {/* Full excerpt text */}
          <p style={{ fontSize: "15px", color: "#888888", lineHeight: 1.75 }}>
            {article.excerpt}
          </p>
        </m.div>
      </div>
    </main>
  );
}
