"use client";

// ─────────────────────────────────────────────────────────────────
// TO UPDATE PLAYER INFO: edit OW2_ROSTER and MR_ROSTER arrays below
// Fields: name, ign, role, rank, flag, bio, socials, topHeroes
// tracker.gg links are auto-generated from the ign field
// ─────────────────────────────────────────────────────────────────

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { m, AnimatePresence } from "framer-motion";
import PlayerStatsSection from "@/components/team-hub/PlayerStatsSection";

// ── Types ────────────────────────────────────────────────────────

type Socials = {
  twitter: string | null;
  instagram: string | null;
  tiktok: string | null;
  twitch: string | null;
};

type Hero = {
  name: string;
  role: string;
  winRate: string;
  timePlayed: string;
};

type Player = {
  id: number;
  name: string;
  ign: string;
  role: string;
  division: "OW2" | "MR";
  rank: string;
  flag: string;
  bio: string;
  socials: Socials;
  topHeroes: Hero[];
};

// ── Roster Data ──────────────────────────────────────────────────

// NOTE: OW2 division is being rebuilt — these are placeholder players for now.
const OW2_ROSTER: Player[] = [
  {
    id: 1,
    name: "Player One",
    ign: "P1xGaming",
    role: "Tank",
    division: "OW2",
    rank: "Top 500",
    flag: "🇵🇷",
    bio: "The anchor of the team. Calls the dives and holds the line.",
    socials: {
      twitter: "https://twitter.com/placeholder",
      instagram: null,
      tiktok: null,
      twitch: null,
    },
    topHeroes: [
      { name: "Reinhardt", role: "Tank", winRate: "68%", timePlayed: "120h" },
      { name: "D.Va",      role: "Tank", winRate: "62%", timePlayed: "85h"  },
      { name: "Zarya",     role: "Tank", winRate: "59%", timePlayed: "60h"  },
    ],
  },
  {
    id: 2,
    name: "Player Two",
    ign: "FlexDPS99",
    role: "DPS",
    division: "OW2",
    rank: "Diamond 1",
    flag: "🇵🇷",
    bio: "Flex DPS with a lethal hitscan. If you see the tracer blink, it's already over.",
    socials: {
      twitter: "https://twitter.com/placeholder",
      instagram: "https://instagram.com/placeholder",
      tiktok: null,
      twitch: null,
    },
    topHeroes: [
      { name: "Tracer", role: "DPS", winRate: "71%", timePlayed: "200h" },
      { name: "Genji",  role: "DPS", winRate: "65%", timePlayed: "110h" },
      { name: "Sombra", role: "DPS", winRate: "60%", timePlayed: "70h"  },
    ],
  },
  {
    id: 3,
    name: "Player Three",
    ign: "VaultHunter",
    role: "DPS",
    division: "OW2",
    rank: "Diamond 2",
    flag: "🇵🇷",
    bio: "Hitscan specialist. Doesn't miss. Keeps it simple. Gets the job done.",
    socials: {
      twitter: null,
      instagram: "https://instagram.com/placeholder",
      tiktok: "https://tiktok.com/@placeholder",
      twitch: null,
    },
    topHeroes: [
      { name: "Cassidy", role: "DPS", winRate: "66%", timePlayed: "150h" },
      { name: "Ashe",    role: "DPS", winRate: "61%", timePlayed: "90h"  },
      { name: "Soldier", role: "DPS", winRate: "58%", timePlayed: "55h"  },
    ],
  },
  {
    id: 4,
    name: "Player Four",
    ign: "AngelWings",
    role: "Support",
    division: "OW2",
    rank: "Platinum 1",
    flag: "🇵🇷",
    bio: "Main support. Keeps everyone alive and the calls clean.",
    socials: {
      twitter: "https://twitter.com/placeholder",
      instagram: null,
      tiktok: null,
      twitch: "https://twitch.tv/placeholder",
    },
    topHeroes: [
      { name: "Ana",    role: "Support", winRate: "70%", timePlayed: "180h" },
      { name: "Lucio",  role: "Support", winRate: "63%", timePlayed: "100h" },
      { name: "Kiriko", role: "Support", winRate: "59%", timePlayed: "75h"  },
    ],
  },
  {
    id: 5,
    name: "Player Five",
    ign: "FlexSupport",
    role: "Support",
    division: "OW2",
    rank: "Platinum 2",
    flag: "🇵🇷",
    bio: "Flex support. Adapts to whatever the team needs. Silent but essential.",
    socials: {
      twitter: null,
      instagram: "https://instagram.com/placeholder",
      tiktok: null,
      twitch: null,
    },
    topHeroes: [
      { name: "Mercy",    role: "Support", winRate: "67%", timePlayed: "130h" },
      { name: "Moira",    role: "Support", winRate: "61%", timePlayed: "80h"  },
      { name: "Zenyatta", role: "Support", winRate: "55%", timePlayed: "50h"  },
    ],
  },
];

const MR_ROSTER: Player[] = [
  {
    id: 6,
    name: "iaguacate",
    ign: "iaguacate",
    role: "Strategist",
    division: "MR",
    rank: "Grandmaster",
    flag: "🇵🇷",
    bio: "Head Coach and Strategist. The brain behind the gameplan — sees three plays ahead.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Loki",         role: "Strategist", winRate: "71%", timePlayed: "110h" },
      { name: "Luna Snow",    role: "Strategist", winRate: "64%", timePlayed: "85h"  },
      { name: "Adam Warlock", role: "Strategist", winRate: "59%", timePlayed: "60h"  },
    ],
  },
  {
    id: 7,
    name: "lblazerowl",
    ign: "lblazerowl",
    role: "Strategist",
    division: "MR",
    rank: "Grandmaster",
    flag: "🇵🇷",
    bio: "Captain and Strategist. Calls the shots and keeps the squad locked in.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",        role: "Strategist", winRate: "68%", timePlayed: "100h" },
      { name: "Luna Snow",     role: "Strategist", winRate: "62%", timePlayed: "75h"  },
      { name: "Cloak & Dagger", role: "Strategist", winRate: "57%", timePlayed: "45h" },
    ],
  },
  {
    id: 8,
    name: "crazyturnx",
    ign: "crazyturnx",
    role: "Duelist",
    division: "MR",
    rank: "Diamond 1",
    flag: "🇵🇷",
    bio: "High-mobility duelist. Finds the angle before you know it exists.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Spider-Man",    role: "Duelist", winRate: "74%", timePlayed: "120h" },
      { name: "Black Panther", role: "Duelist", winRate: "66%", timePlayed: "80h"  },
      { name: "Wolverine",     role: "Duelist", winRate: "60%", timePlayed: "55h"  },
    ],
  },
  {
    id: 9,
    name: "georgierican",
    ign: "georgierican",
    role: "Strategist",
    division: "MR",
    rank: "Diamond 1",
    flag: "🇵🇷",
    bio: "Flex strategist. Adapts the kit to whatever the team needs in the moment.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",     role: "Strategist", winRate: "68%", timePlayed: "100h" },
      { name: "Loki",       role: "Strategist", winRate: "62%", timePlayed: "75h"  },
      { name: "Luna Snow",  role: "Strategist", winRate: "57%", timePlayed: "45h"  },
    ],
  },
  {
    id: 10,
    name: "spooit",
    ign: "spooit",
    role: "Vanguard",
    division: "MR",
    rank: "Grandmaster",
    flag: "🇵🇷",
    bio: "Front line enforcer. Sets the pace and controls the space.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Magneto",         role: "Vanguard", winRate: "72%", timePlayed: "95h" },
      { name: "Thor",            role: "Vanguard", winRate: "65%", timePlayed: "70h" },
      { name: "Captain America", role: "Vanguard", winRate: "58%", timePlayed: "40h" },
    ],
  },
  {
    id: 11,
    name: "the_mofn_ninja",
    ign: "the_mofn_ninja",
    role: "Duelist",
    division: "MR",
    rank: "Diamond 1",
    flag: "🇵🇷",
    bio: "Dive duelist. If you blinked, you already lost the 1v1.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Black Panther", role: "Duelist", winRate: "67%", timePlayed: "90h" },
      { name: "Wolverine",     role: "Duelist", winRate: "63%", timePlayed: "70h" },
      { name: "Spider-Man",    role: "Duelist", winRate: "58%", timePlayed: "50h" },
    ],
  },
  {
    id: 12,
    name: "tides100ping",
    ign: "tides100ping",
    role: "Duelist",
    division: "MR",
    rank: "Diamond 1",
    flag: "🇵🇷",
    bio: "Ranged duelist. Consistent damage. Never out of position.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Star-Lord", role: "Duelist", winRate: "69%", timePlayed: "100h" },
      { name: "Hawkeye",   role: "Duelist", winRate: "62%", timePlayed: "65h"  },
      { name: "Spider-Man", role: "Duelist", winRate: "57%", timePlayed: "45h" },
    ],
  },
  {
    id: 13,
    name: "zoivanni",
    ign: "zoivanni",
    role: "Vanguard",
    division: "MR",
    rank: "Diamond 1",
    flag: "🇵🇷",
    bio: "Anchor vanguard. Holds the line and creates space for the team.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Thor",            role: "Vanguard", winRate: "70%", timePlayed: "90h" },
      { name: "Magneto",         role: "Vanguard", winRate: "64%", timePlayed: "75h" },
      { name: "Captain America", role: "Vanguard", winRate: "59%", timePlayed: "55h" },
    ],
  },
];

const SHADOWS_ROSTER: Player[] = [
  {
    id: 20,
    name: "azul1to",
    ign: "azul1to",
    role: "Vanguard",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Vanguard holding it down. Creates space and never backs off.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Magneto",         role: "Vanguard", winRate: "68%", timePlayed: "80h" },
      { name: "Thor",            role: "Vanguard", winRate: "62%", timePlayed: "60h" },
      { name: "Captain America", role: "Vanguard", winRate: "56%", timePlayed: "40h" },
    ],
  },
  {
    id: 21,
    name: "filthypryde",
    ign: "filthypryde",
    role: "Strategist",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Strategist with sharp reads. Keeps the team alive and in control.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",    role: "Strategist", winRate: "66%", timePlayed: "75h" },
      { name: "Luna Snow", role: "Strategist", winRate: "60%", timePlayed: "55h" },
      { name: "Loki",      role: "Strategist", winRate: "55%", timePlayed: "40h" },
    ],
  },
  {
    id: 22,
    name: "oxarianz",
    ign: "Oxarian",
    role: "Duelist",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Aggressive duelist. Gets in, gets the pick, gets out.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Spider-Man",    role: "Duelist", winRate: "70%", timePlayed: "85h" },
      { name: "Black Panther", role: "Duelist", winRate: "63%", timePlayed: "60h" },
      { name: "Wolverine",     role: "Duelist", winRate: "57%", timePlayed: "45h" },
    ],
  },
  {
    id: 23,
    name: "shokwave10",
    ign: "Shockwave",
    role: "Duelist",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Duelist with explosive plays. High risk, high reward.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Wolverine",     role: "Duelist", winRate: "68%", timePlayed: "80h" },
      { name: "Hawkeye",       role: "Duelist", winRate: "61%", timePlayed: "55h" },
      { name: "Black Panther", role: "Duelist", winRate: "56%", timePlayed: "40h" },
    ],
  },
  {
    id: 24,
    name: "silenustv",
    ign: "Silenusᵗᵛ",
    role: "Support",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Support backbone. Silent but essential — always in the right spot.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Mantis",    role: "Strategist", winRate: "65%", timePlayed: "70h" },
      { name: "Luna Snow", role: "Strategist", winRate: "59%", timePlayed: "50h" },
      { name: "Loki",      role: "Strategist", winRate: "54%", timePlayed: "35h" },
    ],
  },
  {
    id: 25,
    name: "vhaze21",
    ign: "vHaze",
    role: "Duelist",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Versatile duelist. Adapts to any matchup and delivers.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Star-Lord",  role: "Duelist", winRate: "67%", timePlayed: "75h" },
      { name: "Spider-Man", role: "Duelist", winRate: "61%", timePlayed: "55h" },
      { name: "Hawkeye",    role: "Duelist", winRate: "55%", timePlayed: "40h" },
    ],
  },
  {
    id: 26,
    name: "DerekVieraPR",
    ign: "DerekVieraPR",
    role: "Strategist",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Strategist with versatile reads. Controls the fight from every angle.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "Loki",           role: "Strategist", winRate: "60%", timePlayed: "50h" },
      { name: "Doctor Strange", role: "Vanguard",   winRate: "55%", timePlayed: "40h" },
      { name: "Mantis",         role: "Strategist", winRate: "52%", timePlayed: "30h" },
    ],
  },
  {
    id: 27,
    name: "ABJ",
    ign: "ABJ.",
    role: "Strategist",
    division: "MR",
    rank: "Diamond",
    flag: "🇵🇷",
    bio: "Flex strategist. Reads the game and adapts — 96 ranked matches deep.",
    socials: { twitter: null, instagram: null, tiktok: null, twitch: null },
    topHeroes: [
      { name: "The Punisher",   role: "Duelist",    winRate: "58%", timePlayed: "60h" },
      { name: "Doctor Strange", role: "Vanguard",   winRate: "54%", timePlayed: "45h" },
      { name: "Mantis",         role: "Strategist", winRate: "52%", timePlayed: "35h" },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────

const ROLE_COLOR: Record<string, string> = {
  Tank:       "#3A7BD5",
  Vanguard:   "#3A7BD5",
  DPS:        "#E74C3C",
  Duelist:    "#E74C3C",
  Support:    "#1D9E75",
  Strategist: "#1D9E75",
};

function roleColor(role: string): string {
  return ROLE_COLOR[role] ?? "#888888";
}

function initials(name: string): string {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function trackerUrl(player: Player): string {
  if (player.division === "OW2") {
    return `https://tracker.gg/overwatch2/profile/ign/${player.ign}`;
  }
  return `https://tracker.gg/marvel-rivals/profile/ign/${player.ign}`;
}

// ── Sub-components ───────────────────────────────────────────────

function RoleBadge({ role, small = false }: { role: string; small?: boolean }) {
  const color = roleColor(role);
  return (
    <span
      style={{
        display: "inline-block",
        background: `${color}22`,
        border: `1px solid ${color}55`,
        color,
        borderRadius: "3px",
        fontSize: small ? "9px" : "10px",
        fontWeight: 700,
        letterSpacing: "0.08em",
        textTransform: "uppercase",
        padding: small ? "1px 5px" : "2px 7px",
        whiteSpace: "nowrap",
        fontFamily: "var(--font-barlow), sans-serif",
      }}
    >
      {role}
    </span>
  );
}

function SocialButton({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: "28px",
        height: "28px",
        background: "#1A1A1A",
        border: "1px solid #333333",
        borderRadius: "4px",
        fontSize: "9px",
        fontWeight: 700,
        color: "#888888",
        textDecoration: "none",
        letterSpacing: "0.04em",
        fontFamily: "var(--font-barlow), sans-serif",
        transition: "border-color 0.15s, color 0.15s",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#C8E400";
        e.currentTarget.style.color = "#C8E400";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#333333";
        e.currentTarget.style.color = "#888888";
      }}
    >
      {label}
    </a>
  );
}

function PlayerCard({ player }: { player: Player }) {
  const t = useTranslations("team_page");
  const color = roleColor(player.role);

  return (
    <div
      style={{
        background: "#222222",
        border: "1px solid #2A2A2A",
        borderTop: `3px solid ${color}`,
        borderRadius: "8px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      {/* ── Header row ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Avatar */}
        <div
          style={{
            width: "40px",
            height: "40px",
            minWidth: "40px",
            borderRadius: "50%",
            background: "#2A2A2A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#C8E400",
            fontSize: "14px",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          {initials(player.name)}
        </div>

        {/* Name + IGN */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            className="font-heading font-black uppercase"
            style={{
              fontSize: "18px",
              color: "#FFFFFF",
              lineHeight: 1.1,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {player.name}
          </p>
          <p style={{ fontSize: "13px", color: "#888888", marginTop: "1px" }}>
            @{player.ign}
          </p>
        </div>

        {/* Flag + rank badge */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", flexShrink: 0 }}>
          <span style={{ fontSize: "16px", lineHeight: 1 }}>{player.flag}</span>
          <span
            style={{
              background: color,
              color: "#111111",
              borderRadius: "999px",
              fontSize: "10px",
              fontWeight: 700,
              fontFamily: "var(--font-barlow), sans-serif",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              padding: "2px 8px",
              whiteSpace: "nowrap",
            }}
          >
            {player.rank}
          </span>
        </div>
      </div>

      {/* ── Bio ── */}
      <p
        style={{
          fontSize: "13px",
          color: "#888888",
          fontStyle: "italic",
          lineHeight: 1.55,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          margin: 0,
        }}
      >
        {player.bio}
      </p>

      {/* ── Top Heroes ── */}
      <div>
        <p
          style={{
            fontSize: "10px",
            color: "#C8E400",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            marginBottom: "10px",
          }}
        >
          {t("top_heroes")}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {player.topHeroes.map((hero, i) => {
            const isTop = i === 0;
            return (
              <div
                key={hero.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  paddingLeft: isTop ? "8px" : "0",
                  borderLeft: isTop ? "3px solid #C8E400" : "3px solid transparent",
                }}
              >
                {/* Hero name */}
                <span
                  className="font-heading font-bold"
                  style={{
                    fontSize: isTop ? "15px" : "13px",
                    color: "#FFFFFF",
                    flex: 1,
                    minWidth: 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {hero.name}
                </span>

                {/* Role badge */}
                <RoleBadge role={hero.role} small />

                {/* Win rate */}
                <span
                  style={{
                    fontSize: "13px",
                    fontWeight: 700,
                    color: "#C8E400",
                    whiteSpace: "nowrap",
                    fontFamily: "var(--font-barlow), sans-serif",
                    minWidth: "34px",
                    textAlign: "right",
                  }}
                >
                  {hero.winRate}
                </span>

                {/* Time played */}
                <span
                  style={{
                    fontSize: "11px",
                    color: "#666666",
                    whiteSpace: "nowrap",
                    minWidth: "32px",
                    textAlign: "right",
                  }}
                >
                  {hero.timePlayed}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Social links ── */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
        {player.socials.twitter && (
          <SocialButton href={player.socials.twitter} label="TW" />
        )}
        {player.socials.instagram && (
          <SocialButton href={player.socials.instagram} label="IG" />
        )}
        {player.socials.tiktok && (
          <SocialButton href={player.socials.tiktok} label="TT" />
        )}
        {player.socials.twitch && (
          <SocialButton href={player.socials.twitch} label="TV" />
        )}
        <SocialButton href={trackerUrl(player)} label="TRK" />
      </div>

      {/* ── Live stats (MR only) ── */}
      {player.division === "MR" && (
        <PlayerStatsSection ign={player.ign} division={player.division} />
      )}
    </div>
  );
}

// ── Sub-team coming-soon card ────────────────────────────────────

const MR_SUBTEAMS = [
  {
    id: "echoes",
    name: "Echoes",
    tagline: "Rising talent. Next in line.",
    color: "#3A7BD5",
    slots: 6,
  },
] as const;

function SubTeamComingSoon({
  team,
}: {
  team: (typeof MR_SUBTEAMS)[number];
}) {
  const t = useTranslations("team_page");
  return (
    <div
      style={{
        marginTop: "48px",
        borderTop: "1px solid #222222",
        paddingTop: "40px",
      }}
    >
      {/* Sub-team label row */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <span
          className="font-heading font-bold uppercase"
          style={{ fontSize: "13px", color: "#FFFFFF", letterSpacing: "0.12em" }}
        >
          IMPerfect · {team.name}
        </span>
        <span
          style={{
            background: `${team.color}18`,
            border: `1px solid ${team.color}44`,
            color: team.color,
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            padding: "2px 10px",
          }}
        >
          Marvel Rivals
        </span>
        <span
          style={{
            background: "#C8E40012",
            border: "1px solid #C8E40030",
            color: "#C8E400",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 700,
            fontFamily: "var(--font-barlow), sans-serif",
            padding: "2px 10px",
          }}
        >
          {t("roster_tba")}
        </span>
      </div>

      {/* Ghost card grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "16px" }}>
        {Array.from({ length: team.slots }).map((_, i) => (
          <div
            key={i}
            style={{
              background: "#1E1E1E",
              border: "1px solid #242424",
              borderTop: `3px solid ${team.color}44`,
              borderRadius: "8px",
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              minHeight: "120px",
              opacity: 0.55,
            }}
          >
            {/* Ghost avatar */}
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: "#2A2A2A",
                border: `1px dashed ${team.color}55`,
              }}
            />
            <span
              className="font-heading font-bold uppercase"
              style={{ fontSize: "10px", color: "#444444", letterSpacing: "0.15em" }}
            >
              TBA
            </span>
          </div>
        ))}
      </div>

      {/* Banner */}
      <div
        style={{
          marginTop: "20px",
          background: "#1E1E1E",
          border: `1px solid ${team.color}22`,
          borderLeft: `3px solid ${team.color}`,
          borderRadius: "6px",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        <div>
          <p
            className="font-heading font-black uppercase"
            style={{ fontSize: "16px", color: "#FFFFFF", marginBottom: "4px" }}
          >
            {team.tagline}
          </p>
          <p style={{ fontSize: "12px", color: "#555555" }}>
            {t("coming_soon_desc")}
          </p>
        </div>
        <span
          className="font-heading font-bold uppercase"
          style={{
            fontSize: "10px",
            color: team.color,
            letterSpacing: "0.15em",
            padding: "6px 14px",
            border: `1px solid ${team.color}44`,
            borderRadius: "3px",
            whiteSpace: "nowrap",
          }}
        >
          {t("coming_soon")}
        </span>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────

type Division = "OW2" | "MR";

export default function TeamPage() {
  const locale = useLocale();
  const t = useTranslations("team_page");
  const [activeDivision, setActiveDivision] = useState<Division>("OW2");

  const roster = activeDivision === "OW2" ? OW2_ROSTER : MR_ROSTER;
  const divisionLabel = activeDivision === "OW2" ? "Overwatch 2" : "Marvel Rivals";

  return (
    <div style={{ background: "#1A1A1A", minHeight: "100vh" }}>
      {/* ── Page header ── */}
      <section style={{ padding: "120px 24px 64px", borderBottom: "1px solid #1F1F1F" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Link
            href={`/${locale}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "11px",
              color: "#555555",
              textDecoration: "none",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              fontWeight: 700,
              marginBottom: "32px",
              fontFamily: "var(--font-barlow), sans-serif",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8E400")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555555")}
          >
            {t("back")}
          </Link>

          <span className="eyebrow">{t("eyebrow")}</span>
          <h1
            className="font-heading font-black uppercase text-white"
            style={{ fontSize: "clamp(48px, 10vw, 88px)", lineHeight: 0.92, marginBottom: "16px" }}
          >
            {t("title")}
          </h1>
          <p style={{ fontSize: "15px", color: "#888888", maxWidth: "440px", lineHeight: 1.65, marginBottom: "40px" }}>
            {t("description")}
          </p>

          {/* Division toggle */}
          <div style={{ display: "flex", gap: "8px" }}>
            {(["OW2", "MR"] as Division[]).map((div) => {
              const active = activeDivision === div;
              const label = div === "OW2" ? "Overwatch 2" : "Marvel Rivals";
              return (
                <button
                  key={div}
                  onClick={() => setActiveDivision(div)}
                  aria-label={`Switch to ${label}`}
                  aria-pressed={active}
                  style={{
                    background: active ? "#C8E400" : "#2A2A2A",
                    color: active ? "#2A2A2A" : "#888888",
                    border: active ? "none" : "1px solid #333333",
                    borderRadius: "4px",
                    padding: "10px 20px",
                    fontSize: "13px",
                    fontWeight: 700,
                    fontFamily: "var(--font-barlow), sans-serif",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    transition: "background 0.15s, color 0.15s",
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Division section ── */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "56px 24px" }}>
        {/* Section label */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
          <span
            className="font-heading font-bold uppercase"
            style={{ fontSize: "13px", color: "#FFFFFF", letterSpacing: "0.12em" }}
          >
            {activeDivision === "MR" ? t("main_squad") : divisionLabel}
          </span>
          <span
            style={{
              background: "#C8E40022",
              border: "1px solid #C8E40044",
              color: "#C8E400",
              borderRadius: "999px",
              fontSize: "11px",
              fontWeight: 700,
              fontFamily: "var(--font-barlow), sans-serif",
              padding: "2px 10px",
            }}
          >
            {roster.length} {t("players_count")}
          </span>
        </div>

        {/* Card grid with fade on tab switch */}
        <AnimatePresence mode="wait">
          <m.div
            key={activeDivision}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
              {roster.map((player, i) => (
                <m.div
                  key={player.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <PlayerCard player={player} />
                </m.div>
              ))}
            </div>

            {/* Shadows roster — MR only */}
            {activeDivision === "MR" && (
              <div
                style={{
                  marginTop: "48px",
                  borderTop: "1px solid #222222",
                  paddingTop: "40px",
                }}
              >
                {/* Shadows section label */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "32px" }}>
                  <span
                    className="font-heading font-bold uppercase"
                    style={{ fontSize: "13px", color: "#FFFFFF", letterSpacing: "0.12em" }}
                  >
                    IMPerfect · Shadows
                  </span>
                  <span
                    style={{
                      background: "#9B59B618",
                      border: "1px solid #9B59B644",
                      color: "#9B59B6",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "var(--font-barlow), sans-serif",
                      padding: "2px 10px",
                    }}
                  >
                    Marvel Rivals
                  </span>
                  <span
                    style={{
                      background: "#C8E40022",
                      border: "1px solid #C8E40044",
                      color: "#C8E400",
                      borderRadius: "999px",
                      fontSize: "11px",
                      fontWeight: 700,
                      fontFamily: "var(--font-barlow), sans-serif",
                      padding: "2px 10px",
                    }}
                  >
                    {SHADOWS_ROSTER.length} {t("players_count")}
                  </span>
                </div>

                {/* Shadows card grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: "16px" }}>
                  {SHADOWS_ROSTER.map((player, i) => (
                    <m.div
                      key={player.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      <PlayerCard player={player} />
                    </m.div>
                  ))}
                </div>
              </div>
            )}

            {/* Echoes sub-team — MR only */}
            {activeDivision === "MR" && MR_SUBTEAMS.map((subteam) => (
              <SubTeamComingSoon key={subteam.id} team={subteam} />
            ))}
          </m.div>
        </AnimatePresence>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ borderTop: "1px solid #1F1F1F", background: "#111111" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "20px 24px" }}>
          <p
            className="font-heading font-bold uppercase"
            style={{ fontSize: "12px", color: "#555555", letterSpacing: "0.15em", textAlign: "center" }}
          >
            {t("stats_strip")}
          </p>
        </div>
      </div>
    </div>
  );
}
